#!/usr/bin/env node
// Reproduce a UI bug in a real browser and keep the evidence: run a list of
// steps against a page, then save console output (with source locations),
// every request (status, timing, order), uncaught errors, screenshots, and a
// Playwright trace. Exits 1 on console errors, page errors, failed requests,
// or a step that cannot run — usable as a `git bisect run` command.
//
// Playwright is resolved from the project you run this in (cwd):
//   npm i -D playwright && npx playwright install chromium
import { createRequire } from "node:module";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { parseArgs } from "node:util";

const { values: opt } = parseArgs({
  options: {
    url: { type: "string" },
    steps: { type: "string", default: "[]" }, // JSON array, or a path to a JSON file
    out: { type: "string", default: "agent-tracking/screenshots/latest/repro" },
    width: { type: "string", default: "1440" },
    height: { type: "string" },
    theme: { type: "string", default: "light" },
    browser: { type: "string", default: "chromium" }, // chromium | webkit | firefox
    slow: { type: "boolean", default: false }, // delay fetch/xhr responses 1.5s
    "offline-api": { type: "boolean", default: false }, // fail fetch/xhr requests
    "storage-state": { type: "string" },
    timezone: { type: "string" },
    locale: { type: "string" },
    headed: { type: "boolean", default: false },
    help: { type: "boolean", short: "h" },
  },
});

if (opt.help || !opt.url) {
  console.log(`usage: node capture.mjs --url <url> [--steps '<json>' | --steps steps.json] [--out <dir>]
  --width 1440 --height <auto> --theme light|dark --browser chromium|webkit|firefox
  --slow  --offline-api  --storage-state <file>  --timezone <IANA>  --locale <tag>  --headed
steps: [{"click":sel},{"fill":[sel,text]},{"press":key},{"hover":sel},{"select":[sel,value]},
        {"wait":ms|sel},{"goto":url},{"eval":js},{"shot":name}]`);
  process.exit(opt.help ? 0 : 2);
}

const require = createRequire(join(process.cwd(), "package.json"));
let pw;
try {
  pw = require("playwright");
} catch {
  try {
    pw = require("@playwright/test");
  } catch {
    console.error("Playwright not found in this project. Run: npm i -D playwright && npx playwright install chromium");
    process.exit(2);
  }
}

const steps = JSON.parse(existsSync(opt.steps) ? readFileSync(opt.steps, "utf8") : opt.steps);
const width = Number(opt.width);
const outDir = resolve(opt.out);
mkdirSync(outDir, { recursive: true });

const browser = await pw[opt.browser].launch({ headless: !opt.headed });
const context = await browser.newContext({
  viewport: { width, height: Number(opt.height ?? (width < 768 ? 812 : width < 1280 ? 1024 : 900)) },
  colorScheme: opt.theme,
  hasTouch: width < 1024,
  isMobile: width < 768 && opt.browser !== "firefox", // firefox has no isMobile
  storageState: opt["storage-state"],
  timezoneId: opt.timezone,
  locale: opt.locale,
});
await context.tracing.start({ screenshots: true, snapshots: true, sources: false });
const page = await context.newPage();

const t0 = Date.now();
const consoleLog = [];
const errors = [];
const network = [];
const started = new Map();
page.on("console", (m) => {
  const loc = m.location();
  consoleLog.push({ t: Date.now() - t0, type: m.type(), text: m.text(), at: loc.url ? `${loc.url}:${loc.lineNumber}:${loc.columnNumber}` : "" });
});
page.on("pageerror", (e) => errors.push({ t: Date.now() - t0, message: e.message, stack: e.stack }));
page.on("request", (r) => started.set(r, Date.now()));
const record = (r, status, failure) => {
  const s = started.get(r) ?? Date.now();
  network.push({ start: s - t0, ms: Date.now() - s, method: r.method(), url: r.url(), type: r.resourceType(), status, failure });
};
page.on("requestfinished", async (r) => record(r, (await r.response())?.status() ?? 0));
page.on("requestfailed", (r) => record(r, 0, r.failure()?.errorText));

if (opt.slow || opt["offline-api"]) {
  await page.route("**/*", async (route) => {
    if (!["fetch", "xhr"].includes(route.request().resourceType())) return route.continue();
    if (opt["offline-api"]) return route.abort("failed");
    await new Promise((r) => setTimeout(r, 1500));
    return route.continue();
  });
}

const stepLog = [];
let stepError = null;
try {
  await page.goto(opt.url, { waitUntil: "load", timeout: 30_000 });
  for (const [i, step] of steps.entries()) {
    const [kind, arg] = Object.entries(step)[0];
    const entry = { i, kind, arg };
    if (kind === "click") await page.locator(arg).first().click({ timeout: 10_000 });
    else if (kind === "fill") await page.locator(arg[0]).first().fill(arg[1], { timeout: 10_000 });
    else if (kind === "press") await page.keyboard.press(arg);
    else if (kind === "hover") await page.locator(arg).first().hover({ timeout: 10_000 });
    else if (kind === "select") await page.locator(arg[0]).first().selectOption(arg[1], { timeout: 10_000 });
    else if (kind === "wait") typeof arg === "number" ? await page.waitForTimeout(arg) : await page.locator(arg).first().waitFor({ timeout: 15_000 });
    else if (kind === "goto") await page.goto(arg, { waitUntil: "load" });
    else if (kind === "eval") entry.result = await page.evaluate((js) => { try { return String(eval(js)); } catch (e) { return `error: ${e.message}`; } }, arg);
    else if (kind === "shot") await page.screenshot({ path: join(outDir, `${arg}.png`), fullPage: true });
    else throw new Error(`unknown step "${kind}"`);
    stepLog.push(entry);
  }
  await page.waitForTimeout(300);
  await page.screenshot({ path: join(outDir, "final.png"), fullPage: true });
} catch (e) {
  stepError = String(e.message ?? e).split("\n")[0];
  await page.screenshot({ path: join(outDir, "at-failure.png"), fullPage: true }).catch(() => {});
}
await context.tracing.stop({ path: join(outDir, "trace.zip") });
await browser.close();

network.sort((a, b) => a.start - b.start);
const failedRequests = network.filter((n) => n.status >= 400 || n.failure);
const consoleErrors = consoleLog.filter((c) => c.type === "error");
const api = network.filter((n) => ["fetch", "xhr"].includes(n.type));
const counts = {};
for (const n of api) if (n.method === "GET") counts[n.url] = (counts[n.url] ?? 0) + 1;
const duplicateGets = Object.entries(counts).filter(([, n]) => n > 1).map(([u, n]) => `${n}x ${u}`);

writeFileSync(join(outDir, "console.json"), JSON.stringify(consoleLog, null, 2));
writeFileSync(join(outDir, "network.json"), JSON.stringify(network, null, 2));
writeFileSync(join(outDir, "errors.json"), JSON.stringify(errors, null, 2));
writeFileSync(join(outDir, "steps.json"), JSON.stringify({ stepLog, stepError }, null, 2));

for (const s of stepLog.filter((s) => "result" in s)) console.log(`eval[${s.i}]: ${s.result}`);
for (const c of consoleErrors) console.log(`console.error @${c.t}ms: ${c.text} ${c.at}`);
for (const e of errors) console.log(`pageerror @${e.t}ms: ${e.message}`);
for (const n of failedRequests) console.log(`request failed: ${n.method} ${n.url} ${n.status || n.failure}`);
for (const d of duplicateGets) console.log(`duplicate GET: ${d}`);
if (stepError) console.log(`step failed: ${stepError}`);
console.log(`api requests: ${api.length} · console errors: ${consoleErrors.length} · page errors: ${errors.length} · failed requests: ${failedRequests.length}`);
console.log(`evidence: ${outDir} (open trace: npx playwright show-trace ${join(outDir, "trace.zip")})`);
process.exit(stepError || consoleErrors.length || errors.length || failedRequests.length ? 1 : 0);
