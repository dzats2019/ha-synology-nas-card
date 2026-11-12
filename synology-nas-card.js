/*
 * Synology NAS Card for Home Assistant
 * Copyright (c) 2026
 * SPDX-License-Identifier: MIT
 */
const CARD_VERSION = "1.0.0";
const MAX_DRIVES = 4;

const ICONS = {
  nas: '<svg viewBox="0 0 64 48" aria-hidden="true"><rect x="4" y="4" width="56" height="40" rx="5"/><rect x="10" y="10" width="9" height="28" rx="1"/><rect x="23" y="10" width="9" height="28" rx="1"/><rect x="36" y="10" width="9" height="28" rx="1"/><rect x="49" y="10" width="6" height="28" rx="1"/><circle cx="14.5" cy="15" r="1"/><circle cx="27.5" cy="15" r="1"/><circle cx="40.5" cy="15" r="1"/></svg>',
  cpu: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="5" width="14" height="14" rx="2"/><path d="M9 9h6v6H9zM8 1v4m4-4v4m4-4v4M8 19v4m4-4v4m4-4v4M1 8h4m-4 4h4m-4 4h4m14-8h4m-4 4h4m-4 4h4"/></svg>',
  ram: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5" width="16" height="14" rx="2"/><path d="M8 9h2v6H8zm6 0h2v6h-2zM7 1v4m5-4v4m5-4v4M7 19v4m5-4v4m5-4v4M1 9h3m-3 6h3m16-6h3m-3 6h3"/></svg>',
  temp: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 14.8V5a3 3 0 0 0-6 0v9.8a5 5 0 1 0 6 0Z"/><path d="M11 8v9"/></svg>',
  uptime: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 2v6m10-6v6M3 10h18m-7 5a3 3 0 1 0 6 0 3 3 0 0 0-6 0Zm3-2v2l1.5 1"/></svg>',
  update: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11a8 8 0 1 0 2 5M20 4v7h-7"/><path d="m8 12 2.5 2.5L16 9"/></svg>',
  storage: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16v6H4zM4 14h16v6H4zM8 7h.01M8 17h.01"/></svg>',
  disk: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16v16H4z"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1"/><path d="m6 6 4 4m4 4 4 4"/></svg>',
  power: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2v10m6.4-6.4a9 9 0 1 1-12.8 0"/></svg>',
  download: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m-5-5 5 5 5-5M4 19h16"/></svg>',
  upload: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21V9m-5 5 5-5 5 5M4 5h16"/></svg>',
  check: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m8 12 2.5 2.5L16 9"/></svg>'
};

const NAS_ILLUSTRATION = '<svg viewBox="0 0 260 180" role="img" aria-label="Four-bay NAS illustration"><defs><linearGradient id="case" x1="0" x2="1"><stop stop-color="#202020"/><stop offset=".76" stop-color="#444"/><stop offset="1" stop-color="#171717"/></linearGradient><linearGradient id="bay" x1="0" x2="1"><stop stop-color="#080808"/><stop offset=".5" stop-color="#181818"/><stop offset="1" stop-color="#090909"/></linearGradient></defs><rect x="7" y="7" width="246" height="166" rx="12" fill="url(#case)" stroke="#555" stroke-width="5"/><rect x="20" y="16" width="188" height="145" rx="6" fill="#111" stroke="#292929" stroke-width="4"/><g fill="url(#bay)" stroke="#3a3a3a" stroke-width="3"><rect x="27" y="22" width="40" height="133" rx="3"/><rect x="72" y="22" width="40" height="133" rx="3"/><rect x="117" y="22" width="40" height="133" rx="3"/><rect x="162" y="22" width="40" height="133" rx="3"/></g><g fill="#050505" stroke="#444" stroke-width="2"><circle cx="47" cy="125" r="4"/><circle cx="92" cy="125" r="4"/><circle cx="137" cy="125" r="4"/><circle cx="182" cy="125" r="4"/></g><g fill="#20ce39"><rect x="220" y="37" width="9" height="3" rx="1"/><rect x="220" y="46" width="9" height="3" rx="1"/><rect x="220" y="55" width="9" height="3" rx="1"/></g><rect x="224" y="123" width="8" height="18" rx="2" fill="#202020" stroke="#777"/><rect x="221" y="148" width="14" height="13" rx="3" fill="#161616" stroke="#555"/><circle cx="228" cy="154" r="2" fill="#22bce8"/></svg>';

const DEFAULTS = {
  name: "Synology NAS",
  model: "",
  image: "",
  cpu_entity: "",
  ram_entity: "",
  temperature_entity: "",
  uptime_entity: "",
  update_entity: "",
  status_entity: "",
  network_in_entity: "",
  network_out_entity: "",
  volume_name: "Volume 1",
  volume_used_entity: "",
  volume_total_entity: "",
  volume_percent_entity: "",
  volume_status_entity: ""
};

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}

function numeric(state) {
  if (!state || ["unknown", "unavailable", "none"].includes(String(state.state).toLowerCase())) return null;
  const n = Number(String(state.state).replace(/,/g, ""));
  return Number.isFinite(n) ? n : null;
}

function fmtPercent(state) {
  const n = numeric(state);
  return n === null ? "—" : `${Math.round(n)}%`;
}

function fmtTemp(state) {
  const n = numeric(state);
  return n === null ? "—" : `${n.toFixed(0)}${state.attributes?.unit_of_measurement || "°C"}`;
}

function fmtUptime(state) {
  if (!state || ["unknown", "unavailable"].includes(String(state.state).toLowerCase())) return "—";
  const raw = String(state.state).trim();
  const n = Number(raw);
  const unit = String(state.attributes?.unit_of_measurement || "").toLowerCase();
  if (Number.isFinite(n)) {
    const days = unit.startsWith("s") ? n / 86400 : unit.startsWith("h") ? n / 24 : unit.startsWith("min") ? n / 1440 : n;
    if (days >= 1) return `${Math.floor(days)} Day${Math.floor(days) === 1 ? "" : "s"}`;
    const hours = Math.floor(days * 24);
    return `${hours} Hour${hours === 1 ? "" : "s"}`;
  }
  return raw;
}

function bytesFromState(state) {
  const n = numeric(state);
  if (n === null) return null;
  const unit = String(state.attributes?.unit_of_measurement || "").toLowerCase().replace(/\s/g, "");
  const factors = { b: 1, kb: 1e3, mb: 1e6, gb: 1e9, tb: 1e12, kib: 1024, mib: 1024 ** 2, gib: 1024 ** 3, tib: 1024 ** 4 };
  return factors[unit] ? n * factors[unit] : n;
}

function fmtBytes(bytes) {
  if (bytes === null || !Number.isFinite(bytes)) return "—";
  const tb = bytes / 1e12;
  if (tb >= 1) return `${tb.toFixed(tb >= 10 ? 1 : 2)} TB`;
  const gb = bytes / 1e9;
  return `${gb.toFixed(gb >= 10 ? 1 : 2)} GB`;
}

function fmtRate(state) {
  const n = numeric(state);
  if (n === null) return "—";
  const unit = String(state.attributes?.unit_of_measurement || "").toLowerCase().replace(/\s/g, "");
  let mbps = n;
  if (["b/s", "byte/s", "bytes/s", "bs-1"].includes(unit)) mbps = n * 8 / 1e6;
  else if (["kb/s", "kbyte/s", "kbytes/s"].includes(unit)) mbps = n * 8 / 1e3;
  else if (["mb/s", "mbyte/s", "mbytes/s"].includes(unit)) mbps = n * 8;
  else if (["gbit/s", "gbps"].includes(unit)) mbps = n * 1000;
  else if (["kbit/s", "kbps"].includes(unit)) mbps = n / 1000;
  else if (["bit/s", "bps"].includes(unit)) mbps = n / 1e6;
  return `${mbps.toFixed(mbps < 1 ? 2 : 1)} Mbit/s`;
}

function stateText(state, fallback = "—") {
  if (!state || ["unknown", "unavailable"].includes(String(state.state).toLowerCase())) return fallback;
  const text = String(state.state).replace(/_/g, " ");
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function miniLine(values) {
  const clean = values.filter(Number.isFinite);
  if (clean.length < 2) return "";
  const min = Math.min(...clean), max = Math.max(...clean), range = max - min || 1;
  const points = clean.map((v, i) => `${(i * 96 / (clean.length - 1) + 2).toFixed(1)},${(19 - (v - min) / range * 8).toFixed(1)}`).join(" ");
  return `<polyline points="${points}"/>`;
}

class SynologyNasCard extends HTMLElement {
  static getConfigElement() { return document.createElement("synology-nas-card-editor"); }
  static getStubConfig() { return { type: "custom:synology-nas-card", name: "Synology NAS", volume_name: "Volume 1" }; }
  static get cardSize() { return 6; }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._config = { ...DEFAULTS };
    this._samples = {};
    this._lastValues = {};
  }

  setConfig(config) {
    if (!config) throw new Error("Synology NAS Card: configuration is required.");
    this._config = { ...DEFAULTS, ...config };
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    this._collectSamples();
    this._render();
  }

  get hass() { return this._hass; }
  getCardSize() { return 6; }

  _entity(id) { return id && this._hass?.states?.[id] ? this._hass.states[id] : null; }

  _collectSamples() {
    if (!this._hass) return;
    for (let i = 1; i <= MAX_DRIVES; i++) {
      const id = this._config[`drive_${i}_temperature_entity`];
      if (!id) continue;
      const value = numeric(this._entity(id));
      if (value === null || this._lastValues[id] === value) continue;
      this._lastValues[id] = value;
      this._samples[id] = [...(this._samples[id] || []), value].slice(-24);
    }
  }

  _metric(icon, label, value, color = "blue") {
    return `<div class="metric"><span class="ico ${color}">${ICONS[icon]}</span><span class="metric-label">${escapeHtml(label)}:</span><strong>${escapeHtml(value)}</strong></div>`;
  }

  _driveCard(index) {
    const c = this._config;
    const name = c[`drive_${index}_name`] || `Drive ${index}`;
    const tempState = this._entity(c[`drive_${index}_temperature_entity`]);
    const statusState = this._entity(c[`drive_${index}_status_entity`]);
    const smartState = this._entity(c[`drive_${index}_smart_entity`]);
    const tempNum = numeric(tempState);
    const status = stateText(statusState);
    const smart = stateText(smartState);
    const samples = this._samples[c[`drive_${index}_temperature_entity`]] || [];
    const bad = /failed|critical|error|abnormal|not.?healthy|attention/i.test(`${status} ${smart}`);
    const chart = samples.length < 2 ? "" : `<path class="spark-fill" d="${miniLine(samples)} L98 24 L2 24 Z"/><g class="spark-line">${miniLine(samples)}</g>`;
    return `<article class="drive ${bad ? "bad" : ""}">
      <div class="drive-head"><span class="disk-icon">${ICONS.disk}</span><b title="${escapeHtml(name)}">${escapeHtml(name)}</b></div>
      <div class="drive-state"><span class="ico ${bad ? "red" : "green"}">${ICONS.power}</span>${escapeHtml(status)}</div>
      <div class="drive-state"><span class="ico ${bad ? "red" : "green"} small">${ICONS.cpu}</span>${escapeHtml(smart)}</div>
      <div class="drive-temp">${tempNum === null ? "—" : `${tempNum.toFixed(0)}${escapeHtml(tempState?.attributes?.unit_of_measurement || "°C")}`}</div>
      <svg class="spark" viewBox="0 0 100 24" preserveAspectRatio="none">${chart}</svg>
    </article>`;
  }

  _render() {
    if (!this.shadowRoot) return;
    const c = this._config || DEFAULTS;
    const get = (key) => this._entity(c[key]);
    const cpu = fmtPercent(get("cpu_entity"));
    const ram = fmtPercent(get("ram_entity"));
    const temperature = fmtTemp(get("temperature_entity"));
    const uptime = fmtUptime(get("uptime_entity"));
    const update = get("update_entity");
    const status = get("status_entity");
    const updateState = String(update?.state || "").toLowerCase();
    let updateLabel = update ? (updateState === "on" ? "Update Available" : updateState === "off" ? "Up-To-Date" : "Status unavailable") : (status ? stateText(status) : "Status unavailable");
    let updateClass = /available|unsafe|out.?of.?date|error|attention/i.test(updateLabel) ? "warn" : "ok";
    const volumeUsedState = get("volume_used_entity");
    const volumeTotalState = get("volume_total_entity");
    const volumePercentState = get("volume_percent_entity");
    const usedBytes = bytesFromState(volumeUsedState);
    const totalBytes = bytesFromState(volumeTotalState);
    let percent = numeric(volumePercentState);
    if (percent === null && usedBytes !== null && totalBytes > 0) percent = usedBytes / totalBytes * 100;
    percent = percent === null ? null : Math.max(0, Math.min(100, percent));
    const usedLabel = usedBytes !== null ? fmtBytes(usedBytes) : "—";
    const totalLabel = totalBytes !== null ? fmtBytes(totalBytes) : "—";
    const volumeStatus = stateText(get("volume_status_entity"));
    const volumeBad = /crashed|degraded|attention|error|failed/i.test(volumeStatus);
    const driveCards = Array.from({ length: MAX_DRIVES }, (_, i) => i + 1)
      .filter((i) => ["name", "temperature_entity", "status_entity", "smart_entity"].some((suffix) => c[`drive_${i}_${suffix}`]))
      .map((i) => this._driveCard(i)).join("");
    const image = c.image ? `<img class="nas-image" src="${escapeHtml(c.image)}" alt="${escapeHtml(c.model || c.name)}" loading="lazy">` : `<div class="nas-render">${NAS_ILLUSTRATION}</div>`;
    const volumeProgress = percent === null ? 0 : percent;
    const volumeLabel = percent === null ? "—" : `${percent.toFixed(1)}%`;
    const usedTotal = usedBytes !== null && totalBytes !== null ? `${usedLabel} / ${totalLabel}` : (volumeUsedState ? `${usedLabel}${volumePercentState ? ` · ${volumeLabel}` : ""}` : `${volumeLabel}`);
    this.shadowRoot.innerHTML = `
      <style>
        :host{display:block;color:var(--primary-text-color,#f3f3f3);font-family:var(--paper-font-body1_-_font-family,Roboto,"Arial",sans-serif);--cyan:#12b8e9;--lime:#16e62c;--panel:#151515;--line:#303030;}
        *{box-sizing:border-box}.shell{background:var(--card-background-color,#111);border-radius:20px;padding:12px;color:var(--primary-text-color,#f3f3f3);}
        .overview{position:relative;min-height:360px;border:1px solid var(--line);border-radius:16px;padding:25px 24px 22px;overflow:hidden;display:grid;grid-template-columns:minmax(165px,1fr) minmax(160px,1.1fr) minmax(130px,1fr);grid-template-rows:auto 1fr;gap:12px;}
        .identity{grid-column:1;grid-row:1;display:flex;flex-direction:column;align-items:flex-start;gap:8px;z-index:1}.brand{width:66px;height:48px;color:var(--lime)}.brand svg{width:100%;height:100%;fill:none;stroke:currentColor;stroke-width:4;stroke-linejoin:round}.brand svg circle{fill:currentColor;stroke:none}
        .title{font-size:clamp(20px,3vw,28px);font-weight:700;line-height:1.1;overflow-wrap:anywhere}.metrics{grid-column:1 / 3;grid-row:2;align-self:start;display:grid;gap:14px;padding-top:7px;z-index:1}.metric{display:flex;align-items:center;gap:10px;min-height:31px;font-size:clamp(14px,2vw,18px);white-space:nowrap}.metric strong{font-weight:400}.metric-label{margin-right:-6px}.ico{display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;flex:0 0 28px;color:var(--cyan)}.ico svg{width:100%;height:100%;fill:none;stroke:currentColor;stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round}.ico.green{color:var(--lime)}.ico.red{color:#ff6b61}.ico.small{width:18px;height:18px;flex-basis:18px}
        .device{grid-column:2;grid-row:1 / 3;justify-self:center;align-self:start;z-index:0;width:min(100%,260px);height:195px;display:flex;justify-content:center;align-items:flex-start}.nas-image{max-width:100%;max-height:100%;object-fit:contain;filter:drop-shadow(0 5px 9px #0008)}.nas-render{width:100%;height:175px;padding:0;background:none;border:0;border-radius:0;box-shadow:none;display:flex;align-items:stretch}.nas-render svg{width:100%;height:100%;filter:drop-shadow(0 5px 9px #0008)}.update{grid-column:3;grid-row:1;display:flex;gap:8px;align-items:center;justify-self:end;z-index:1;white-space:nowrap;font-size:clamp(13px,2vw,17px)}.update .ico{color:#23bfe8}.update.warn .ico{color:#ffab40}.update.ok .ico{color:#23bfe8}.update span:last-child{max-width:130px;white-space:normal}
        .summary{display:flex;justify-content:flex-end;align-items:center;gap:13px;min-height:48px;padding:3px 9px;color:var(--secondary-text-color,#b7b7b7);font-size:clamp(13px,2vw,16px);white-space:nowrap}.summary-item{display:inline-flex;align-items:center;gap:6px}.summary-item svg{width:21px;height:21px;fill:none;stroke:var(--cyan);stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round}.summary-item.health svg{stroke:var(--lime)}.summary-item.bad{color:#ff6b61}.summary-item.bad svg{stroke:#ff6b61}
        .volume{border:1px solid var(--line);background:var(--panel);border-radius:17px;padding:15px 17px;display:grid;grid-template-columns:70px 1fr;gap:16px;align-items:center;min-height:96px}.volume-icon{color:var(--lime);width:55px;height:55px}.volume-icon svg{width:100%;height:100%;fill:none;stroke:currentColor;stroke-width:3;stroke-linecap:round;stroke-linejoin:round}.bar-wrap{height:52px;position:relative;background:#10282c;border-radius:3px;overflow:hidden;display:flex;align-items:center}.bar-fill{position:absolute;left:0;top:0;bottom:0;width:${volumeProgress}%;background:#0c9fca;transition:width .3s}.bar-content{position:relative;z-index:1;width:100%;padding:0 10px;display:flex;justify-content:space-between;align-items:center;gap:8px;font-size:clamp(13px,2.1vw,17px);color:#e8f0f1}.bar-name{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.bar-value{white-space:nowrap}
        .drives{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin-top:12px}.drive{min-width:0;height:168px;position:relative;overflow:hidden;border:1px solid var(--line);border-radius:16px;background:#1b1b1b;padding:12px 10px 20px}.drive-head{display:flex;align-items:center;gap:7px;min-width:0;margin-bottom:8px}.disk-icon{width:30px;height:30px;background:var(--lime);color:#071006;display:flex;align-items:center;justify-content:center;flex:0 0 30px;border-radius:3px}.disk-icon svg{width:24px;height:24px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}.drive-head b{font-size:14px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.drive-state{height:24px;display:flex;align-items:center;gap:5px;font-size:12px;color:var(--secondary-text-color,#d0d0d0);overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.drive-state .ico{width:17px;height:17px;flex:0 0 17px}.drive-state .ico svg{stroke-width:2.2}.drive-temp{position:absolute;right:9px;bottom:47px;font-size:12px;color:#b8b8b8}.spark{position:absolute;left:0;right:0;bottom:0;width:100%;height:30px;background:linear-gradient(0deg,#66411788,transparent)}.spark-line path,.spark-line polyline{fill:none;stroke:#e09a32;stroke-width:1.6;vector-effect:non-scaling-stroke}.spark-fill{fill:#b36b1e55;stroke:none}.drive.bad{border-color:#a94442}
        .network{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:12px}.network-card{min-height:82px;border:1px solid var(--line);border-radius:16px;background:#1b1b1b;display:grid;grid-template-columns:42px 1fr;column-gap:8px;align-content:center;padding:12px 16px}.network-card .net-icon{grid-row:1 / 3;width:30px;height:30px;align-self:center}.network-card .net-icon svg{width:100%;height:100%;fill:none;stroke:currentColor;stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round}.network-card.down .net-icon{color:#ed5c54}.network-card.up .net-icon{color:#4dbb68}.network-label{font-size:17px}.network-value{font-size:16px;color:#c9c9c9;margin-top:3px}
        .empty{border:1px dashed var(--line);border-radius:12px;padding:12px;color:var(--secondary-text-color,#aaa);font-size:13px;margin-top:10px}
        @media(max-width:600px){.overview{min-height:330px;padding:17px 15px;grid-template-columns:minmax(120px,1fr) minmax(115px,1fr);grid-template-rows:auto auto 1fr;gap:7px}.identity{grid-column:1;grid-row:1}.device{grid-column:2;grid-row:1 / 3;width:100%;height:145px}.update{grid-column:1 / 3;grid-row:2;justify-self:start;margin-top:7px}.metrics{grid-column:1 / 3;grid-row:3;gap:9px;padding-top:0}.metric{font-size:14px;min-height:25px}.ico{width:24px;height:24px;flex-basis:24px}.summary{justify-content:flex-start;gap:9px;overflow-x:auto}.volume{grid-template-columns:48px 1fr;gap:10px;padding:12px}.volume-icon{width:42px;height:42px}.bar-content{font-size:12px}.drives{grid-template-columns:repeat(2,minmax(0,1fr))}.network-card{padding:10px;grid-template-columns:30px 1fr}.network-label{font-size:15px}.network-value{font-size:13px}}
        @media(max-width:360px){.network{grid-template-columns:1fr}.overview{min-height:345px}.device{height:125px}.title{font-size:19px}}
      </style>
      <div class="shell">
        <section class="overview">
          <div class="identity"><span class="brand">${ICONS.nas}</span><div class="title">${escapeHtml(c.model || c.name || "Synology NAS")}</div></div>
          <div class="device">${image}</div>
          <div class="update ${updateClass}"><span class="ico">${ICONS.update}</span><span>${escapeHtml(updateLabel)}</span></div>
          <div class="metrics">
            ${this._metric("cpu", "CPU", cpu)}
            ${this._metric("ram", "RAM", ram)}
            ${this._metric("temp", "Temperature", temperature)}
            ${this._metric("uptime", "Uptime", uptime)}
          </div>
        </section>
        <div class="summary">
          <span class="summary-item">${ICONS.storage}<span>${escapeHtml(usedLabel)}</span></span>
          <span class="summary-item">${ICONS.storage}<span>${escapeHtml(volumeLabel)}</span></span>
          <span class="summary-item health ${volumeBad ? "bad" : ""}">${ICONS.check}<span>${escapeHtml(volumeStatus)}</span></span>
        </div>
        <section class="volume">
          <span class="volume-icon">${ICONS.storage}</span>
          <div class="bar-wrap"><div class="bar-fill"></div><div class="bar-content"><span class="bar-name">Storage (${escapeHtml(c.volume_name || "Volume 1")})</span><span class="bar-value">${escapeHtml(usedTotal)}</span></div></div>
        </section>
        ${driveCards ? `<section class="drives">${driveCards}</section>` : `<div class="empty">Add drive temperature/status entities in the card editor to show drive health tiles.</div>`}
        <section class="network">
          <div class="network-card down"><span class="net-icon">${ICONS.download}</span><span class="network-label">Inbound</span><span class="network-value">${escapeHtml(fmtRate(get("network_in_entity")))}</span></div>
          <div class="network-card up"><span class="net-icon">${ICONS.upload}</span><span class="network-label">Outbound</span><span class="network-value">${escapeHtml(fmtRate(get("network_out_entity")))}</span></div>
        </section>
      </div>`;
  }
}

const EDITOR_FIELDS = [
  ["name", "Card name", "text"], ["model", "NAS model (for example DS918+)", "text"], ["image", "Optional NAS image URL (/local/... is supported)", "text"],
  ["cpu_entity", "CPU usage entity", "entity"], ["ram_entity", "RAM usage entity", "entity"], ["temperature_entity", "NAS temperature entity", "entity"], ["uptime_entity", "Uptime entity", "entity"],
  ["update_entity", "DSM update entity (optional)", "entity"], ["status_entity", "Overall status entity (optional)", "entity"],
  ["volume_name", "Volume name", "text"], ["volume_used_entity", "Volume used size entity", "entity"], ["volume_total_entity", "Volume total size entity", "entity"], ["volume_percent_entity", "Volume used percent entity", "entity"], ["volume_status_entity", "Volume status entity", "entity"],
  ["network_in_entity", "Inbound/network download entity", "entity"], ["network_out_entity", "Outbound/network upload entity", "entity"]
];
for (let i = 1; i <= MAX_DRIVES; i++) {
  EDITOR_FIELDS.push([`drive_${i}_name`, `Drive ${i} name`, "text"]);
  EDITOR_FIELDS.push([`drive_${i}_temperature_entity`, `Drive ${i} temperature entity`, "entity"]);
  EDITOR_FIELDS.push([`drive_${i}_status_entity`, `Drive ${i} status entity`, "entity"]);
  EDITOR_FIELDS.push([`drive_${i}_smart_entity`, `Drive ${i} SMART entity`, "entity"]);
}

class SynologyNasCardEditor extends HTMLElement {
  constructor() { super(); this.attachShadow({ mode: "open" }); this._config = {}; }
  set hass(hass) { this._hass = hass; this._render(); }
  setConfig(config) { this._config = { ...DEFAULTS, ...config }; this._render(); }
  _render() {
    if (!this.shadowRoot || !this._hass || !customElements.get("ha-form")) return;
    const schema = EDITOR_FIELDS.map(([name, label, kind]) => ({ name, label, selector: kind === "entity" ? { entity: {} } : { text: {} } }));
    this.shadowRoot.innerHTML = `<style>:host{display:block}ha-form{display:block;padding:8px 0}</style><ha-form></ha-form>`;
    const form = this.shadowRoot.querySelector("ha-form");
    form.hass = this._hass;
    form.data = this._config;
    form.schema = schema;
    form.computeLabel = (selector) => selector.label;
    form.addEventListener("value-changed", (ev) => {
      ev.stopPropagation();
      this._config = { ...this._config, ...ev.detail.value };
      this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: this._config }, bubbles: true, composed: true }));
    });
  }
}

if (!customElements.get("synology-nas-card")) customElements.define("synology-nas-card", SynologyNasCard);
if (!customElements.get("synology-nas-card-editor")) customElements.define("synology-nas-card-editor", SynologyNasCardEditor);

window.customCards = window.customCards || [];
if (!window.customCards.some((card) => card.type === "synology-nas-card")) {
  window.customCards.push({ type: "synology-nas-card", name: "Synology NAS Card", description: "Synology NAS system, volume, drive health and network overview", preview: true });
}

console.info(`%c SYNOLOGY-NAS-CARD %c ${CARD_VERSION} `, "color:#fff;background:#15a82a;font-weight:bold", "color:#15a82a;background:#222;font-weight:bold");
