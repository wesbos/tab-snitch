import type { Context } from "hono";
import { PRESETS } from "../presets";
import { QUICK_PICKS } from "../quickPicks";
import { escapeHtml, slugify, unslugify } from "../slug";
import { html } from "./layout";

export interface HomeOptions {
  titleSlug?: string;
  presetSlug?: string;
  customDomain?: string;
}

export function homePage(c: Context, opts: HomeOptions = {}): Response {
  const titleSlug = opts.titleSlug ?? "";
  const presetSlug = opts.presetSlug ?? "";
  const customDomain = opts.customDomain ?? "";

  const prefillTitle = titleSlug ? unslugify(titleSlug) : "";

  const selectedSource = presetSlug
    ? `preset:${presetSlug}`
    : customDomain
      ? "custom"
      : "preset:google";

  const preset = presetSlug ? PRESETS[presetSlug] : undefined;
  const initialDomain = preset?.domain ?? (customDomain || "google.com");
  const initialTabTitle = prefillTitle || "Tab Snitch";
  const initialTabLabel = prefillTitle || "New Tab";
  const iconPath = `/icon/${encodeURIComponent(initialDomain)}`;
  const initialUrl = `${initialDomain}${titleSlug ? `/${titleSlug}` : ""}`;
  const isHijacked = Boolean(titleSlug);

  const tiles = Object.entries(PRESETS)
    .map(([slug, p]) => {
      const value = `preset:${slug}`;
      const checked = value === selectedSource ? " checked" : "";
      return `
      <label class="tile" title="${escapeHtml(p.label)}">
        <input type="radio" name="source" value="${escapeHtml(value)}"${checked}>
        <img src="/icon/${escapeHtml(p.domain)}" alt="${escapeHtml(p.label)}" width="22" height="22" loading="lazy">
      </label>`;
    })
    .join("");

  const picks = QUICK_PICKS.map((q) => {
    const p = PRESETS[q.preset];
    if (!p) return "";
    const href = `/${q.preset}/${slugify(q.title)}`;
    return `
      <a class="pick" href="${escapeHtml(href)}" title="${escapeHtml(p.label)}">
        <img src="/icon/${escapeHtml(p.domain)}" alt="" width="16" height="16" loading="lazy">
        <span>${escapeHtml(q.title)}</span>
      </a>`;
  })
    .filter(Boolean)
    .join("");

  const customChecked = selectedSource === "custom" ? " checked" : "";

  const ogTags = isHijacked
    ? `<meta property="og:title" content="${escapeHtml(prefillTitle)}">
<meta property="og:image" content="${escapeHtml(iconPath)}">`
    : "";

  const head = `<link rel="icon" type="image/png" href="${escapeHtml(iconPath)}">
${ogTags}
<style>
  :root { color-scheme: light; }
  * { box-sizing: border-box; }
  html, body { margin: 0; }
  body {
    font: 15px/1.5 -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
    background: linear-gradient(180deg, #b8c4d4 0%, #d8dadd 55%, #c8cdd3 100%);
    min-height: 100vh;
    color: #222;
    padding: 40px 16px 80px;
  }

  /* Fake browser window */
  .browser {
    max-width: 920px;
    margin: 0 auto;
    background: #fff;
    border-radius: 12px;
    box-shadow:
      0 30px 80px rgba(20, 30, 50, 0.25),
      0 10px 24px rgba(20, 30, 50, 0.12),
      0 1px 0 rgba(255, 255, 255, 0.4) inset;
    overflow: hidden;
  }

  .chrome {
    background: linear-gradient(to bottom, #e9ebef, #dfe2e6);
    border-bottom: 1px solid #c4c7cc;
  }

  .titlebar {
    display: flex;
    align-items: flex-end;
    gap: 14px;
    padding: 10px 12px 0;
    min-height: 42px;
  }

  .traffic-lights {
    display: flex;
    gap: 8px;
    padding-bottom: 10px;
    flex-shrink: 0;
  }
  .traffic-lights span {
    width: 12px; height: 12px;
    border-radius: 50%;
    box-shadow: inset 0 0 0 0.5px rgba(0,0,0,0.12);
  }
  .traffic-lights .red { background: #ff5f57; }
  .traffic-lights .yellow { background: #febc2e; }
  .traffic-lights .green { background: #28c840; }

  .tab-strip {
    flex: 1;
    display: flex;
    align-items: flex-end;
    gap: 2px;
    overflow: hidden;
  }

  .tab {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 7px 10px 8px;
    min-width: 140px;
    max-width: 260px;
    background: #fff;
    border-radius: 8px 8px 0 0;
    border: 1px solid #c4c7cc;
    border-bottom: none;
    margin-bottom: -1px;
    position: relative;
    z-index: 1;
  }
  .tab img { width: 16px; height: 16px; flex-shrink: 0; }
  .tab .tab-title {
    font-size: 13px;
    color: #1e1f22;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
  }
  .tab .tab-close {
    color: #888;
    font-size: 16px;
    line-height: 1;
    width: 16px; height: 16px;
    display: flex; align-items: center; justify-content: center;
    border-radius: 4px;
    flex-shrink: 0;
  }
  .tab .tab-close:hover { background: #d6d8dc; color: #000; }

  .tab-new {
    appearance: none;
    background: transparent;
    border: 0;
    width: 28px; height: 28px;
    margin-bottom: 4px;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px; color: #666;
    font-family: inherit;
    border-radius: 6px;
    cursor: default;
  }
  .tab-new:hover { background: rgba(0,0,0,0.05); }

  .urlbar {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 12px;
    background: #ededf0;
  }
  .url-nav { display: flex; gap: 2px; color: #6b7076; flex-shrink: 0; }
  .url-nav span {
    width: 28px; height: 28px;
    display: flex; align-items: center; justify-content: center;
    border-radius: 6px;
    font-size: 18px;
    line-height: 1;
  }
  .url-nav span:hover { background: rgba(0,0,0,0.06); color: #333; }

  .url-input {
    flex: 1;
    background: #fff;
    border: 1px solid #d2d4d8;
    border-radius: 6px;
    padding: 5px 10px;
    font-size: 13px;
    color: #333;
    display: flex;
    align-items: center;
    gap: 7px;
    overflow: hidden;
  }
  .url-lock { font-size: 11px; opacity: 0.7; flex-shrink: 0; }
  #chrome-url {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* Content area */
  .content { padding: 32px 36px 40px; background: #fff; }
  h1 { margin: 0 0 4px; font-size: 28px; }
  .sub { color: #666; margin: 0 0 24px; }
  .card {
    background: #f8f9fb;
    border: 1px solid #e4e6eb;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 16px;
  }
  label.field, .card > .field {
    display: block;
    font-weight: 600;
    margin-bottom: 8px;
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: #555;
  }
  input[type="text"] {
    width: 100%;
    padding: 10px 12px;
    font-size: 16px;
    border: 1px solid #d0d4da;
    border-radius: 8px;
    background: #fff;
    color: #222;
    font-family: inherit;
  }
  input[type="text"]::placeholder { color: #9aa0a6; }
  input[type="text"]:focus { outline: 2px solid #3366ff; border-color: #3366ff; }

  .tiles { display: grid; grid-template-columns: repeat(auto-fill, minmax(40px, 1fr)); gap: 4px; }
  .tile {
    position: relative;
    display: flex; align-items: center; justify-content: center;
    padding: 6px;
    aspect-ratio: 1;
    border: 2px solid #e4e6eb;
    border-radius: 8px;
    cursor: pointer;
    background: #fff;
    transition: border-color 0.1s, background 0.1s;
  }
  .tile:hover { background: #f0f3f7; border-color: #c5cad1; }
  .tile input { position: absolute; opacity: 0; pointer-events: none; }
  .tile:has(input:checked) { border-color: #3366ff; background: #eef2ff; }
  .tile img { display: block; width: 22px; height: 22px; }

  .custom-row { display: flex; gap: 8px; align-items: center; margin-top: 10px; }
  .custom-row label.tile { padding: 8px 12px; aspect-ratio: auto; min-width: 120px; font-size: 13px; white-space: nowrap; }
  .custom-row input[type="text"] { flex: 1; }

  .picks { display: flex; flex-wrap: wrap; gap: 6px; }
  .pick {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 6px 10px 6px 8px;
    background: #fff;
    border: 1px solid #e4e6eb;
    border-radius: 999px;
    font-size: 13px;
    color: #222;
    text-decoration: none;
    max-width: 260px;
    transition: background 0.1s, border-color 0.1s, transform 0.1s;
  }
  .pick:hover { background: #eef2ff; border-color: #b9c3d6; transform: translateY(-1px); }
  .pick img { flex-shrink: 0; }
  .pick span { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

  button[type="submit"] {
    appearance: none;
    background: #3366ff;
    color: white;
    border: 0;
    padding: 12px 20px;
    font-size: 16px;
    font-weight: 600;
    border-radius: 8px;
    cursor: pointer;
    font-family: inherit;
    margin-top: 8px;
  }
  button[type="submit"]:hover { background: #2855e0; }

  /* Wes Bos signature footer — yellow highlighter under the name */
  .wb-footer {
    max-width: 920px;
    margin: 24px auto 0;
    padding: 0 8px;
    text-align: center;
    font-size: 15px;
    color: #2b2f36;
    letter-spacing: 0.01em;
  }
  .wb-name {
    display: inline-block;
    color: #000;
    font-weight: 800;
    text-decoration: none;
    padding: 0 4px 1px;
    background: linear-gradient(transparent 62%, #ffc600 62%);
    transform: rotate(-1.5deg);
    transition: transform 0.15s ease, background-position 0.15s ease;
  }
  .wb-name:hover { transform: rotate(-2.5deg) scale(1.04); }

  @media (max-width: 540px) {
    body { padding: 16px 10px 40px; }
    .content { padding: 24px 20px 32px; }
    .tab { min-width: 100px; }
    .titlebar { padding: 8px 10px 0; min-height: 38px; }
  }
</style>`;

  const presetDomainMap = JSON.stringify(
    Object.fromEntries(Object.entries(PRESETS).map(([slug, p]) => [slug, p.domain])),
  );

  const body = `
<div class="browser">
  <div class="chrome">
    <div class="titlebar">
      <div class="traffic-lights" aria-hidden="true">
        <span class="red"></span><span class="yellow"></span><span class="green"></span>
      </div>
      <div class="tab-strip">
        <div class="tab" role="tab" aria-selected="true">
          <img id="chrome-tab-icon" src="${escapeHtml(iconPath)}" width="16" height="16" alt="">
          <span id="chrome-tab-title" class="tab-title">${escapeHtml(initialTabLabel)}</span>
          <span class="tab-close" aria-hidden="true">×</span>
        </div>
        <button class="tab-new" type="button" tabindex="-1" aria-hidden="true">+</button>
      </div>
    </div>
    <div class="urlbar">
      <div class="url-nav" aria-hidden="true">
        <span>‹</span><span>›</span><span>↻</span>
      </div>
      <div class="url-input">
        <span class="url-lock" aria-hidden="true">🔒</span>
        <span id="chrome-url">${escapeHtml(initialUrl)}</span>
      </div>
    </div>
  </div>
  <div class="content">
    <h1>Tab Snitch</h1>
    <p class="sub">Fake the title and favicon of a browser tab. Pick an icon, type a title, and you'll get a bookmarkable URL.</p>

    <form method="post" action="/make">
      <div class="card">
        <label class="field" for="title">Tab title</label>
        <input id="title" name="title" type="text" placeholder="Inbox (453)" value="${escapeHtml(prefillTitle)}" required autocomplete="off">
      </div>

      <div class="card">
        <div class="field">Favicon</div>
        <div class="tiles">${tiles}</div>
        <div class="custom-row">
          <label class="tile">
            <input type="radio" name="source" value="custom"${customChecked}>
            <span>Custom domain</span>
          </label>
          <input name="domain" type="text" placeholder="example.com" value="${escapeHtml(customDomain)}" autocomplete="off">
        </div>
      </div>

      <button type="submit">Generate fake tab</button>
    </form>

    <div class="card" style="margin-top: 24px">
      <div class="field">Or try one of these</div>
      <div class="picks">${picks}</div>
    </div>
  </div>
</div>

<footer class="wb-footer">
  Made by <a class="wb-name" href="https://wesbos.com">Wes Bos</a>
</footer>

<script>
  (function () {
    var presets = ${presetDomainMap};
    var titleInput = document.getElementById('title');
    var domainInput = document.querySelector('input[name="domain"]');
    var tabIcon = document.getElementById('chrome-tab-icon');
    var tabTitle = document.getElementById('chrome-tab-title');
    var urlEl = document.getElementById('chrome-url');

    function currentDomain() {
      var source = document.querySelector('input[name="source"]:checked');
      if (!source) return 'google.com';
      if (source.value === 'custom') return (domainInput.value || '').trim() || 'example.com';
      return presets[source.value.slice('preset:'.length)] || 'google.com';
    }

    function toSlug(s) {
      return (s || '').trim().toLowerCase()
        .replace(/[^a-z0-9\\s-]/g, '')
        .replace(/\\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
    }

    function setFavicon(href) {
      document.querySelectorAll('link[rel~="icon"]').forEach(function (l) { l.remove(); });
      var link = document.createElement('link');
      link.rel = 'icon';
      link.type = 'image/png';
      link.href = href;
      document.head.appendChild(link);
    }

    function render() {
      var rawTitle = titleInput.value;
      var tabLabel = rawTitle || 'New Tab';
      var docTitle = rawTitle || 'Tab Snitch';
      var domain = currentDomain();
      var slug = toSlug(rawTitle);
      var iconUrl = '/icon/' + encodeURIComponent(domain);
      var fakeUrl = domain + (slug ? '/' + slug : '');

      tabIcon.src = iconUrl;
      tabTitle.textContent = tabLabel;
      urlEl.textContent = fakeUrl;
      document.title = docTitle;
      setFavicon(iconUrl);
    }

    titleInput.addEventListener('input', render);
    domainInput.addEventListener('input', function () {
      var customRadio = document.querySelector('input[name="source"][value="custom"]');
      if (customRadio) customRadio.checked = true;
      render();
    });
    document.querySelectorAll('input[name="source"]').forEach(function (el) {
      el.addEventListener('change', render);
    });

    render();
  })();
</script>`;

  return c.html(html(escapeHtml(initialTabTitle), body, head));
}
