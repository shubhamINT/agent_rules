#!/usr/bin/env node
// Screenshot pages at several widths and themes with Playwright + Chromium, and
// run the checks hirebot-fe-verify-ui relies on: console errors, failed
// requests, horizontal overflow, small touch targets, duplicate GETs, and axe
// (when @axe-core/playwright is installed). Exits 1 when any check fails.
//
// Playwright is resolved from the project you run this in (cwd), so install it
// there: npm i -D playwright && npx playwright install chromium
import { createRequire } from "node:module";
import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { parseArgs } from "node:util";

const HEIGHTS = { 320: 568, 375: 812, 390: 844, 768: 1024, 1024: 768, 1280: 800, 1440: 900, 1920: 1080 };

const { values: opt } = parseArgs({
  options: {
    url: { type: "string", multiple: true },
    name: { type: "string", multiple: true },
    out: { type: "string", default: "agent-tracking/screenshots/latest" },
    widths: { type: "string", default: "375,768,1024,1440,1920" },
    themes: { type: "string", default: "light,dark" },
    "theme-mode": { type: "string", default: "media" }, // media | class
    "full-page": { type: "boolean", default: true },
    wait: { type: "string" }, // CSS selector to wait for before shooting
    delay: { type: "string", default: "300" }, // ms after load, lets animations settle
    slow: { type: "boolean", default: false }, // add ~1.5s latency to every API request
    "storage-state": { type: "string" }, // Playwright storageState JSON for signed-in pages
    help: { type: "boolean", short: "h" },
  },
});

if (opt.help || !opt.url?.length) {
  console.log(`usage: node shoot.mjs --url <url> [--url <url> …] [--name <name> …]
  --out <dir>            default agent-tracking/screenshots/latest
  --widths 375,768,…     default 375,768,1024,1440,1920
  --themes light,dark    default light,dark
  --theme-mode media|class   media = prefers-color-scheme, class = toggle .dark on <html>
  --wait <selector>      wait for this element before shooting
  --delay <ms>           settle time after load (default 300)
  --slow                 delay API responses ~1.5s to capture loading states
  --storage-state <file> reuse a signed-in session (never commit this file)
  --no-full-page         viewport-only screenshots`);
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
let AxeBuilder = null;
try {
  AxeBuilder = require("@axe-core/playwright").default ?? require("@axe-core/playwright").AxeBuilder;
} catch {
  // optional
}

const widths = opt.widths.split(",").map(Number);
const themes = opt.themes.split(",");
const outDir = resolve(opt.out);
mkdirSync(outDir, { recursive: true });

const slug = (u) => new URL(u).pathname.replace(/^\/|\/$/g, "").replace(/[^a-z0-9]+/gi, "-") || "home";
const browser = await chromium.launch();
const results = [];

for (const [i, url] of opt.url.entries()) {
  const name = opt.name?.[i] ?? slug(url);
  for (const width of widths) {
    for (const theme of themes) {
      const context = await browser.newContext({
        viewport: { width, height: HEIGHTS[width] ?? 900 },
        colorScheme: opt["theme-mode"] === "media" ? theme : "light",
        deviceScaleFactor: 1,
        hasTouch: width < 1024,
        isMobile: width < 768,
        storageState: opt["storage-state"],
      });
      const page = await context.newPage();
      const consoleErrors = [];
      const failedRequests = [];
      const gets = new Map();
      page.on("console", (m) => m.type() === "error" && consoleErrors.push(m.text()));
      page.on("pageerror", (e) => consoleErrors.push(String(e)));
      page.on("requestfailed", (r) => failedRequests.push(`${r.method()} ${r.url()} ${r.failure()?.errorText}`));
      page.on("response", (r) => r.status() >= 400 && failedRequests.push(`${r.request().method()} ${r.url()} ${r.status()}`));
      page.on("request", (r) => {
        if (r.method() === "GET" && ["fetch", "xhr"].includes(r.resourceType())) gets.set(r.url(), (gets.get(r.url()) ?? 0) + 1);
      });
      if (opt.slow) {
        await page.route("**/*", async (route) => {
          if (["fetch", "xhr"].includes(route.request().resourceType())) await new Promise((r) => setTimeout(r, 1500));
          await route.continue();
        });
      }

      const shot = { name, url, width, theme, file: `${name}-${width}-${theme}.png`, checks: {} };
      try {
        await page.goto(url, { waitUntil: opt.slow ? "domcontentloaded" : "networkidle", timeout: 30_000 });
        if (opt["theme-mode"] === "class" && theme === "dark") {
          await page.evaluate(() => document.documentElement.classList.add("dark"));
        }
        if (opt.wait) await page.waitForSelector(opt.wait, { timeout: 15_000 });
        await page.waitForTimeout(Number(opt.delay));

        const layout = await page.evaluate(() => {
          const vw = document.documentElement.clientWidth;
          const overflowing = [];
          for (const el of document.querySelectorAll("body *")) {
            const r = el.getBoundingClientRect();
            if (r.width && r.right > vw + 1 && getComputedStyle(el).position !== "fixed") {
              let p = el.parentElement, clipped = false;
              while (p && p !== document.body) {
                const s = getComputedStyle(p);
                if (/(auto|scroll|hidden|clip)/.test(s.overflowX)) { clipped = true; break; }
                p = p.parentElement;
              }
              if (!clipped) overflowing.push(el.tagName.toLowerCase() + (el.id ? `#${el.id}` : "") + (el.className && typeof el.className === "string" ? "." + el.className.trim().split(/\s+/).slice(0, 3).join(".") : ""));
            }
          }
          const small = [];
          for (const el of document.querySelectorAll("a[href], button, [role=button], input:not([type=hidden]), select, textarea")) {
            const r = el.getBoundingClientRect();
            if (r.width && r.height && (r.width < 24 || r.height < 24) && getComputedStyle(el).visibility !== "hidden") {
              small.push(`${el.tagName.toLowerCase()} "${(el.getAttribute("aria-label") || el.textContent || "").trim().slice(0, 30)}" ${Math.round(r.width)}x${Math.round(r.height)}`);
            }
          }
          return { pageScrollsSideways: document.documentElement.scrollWidth > vw + 1, overflowing: overflowing.slice(0, 10), small: small.slice(0, 10) };
        });

        shot.checks.consoleErrors = consoleErrors;
        shot.checks.failedRequests = failedRequests;
        shot.checks.horizontalOverflow = layout.pageScrollsSideways ? layout.overflowing : [];
        shot.checks.smallTouchTargets = width < 1024 ? layout.small : [];
        shot.checks.duplicateGets = [...gets].filter(([, n]) => n > 1).map(([u, n]) => `${n}x ${u}`);
        shot.requests = [...gets.values()].reduce((a, b) => a + b, 0);
        if (AxeBuilder && theme === themes[0]) {
          const axe = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
          shot.checks.axe = axe.violations
            .filter((v) => ["serious", "critical"].includes(v.impact))
            .map((v) => `${v.impact} ${v.id}: ${v.help} (${v.nodes.length})`);
        }
        await page.screenshot({ path: join(outDir, shot.file), fullPage: opt["full-page"] });
      } catch (e) {
        shot.checks.error = [String(e.message ?? e).split("\n")[0]];
      }
      // ponytail: touch targets and duplicate GETs are warnings; the rest fail the run
      shot.failed = ["consoleErrors", "failedRequests", "horizontalOverflow", "axe", "error"].some((k) => shot.checks[k]?.length);
      results.push(shot);
      await context.close();
    }
  }
}
await browser.close();

writeFileSync(join(outDir, "report.json"), JSON.stringify({ axe: Boolean(AxeBuilder), results }, null, 2));
for (const s of results) {
  const issues = Object.entries(s.checks).filter(([, v]) => v.length).map(([k, v]) => `${k}: ${v.length}`);
  console.log(`${s.failed ? "FAIL" : issues.length ? "WARN" : "ok  "} ${s.file}  ${issues.join(", ")}`);
}
if (!AxeBuilder) console.log("note: axe skipped (npm i -D @axe-core/playwright to enable)");
console.log(`screenshots + report.json: ${outDir}`);
process.exit(results.some((s) => s.failed) ? 1 : 0);
