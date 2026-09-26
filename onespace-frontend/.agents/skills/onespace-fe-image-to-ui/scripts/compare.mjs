#!/usr/bin/env node
// Compare a built page with a reference design image, for onespace-fe-image-to-ui.
//
//   compare  --ref design.png --url http://localhost:5173/dashboard
//            screenshot the page at the design's width, diff it pixel by pixel
//            in the browser (canvas, no extra dependencies), and write
//            built.png, diff.png, side-by-side.png, overlay.png, a crop pair
//            per worst grid cell, and report.json
//   palette  --ref design.png --palette      dominant colours of the design
//   slice    --ref design.png --slice        cut a tall design into readable tiles
//
// Exits 1 when --fail-above is set and the mismatch is higher, 2 on bad usage.
// Playwright is resolved from the project you run this in (cwd):
//   npm i -D playwright && npx playwright install chromium
import { createRequire } from "node:module";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { extname, join, resolve } from "node:path";
import { parseArgs } from "node:util";

const { values: opt } = parseArgs({
  options: {
    ref: { type: "string" },
    url: { type: "string" },
    out: { type: "string", default: "agent-tracking/screenshots/latest/compare" },
    width: { type: "string" }, // CSS px; default ref width / dpr
    height: { type: "string" }, // CSS px; default 900, or the design height with --no-full-page
    dpr: { type: "string" }, // default 2 when the ref is 2560px or wider, else 1
    "full-page": { type: "boolean", default: true },
    mask: { type: "string", multiple: true }, // x,y,w,h in CSS px of the design
    threshold: { type: "string", default: "0.1" }, // 0..1 colour distance per pixel
    grid: { type: "string", default: "8" }, // columns; cells are square
    theme: { type: "string", default: "light" },
    "theme-mode": { type: "string", default: "media" }, // media | class
    wait: { type: "string" },
    delay: { type: "string", default: "500" },
    "storage-state": { type: "string" },
    "fail-above": { type: "string" }, // mismatch % that exits 1
    palette: { type: "boolean", default: false },
    slice: { type: "boolean", default: false },
    "slice-height": { type: "string" }, // px of the ref image; default 0.75 × width
    help: { type: "boolean", short: "h" },
  },
});

if (opt.help || !opt.ref || (!opt.url && !opt.palette && !opt.slice)) {
  console.log(`usage:
  node compare.mjs --ref <image> --url <url> [options]   compare built page with design
  node compare.mjs --ref <image> --palette               dominant colours -> palette.json
  node compare.mjs --ref <image> --slice                 tall design -> slice-NN.png tiles
options:
  --out <dir>            default agent-tracking/screenshots/latest/compare
  --width <css px>       viewport width (default: ref width / dpr)
  --height <css px>      viewport height (default 900; design height with --no-full-page)
  --dpr <1|2|3>          design export scale (default 2 if ref >= 2560px wide, else 1)
  --mask x,y,w,h         ignore a region, CSS px of the design (repeatable)
  --threshold <0..1>     per-pixel colour distance counted as different (default 0.1)
  --grid <n>             grid columns for the per-region report (default 8)
  --theme light|dark     --theme-mode media|class
  --wait <selector>      --delay <ms> (default 500)
  --storage-state <file> signed-in session (never commit it)
  --no-full-page         viewport-only screenshot
  --fail-above <pct>     exit 1 when mismatch % is higher
  --slice-height <px>    tile height in ref pixels (default 0.75 x width)`);
  process.exit(opt.help ? 0 : 2);
}

const require = createRequire(join(process.cwd(), "package.json"));
let chromium;
try {
  ({ chromium } = require("playwright"));
} catch {
  try {
    ({ chromium } = require("@playwright/test"));
  } catch {
    console.error("Playwright not found in this project. Run: npm i -D playwright && npx playwright install chromium");
    process.exit(2);
  }
}

const MIME = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp" };
const mime = MIME[extname(opt.ref).toLowerCase()];
if (!mime) {
  console.error(`unsupported image type: ${opt.ref} (use png, jpg, or webp)`);
  process.exit(2);
}
const refUrl = `data:${mime};base64,${readFileSync(opt.ref).toString("base64")}`;
const outDir = resolve(opt.out);
mkdirSync(outDir, { recursive: true });
const save = (name, dataUrl) => writeFileSync(join(outDir, name), Buffer.from(dataUrl.split(",")[1], "base64"));
const pct = (n) => Math.round(n * 1000) / 10;

const browser = await chromium.launch();
const lab = await (await browser.newContext()).newPage(); // blank page where the pixel work runs

// Runs in the browser: shared helpers are passed in as source so each evaluate stays self-contained.
const HELPERS = `
  window.load = (src) => new Promise((ok, err) => { const i = new Image(); i.onload = () => ok(i); i.onerror = err; i.src = src; });
  window.canvas = (w, h) => { const c = document.createElement("canvas"); c.width = w; c.height = h; return [c, c.getContext("2d", { willReadFrequently: true })]; };
`;
await lab.addScriptTag({ content: HELPERS });

const size = await lab.evaluate(async (src) => {
  const i = await load(src);
  return { width: i.naturalWidth, height: i.naturalHeight };
}, refUrl);
const dpr = Number(opt.dpr ?? (size.width >= 2560 ? 2 : 1));
const width = Number(opt.width ?? Math.round(size.width / dpr));
const report = { ref: { path: opt.ref, ...size }, dpr, viewportWidth: width, files: [] };

if (opt.palette) {
  report.palette = await lab.evaluate(async (src) => {
    const img = await load(src);
    const [, g] = canvas(img.naturalWidth, img.naturalHeight);
    g.drawImage(img, 0, 0);
    const d = g.getImageData(0, 0, img.naturalWidth, img.naturalHeight).data;
    const buckets = new Map(); // 4 bits per channel
    for (let p = 0; p < d.length; p += 4) {
      if (d[p + 3] < 128) continue;
      const k = ((d[p] >> 4) << 8) | ((d[p + 1] >> 4) << 4) | (d[p + 2] >> 4);
      const b = buckets.get(k) ?? [0, 0, 0, 0];
      b[0] += d[p]; b[1] += d[p + 1]; b[2] += d[p + 2]; b[3]++;
      buckets.set(k, b);
    }
    const total = d.length / 4;
    const hex = (v) => Math.round(v).toString(16).padStart(2, "0");
    return [...buckets.values()]
      .sort((a, b) => b[3] - a[3])
      .slice(0, 16)
      .map(([r, gr, bl, n]) => ({ hex: `#${hex(r / n)}${hex(gr / n)}${hex(bl / n)}`, share: Math.round((n / total) * 1000) / 10 }));
  }, refUrl);
  writeFileSync(join(outDir, "palette.json"), JSON.stringify(report.palette, null, 2));
  report.files.push("palette.json");
}

if (opt.slice) {
  const tile = Number(opt["slice-height"] ?? Math.round(size.width * 0.75));
  const tiles = await lab.evaluate(async ({ src, tile }) => {
    const img = await load(src);
    const out = [];
    for (let y = 0; y < img.naturalHeight; y += tile) {
      const h = Math.min(tile, img.naturalHeight - y);
      const [c, g] = canvas(img.naturalWidth, h);
      g.drawImage(img, 0, y, img.naturalWidth, h, 0, 0, img.naturalWidth, h);
      out.push({ y, h, url: c.toDataURL("image/png") });
    }
    return out;
  }, { src: refUrl, tile });
  report.slices = tiles.map((t, i) => {
    const name = `slice-${String(i + 1).padStart(2, "0")}.png`;
    save(name, t.url);
    report.files.push(name);
    return { file: name, yCss: Math.round(t.y / dpr), heightCss: Math.round(t.h / dpr) };
  });
}

if (opt.url) {
  const context = await browser.newContext({
    // Full page: a short viewport, so the screenshot height is the content height.
    viewport: { width, height: Number(opt.height ?? (opt["full-page"] ? 900 : Math.round(size.height / dpr))) },
    deviceScaleFactor: dpr,
    colorScheme: opt["theme-mode"] === "media" ? opt.theme : "light",
    storageState: opt["storage-state"],
  });
  const page = await context.newPage();
  await page.goto(opt.url, { waitUntil: "networkidle" });
  if (opt["theme-mode"] === "class") {
    await page.evaluate((dark) => document.documentElement.classList.toggle("dark", dark), opt.theme === "dark");
  }
  if (opt.wait) await page.waitForSelector(opt.wait);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(Number(opt.delay));
  const shot = await page.screenshot({ fullPage: opt["full-page"], animations: "disabled" });
  const builtUrl = `data:image/png;base64,${shot.toString("base64")}`;
  save("built.png", builtUrl);
  report.files.push("built.png");
  await context.close();

  const masks = (opt.mask ?? []).map((m) => m.split(",").map((v) => Number(v) * dpr));
  const cols = Number(opt.grid);
  const r = await lab.evaluate(
    async ({ refUrl, builtUrl, masks, threshold, cols }) => {
      const [ref, built] = [await load(refUrl), await load(builtUrl)];
      const W = ref.naturalWidth, H = ref.naturalHeight;
      const [rc, rg] = canvas(W, H);
      rg.drawImage(ref, 0, 0);
      // The built page is compared on the design's canvas: extra height is cut,
      // missing height stays transparent and counts as different.
      const [bc, bg] = canvas(W, H);
      bg.drawImage(built, 0, 0);
      const a = rg.getImageData(0, 0, W, H).data;
      const b = bg.getImageData(0, 0, W, H).data;
      const [dc, dg] = canvas(W, H);
      const diff = dg.createImageData(W, H);
      const cell = Math.ceil(W / cols), rows = Math.ceil(H / cell);
      const bad = new Float64Array(rows * cols), seen = new Float64Array(rows * cols);
      const masked = (x, y) => masks.some(([mx, my, mw, mh]) => x >= mx && x < mx + mw && y >= my && y < my + mh);
      const max = 255 * Math.sqrt(3);
      let badTotal = 0, seenTotal = 0;
      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          const p = (y * W + x) * 4;
          const grey = 0.3 * a[p] + 0.59 * a[p + 1] + 0.11 * a[p + 2];
          const faint = 255 - (255 - grey) * 0.25;
          if (masks.length && masked(x, y)) {
            diff.data.set([faint * 0.8, faint * 0.85, 255, 255], p);
            continue;
          }
          const dist = b[p + 3] < 128 ? 1 : Math.hypot(a[p] - b[p], a[p + 1] - b[p + 1], a[p + 2] - b[p + 2]) / max;
          const i = Math.floor(y / cell) * cols + Math.floor(x / cell);
          seen[i]++; seenTotal++;
          if (dist > threshold) {
            bad[i]++; badTotal++;
            diff.data.set([255, 0, 0, 255], p);
          } else {
            diff.data.set([faint, faint, faint, 255], p);
          }
        }
      }
      dg.putImageData(diff, 0, 0);

      const gap = Math.max(8, Math.round(W / 100));
      const [sc, sg] = canvas(W * 2 + gap, H);
      sg.fillStyle = "#ff00ff"; sg.fillRect(0, 0, sc.width, H);
      sg.drawImage(rc, 0, 0); sg.drawImage(bc, W + gap, 0);
      const [oc, og] = canvas(W, H);
      og.drawImage(rc, 0, 0); og.globalAlpha = 0.5; og.drawImage(bc, 0, 0);

      const cells = [];
      for (let i = 0; i < rows * cols; i++) {
        if (!seen[i]) continue;
        const row = Math.floor(i / cols), col = i % cols;
        cells.push({ row, col, x: col * cell, y: row * cell, w: Math.min(cell, W - col * cell), h: Math.min(cell, H - row * cell), mismatch: bad[i] / seen[i] });
      }
      const worst = cells.filter((c) => c.mismatch > 0.01).sort((p, q) => q.mismatch - p.mismatch).slice(0, 5);
      const crops = worst.map((c) => {
        const [cc, cg] = canvas(c.w * 2 + gap, c.h);
        cg.fillStyle = "#ff00ff"; cg.fillRect(0, 0, cc.width, c.h);
        cg.drawImage(rc, c.x, c.y, c.w, c.h, 0, 0, c.w, c.h);
        cg.drawImage(bc, c.x, c.y, c.w, c.h, c.w + gap, 0, c.w, c.h);
        return cc.toDataURL("image/png");
      });
      return {
        mismatch: seenTotal ? badTotal / seenTotal : 0,
        built: { width: built.naturalWidth, height: built.naturalHeight },
        rows, cellPx: cell,
        grid: Array.from({ length: rows }, (_, row) => Array.from({ length: cols }, (_, col) => Math.round((bad[row * cols + col] / (seen[row * cols + col] || 1)) * 100))),
        worst, crops,
        diff: dc.toDataURL("image/png"), side: sc.toDataURL("image/png"), overlay: oc.toDataURL("image/png"),
      };
    },
    { refUrl, builtUrl, masks, threshold: Number(opt.threshold), cols },
  );

  save("diff.png", r.diff);
  save("side-by-side.png", r.side);
  save("overlay.png", r.overlay);
  report.files.push("diff.png", "side-by-side.png", "overlay.png");
  const css = (v) => Math.round(v / dpr);
  report.worst = r.worst.map((c, i) => {
    const file = `cell-r${c.row}-c${c.col}.png`;
    save(file, r.crops[i]);
    report.files.push(file);
    return { row: c.row, col: c.col, mismatchPct: pct(c.mismatch), boxCss: { x: css(c.x), y: css(c.y), w: css(c.w), h: css(c.h) }, crop: file };
  });
  report.mismatchPct = pct(r.mismatch);
  report.threshold = Number(opt.threshold);
  report.masksCss = opt.mask ?? [];
  report.built = r.built;
  report.grid = { cols, rows: r.rows, cellCss: css(r.cellPx), mismatchPctByCell: r.grid };
  const dh = Math.abs(r.built.height - size.height) / size.height;
  if (r.built.width !== size.width || dh > 0.02) {
    report.sizeWarning =
      `built ${r.built.width}x${r.built.height} vs design ${size.width}x${size.height} (device px). ` +
      (r.built.width !== size.width ? "Width differs: check --width / --dpr. " : "") +
      (dh > 0.02 ? "Height differs: content is missing or extra, or the design is one viewport tall (try --no-full-page)." : "");
  }
}

await browser.close();
writeFileSync(join(outDir, "report.json"), JSON.stringify(report, null, 2));

if (opt.url) {
  console.log(`mismatch ${report.mismatchPct}% at ${width}px (dpr ${dpr}, threshold ${report.threshold})`);
  for (const c of report.worst) console.log(`  worst r${c.row} c${c.col}: ${c.mismatchPct}%  box ${JSON.stringify(c.boxCss)}  ${c.crop}`);
  if (report.sizeWarning) console.log(`  WARN ${report.sizeWarning}`);
}
if (opt.palette) console.log(`palette: ${report.palette.slice(0, 8).map((p) => `${p.hex} ${p.share}%`).join(", ")}`);
if (opt.slice) console.log(`slices: ${report.slices.length} tiles`);
console.log(`→ ${join(outDir, "report.json")}`);
process.exit(opt["fail-above"] && report.mismatchPct > Number(opt["fail-above"]) ? 1 : 0);
