/* =============================================
   ToolKit Pro — app.js
   All tool logic, no external dependencies
   (QR uses free goQR.me API)
   ============================================= */

// ── NAVIGATION ───────────────────────────────
function openTool(id) {
  // hide all panels
  document.querySelectorAll('.tool-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tool-card').forEach(c => c.classList.remove('active'));
  // show selected
  const panel = document.getElementById('tool-' + id);
  const card  = document.getElementById('card-' + id);
  if (panel) panel.classList.add('active');
  if (card)  card.classList.add('active');
  // smooth scroll to tool area
  setTimeout(() => {
    document.getElementById('tool-area').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 50);
}

// ── TOAST ─────────────────────────────────────
function showToast(msg = '✅ Copied!') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2000);
}

function copyText(text) {
  navigator.clipboard.writeText(text).then(() => showToast('✅ Copied!'));
}

function copyResult(id) {
  const el = document.getElementById(id);
  if (el) copyText(el.textContent);
}

// ── WORD COUNTER ──────────────────────────────
function analyzeText() {
  const text = document.getElementById('wc-input').value;
  const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  const chars = text.length;
  const charsNoSpace = text.replace(/\s/g, '').length;
  const sentences = text.trim() === '' ? 0 : (text.match(/[.!?]+/g) || []).length;
  const paragraphs = text.trim() === '' ? 0 : text.split(/\n\s*\n/).filter(p => p.trim()).length || (text.trim() ? 1 : 0);
  const readTime = Math.ceil(words / 200);

  document.getElementById('wc-words').textContent = words.toLocaleString();
  document.getElementById('wc-chars').textContent = chars.toLocaleString();
  document.getElementById('wc-chars-ns').textContent = charsNoSpace.toLocaleString();
  document.getElementById('wc-sentences').textContent = sentences.toLocaleString();
  document.getElementById('wc-paragraphs').textContent = paragraphs.toLocaleString();
  document.getElementById('wc-read').textContent = readTime < 1 ? '< 1 min' : readTime + ' min';
}

// ── CASE CONVERTER ────────────────────────────
function convertCase(type) {
  const input = document.getElementById('cc-input').value;
  let out = '';
  switch (type) {
    case 'upper':    out = input.toUpperCase(); break;
    case 'lower':    out = input.toLowerCase(); break;
    case 'title':    out = input.replace(/\w\S*/g, w => w[0].toUpperCase() + w.slice(1).toLowerCase()); break;
    case 'sentence': out = input.charAt(0).toUpperCase() + input.slice(1).toLowerCase(); break;
    case 'camel':
      out = input.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase());
      break;
    case 'snake':
      out = input.trim().toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
      break;
    case 'kebab':
      out = input.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      break;
    default: out = input;
  }
  document.getElementById('cc-result').textContent = out;
}

// ── LOREM IPSUM ───────────────────────────────
const LOREM_WORDS = [
  'lorem','ipsum','dolor','sit','amet','consectetur','adipiscing','elit','sed','do',
  'eiusmod','tempor','incididunt','ut','labore','et','dolore','magna','aliqua','enim',
  'ad','minim','veniam','quis','nostrud','exercitation','ullamco','laboris','nisi',
  'aliquip','ex','ea','commodo','consequat','duis','aute','irure','in','reprehenderit',
  'voluptate','velit','esse','cillum','eu','fugiat','nulla','pariatur','excepteur',
  'sint','occaecat','cupidatat','non','proident','sunt','culpa','qui','officia',
  'deserunt','mollit','anim','id','est','laborum','curabitur','pretium','tincidunt',
  'lacus','nunc','pulvinar','sapien','ligula','eget','massa','volutpat','vel',
  'facilisis','magna','etiam','tempor','orci','eu','lobortis'
];

function loremSentence(wordCount) {
  const words = Array.from({length: wordCount}, () => LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]);
  return words[0].charAt(0).toUpperCase() + words.slice(1).join(' ') + '.';
}

function generateLorem() {
  const paras = parseInt(document.getElementById('li-count').value) || 3;
  const sents = parseInt(document.getElementById('li-sentences').value) || 5;
  const paragraphs = Array.from({length: paras}, () => {
    return Array.from({length: sents}, () => loremSentence(Math.floor(Math.random() * 10) + 8)).join(' ');
  });
  document.getElementById('li-result').textContent = paragraphs.join('\n\n');
}

// ── PASSWORD GENERATOR ────────────────────────
const CHARSET = {
  upper:  'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower:  'abcdefghijklmnopqrstuvwxyz',
  digits: '0123456789',
  sym:    '!@#$%^&*()-_=+[]{}|;:,.<>?'
};

function generatePassword() {
  const len    = parseInt(document.getElementById('pg-length').value);
  const upper  = document.getElementById('pg-upper').checked;
  const lower  = document.getElementById('pg-lower').checked;
  const digits = document.getElementById('pg-digits').checked;
  const sym    = document.getElementById('pg-sym').checked;

  let chars = '';
  let mandatory = '';
  if (upper)  { chars += CHARSET.upper;  mandatory += CHARSET.upper[Math.floor(Math.random()*26)]; }
  if (lower)  { chars += CHARSET.lower;  mandatory += CHARSET.lower[Math.floor(Math.random()*26)]; }
  if (digits) { chars += CHARSET.digits; mandatory += CHARSET.digits[Math.floor(Math.random()*10)]; }
  if (sym)    { chars += CHARSET.sym;    mandatory += CHARSET.sym[Math.floor(Math.random()*CHARSET.sym.length)]; }

  if (!chars) { document.getElementById('pg-result').textContent = 'Select at least one character type'; return; }

  let pwd = mandatory;
  const arr = new Uint32Array(len - mandatory.length);
  crypto.getRandomValues(arr);
  for (let i = 0; i < arr.length; i++) {
    pwd += chars[arr[i] % chars.length];
  }
  // Shuffle
  pwd = pwd.split('').sort(() => crypto.getRandomValues(new Uint8Array(1))[0] - 128).join('');

  document.getElementById('pg-result').textContent = pwd;

  // Strength
  let score = 0;
  if (upper) score++;
  if (lower) score++;
  if (digits) score++;
  if (sym) score++;
  if (len >= 12) score++;
  if (len >= 20) score++;
  const labels = ['', 'Very Weak 🔴', 'Weak 🟠', 'Fair 🟡', 'Good 🟢', 'Strong 💚', 'Very Strong 💪'];
  document.getElementById('pg-strength').innerHTML = `Strength: <strong>${labels[Math.min(score, 6)]}</strong>`;
}

// ── HASH GENERATOR (SHA-256 via Web Crypto) ───
async function hashText() {
  const text = document.getElementById('hg-input').value;
  if (!text.trim()) return;
  const enc = new TextEncoder();
  const data = enc.encode(text);
  const digest = await crypto.subtle.digest('SHA-256', data);
  const hex = Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2,'0')).join('');
  // Simple non-crypto hashes
  const md5like = simpleHash(text, 32);
  const sha1like = simpleHash(text, 40);

  document.getElementById('hg-results').innerHTML = `
    <div class="stat-grid" style="grid-template-columns:1fr;">
      <div class="stat-card" style="text-align:left;cursor:pointer;" onclick="copyText('${hex}')">
        <div class="stat-label">SHA-256 (click to copy)</div>
        <div style="font-family:monospace;font-size:0.78rem;word-break:break-all;color:var(--accent);margin-top:4px;">${hex}</div>
      </div>
      <div class="stat-card" style="text-align:left;cursor:pointer;" onclick="copyText('${md5like}')">
        <div class="stat-label">MD5-style hash (click to copy)</div>
        <div style="font-family:monospace;font-size:0.85rem;word-break:break-all;color:var(--accent2);margin-top:4px;">${md5like}</div>
      </div>
    </div>`;
}

function simpleHash(str, len) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  // stretch to desired length
  let result = Math.abs(hash).toString(16);
  while (result.length < len) { result += Math.abs(hash * result.length).toString(16); }
  return result.slice(0, len);
}

// ── UNIT CONVERTER ────────────────────────────
const UNITS = {
  length: {
    units: ['Meter','Kilometer','Mile','Yard','Foot','Inch','Centimeter','Millimeter','Nanometer','Light-year'],
    toBase: [1, 1e3, 1609.344, 0.9144, 0.3048, 0.0254, 0.01, 0.001, 1e-9, 9.461e+15]
  },
  weight: {
    units: ['Kilogram','Gram','Pound','Ounce','Tonne','Milligram','Microgram','Stone'],
    toBase: [1, 0.001, 0.453592, 0.0283495, 1000, 1e-6, 1e-9, 6.35029]
  },
  temperature: {
    units: ['Celsius','Fahrenheit','Kelvin'],
    toBase: null // special case
  },
  area: {
    units: ['Square Meter','Square Kilometer','Square Foot','Square Yard','Square Mile','Acre','Hectare'],
    toBase: [1, 1e6, 0.092903, 0.836127, 2.58999e6, 4046.86, 10000]
  },
  speed: {
    units: ['m/s','km/h','mph','knot','ft/s'],
    toBase: [1, 0.277778, 0.44704, 0.514444, 0.3048]
  },
  data: {
    units: ['Bit','Byte','Kilobyte','Megabyte','Gigabyte','Terabyte','Petabyte'],
    toBase: [0.125, 1, 1024, 1048576, 1073741824, 1.09951e12, 1.12590e15]
  }
};

function initUnitConverter() {
  const type = document.getElementById('uc-type').value;
  const fromSel = document.getElementById('uc-from');
  const toSel   = document.getElementById('uc-to');
  const units   = UNITS[type].units;
  fromSel.innerHTML = units.map((u,i) => `<option value="${i}">${u}</option>`).join('');
  toSel.innerHTML   = units.map((u,i) => `<option value="${i}" ${i===1?'selected':''}>${u}</option>`).join('');
  convertUnit();
}

function convertUnit() {
  const type  = document.getElementById('uc-type').value;
  const val   = parseFloat(document.getElementById('uc-value').value);
  const fi    = parseInt(document.getElementById('uc-from').value);
  const ti    = parseInt(document.getElementById('uc-to').value);
  const data  = UNITS[type];
  let result;

  if (type === 'temperature') {
    result = convertTemp(val, fi, ti);
  } else {
    const base = val * data.toBase[fi];
    result = base / data.toBase[ti];
  }

  const fmt = isNaN(result) ? '—' : (Math.abs(result) < 0.0001 || Math.abs(result) > 1e10)
    ? result.toExponential(6)
    : parseFloat(result.toFixed(8)).toString();

  document.getElementById('uc-result').textContent =
    `${val} ${data.units[fi]} = ${fmt} ${data.units[ti]}`;
}

function convertTemp(val, from, to) {
  // 0=C, 1=F, 2=K
  let celsius;
  if (from === 0) celsius = val;
  else if (from === 1) celsius = (val - 32) * 5/9;
  else celsius = val - 273.15;

  if (to === 0) return celsius;
  if (to === 1) return celsius * 9/5 + 32;
  return celsius + 273.15;
}

// ── COLOR PICKER ──────────────────────────────
function updateColor(hex) {
  document.getElementById('cp-picker').value = hex;
  document.getElementById('cp-hex').value = hex;
  document.getElementById('cp-preview').style.background = hex;
  document.getElementById('cp-hex-val').textContent = hex;

  const rgb = hexToRgb(hex);
  if (!rgb) return;
  document.getElementById('cp-rgb-val').textContent = `rgb(${rgb.r},${rgb.g},${rgb.b})`;

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  document.getElementById('cp-hsl-val').textContent = `hsl(${hsl.h}°,${hsl.s}%,${hsl.l}%)`;
}

function updateColorFromHex(val) {
  if (/^#[0-9A-Fa-f]{6}$/.test(val)) updateColor(val);
}

function hexToRgb(hex) {
  const m = hex.replace('#','').match(/.{2}/g);
  if (!m) return null;
  return { r: parseInt(m[0],16), g: parseInt(m[1],16), b: parseInt(m[2],16) };
}

function rgbToHsl(r,g,b) {
  r/=255; g/=255; b/=255;
  const max=Math.max(r,g,b), min=Math.min(r,g,b);
  let h,s,l=(max+min)/2;
  if (max===min) { h=s=0; }
  else {
    const d=max-min;
    s=l>0.5?d/(2-max-min):d/(max+min);
    switch(max){
      case r: h=((g-b)/d+(g<b?6:0))/6; break;
      case g: h=((b-r)/d+2)/6; break;
      case b: h=((r-g)/d+4)/6; break;
    }
  }
  return { h: Math.round(h*360), s: Math.round(s*100), l: Math.round(l*100) };
}

// ── BASE64 ────────────────────────────────────
function doBase64(mode) {
  const input = document.getElementById('b64-input').value;
  try {
    const out = mode === 'encode' ? btoa(unescape(encodeURIComponent(input))) : decodeURIComponent(escape(atob(input)));
    document.getElementById('b64-result').textContent = out;
  } catch(e) {
    document.getElementById('b64-result').textContent = '⚠️ Invalid input: ' + e.message;
  }
}

// ── JSON FORMATTER ────────────────────────────
function formatJSON(indent) {
  const input = document.getElementById('jf-input').value;
  try {
    const obj = JSON.parse(input);
    document.getElementById('jf-result').textContent = JSON.stringify(obj, null, indent);
  } catch(e) {
    document.getElementById('jf-result').textContent = '❌ Invalid JSON: ' + e.message;
  }
}

function validateJSON() {
  const input = document.getElementById('jf-input').value;
  try {
    JSON.parse(input);
    document.getElementById('jf-result').textContent = '✅ Valid JSON!';
  } catch(e) {
    document.getElementById('jf-result').textContent = '❌ Invalid JSON: ' + e.message;
  }
}

// ── QR CODE GENERATOR ─────────────────────────
function generateQR() {
  const text = document.getElementById('qr-input').value.trim();
  if (!text) { alert('Please enter some text or a URL.'); return; }
  const size = document.getElementById('qr-size').value;
  const encoded = encodeURIComponent(text);
  const url = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encoded}&color=7c5cfc&bgcolor=111118`;
  document.getElementById('qr-output').innerHTML = `
    <img src="${url}" alt="QR Code" style="border-radius:12px;border:1px solid var(--border);max-width:100%;"/>
    <p style="margin-top:0.75rem;font-size:0.8rem;color:var(--muted);">Right-click → Save Image to download</p>`;
}

// ── TIMESTAMP CONVERTER ───────────────────────
function tsToDate() {
  const ts = parseInt(document.getElementById('ts-unix').value);
  if (isNaN(ts)) { document.getElementById('ts-result').textContent = '⚠️ Enter a valid UNIX timestamp'; return; }
  const d = new Date(ts * 1000);
  document.getElementById('ts-result').textContent =
    `UTC:    ${d.toUTCString()}\nLocal:  ${d.toLocaleString()}\nISO:    ${d.toISOString()}\nDate:   ${d.toLocaleDateString()}\nTime:   ${d.toLocaleTimeString()}`;
}

function tsNow() {
  const now = Math.floor(Date.now() / 1000);
  document.getElementById('ts-unix').value = now;
  tsToDate();
}

function dateToTs() {
  const str = document.getElementById('ts-date').value.trim();
  const d = new Date(str);
  if (isNaN(d.getTime())) { document.getElementById('ts-result2').textContent = '⚠️ Invalid date format'; return; }
  document.getElementById('ts-result2').textContent = `UNIX Timestamp: ${Math.floor(d.getTime() / 1000)}`;
}

// ── VIDEO DOWNLOADER (Cobalt API) ─────────────
function vdlToggleMode() {
  const isAudio = document.getElementById('vdl-mode-audio').checked;
  document.getElementById('vdl-video-opts').style.display = isAudio ? 'none' : '';
  document.getElementById('vdl-audio-opts').style.display = isAudio ? '' : 'none';
}

async function downloadVideo() {
  const url       = document.getElementById('vdl-url').value.trim();
  const isAudio   = document.getElementById('vdl-mode-audio').checked;
  const quality   = document.getElementById('vdl-quality').value;
  const vcodec    = document.getElementById('vdl-vcodec').value;
  const aformat   = document.getElementById('vdl-aformat').value;
  const resultEl  = document.getElementById('vdl-result');
  const btn       = document.getElementById('vdl-btn');

  if (!url) {
    resultEl.innerHTML = `<div class="result-box" style="color:var(--warning);">⚠️ Please enter a video URL.</div>`;
    return;
  }

  btn.disabled = true;
  btn.textContent = '⏳ Fetching…';
  resultEl.innerHTML = `<div class="result-box" style="color:var(--muted);text-align:center;">Contacting Cobalt API…</div>`;

  const body = {
    url,
    videoQuality: quality === 'max' ? '9000' : quality,
    filenameStyle: 'pretty',
    downloadMode: isAudio ? 'audio' : 'auto',
  };
  if (isAudio && aformat !== 'best') body.audioFormat = aformat;
  if (!isAudio) body.youtubeVideoCodec = vcodec;

  const COBALT_INSTANCES = [
    'https://cobalt-api.kwiatekm.dev/',
    'https://api.cobalt.tools/',
    'https://cobalt.q0.nhsh.it/',
    'https://imput.net/cobalt/api/json',
    'https://api.cobalt.best/'
  ];

  let success = false;
  let lastError = null;

  for (const apiUrl of COBALT_INSTANCES) {
    if (success) break;
    
    try {
      resultEl.innerHTML = `<div class="result-box" style="color:var(--muted);text-align:center;">Contacting free API (${apiUrl.split('/')[2]})...</div>`;
      
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(body),
      });
      
      if (!res.ok) throw new Error("API rejected the request");
      
      const data = await res.json();
  
      if (data.status === 'error') {
          throw new Error(data.error?.code || 'Unknown error');
      }
  
      const downloadUrl = data.url || (data.picker && data.picker[0]?.url);
      const filename    = data.filename || 'download';
  
      if (!downloadUrl) throw new Error("No download URL returned");
  
      resultEl.innerHTML = `
        <div style="background:var(--bg2);border:1px solid var(--success);border-radius:10px;padding:1.25rem;margin-top:0.5rem;">
          <div style="color:var(--success);font-weight:600;margin-bottom:0.75rem;">✅ Ready to download!</div>
          <p style="font-size:0.8rem;color:var(--muted);margin-bottom:1rem;">File: <code>${filename}</code></p>
          <a href="${downloadUrl}" download="${filename}" target="_blank"
             style="display:inline-flex;align-items:center;gap:0.4rem;padding:0.6rem 1.25rem;background:var(--success);color:#000;
                    border-radius:8px;font-weight:700;font-size:0.9rem;text-decoration:none;"
             onclick="showToast('⬇️ Download started!')">
            ⬇️ Download ${isAudio ? 'Audio' : 'Video'}
          </a>
          <p style="font-size:0.72rem;color:var(--muted);margin-top:0.75rem;">
            If the download doesn't start, <a href="${downloadUrl}" target="_blank" style="color:var(--accent);">open the direct link</a>.
          </p>
        </div>`;
      
      success = true;
      break; 
  
    } catch (err) {
      lastError = err.message;
      // Continue to next API instance
    }
  }

  if (!success) {
    resultEl.innerHTML = `
      <div class="result-box" style="color:var(--danger);">
        ❌ All free downloader APIs are currently busy or blocked this video.<br/>
        <span style="font-size:0.78rem;color:var(--muted);">Last Error: ${lastError} - Try again later.</span>
      </div>`;
  }
  
  btn.disabled = false;
  btn.textContent = '⬇️ Download';
}

// ── FILE CONVERTER (FFmpeg.wasm) ───────────────
const FC_FORMATS = {
  audio: [
    { ext: 'mp3',  label: 'MP3 — most compatible' },
    { ext: 'flac', label: 'FLAC — lossless' },
    { ext: 'wav',  label: 'WAV — uncompressed lossless' },
    { ext: 'ogg',  label: 'OGG Vorbis — open source' },
    { ext: 'opus', label: 'Opus — best quality/size' },
    { ext: 'm4a',  label: 'M4A (AAC) — Apple/iTunes' },
    { ext: 'alac', label: 'ALAC — Apple lossless (in M4A)' },
    { ext: 'ac3',  label: 'AC3 — Dolby Digital' },
    { ext: 'aiff', label: 'AIFF — Apple uncompressed' },
    { ext: 'amr',  label: 'AMR — voice / mobile' },
  ],
  video: [
    { ext: 'mp4',  label: 'MP4 (H.264) — best compat' },
    { ext: 'webm', label: 'WebM (VP9) — web optimised' },
    { ext: 'mkv',  label: 'MKV — flexible container' },
    { ext: 'avi',  label: 'AVI — legacy' },
    { ext: 'mov',  label: 'MOV — QuickTime' },
    { ext: 'gif',  label: 'GIF — animated meme 🎞️' },
  ],
  image: [
    { ext: 'jpg',  label: 'JPG — compressed photo' },
    { ext: 'png',  label: 'PNG — lossless with alpha' },
    { ext: 'webp', label: 'WebP — modern web format' },
    { ext: 'bmp',  label: 'BMP — raw bitmap' },
    { ext: 'tiff', label: 'TIFF — print quality' },
    { ext: 'gif',  label: 'GIF — static' },
  ],
};

// FFmpeg codec map per output extension
const FC_CODEC = {
  mp3:  ['-c:a','libmp3lame'],
  flac: ['-c:a','flac'],
  wav:  ['-c:a','pcm_s16le'],
  ogg:  ['-c:a','libvorbis'],
  opus: ['-c:a','libopus'],
  m4a:  ['-c:a','aac'],
  alac: ['-c:a','alac'],
  ac3:  ['-c:a','ac3'],
  aiff: ['-c:a','pcm_s16be'],
  amr:  ['-c:a','libopencore_amrnb','-ar','8000'],
  mp4:  ['-c:v','libx264','-c:a','aac'],
  webm: ['-c:v','libvpx-vp9','-c:a','libopus'],
  mkv:  ['-c:v','libx264','-c:a','aac'],
  avi:  ['-c:v','mpeg4','-c:a','mp3'],
  mov:  ['-c:v','libx264','-c:a','aac'],
  gif:  ['-vf','fps=12,scale=480:-1:flags=lanczos'],
  jpg:  ['-vf','scale=iw:ih'],
  png:  [],
  webp: ['-quality','80'],
  bmp:  [],
  tiff: [],
};

let fcFile = null;
let ffmpegInst = null;
let ffmpegLoaded = false;

function fcUpdateFormats() {
  const cat = document.getElementById('fc-category').value;
  const sel = document.getElementById('fc-format');
  sel.innerHTML = FC_FORMATS[cat].map(f => `<option value="${f.ext}">${f.ext.toUpperCase()} — ${f.label.split('—')[1]?.trim() || f.label}</option>`).join('');
  document.getElementById('fc-audio-opts').style.display = cat === 'audio' ? '' : 'none';
  document.getElementById('fc-video-opts').style.display = cat === 'video' ? '' : 'none';
}

function fcDragOver(e) {
  e.preventDefault();
  document.getElementById('fc-dropzone').classList.add('drag-over');
}

function fcDrop(e) {
  e.preventDefault();
  document.getElementById('fc-dropzone').classList.remove('drag-over');
  const file = e.dataTransfer.files[0];
  if (file) fcSetFile(file);
}

function fcFileSelected(input) {
  if (input.files[0]) fcSetFile(input.files[0]);
}

function fcSetFile(file) {
  fcFile = file;
  const mb = file.size / 1024 / 1024;
  const mbStr = mb.toFixed(2);

  let sizeNote = '';
  if (mb > 500) {
    sizeNote = ` <span style="color:var(--danger);font-weight:600">❌ Too large (${mbStr} MB) — max 500 MB</span>`;
    fcFile = null; // block it
  } else if (mb > 200) {
    sizeNote = ` <span style="color:var(--warning)">⚠️ Large file (${mbStr} MB) — may be slow or crash</span>`;
  } else {
    sizeNote = ` <span style="color:var(--muted)">(${mbStr} MB)</span>`;
  }

  document.getElementById('fc-filename').innerHTML =
    `📄 ${file.name}${sizeNote}
    <div style="margin-top:0.6rem;padding:0.55rem 0.8rem;background:rgba(124,92,252,0.08);border:1px solid rgba(124,92,252,0.25);border-radius:8px;font-size:0.78rem;color:var(--muted);display:flex;align-items:center;gap:0.4rem;">
      🧠 <strong style="color:var(--accent);">RAM Notice:</strong> Conversion runs entirely in your browser. The file will be loaded into your device's RAM — no data is sent to any server.
    </div>`;

  if (!fcFile) return; // blocked

  // Auto-select output category based on mime
  const mime = file.type;
  if (mime.startsWith('audio')) document.getElementById('fc-category').value = 'audio';
  else if (mime.startsWith('video')) document.getElementById('fc-category').value = 'video';
  else if (mime.startsWith('image')) document.getElementById('fc-category').value = 'image';
  fcUpdateFormats();
}

async function loadFFmpeg() {
  if (ffmpegLoaded) return ffmpegInst;
  // FFmpegWASM is the UMD global from @ffmpeg/ffmpeg
  // FFmpegUtil is the UMD global from @ffmpeg/util
  const { FFmpeg } = FFmpegWASM;
  const { fetchFile, toBlobURL } = FFmpegUtil;
  ffmpegInst = new FFmpeg();
  ffmpegInst._fetchFile = fetchFile;

  const baseURL = 'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.6/dist/umd';
  await ffmpegInst.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
  });
  ffmpegLoaded = true;
  return ffmpegInst;
}

async function convertFile() {
  if (!fcFile) {
    document.getElementById('fc-result').innerHTML =
      `<div class="result-box" style="color:var(--warning);">⚠️ Please select a file first.</div>`;
    return;
  }

  const cat      = document.getElementById('fc-category').value;
  const outExt   = document.getElementById('fc-format').value;
  const bitrate  = document.getElementById('fc-bitrate').value;
  const sr       = document.getElementById('fc-samplerate').value;
  const crf      = document.getElementById('fc-vbitrate').value;
  const scale    = document.getElementById('fc-scale').value;
  const btn      = document.getElementById('fc-btn');
  const prog     = document.getElementById('fc-progress');
  const bar      = document.getElementById('fc-bar');
  const pctEl    = document.getElementById('fc-pct');
  const statusEl = document.getElementById('fc-status-text');
  const resultEl = document.getElementById('fc-result');

  btn.disabled = true;
  prog.style.display = 'block';
  resultEl.innerHTML = '';
  statusEl.textContent = 'Loading FFmpeg engine…';
  bar.style.width = '5%'; pctEl.textContent = '5%';

  try {
    const ff = await loadFFmpeg();
    const { fetchFile } = FFmpegUtil;

    statusEl.textContent = 'Reading file…';
    bar.style.width = '20%'; pctEl.textContent = '20%';

    const inputName  = 'input.' + (fcFile.name.split('.').pop() || 'bin');
    const outputName = 'output.' + (outExt === 'alac' ? 'm4a' : outExt);

    ff.writeFile(inputName, await fetchFile(fcFile));

    statusEl.textContent = '🧠 Converting… using your browser RAM (no upload, 100% private)';
    bar.style.width = '40%'; pctEl.textContent = '40%';

    // Build FFmpeg args
    let args = ['-i', inputName];
    const codec = FC_CODEC[outExt] || [];
    args = args.concat(codec);

    // Audio-specific options
    if (cat === 'audio' && !['flac','wav','aiff','alac'].includes(outExt) && bitrate !== '0') {
      args.push('-b:a', bitrate + 'k');
    }
    if (cat === 'audio' && sr) args.push('-ar', sr);

    // Video-specific options
    if (cat === 'video' && outExt !== 'gif') {
      args.push('-crf', crf);
      if (scale) args.push('-vf', `scale=${scale}`);
    }

    args.push('-y', outputName);

    ff.on('progress', ({ progress }) => {
      const pct = Math.min(Math.round(progress * 60) + 40, 98);
      bar.style.width = pct + '%'; pctEl.textContent = pct + '%';
    });

    await ff.exec(args);

    bar.style.width = '100%'; pctEl.textContent = '100%';
    statusEl.textContent = 'Done!';

    const data = ff.readFile(outputName);
    const blob = new Blob([data.buffer], { type: getMime(outExt) });
    const url  = URL.createObjectURL(blob);
    const dlName = fcFile.name.replace(/\.[^.]+$/, '') + '.' + (outExt === 'alac' ? 'm4a' : outExt);

    resultEl.innerHTML = `
      <div style="background:var(--bg2);border:1px solid var(--success);border-radius:10px;padding:1.25rem;">
        <div style="color:var(--success);font-weight:600;margin-bottom:0.5rem;">✅ Conversion complete!</div>
        <p style="font-size:0.8rem;color:var(--muted);margin-bottom:1rem;">${dlName}</p>
        <a href="${url}" download="${dlName}"
           style="display:inline-flex;align-items:center;gap:0.4rem;padding:0.6rem 1.25rem;
                  background:var(--success);color:#000;border-radius:8px;font-weight:700;font-size:0.9rem;text-decoration:none;"
           onclick="showToast('⬇️ File saved!')">
          ⬇️ Download ${outExt.toUpperCase()}
        </a>
      </div>`;

    // cleanup
    try { ff.deleteFile(inputName); ff.deleteFile(outputName); } catch(_) {}

  } catch (err) {
    resultEl.innerHTML =
      `<div class="result-box" style="color:var(--danger);">❌ Conversion failed: ${err.message}<br/>
       <span style="font-size:0.78rem;color:var(--muted);">Some formats may not be supported or the file may be corrupted.</span></div>`;
  } finally {
    btn.disabled = false;
    setTimeout(() => { prog.style.display = 'none'; bar.style.width = '0%'; }, 2000);
  }
}

function getMime(ext) {
  const map = {
    mp3:'audio/mpeg', flac:'audio/flac', wav:'audio/wav', ogg:'audio/ogg',
    opus:'audio/ogg', m4a:'audio/mp4', alac:'audio/mp4', ac3:'audio/ac3',
    aiff:'audio/aiff', amr:'audio/amr',
    mp4:'video/mp4', webm:'video/webm', mkv:'video/x-matroska',
    avi:'video/x-msvideo', mov:'video/quicktime', gif:'image/gif',
    jpg:'image/jpeg', png:'image/png', webp:'image/webp',
    bmp:'image/bmp', tiff:'image/tiff',
  };
  return map[ext] || 'application/octet-stream';
}

// Init file converter format list on page load
document.addEventListener('DOMContentLoaded', () => { fcUpdateFormats(); });
/* =============================================
   Document & PDF Tools Additions
   Add this to the bottom of app.js
   ============================================= */

// Tabs
function setDocTab(tabId) {
  document.getElementById('doc-tab-pdf').style.display = tabId === 'doc-pdf' ? 'block' : 'none';
  document.getElementById('doc-tab-sheet').style.display = tabId === 'doc-sheet' ? 'block' : 'none';
  document.getElementById('doc-tab-word').style.display = tabId === 'doc-word' ? 'block' : 'none';
  document.getElementById('btn-doc-pdf').className = tabId === 'doc-pdf' ? 'btn btn-primary' : 'btn btn-ghost';
  document.getElementById('btn-doc-sheet').className = tabId === 'doc-sheet' ? 'btn btn-primary' : 'btn btn-ghost';
  document.getElementById('btn-doc-word').className = tabId === 'doc-word' ? 'btn btn-primary' : 'btn btn-ghost';
}

// ── PDF Tools ───────────────────────────────────────────
let dtPdfFiles = [];

function dtPdfActionChange() {
  const action = document.getElementById('dt-pdf-action').value;
  const extra = document.getElementById('dt-pdf-extra-field');
  
  if (action === 'split') {
    extra.style.display = 'block';
    extra.innerHTML = '<label>Pages (e.g. 1-3, 5)</label><input type="text" id="dt-pdf-pages" placeholder="e.g. 1-3" />';
  } else {
    extra.style.display = 'none';
  }
}

function dtPdfDrop(e) {
  e.preventDefault();
  document.getElementById('dt-pdf-dropzone').classList.remove('drag-over');
  dtPdfFiles = Array.from(e.dataTransfer.files);
  updatePdfFileLabel();
}

function dtPdfSelected(input) {
  dtPdfFiles = Array.from(input.files);
  updatePdfFileLabel();
}

function updatePdfFileLabel() {
  if (dtPdfFiles.length === 0) return;
  const size = dtPdfFiles.reduce((acc, f) => acc + f.size, 0) / 1024 / 1024;
  const label = dtPdfFiles.length === 1 ? dtPdfFiles[0].name : `${dtPdfFiles.length} files selected`;
  document.getElementById('dt-pdf-filename').innerHTML = 
    `📄 ${label} <span style="color:var(--muted)">(${size.toFixed(2)} MB)</span>
    <div style="margin-top:0.6rem;padding:0.55rem 0.8rem;background:rgba(124,92,252,0.08);border:1px solid rgba(124,92,252,0.25);border-radius:8px;font-size:0.78rem;color:var(--muted);display:flex;align-items:center;gap:0.4rem;">
      🧠 <strong style="color:var(--accent);">RAM Notice:</strong> Processing runs entirely in your browser. No data is sent to any server.
    </div>`;
}

async function executePdfTool() {
  if (dtPdfFiles.length === 0) return alert('Select file(s) first');
  const action = document.getElementById('dt-pdf-action').value;
  const btn = document.getElementById('dt-pdf-btn');
  const result = document.getElementById('dt-pdf-result');
  
  btn.disabled = true;
  btn.textContent = '🧠 Processing in RAM...';
  result.innerHTML = '';
  
  try {
    if (action === 'img2pdf') await doImg2Pdf(result);
    else if (action === 'pdf2img') await doPdf2Img(result);
    else if (action === 'pdf2txt') await doPdf2Txt(result);
    else if (action === 'merge') await doPdfMerge(result);
    else if (action === 'split') await doPdfSplit(result);
    else if (action === 'compress') await doPdfCompress(result);
  } catch (err) {
    result.innerHTML = `<div class="result-box" style="color:var(--danger)">❌ Error: ${err.message}</div>`;
  } finally {
    btn.disabled = false;
    btn.textContent = '⚡ Run Tool';
  }
}

// 1. Image to PDF (jsPDF)
async function doImg2Pdf(result) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: 'px', format: 'a4' });
  
  for (let i = 0; i < dtPdfFiles.length; i++) {
    const file = dtPdfFiles[i];
    if (!file.type.startsWith('image/')) throw new Error(`${file.name} is not an image`);
    
    if (i > 0) doc.addPage();
    
    // Load image
    const imgData = await new Promise((req, rej) => {
      const reader = new FileReader();
      reader.onload = e => req(e.target.result);
      reader.onerror = rej;
      reader.readAsDataURL(file);
    });
    
    // Create image element to get dims
    const img = new Image();
    img.src = imgData;
    await new Promise(r => img.onload = r);
    
    // Fit to A4 max dimensions (keep aspect ratio)
    const a4W = 446; const a4H = 630; // approx px in jsPDF default
    let w = img.width, h = img.height;
    if (w > a4W || h > a4H) {
      const ratio = Math.min(a4W / w, a4H / h);
      w *= ratio; h *= ratio;
    }
    
    doc.addImage(imgData, file.type.split('/')[1].toUpperCase(), (446-w)/2, (630-h)/2, w, h);
  }
  
  const blob = doc.output('blob');
  createDownloadLink(result, blob, 'converted_images.pdf', 'PDF');
}

// 2. PDF to Images (PDF.js)
async function doPdf2Img(result) {
  const file = dtPdfFiles[0];
  if (file.type !== 'application/pdf') throw new Error('First file must be a PDF');
  
  // Dynamic import PDFJS (it's a module)
  const pdfjsLib = await import('https://cdn.jsdelivr.net/npm/pdfjs-dist@4.2.67/build/pdf.min.mjs');
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.2.67/build/pdf.worker.min.mjs';
  
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
  
  result.innerHTML = `<div style="margin-bottom:1rem;color:var(--muted)">Extracting ${pdf.numPages} pages...</div>`;
  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.gap = '0.5rem';
  container.style.flexWrap = 'wrap';
  
  for (let i = 1; i <= pdf.numPages; i++) {
    if (i > 20) {
      result.innerHTML += `<div style="color:var(--warning)">⚠️ Limited to 20 pages to prevent memory limits</div>`;
      break;
    }
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 2.0 }); // 2x for decent quality
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width; canvas.height = viewport.height;
    const ctx = canvas.getContext('2d');
    await page.render({ canvasContext: ctx, viewport }).promise;
    
    const url = canvas.toDataURL('image/png');
    container.insertAdjacentHTML('beforeend', `
       <a href="${url}" download="page-${i}.png" style="text-decoration:none;">
         <img src="${url}" style="width:100px; height:auto; border:1px solid var(--border); border-radius:4px;"/>
         <div style="font-size:0.7rem; color:var(--text); text-align:center;">Page ${i}</div>
       </a>
    `);
  }
  result.appendChild(container);
}

// 3. PDF to Text
async function doPdf2Txt(result) {
  const file = dtPdfFiles[0];
  if (file.type !== 'application/pdf') throw new Error('File must be a PDF');
  
  const pdfjsLib = await import('https://cdn.jsdelivr.net/npm/pdfjs-dist@4.2.67/build/pdf.min.mjs');
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.2.67/build/pdf.worker.min.mjs';
  
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
  
  let fullText = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map(item => item.str).join(' ');
    fullText += pageText + '\n\n';
  }
  
  const blob = new Blob([fullText], { type: 'text/plain' });
  createDownloadLink(result, blob, 'extracted_text.txt', 'Text');
}

// 4. PDF Merge
async function doPdfMerge(result) {
  if (dtPdfFiles.length < 2) throw new Error('Select at least 2 PDFs to merge');
  const PDFDocument = PDFLib.PDFDocument;
  const mergedPdf = await PDFDocument.create();
  
  for (const file of dtPdfFiles) {
    if (file.type !== 'application/pdf') throw new Error(`File ${file.name} is not a PDF`);
    const fBuffer = await file.arrayBuffer();
    const p = await PDFDocument.load(fBuffer);
    const copied = await mergedPdf.copyPages(p, p.getPageIndices());
    copied.forEach(pg => mergedPdf.addPage(pg));
  }
  
  const outBytes = await mergedPdf.save();
  const blob = new Blob([outBytes], { type: 'application/pdf' });
  createDownloadLink(result, blob, 'merged.pdf', 'Merged PDF');
}

// 5. PDF Split
async function doPdfSplit(result) {
  const pagesRaw = document.getElementById('dt-pdf-pages').value;
  if (!pagesRaw) throw new Error('Enter a page range');
  
  // parse pages (e.g. "1-3, 5")
  let pageList = [];
  pagesRaw.split(',').forEach(p => {
    if (p.includes('-')) {
      const [start, end] = p.split('-').map(Number);
      for (let i=start; i<=end; i++) pageList.push(i-1); // 0-indexed
    } else {
      pageList.push(Number(p)-1);
    }
  });
  
  const file = dtPdfFiles[0];
  const PDFDocument = PDFLib.PDFDocument;
  const docToSplit = await PDFDocument.load(await file.arrayBuffer());
  const newPdf = await PDFDocument.create();
  
  const copied = await newPdf.copyPages(docToSplit, pageList);
  copied.forEach(pg => newPdf.addPage(pg));
  
  const outBytes = await newPdf.save();
  const blob = new Blob([outBytes], { type: 'application/pdf' });
  createDownloadLink(result, blob, 'split.pdf', 'Split PDF');
}

// 6. PDF Compress (Re-save drops metadata and unused objects)
async function doPdfCompress(result) {
  const file = dtPdfFiles[0];
  const PDFDocument = PDFLib.PDFDocument;
  const pBuffer = await file.arrayBuffer();
  
  // loading and saving in pdf-lib naturally removes some bloat
  const doc = await PDFDocument.load(pBuffer);
  const outBytes = await doc.save({ useObjectStreams: false }); 
  
  const blob = new Blob([outBytes], { type: 'application/pdf' });
  
  const bMB = (blob.size / 1024 / 1024).toFixed(2);
  const oMB = (file.size / 1024 / 1024).toFixed(2);
  
  result.innerHTML = `<div style="color:var(--muted); font-size:0.8rem; margin-bottom:0.5rem">Original: ${oMB} MB → Compressed: ${bMB} MB</div>`;
  createDownloadLink(result, blob, 'compressed.pdf', 'Compressed PDF', true);
}


// ── Spreadsheets ──────────────────────────────────────────
let dtShFile = null;

function dtShDrop(e) {
  e.preventDefault();
  document.getElementById('dt-sh-dropzone').classList.remove('drag-over');
  dtShFile = e.dataTransfer.files[0];
  updateShLabel();
}

function dtShSelected(inp) {
  dtShFile = inp.files[0];
  updateShLabel();
}

function updateShLabel() {
  if (!dtShFile) return;
  const size = (dtShFile.size / 1024/1024).toFixed(2);
  document.getElementById('dt-sh-filename').innerHTML = 
    `📄 ${dtShFile.name} <span style="color:var(--muted)">(${size} MB)</span>
    <div style="margin-top:0.6rem;padding:0.55rem 0.8rem;background:rgba(124,92,252,0.08);border:1px solid rgba(124,92,252,0.25);border-radius:8px;font-size:0.78rem;color:var(--muted);display:flex;align-items:center;gap:0.4rem;">
      🧠 <strong style="color:var(--accent);">RAM Notice:</strong> Processed fully in-browser using SheetJS.
    </div>`;
}

async function executeSheetTool() {
  if (!dtShFile) return alert('Select a spreadsheet');
  const target = document.getElementById('dt-sh-format').value;
  const btn = document.getElementById('dt-sh-btn');
  const result = document.getElementById('dt-sh-result');
  
  btn.disabled = true; btn.textContent = '🧠 Processing...'; result.innerHTML = '';
  
  try {
    const buffer = await dtShFile.arrayBuffer();
    const wb = XLSX.read(buffer, { type: 'array' });
    const ws = wb.Sheets[wb.SheetNames[0]]; // grabs first sheet
    
    let blob, ext;
    if (target === 'csv') {
      const csvStr = XLSX.utils.sheet_to_csv(ws);
      blob = new Blob([csvStr], { type: 'text/csv' });
      ext = 'csv';
    } else if (target === 'json') {
      const jsonArr = XLSX.utils.sheet_to_json(ws);
      blob = new Blob([JSON.stringify(jsonArr, null, 2)], { type: 'application/json' });
      ext = 'json';
    } else if (target === 'xlsx') {
      // Writing requires the workbook
      const wbout = XLSX.write(wb, { bookType:'xlsx', type:'array' });
      blob = new Blob([wbout], { type: 'application/octet-stream' });
      ext = 'xlsx';
    }
    
    createDownloadLink(result, blob, dtShFile.name.replace(/\.[^.]+$/, '') + '.' + ext, target.toUpperCase());
  } catch(e) {
    result.innerHTML = `<div class="result-box" style="color:var(--danger)">❌ Error: ${e.message}</div>`;
  } finally {
    btn.disabled = false; btn.textContent = '⚡ Convert Spreadsheet';
  }
}

// ── Doc/Markup ──────────────────────────────────────────
let dtDocFile = null;

function dtDocDrop(e) {
  e.preventDefault();
  document.getElementById('dt-doc-dropzone').classList.remove('drag-over');
  dtDocFile = e.dataTransfer.files[0];
  updateDocLabel();
}

function dtDocSelected(inp) {
  dtDocFile = inp.files[0];
  updateDocLabel();
}

function updateDocLabel() {
  if (!dtDocFile) return;
  document.getElementById('dt-doc-filename').innerHTML = 
    `📄 ${dtDocFile.name}
    <div style="margin-top:0.6rem;padding:0.55rem 0.8rem;background:rgba(124,92,252,0.08);border:1px solid rgba(124,92,252,0.25);border-radius:8px;font-size:0.78rem;color:var(--muted);display:flex;align-items:center;gap:0.4rem;">
      🧠 <strong style="color:var(--accent);">RAM Notice:</strong> Processed fully in-browser.
    </div>`;
}

async function executeDocTool() {
  if (!dtDocFile) return alert('Select a file');
  const target = document.getElementById('dt-doc-format').value;
  const result = document.getElementById('dt-doc-result');
  const btn = document.getElementById('dt-doc-btn');
  
  if (target === 'docx') {
    result.innerHTML = `
      <div class="result-box" style="color:var(--danger); text-align:left;">
        <strong>❌ Creation of Word (.docx) files is NOT supported.</strong><br/><br/>
        <span style="color:var(--muted);font-size:0.8rem;">To generate a perfect Word document from a PDF or HTML requires a dedicated server with Microsoft Office or LibreOffice engines installed. This website intentionally runs 100% in your browser without servers to protect your privacy and remain completely free. Therefore, converting <em>to</em> MS Word isn't possible here. Try CloudConvert or Adobe's free online tools!</span>
      </div>`;
    return;
  }
  
  btn.disabled = true; btn.textContent = '🧠 Processing...'; result.innerHTML = '';
  
  try {
    const ext = dtDocFile.name.split('.').pop().toLowerCase();
    const rawText = await dtDocFile.text();
    let finalStr = '';
    
    // IF DOCX
    if (ext === 'docx') {
      const arrayBuf = await dtDocFile.arrayBuffer();
      if (target === 'html') {
        const obj = await mammoth.convertToHtml({ arrayBuffer: arrayBuf });
        finalStr = obj.value;
      } else if (target === 'txt' || target === 'md') {
        const obj = await mammoth.extractRawText({ arrayBuffer: arrayBuf });
        finalStr = obj.value; 
        // For md, just dump raw text (mammoth doesn't easily do docx direct to markdown without massive boilerplate)
      }
    } 
    // IF MD
    else if (ext === 'md') {
      if (target === 'html') finalStr = marked.parse(rawText);
      else if (target === 'txt') finalStr = rawText.replace(/[#*`_]/g, ''); // dumb strip
    }
    // IF HTML
    else if (ext === 'html' || ext === 'htm') {
      if (target === 'md') {
        const td = new TurndownService();
        finalStr = td.turndown(rawText);
      } else if (target === 'txt') {
        const temp = document.createElement('div');
        temp.innerHTML = rawText;
        finalStr = temp.textContent || temp.innerText || "";
      }
    } else {
      throw new Error(`Unsupported input extension: .${ext}. Please use DOCX, HTML, or MD.`);
    }

    const typeArgs = target === 'html' ? 'text/html' : (target === 'md' ? 'text/markdown' : 'text/plain');
    const blob = new Blob([finalStr], { type: typeArgs });
    createDownloadLink(result, blob, dtDocFile.name.replace(/\.[^.]+$/, '') + '.' + target, target.toUpperCase());
    
  } catch(e) {
    result.innerHTML = `<div class="result-box" style="color:var(--danger)">❌ Error: ${e.message}</div>`;
  } finally {
    btn.disabled = false; btn.textContent = '⚡ Convert Document';
  }
}

// ── Shared Util ─────────────────────────────────────────
function createDownloadLink(div, blob, filename, label, append=false) {
  const url = URL.createObjectURL(blob);
  const html = `
    <div style="background:var(--bg2);border:1px solid var(--success);border-radius:10px;padding:1.25rem;">
      <div style="color:var(--success);font-weight:600;margin-bottom:0.5rem;">✅ Complete!</div>
      <p style="font-size:0.8rem;color:var(--muted);margin-bottom:1rem;">${filename}</p>
      <a href="${url}" download="${filename}"
         style="display:inline-flex;align-items:center;gap:0.4rem;padding:0.6rem 1.25rem;
                background:var(--success);color:#000;border-radius:8px;font-weight:700;font-size:0.9rem;text-decoration:none;"
         onclick="showToast('⬇️ File saved!')">
        ⬇️ Download ${label}
      </a>
    </div>`;
    
  if(append) div.innerHTML += html;
  else div.innerHTML = html;
}
/* =============================================
   IMAGE EDITOR SUITE (Filerobot)
   ============================================= */
let filerobotImageEditor = null;
let ieFile = null;

function ieDrop(e) {
  e.preventDefault();
  document.getElementById('ie-dropzone').classList.remove('drag-over');
  ieSelected({ files: e.dataTransfer.files });
}

function ieSelected(input) {
  if (!input.files || input.files.length === 0) return;
  ieFile = input.files[0];
  if (!ieFile.type.startsWith('image/')) return alert('Please select an image file.');

  const size = (ieFile.size / 1024 / 1024).toFixed(2);
  document.getElementById('ie-filename').innerHTML = `🖼️ ${ieFile.name} <span style="color:var(--muted)">(${size} MB)</span>`;
  document.getElementById('ie-workspace').style.display = 'block';

  // Load image into preview
  const url = URL.createObjectURL(ieFile);
  ieInitFilerobot(url);
}

function ieResetEditor() {
    if (filerobotImageEditor) {
        filerobotImageEditor.terminate();
        filerobotImageEditor = null;
    }
    document.getElementById('ie-workspace').style.display = 'none';
    document.getElementById('ie-filename').innerHTML = '';
    document.getElementById('ie-file').value = '';
}

function ieInitFilerobot(imageUrl) {
    if (filerobotImageEditor) {
        filerobotImageEditor.terminate();
    }
    
    const { TABS, TOOLS } = FilerobotImageEditor;
    const config = {
        source: imageUrl,
        theme: {
            palette: {
                'bg-primary': '#111118',
                'bg-secondary': '#1a1030',
                'bg-primary-hover': '#2d2d3a',
                'bg-primary-active': '#9b7ef8',
            }
        },
        annotationsCommon: {
            fill: '#ffffff',
            stroke: '#000000',
            strokeWidth: 0,
        },
        Text: { text: 'Watermark' },
        onSave: (editedImageObject, designState) => {
            const a = document.createElement('a');
            a.href = editedImageObject.imageBase64;
            a.download = ieFile.name.replace(/\.[^.]+$/, '') + '_edited.' + editedImageObject.extension;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            showToast("✅ Image Saved!");
        },
        tabsIds: [TABS.ADJUST, TABS.ANNOTATE, TABS.WATERMARK, TABS.FILTERS, TABS.FINETUNE, TABS.RESIZE],
        defaultTabId: TABS.ADJUST,
        defaultToolId: TOOLS.CROP,
    };
    
    filerobotImageEditor = new FilerobotImageEditor(
        document.querySelector('#editor_container'),
        config
    );
    filerobotImageEditor.render();
}