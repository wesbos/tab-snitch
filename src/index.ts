import { Hono } from "hono";
import { PRESETS } from "./presets";
import { homePage } from "./views/home";
import { isValidDomain, slugify } from "./slug";

// Google's s2/favicons service returns the google.com `G` for every
// *.google.com subdomain, so we override the proxy source for the specific
// Google products with their real product logos on gstatic.
const ICON_OVERRIDES: Record<string, string> = {
  "mail.google.com": "https://www.gstatic.com/images/branding/product/2x/gmail_2020q4_48dp.png",
  "docs.google.com": "https://www.gstatic.com/images/branding/product/2x/docs_2020q4_48dp.png",
  "sheets.google.com": "https://www.gstatic.com/images/branding/product/2x/sheets_2020q4_48dp.png",
  "slides.google.com": "https://www.gstatic.com/images/branding/product/2x/slides_2020q4_48dp.png",
  "drive.google.com": "https://www.gstatic.com/images/branding/product/2x/drive_2020q4_48dp.png",
  "calendar.google.com": "https://www.gstatic.com/images/branding/product/2x/calendar_2020q4_48dp.png",
  "meet.google.com": "https://www.gstatic.com/images/branding/product/2x/meet_2020q4_48dp.png",
};

const app = new Hono();

app.get("/", (c) => homePage(c));

app.post("/make", async (c) => {
  const form = await c.req.formData();
  const source = String(form.get("source") ?? "");
  const titleRaw = String(form.get("title") ?? "");
  const domainRaw = String(form.get("domain") ?? "");
  const titleSlug = slugify(titleRaw) || "untitled";

  if (source.startsWith("preset:")) {
    const slug = source.slice("preset:".length);
    if (!PRESETS[slug]) return c.text("unknown preset", 400);
    return c.redirect(`/${encodeURIComponent(slug)}/${encodeURIComponent(titleSlug)}`, 302);
  }

  if (source === "custom") {
    const domain = domainRaw.trim().toLowerCase();
    if (!isValidDomain(domain)) return c.text("Enter a valid domain like example.com", 400);
    return c.redirect(`/d/${encodeURIComponent(domain)}/${encodeURIComponent(titleSlug)}`, 302);
  }

  return c.text("Pick a favicon source", 400);
});

app.get("/icon/:domain", async (c) => {
  const domain = c.req.param("domain").toLowerCase();
  if (!isValidDomain(domain)) return c.text("bad domain", 400);
  const upstream =
    ICON_OVERRIDES[domain] ??
    `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=64`;
  const res = await fetch(upstream, {
    cf: { cacheTtl: 86400, cacheEverything: true },
  } as RequestInit);
  return new Response(res.body, {
    status: res.status,
    headers: {
      "content-type": res.headers.get("content-type") ?? "image/png",
      "cache-control": "public, max-age=300, s-maxage=86400",
    },
  });
});

app.get("/favicon.ico", (c) => c.body(null, 204));

app.get("/d/:domain/:title", (c) => {
  const customDomain = c.req.param("domain").toLowerCase();
  if (!isValidDomain(customDomain)) return c.notFound();
  return homePage(c, {
    titleSlug: c.req.param("title"),
    customDomain,
  });
});

app.get("/:preset/:title", (c) => {
  const presetSlug = c.req.param("preset");
  if (!PRESETS[presetSlug]) return c.notFound();
  return homePage(c, {
    titleSlug: c.req.param("title"),
    presetSlug,
  });
});

export default app;
