/* txtkit -- shared */

// ========= Site rendering ===========
const SITE_NAME = 'txtkit';
const REPO_URL  = 'https://github.com/edvinassvedas-dev/txtkit';

const TOOLS = [
  { file: 'quote.html',   label: 'quote',
    description: 'Wrap list items in quote characters' },
  { file: 'unquote.html', label: 'unquote',
    description: 'Strip surrounding quotes or brackets from list items' },
  { file: 'compare.html', label: 'compare',
    description: 'Find items in list A only, list B only, or in both' },
  { file: 'dedupe.html', label: 'dedupe',
    description: 'Find duplicates and produce a deduplicated list' },
  { file: 'tabulate.html', label: 'tabulate',
    description: 'Turn tabular text into MD, CSV, PY, or SQL' },
  { file: 'mdtoc.html', label: 'mdtoc',
    description: 'Generate a table of contents from markdown headings' },
  { file: 'replace.html', label: 'replace',
    description: 'Apply a CSV-driven dictionary of identifier renames to code or text' },
];

// ---------- Theme toggle----------
const THEME_KEY = 'txtkit-theme';

function applyTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
}

function getStoredTheme() {
  try { return localStorage.getItem(THEME_KEY) || 'dark'; }
  catch (e) { return 'dark'; }
}

function setStoredTheme(theme) {
  try { localStorage.setItem(THEME_KEY, theme); } catch (e) { /* ignore */ }
}

function toggleTheme() {
  const next = getStoredTheme() === 'dark' ? 'light' : 'dark';
  setStoredTheme(next);
  applyTheme(next);
  updateToggleLabel(next);
}

function updateToggleLabel(theme) {
  const btn = document.getElementById('theme-toggle');
  if (btn) btn.textContent = theme === 'dark' ? 'light' : 'dark';
}

// ---------- Header ----------
function renderSiteHeader() {
  const host = document.getElementById('site-header');
  if (!host) return;
  const file = location.pathname.split('/').pop() || 'index.html';
  const links = TOOLS.map(t => {
    const cls = t.file === file ? ' class="active"' : '';
    return '<a href="' + t.file + '"' + cls + '>' + t.label + '</a>';
  }).join('');
  const stored = getStoredTheme();
  const toggleLabel = stored === 'dark' ? 'light' : 'dark';
  host.innerHTML =
    '<header class="site-head">' +
      '<div class="site-brand">' +
        '<a class="brand" href="index.html">' + SITE_NAME + '</a>' +
        '<a href="' + REPO_URL + '" class="repo" target="_blank" rel="noopener">github</a>' +
        '<button id="theme-toggle" class="theme-toggle" type="button">' + toggleLabel + '</button>' +
      '</div>' +
      '<nav class="site-nav">' + links + '</nav>' +
    '</header>';
  document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
}

function renderToolCards() {
  const host = document.getElementById('tool-cards');
  if (!host) return;
  host.innerHTML = TOOLS.map(t =>
    '<a class="tool-card" href="' + t.file + '">' +
      '<div class="t">' + t.label + '</div>' +
      '<div class="d">' + t.description + '</div>' +
    '</a>'
  ).join('');
}

renderSiteHeader();
renderToolCards();


// ========= Site rendering end ===========



// ---------- Separator def ----------
const SEPARATORS = {
  newline:       { split: /\r?\n/,    join: '\n' },
  comma:         { split: ',',         join: ',' },
  'comma-space': { split: /,\s*/,      join: ', ' },
  semicolon:     { split: /;\s*/,      join: '; ' },
  space:         { split: /\s+/,       join: ' ' },
  tab:           { split: '\t',        join: '\t' },
  pipe:          { split: /\s*\|\s*/,  join: ' | ' },
};

function getSplitter(kind, custom) {
  if (kind === 'custom') return custom || /\r?\n/;
  if (kind === 'regex') {
    const v = (custom || '').trim();
    if (!v) return /\r?\n/;
    const m = v.match(/^\/(.+)\/([gimsuy]*)$/);
    try { return m ? new RegExp(m[1], m[2]) : new RegExp(v); }
    catch (e) { return /\r?\n/; }
  }
  return SEPARATORS[kind] ? SEPARATORS[kind].split : /\r?\n/;
}

function getJoiner(kind, custom) {
  if (kind === 'custom') return custom || '';
  return SEPARATORS[kind] ? SEPARATORS[kind].join : '\n';
}

function splitItems(text, kind, custom) {
  if (!text || !text.length) return [];
  return text.split(getSplitter(kind, custom));
}

function joinItems(items, kind, custom) {
  return items.join(getJoiner(kind, custom));
}

// Toggles the "custom" text input's disabled state based on the kind dropdown value
// Pass allowRegex=true on inputs.
function syncSeparatorDisabled(kindEl, customEl, allowRegex) {
  customEl.disabled = !(kindEl.value === 'custom' || (allowRegex && kindEl.value === 'regex'));
}

// ---------- Quote presets --used by quote,unquote ----------
const QUOTE_PRESETS = [
  ['"','"'],
  ["'","'"],
  ['\u201C','\u201D'],
  ['\u2018','\u2019'],
  ['\u00AB','\u00BB'],
  ['\u2039','\u203A'],
  ['\u300C','\u300D'],
  ['[',']'],
  ['(',')'],
  ['{','}'],
  ['<','>'],
  ['`','`'],
];

function buildQuotePresets(container, leftInput, rightInput, onChange) {
  QUOTE_PRESETS.forEach(([l, r]) => {
    const b = document.createElement('button');
    b.className = 'qchip';
    b.type = 'button';
    b.textContent = l + (l === r ? '' : ' ' + r);
    b.dataset.l = l; b.dataset.r = r;
    b.addEventListener('click', () => {
      leftInput.value = l; rightInput.value = r;
      onChange();
    });
    container.appendChild(b);
  });
}

function highlightActivePreset(container, leftValue, rightValue) {
  Array.from(container.children).forEach(c => {
    c.classList.toggle('active', c.dataset.l === leftValue && c.dataset.r === rightValue);
  });
}

// ---------- Copy button ----------
function flashCopy(btn, text) {
  if (!text) return;
  const doFlash = () => {
    const old = btn.textContent;
    btn.textContent = 'Copied';
    btn.classList.add('flash');
    setTimeout(() => { btn.textContent = old; btn.classList.remove('flash'); }, 800);
  };
  const fallback = () => {
    const ta = document.createElement('textarea');
    ta.value = text; document.body.appendChild(ta);
    ta.select(); document.execCommand('copy'); ta.remove();
    doFlash();
  };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(doFlash).catch(fallback);
  } else { fallback(); }
}

function setupCopyButton(btn, source) {
  btn.addEventListener('click', () => flashCopy(btn, source.value));
}

// ---------- Misc ----------
function pluralLabel(n, single) {
  single = single || 'item';
  return n + ' ' + single + (n === 1 ? '' : 's');
}

// post-processing of an item list
// Order: trim before filter, so " " becomes "" and gets filtered.
function processList(items, opts) {
  opts = opts || {};
  if (opts.trim)      items = items.map(s => s.trim());
  if (opts.skipEmpty) items = items.filter(s => s.length > 0);
  return items;
}

// ---------- URL hash----------
function readHashParams() {
  return new URLSearchParams(location.hash.slice(1));
}
function writeHashParams(obj) {
  const p = new URLSearchParams();
  Object.entries(obj).forEach(([k, v]) => {
    if (v !== '' && v !== null && v !== undefined) p.set(k, v);
  });
  const s = p.toString();
  history.replaceState(null, '', s ? '#' + s : location.pathname + location.search);
}
function makeDebounced(fn, ms) {
  let t;
  return function() { clearTimeout(t); t = setTimeout(fn, ms || 250); };
}
