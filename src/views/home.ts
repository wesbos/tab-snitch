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

  const initialTileSlug = titleSlug || "untitled";
  const tiles = Object.entries(PRESETS)
    .map(([slug, p]) => {
      const value = `preset:${slug}`;
      const checked = value === selectedSource ? " checked" : "";
      const href = `/${slug}/${initialTileSlug}`;
      return `
      <a class="tile" href="${escapeHtml(href)}" data-preset="${escapeHtml(slug)}" title="${escapeHtml(p.label)}">
        <input type="radio" name="source" value="${escapeHtml(value)}"${checked} tabindex="-1" aria-hidden="true">
        <img src="/icon/${escapeHtml(p.domain)}" alt="${escapeHtml(p.label)}" width="22" height="22" loading="lazy">
      </a>`;
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
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=JetBrains+Mono:wght@500&display=swap">
<style>
  :root {
    color-scheme: light;
    --yellow: #ffc600;
    --black: #000;
    --white: #fff;
    --cream: #fbfbfb;
    --lightGrey: #d8d8d8;
    --border: 2.5px;
    --display: "Archivo Black", system-ui, sans-serif;
    --mono: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace;
  }
  * { box-sizing: border-box; }
  html, body { margin: 0; }
  body {
    font: 15px/1.5 -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
    background-color: var(--cream);
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.07 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size: 200px 200px;
    min-height: 100vh;
    color: var(--black);
    padding: 40px 16px 80px;
  }

  /* Fake browser window — chunky wesbos border + hard offset shadow */
  .browser {
    max-width: 920px;
    margin: 0 auto;
    background: var(--white);
    border: var(--border) solid var(--black);
    border-radius: 6px;
    box-shadow: 10px 10px 0 var(--black);
    overflow: hidden;
  }

  .chrome {
    background: linear-gradient(to bottom, #e9ebef, #dfe2e6);
    border-bottom: var(--border) solid var(--black);
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
    border: 2px solid var(--black);
    border-bottom: none;
    margin-bottom: -2.5px;
    position: relative;
    z-index: 1;
    box-shadow: inset 0 -3px 0 var(--yellow);
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
    border: 2px solid var(--black);
    border-radius: 6px;
    padding: 5px 10px;
    font-family: var(--mono);
    font-size: 12.5px;
    color: #111;
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
  .content { padding: 40px 40px 48px; background: var(--white); }
  h1 {
    margin: 0 0 10px;
    font-family: var(--display);
    font-weight: 400;
    font-size: 52px;
    line-height: 1.05;
    letter-spacing: -0.02em;
    color: var(--black);
  }
  h1 .hl {
    display: inline-block;
    padding: 0 8px 2px;
    background: linear-gradient(transparent 58%, var(--yellow) 58%);
    transform: rotate(-1.5deg);
  }
  .sub {
    color: #111;
    margin: 0 0 28px;
    font-size: 17px;
    max-width: 46ch;
  }
  .card {
    background: var(--white);
    border: var(--border) solid var(--black);
    border-radius: 6px;
    padding: 22px;
    margin-bottom: 18px;
    box-shadow: 5px 5px 0 var(--black);
  }
  label.field, .card > .field {
    display: block;
    font-family: var(--mono);
    font-weight: 500;
    margin-bottom: 12px;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--black);
  }
  input[type="text"] {
    width: 100%;
    padding: 12px 14px;
    font-size: 16px;
    border: var(--border) solid var(--black);
    border-radius: 4px;
    background: var(--white);
    color: var(--black);
    font-family: inherit;
    font-weight: 500;
  }
  input[type="text"]::placeholder { color: #8a8f98; font-weight: 400; }
  input[type="text"]:focus {
    outline: 0;
    background: #fffbe6;
    box-shadow: 4px 4px 0 var(--yellow);
  }

  .tiles { display: grid; grid-template-columns: repeat(auto-fill, minmax(42px, 1fr)); gap: 5px; }
  .tile {
    position: relative;
    display: flex; align-items: center; justify-content: center;
    padding: 6px;
    aspect-ratio: 1;
    border: 2.5px solid var(--black);
    border-radius: 4px;
    cursor: pointer;
    background: var(--white);
    color: inherit;
    text-decoration: none;
    transition: transform 0.1s, box-shadow 0.1s, background 0.1s;
  }
  .tile:hover { background: #fff8d0; transform: translate(-1px, -1px); box-shadow: 2px 2px 0 var(--black); }
  .tile input { position: absolute; opacity: 0; pointer-events: none; }
  .tile:has(input:checked) { background: var(--yellow); transform: translate(-2px, -2px); box-shadow: 3px 3px 0 var(--black); }
  .tile img { display: block; width: 22px; height: 22px; }

  .custom-row { display: flex; gap: 10px; align-items: center; margin-top: 14px; }
  .custom-row label.tile {
    padding: 10px 14px; aspect-ratio: auto; min-width: 140px;
    font-size: 13px; white-space: nowrap; font-weight: 600;
  }
  .custom-row input[type="text"] { flex: 1; }

  .picks { display: flex; flex-wrap: wrap; gap: 8px; }
  .pick {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 7px 12px 7px 9px;
    background: var(--white);
    border: 2px solid var(--black);
    border-radius: 999px;
    font-size: 13px;
    font-weight: 600;
    color: var(--black);
    text-decoration: none;
    max-width: 280px;
    transition: transform 0.1s, box-shadow 0.1s, background 0.1s;
  }
  .pick:hover { background: var(--yellow); transform: translate(-1px, -1px); box-shadow: 2px 2px 0 var(--black); }
  .pick img { flex-shrink: 0; }
  .pick span { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

  /* Title input + submit combined control */
  .title-field {
    display: flex;
    align-items: stretch;
    border: var(--border) solid var(--black);
    border-radius: 4px;
    background: var(--white);
    box-shadow: 4px 4px 0 var(--black);
    overflow: hidden;
    transition: box-shadow 0.1s, transform 0.1s;
  }
  .title-field:focus-within {
    background: #fffbe6;
    box-shadow: 6px 6px 0 var(--yellow), 6px 6px 0 2px var(--black);
    transform: translate(-1px, -1px);
  }
  .title-field input[type="text"] {
    flex: 1;
    min-width: 0;
    border: 0;
    background: transparent;
    padding: 14px 16px;
    font-size: 16px;
    font-weight: 500;
    color: var(--black);
    border-radius: 0;
  }
  .title-field input[type="text"]:focus {
    outline: 0;
    background: transparent;
    box-shadow: none;
  }
  .title-field button[type="submit"] {
    appearance: none;
    flex-shrink: 0;
    background: var(--yellow);
    color: var(--black);
    border: 0;
    border-left: var(--border) solid var(--black);
    padding: 0 22px;
    font-size: 14px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    cursor: pointer;
    font-family: inherit;
    white-space: nowrap;
    transition: background 0.1s;
  }
  .title-field button[type="submit"]:hover { background: #ffd633; }
  .title-field button[type="submit"]:active { background: #e6b300; }

  @media (max-width: 540px) {
    .title-field { flex-direction: column; }
    .title-field button[type="submit"] { border-left: 0; border-top: var(--border) solid var(--black); padding: 12px; }
  }

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
    <h1><span class="hl">Tab Snitch</span></h1>
    <p class="sub">Liven up your screenshots with errant open tabs.</p>

    <form method="post" action="/make">
      <div class="card">
        <label class="field" for="title">Tab title</label>
        <div class="title-field">
          <input id="title" name="title" type="text" placeholder="Inbox (453)" value="${escapeHtml(prefillTitle)}" required autocomplete="off">
          <button type="submit">Generate fake tab</button>
        </div>
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

    var presetTiles = document.querySelectorAll('a.tile[data-preset]');

    function updateTileHrefs(slug) {
      var s = slug || 'untitled';
      presetTiles.forEach(function (a) {
        a.href = '/' + a.dataset.preset + '/' + s;
      });
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
      updateTileHrefs(slug);
    }

    // Plain click = select preset; modifier/middle-click = open decoy in new tab
    presetTiles.forEach(function (a) {
      a.addEventListener('click', function (e) {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        e.preventDefault();
        var radio = a.querySelector('input[type="radio"]');
        if (radio) {
          radio.checked = true;
          render();
        }
      });
    });

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
