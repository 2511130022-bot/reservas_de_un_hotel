/* ============================================
   HotelAdmin — CRUD sobre Supabase
   (tema glass, tema claro/oscuro, reloj y clima)
   ============================================ */

(() => {
"use strict";

// ======================================
// CONFIGURACIÓN
// ======================================

const SUPABASE_URL = "https://jaerbsdcpyajjmhkwekr.supabase.co";
const SUPABASE_KEY = "sb_publishable_vvJj0eeGSj0_PQs1MwGhNQ_WRgAKAxY";

// Moneda usada SOLO para mostrar la tarifa (cámbiala aquí si hace falta).
const CURRENCY = "S/";

if (!window.supabase) {
  document.body.innerHTML =
    '<p style="font:600 15px Inter,sans-serif;padding:40px;text-align:center">' +
    "No se pudo cargar Supabase. Revisa tu conexión a Internet.</p>";
  return;
}

const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
});

// ======================================
// ICONOS (SVG inline)
// ======================================

const S = 'stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"';
const ICONS = {
  home:      `<svg viewBox="0 0 24 24" ${S}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/></svg>`,
  tag:       `<svg viewBox="0 0 24 24" ${S}><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><circle cx="7" cy="7" r="1.5"/></svg>`,
  box:       `<svg viewBox="0 0 24 24" ${S}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="M3.3 7L12 12l8.7-5M12 22V12"/></svg>`,
  user:      `<svg viewBox="0 0 24 24" ${S}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  briefcase: `<svg viewBox="0 0 24 24" ${S}><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
  calendar:  `<svg viewBox="0 0 24 24" ${S}><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>`,
  search:    `<svg viewBox="0 0 24 24" ${S}><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>`,
  plus:      `<svg viewBox="0 0 24 24" ${S}><path d="M12 5v14M5 12h14"/></svg>`,
  download:  `<svg viewBox="0 0 24 24" ${S}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5M12 15V3"/></svg>`,
  edit:      `<svg viewBox="0 0 24 24" ${S}><path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z"/></svg>`,
  trash:     `<svg viewBox="0 0 24 24" ${S}><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>`,
  sun:       `<svg viewBox="0 0 24 24" ${S}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>`,
  moon:      `<svg viewBox="0 0 24 24" ${S}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`,
  refresh:   `<svg viewBox="0 0 24 24" ${S}><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>`,
  x:         `<svg viewBox="0 0 24 24" ${S}><path d="M18 6L6 18M6 6l12 12"/></svg>`,
  check:     `<svg viewBox="0 0 24 24" ${S}><path d="M20 6L9 17l-5-5"/></svg>`,
  alert:     `<svg viewBox="0 0 24 24" ${S}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><path d="M12 9v4M12 17h.01"/></svg>`,
  inbox:     `<svg viewBox="0 0 24 24" ${S}><path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.9 4H7.1a2 2 0 0 0-1.8 1.11z"/></svg>`,
  arrow:     `<svg viewBox="0 0 24 24" ${S}><path d="M5 12h14M12 5l7 7-7 7"/></svg>`
};

const $  = (id) => document.getElementById(id);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function mountIcons(root = document) {
  $$("[data-icon]", root).forEach(el => { el.innerHTML = ICONS[el.dataset.icon] || ""; });
}

// ======================================
// UTILIDADES
// ======================================

function safe(value) {
  return String(value ?? "").replace(/[&<>"']/g, c => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
  }[c]));
}

function errorMessage(error) {
  console.error(error);
  return error?.message || "Ocurrió un error inesperado.";
}

const moneyFmt = new Intl.NumberFormat("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const dateFmt  = new Intl.DateTimeFormat("es-PE", { day: "numeric", month: "short", year: "numeric" });

function fmtMoney(v) { return v === null || v === undefined || v === "" ? "—" : CURRENCY + " " + moneyFmt.format(Number(v)); }
function fmtDate(v)  {
  if (!v) return "—";
  const d = new Date(v + "T00:00:00");
  return isNaN(d) ? safe(v) : dateFmt.format(d);
}

function pad2(n) { return String(n).padStart(2, "0"); }

function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

// ======================================
// CONFIGURACIÓN DE LAS TABLAS
// ======================================

const configs = {
  tipo_de_habitacion: {
    title: "Tipos de habitación",
    singular: "tipo de habitación",
    table: "tipo_de_habitacion",
    pk: ["cod_tipo_hab"],
    prefix: "TH",
    columns: [
      ["cod_tipo_hab", "Código"],
      ["nombre_tipo", "Tipo"],
      ["tarifa_unitaria", "Tarifa por noche", "money"]
    ],
    fields: [
      { name: "cod_tipo_hab", label: "Código", type: "text", required: true, generated: true },
      { name: "nombre_tipo", label: "Nombre del tipo", required: true },
      { name: "tarifa_unitaria", label: "Tarifa por noche", type: "number", min: 0, step: "0.01", required: true }
    ]
  },

  habitacion: {
    title: "Habitaciones",
    singular: "habitación",
    table: "habitacion",
    pk: ["cod_habitacion"],
    prefix: "HA",
    columns: [
      ["cod_habitacion", "Código"],
      ["cod_tipo_hab", "Tipo de habitación", "rel"],
      ["num_piso", "Piso"]
    ],
    fields: [
      { name: "cod_habitacion", label: "Código", type: "text", required: true, generated: true },
      { name: "cod_tipo_hab", label: "Tipo de habitación", type: "relation", table: "tipo_de_habitacion", value: "cod_tipo_hab", display: "nombre_tipo", required: true },
      { name: "num_piso", label: "Número de piso", type: "number", step: "1", required: true }
    ]
  },

  huesped: {
    title: "Huéspedes",
    singular: "huésped",
    table: "huesped",
    pk: ["cod_huesped"],
    prefix: "HU",
    columns: [
      ["cod_huesped", "Código"],
      ["dni", "DNI"],
      ["nombre_huesped", "Nombre"],
      ["apellidos_huesped", "Apellidos"]
    ],
    fields: [
      { name: "cod_huesped", label: "Código", type: "text", required: true, generated: true },
      { name: "dni", label: "DNI", required: true, maxlength: 8 },
      { name: "nombre_huesped", label: "Nombre(s)", required: true },
      { name: "apellidos_huesped", label: "Apellidos", maxlength: 60 }
    ]
  },

  empleado: {
    title: "Empleados",
    singular: "empleado",
    table: "empleado",
    pk: ["cod_empleado"],
    prefix: "EM",
    columns: [
      ["cod_empleado", "Código"],
      ["nombre_empleado", "Nombres"],
      ["apellidos_empleado", "Apellidos"],
      ["dni", "DNI"]
    ],
    fields: [
      { name: "cod_empleado", label: "Código", type: "text", required: true, generated: true },
      { name: "nombre_empleado", label: "Nombres", required: true },
      { name: "apellidos_empleado", label: "Apellidos", required: true },
      { name: "dni", label: "DNI", required: true, maxlength: 8 }
    ]
  },

  reserva: {
    title: "Reservas",
    singular: "reserva",
    table: "reserva",
    pk: ["cod_reserva", "cod_huesped", "cod_habitacion", "cod_empleado"],
    prefix: "RE",
    columns: [
      ["cod_reserva", "Código"],
      ["cod_huesped", "Huésped", "rel"],
      ["cod_habitacion", "Habitación", "rel"],
      ["cod_empleado", "Empleado", "rel"],
      ["fecha_ingreso", "Ingreso", "date"],
      ["fecha_salida", "Salida", "date"],
      ["__estado", "Estado", "estado"],
      ["tarifa_total", "Total", "money"]
    ],
    fields: [
      { name: "cod_reserva", label: "Código de reserva", type: "text", required: true, generated: true },
      { name: "cod_huesped", label: "Huésped", type: "relation", table: "huesped", value: "cod_huesped", display: "nombre_huesped", required: true },
      { name: "cod_habitacion", label: "Habitación", type: "relation", table: "habitacion", value: "cod_habitacion", display: "cod_habitacion", required: true },
      { name: "cod_empleado", label: "Empleado", type: "relation", table: "empleado", value: "cod_empleado", display: "apellidos_empleado", required: true },
      { name: "fecha_ingreso", label: "Fecha de ingreso", type: "date", required: true },
      { name: "fecha_salida", label: "Fecha de salida", type: "date", required: true },
      { name: "tarifa_total", label: "Tarifa total", type: "number", min: 0, step: "0.01", required: true }
    ]
  }
};

// Tabla → clave primaria (para resolver nombres foráneos)
const REL_PK = {
  tipo_de_habitacion: "cod_tipo_hab",
  habitacion: "cod_habitacion",
  huesped: "cod_huesped",
  empleado: "cod_empleado"
};

// ======================================
// ESTADO
// ======================================

let currentPage = "dashboard";
let currentRows = [];
let editingRow = null;
let toastTimer;
let sortState = { key: null, dir: 1 };
const relData = new Map(); // tabla → filas cacheadas para mostrar nombres

// ======================================
// TOAST
// ======================================

function notify(message, type = "ok") {
  const toast = $("toast");
  $("toastMsg").textContent = message;
  $("toastIcon").innerHTML = ICONS[type === "err" ? "alert" : "check"];
  toast.classList.toggle("err", type === "err");
  toast.classList.remove("hidden");
  toast.style.animation = "none";
  void toast.offsetWidth;      // reinicia la animación
  toast.style.animation = "";
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.add("hidden"), 3200);
}

// ======================================
// CONFIRMACIÓN PERSONALIZADA
// ======================================

let confirmResolve = null;

function askConfirm(title, messageHtml) {
  $("confirmTitle").textContent = title;
  $("confirmMessage").innerHTML = messageHtml;
  $("confirmBackdrop").classList.remove("hidden");
  return new Promise(resolve => { confirmResolve = resolve; });
}

function settleConfirm(result) {
  if (!confirmResolve) return;
  $("confirmBackdrop").classList.add("hidden");
  const r = confirmResolve;
  confirmResolve = null;
  r(result);
}

// ======================================
// TEMA CLARO / OSCURO
// ======================================

function initTheme() {
  const saved = localStorage.getItem("ha-theme") || "light";
  document.documentElement.dataset.theme = saved;
  $("themeToggle").innerHTML = ICONS[saved === "dark" ? "sun" : "moon"];
}

function toggleTheme() {
  const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = next;
  localStorage.setItem("ha-theme", next);
  $("themeToggle").innerHTML = ICONS[next === "dark" ? "sun" : "moon"];
}

// ======================================
// RELOJ Y SALUDO
// ======================================

function tickClock() {
  const d = new Date();
  const h = d.getHours();
  const m = pad2(d.getMinutes());

  $("clockTime").textContent = `${h % 12 || 12}:${m}`;
  $("clockMer").textContent  = h >= 12 ? "PM" : "AM";

  const shortDate = d.toLocaleDateString("es-PE", { weekday: "long", day: "numeric", month: "short" });
  const longDate  = d.toLocaleDateString("es-PE", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  $("clockDate").textContent = shortDate.charAt(0).toUpperCase() + shortDate.slice(1);
  $("greetDate").textContent = longDate.charAt(0).toUpperCase() + longDate.slice(1);

  const greet = h < 5 ? "Buenas noches" : h < 12 ? "Buenos días" : h < 19 ? "Buenas tardes" : "Buenas noches";
  $("greetTitle").textContent = greet;
}

// ======================================
// CLIMA (open-meteo, sin API key; falla en silencio)
// ======================================

const WMO = [
  [0, "Despejado", "☀️"], [1, "Mayormente despejado", "🌤️"], [2, "Parcialmente nublado", "⛅"],
  [3, "Nublado", "☁️"], [45, "Neblina", "🌫️"], [48, "Neblina con escarcha", "🌫️"],
  [51, "Llovizna ligera", "🌦️"], [53, "Llovizna", "🌦️"], [55, "Llovizna intensa", "🌦️"],
  [61, "Lluvia ligera", "🌧️"], [63, "Lluvia", "🌧️"], [65, "Lluvia fuerte", "🌧️"],
  [71, "Nieve ligera", "🌨️"], [73, "Nieve", "🌨️"], [75, "Nieve fuerte", "❄️"],
  [80, "Chubascos ligeros", "🌦️"], [81, "Chubascos", "🌧️"], [82, "Chubascos fuertes", "⛈️"],
  [95, "Tormenta", "⛈️"], [96, "Tormenta con granizo", "⛈️"], [99, "Tormenta severa", "⛈️"]
];

async function loadWeather() {
  try {
    const res = await fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=-12.046&longitude=-77.043" +
      "&current=temperature_2m,weather_code&timezone=auto"
    );
    if (!res.ok) throw new Error("weather http " + res.status);
    const json = await res.json();
    const c = json.current;
    const found = WMO.find(w => w[0] === c.weather_code);

    $("wTemp").textContent = Math.round(c.temperature_2m);
    $("wDesc").textContent = found ? found[1] : "—";
    $("wEmoji").textContent = found ? found[2] : "🌡️";
    $("weatherCard").hidden = false;
  } catch {
    // Sin conexión o API caída: la tarjeta simplemente no aparece.
  }
}

// ======================================
// CACHE DE TABLAS RELACIONADAS
// ======================================

async function loadRel(table) {
  if (relData.has(table)) return relData.get(table);
  const { data, error } = await db.from(table).select("*");
  if (error) {
    console.error("Relación " + table, error);
    return [];
  }
  relData.set(table, data || []);
  return data || [];
}

function relGet(table, code) {
  const rows = relData.get(table) || [];
  const pk = REL_PK[table];
  return rows.find(r => String(r[pk] ?? "").trim() === String(code).trim());
}

// Nombre "amigable" para columnas que son claves foráneas
function resolveRelName(key, row) {
  const code = String(row[key] ?? "").trim();
  if (!code) return "";

  if (key === "cod_tipo_hab") {
    const t = relGet("tipo_de_habitacion", code);
    return t?.nombre_tipo || code;
  }
  if (key === "cod_huesped") {
    const h = relGet("huesped", code);
    if (!h) return code;
    const full = `${h.nombre_huesped ?? ""} ${h.apellidos_huesped ?? ""}`.trim();
    return full || code;
  }
  if (key === "cod_empleado") {
    const e = relGet("empleado", code);
    return e ? `${e.nombre_empleado} ${e.apellidos_empleado}`.trim() : code;
  }
  if (key === "cod_habitacion") {
    const h = relGet("habitacion", code);
    if (!h) return code;
    const t = h.cod_tipo_hab ? relGet("tipo_de_habitacion", String(h.cod_tipo_hab).trim()) : null;
    return t ? `${code} · ${t.nombre_tipo}` : code;
  }
  return code;
}

function neededRelTables(page) {
  const tables = new Set();
  (configs[page]?.fields || []).forEach(f => { if (f.type === "relation") tables.add(f.table); });
  // En reservas, la habitación muestra además el nombre de su tipo:
  if (page === "reserva") tables.add("tipo_de_habitacion");
  if (page === "habitacion") tables.add("tipo_de_habitacion");
  return [...tables];
}

// ======================================
// ESTADO DE UNA RESERVA
// ======================================

function statusOf(row) {
  const t = todayISO();
  const i = row.fecha_ingreso || "";
  const s = row.fecha_salida || "";
  if (s && s < t) return { label: "Finalizada", cls: "done", rank: 0 };
  if (i && i <= t) return { label: "En curso", cls: "now", rank: 1 };
  return { label: "Próxima", cls: "next", rank: 2 };
}

// ======================================
// ESTADÍSTICAS Y PANELES DEL DASHBOARD
// ======================================

function setConnChip(state, text) {
  const chip = $("connChip");
  chip.classList.toggle("ok", state === "ok");
  chip.classList.toggle("err", state === "err");
  $("connText").textContent = text;
}

async function loadStats() {
  const targets = [
    ["tipo_de_habitacion", "statTipos"],
    ["habitacion", "statHabitaciones"],
    ["huesped", "statHuespedes"],
    ["reserva", "statReservas"]
  ];

  let failed = false;

  for (const [table, id] of targets) {
    const { count, error } = await db.from(table).select("*", { count: "exact", head: true });
    $(id).textContent = error ? "!" : String(count ?? 0);
    if (error) { failed = true; console.error("Estadística " + table, error); }
  }

  setConnChip(failed ? "err" : "ok", failed ? "Sin conexión" : "Conectado a Supabase");
}

async function loadUpcoming() {
  const box = $("upcomingList");
  box.innerHTML = '<div class="muted pad">Cargando…</div>';

  await loadRel("huesped");

  const { data, error } = await db
    .from("reserva")
    .select("*")
    .order("fecha_ingreso");

  if (error) {
    box.innerHTML = `<div class="muted pad">${safe(error.message)}</div>`;
    console.error(error);
    return;
  }

  const today = todayISO();
  const items = (data || [])
    .filter(r => (r.fecha_salida || "") >= today)   // próximas + en curso
    .slice(0, 6);

  if (!items.length) {
    box.innerHTML = '<div class="muted pad">No hay reservas activas ni próximas.</div>';
    return;
  }

  box.innerHTML = items.map(r => {
    const st = statusOf(r);
    const g = relGet("huesped", r.cod_huesped);
    const name = g ? `${g.nombre_huesped ?? ""} ${g.apellidos_huesped ?? ""}`.trim() || r.cod_huesped : r.cod_huesped;
    return `
      <div class="up-item">
        <span class="status-dot d-${st.cls}"></span>
        <div class="up-main">
          <strong>${safe(name)}</strong>
          <span>${fmtDate(r.fecha_ingreso)} → ${fmtDate(r.fecha_salida)} · ${safe(r.cod_habitacion)}</span>
        </div>
        <span class="chip ${st.cls}">${st.label}</span>
      </div>`;
  }).join("");
}

async function loadOccupancy() {
  const box = $("occupancy");
  box.innerHTML = '<div class="muted pad">Cargando…</div>';

  const [habs, tipos] = await Promise.all([loadRel("habitacion"), loadRel("tipo_de_habitacion")]);
  const { error } = await db.from("habitacion").select("cod_habitacion", { count: "exact", head: true });
  if (error) console.error(error);

  // Recuenta en vivo para no depender solo del cache:
  const { data: fresh, error: freshErr } = await db.from("habitacion").select("cod_tipo_hab");
  const rows = freshErr ? habs : (fresh || []);

  if (!rows.length) {
    box.innerHTML = '<div class="muted pad">Aún no hay habitaciones registradas.</div>';
    return;
  }

  const counts = new Map();
  rows.forEach(h => {
    const key = String(h.cod_tipo_hab ?? "").trim();
    counts.set(key, (counts.get(key) || 0) + 1);
  });

  const max = Math.max(...counts.values());
  box.innerHTML = [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([code, n]) => {
      const t = relGet("tipo_de_habitacion", code);
      const name = t?.nombre_tipo || code || "Sin tipo";
      return `
        <div class="occ-row">
          <span class="occ-name" title="${safe(name)}">${safe(name)}</span>
          <div class="occ-bar"><i style="width:${Math.round(n / max * 100)}%"></i></div>
          <span class="occ-num">${n}</span>
        </div>`;
    }).join("");
}

async function loadDashboard() {
  await Promise.all([loadStats(), loadUpcoming(), loadOccupancy()]);
}

// ======================================
// NAVEGACIÓN
// ======================================

function showPage(page) {
  currentPage = page;
  const cfg = configs[page];

  $("dashboardPage").classList.toggle("hidden", page !== "dashboard");
  $("recordsPage").classList.toggle("hidden", page === "dashboard");

  $$(".dock-btn, [data-page]").forEach(b => {
    if (b.classList.contains("dock-btn")) b.classList.toggle("active", b.dataset.page === page);
  });

  if (page === "dashboard") {
    loadDashboard();
    return;
  }

  $("tableTitle").textContent = cfg.title;
  $("searchInput").value = "";
  $("searchInput").placeholder = `Buscar en ${cfg.title.toLowerCase()}…`;
  sortState = { key: cfg.pk[0], dir: 1 };

  renderHead(cfg);
  loadRows();
}

// ======================================
// TABLA: ENCABEZADO ORDENABLE
// ======================================

function renderHead(cfg) {
  $("tableHead").innerHTML =
    "<tr>" +
    cfg.columns.map(([key, label]) => {
      const on = sortState.key === key;
      const arrow = on ? (sortState.dir === 1 ? "↑" : "↓") : "↕";
      return `<th><button class="th-sort ${on ? "on" : ""}" data-sort="${safe(key)}">${safe(label)}<span class="th-arrow">${arrow}</span></button></th>`;
    }).join("") +
    "<th>Acciones</th></tr>";
}

// ======================================
// TABLA: ORDEN, FILTRO Y FILAS
// ======================================

function compareValues(a, b, key, cfg) {
  const col = cfg.columns.find(c => c[0] === key);

  if (col && col[2] === "estado") {
    return (statusOf(a).rank - statusOf(b).rank);
  }
  if (col && (col[2] === "money" || key === "num_piso")) {
    return (Number(a[key]) || 0) - (Number(b[key]) || 0);
  }
  return String(a[key] ?? "").localeCompare(String(b[key] ?? ""), "es", { numeric: true });
}

function viewRows() {
  const cfg = configs[currentPage];
  const term = $("searchInput").value.trim().toLocaleLowerCase("es");

  let rows = currentRows.filter(row =>
    !term || cfg.columns.some(([key]) => {
      const rel = (cfg.columns.find(c => c[0] === key)?.[2] === "rel")
        ? " " + resolveRelName(key, row).toLocaleLowerCase("es") : "";
      return (String(row[key] ?? "") + rel).toLocaleLowerCase("es").includes(term);
    })
  );

  if (sortState.key) {
    rows = [...rows].sort((a, b) => compareValues(a, b, sortState.key, cfg) * sortState.dir);
  }
  return rows;
}

function renderCell(row, col) {
  const [key, , kind] = col;
  const v = row[key];

  if (kind === "money") return `<span class="money">${fmtMoney(v)}</span>`;
  if (kind === "date")  return fmtDate(v);
  if (kind === "estado") {
    const st = statusOf(row);
    return `<span class="chip ${st.cls}">${st.label}</span>`;
  }
  if (kind === "rel") {
    return `<div class="rel-name">${safe(resolveRelName(key, row))}</div><div class="rel-code">${safe(v) || "—"}</div>`;
  }
  return safe(v) || "—";
}

function renderRows(rows) {
  const cfg = configs[currentPage];
  const term = $("searchInput").value.trim();

  $("recordCount").textContent = `${rows.length} registro${rows.length === 1 ? "" : "s"}`;

  if (!rows.length) {
    const msg = term
      ? `Sin resultados para “${safe(term)}”.`
      : "No hay registros todavía.";
    const cta = term ? "" : `<button class="btn primary small" data-empty-new>+ Crear ${safe(cfg.singular)}</button>`;
    $("tableBody").innerHTML =
      `<tr><td class="empty" colspan="${cfg.columns.length + 1}">
        <div class="empty-box">
          <span class="empty-ico">${ICONS.inbox}</span>
          <p>${msg}</p>${cta}
        </div>
      </td></tr>`;
    return;
  }

  $("tableBody").innerHTML = rows.map((row, index) => `
    <tr>
      ${cfg.columns.map(col => `<td>${renderCell(row, col)}</td>`).join("")}
      <td>
        <div class="actions">
          <button class="row-btn" data-edit="${index}" title="Editar" aria-label="Editar">${ICONS.edit}</button>
          <button class="row-btn danger" data-delete="${index}" title="Eliminar" aria-label="Eliminar">${ICONS.trash}</button>
        </div>
      </td>
    </tr>`).join("");
}

function refreshTable() {
  renderHead(configs[currentPage]);
  renderRows(viewRows());
}

// ======================================
// CARGAR REGISTROS
// ======================================

async function loadRows() {
  const cfg = configs[currentPage];

  $("tableBody").innerHTML =
    `<tr><td class="empty" colspan="${cfg.columns.length + 1}">Cargando registros…</td></tr>`;
  $("recordCount").textContent = "Cargando…";

  try {
    await Promise.all(neededRelTables(currentPage).map(loadRel));

    const { data, error } = await db.from(cfg.table).select("*").order(cfg.pk[0]);
    if (error) throw error;

    currentRows = data || [];
    refreshTable();
    setConnChip("ok", "Conectado a Supabase");

  } catch (e) {
    $("tableBody").innerHTML =
      `<tr><td class="empty" colspan="${cfg.columns.length + 1}">${safe(errorMessage(e))}</td></tr>`;
    $("recordCount").textContent = "No se pudieron cargar los datos";
    setConnChip("err", "Sin conexión");
  }
}

// ======================================
// EXPORTAR CSV
// ======================================

function csvCell(v) {
  const s = String(v ?? "");
  return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function exportCSV() {
  const cfg = configs[currentPage];
  const rows = viewRows();

  if (!rows.length) {
    notify("No hay datos para exportar.", "err");
    return;
  }

  const lines = [
    cfg.columns.map(([, label]) => csvCell(label)).join(","),
    ...rows.map(r => cfg.columns.map(([key, , kind]) => {
      const v = kind === "estado" ? statusOf(r).label : r[key];
      return csvCell(v);
    }).join(","))
  ];

  const blob = new Blob(["\ufeff" + lines.join("\n")], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${cfg.table}_${todayISO()}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);

  notify(`Exportados ${rows.length} registro(s) a CSV.`);
}

// ======================================
// GENERAR CÓDIGOS AUTOMÁTICOS
// ======================================

async function nextCode(cfg) {
  const { data, error } = await db.from(cfg.table).select(cfg.pk[0]);
  if (error) throw error;

  let max = 0;
  for (const row of (data || [])) {
    const match = String(row[cfg.pk[0]] || "").trim().match(new RegExp("^" + cfg.prefix + "(\\d+)$", "i"));
    if (match) max = Math.max(max, Number(match[1]));
  }
  return cfg.prefix + String(max + 1).padStart(3, "0");
}

// ======================================
// FORMULARIO (CREAR / EDITAR)
// ======================================

async function makeInput(field, value, disabled) {
  const wrap = document.createElement("div");
  wrap.className = "field";

  const label = document.createElement("label");
  label.htmlFor = "field_" + field.name;
  label.textContent = field.label;

  let input;

  if (field.type === "relation") {
    input = document.createElement("select");

    const empty = document.createElement("option");
    empty.value = "";
    empty.textContent = "Selecciona una opción";
    input.appendChild(empty);

    const { data, error } = await db.from(field.table)
      .select(`${field.value},${field.display}`)
      .order(field.display);

    if (error) throw error;

    (data || []).forEach(item => {
      const opt = document.createElement("option");
      opt.value = String(item[field.value]).trim();
      opt.textContent = `${String(item[field.display] ?? "").trim()} (${String(item[field.value]).trim()})`;
      input.appendChild(opt);
    });

  } else {
    input = document.createElement("input");
    input.type = field.type || "text";
    if (field.min !== undefined) input.min = field.min;
    if (field.step) input.step = field.step;
    if (field.maxlength) input.maxLength = field.maxlength;
  }

  input.id = "field_" + field.name;
  input.name = field.name;
  input.required = Boolean(field.required);

  if (value !== undefined && value !== null) input.value = String(value).trim();
  if (disabled) input.disabled = true;

  if (field.generated && !editingRow) {
    input.placeholder = "Se genera automáticamente";
    input.classList.add("mono");
  }

  wrap.append(label, input);
  return wrap;
}

async function openModal(row = null) {
  editingRow = row;
  const cfg = configs[currentPage];

  $("modalTitle").textContent = row ? `Editar ${cfg.singular}` : `Nuevo registro`;
  $("modalSubtitle").textContent = row
    ? `Modifica los datos de ${cfg.title.toLowerCase()} y guarda los cambios.`
    : `Completa los campos para registrar ${cfg.singular} en ${cfg.title.toLowerCase()}.`;

  $("formError").textContent = "";
  $("formFields").replaceChildren();
  $("newButton").disabled = true;
  $("modalClose").disabled = true;

  try {
    for (const field of cfg.fields) {
      const value = row ? row[field.name] : (field.generated ? await nextCode(cfg) : "");
      const node = await makeInput(field, value, Boolean(row && field.generated));

      if (field.generated && !row) {
        const input = node.querySelector("input");
        input.value = value;
        input.readOnly = true;
      }
      $("formFields").appendChild(node);
    }

    $("modalBackdrop").classList.remove("hidden");
    $("formFields").querySelector("input:not([disabled]),select:not([disabled])")?.focus();

  } catch (e) {
    $("formError").textContent = errorMessage(e);
  } finally {
    $("newButton").disabled = false;
    $("modalClose").disabled = false;
  }
}

function closeModal() {
  $("modalBackdrop").classList.add("hidden");
  $("recordForm").reset();
  $("formFields").replaceChildren();
  $("formError").textContent = "";
  editingRow = null;
}

// ======================================
// GUARDAR REGISTROS
// ======================================

async function saveRow(event) {
  event.preventDefault();

  const cfg = configs[currentPage];
  const payload = {};

  for (const field of cfg.fields) {
    const input = $("recordForm").elements[field.name];
    if (input && !input.disabled) {
      payload[field.name] = field.type === "number" ? Number(input.value) : input.value.trim();
    }
  }

  if ((currentPage === "huesped" || currentPage === "empleado") && !/^\d{8}$/.test(payload.dni)) {
    $("formError").textContent = "El DNI debe tener exactamente 8 dígitos.";
    return;
  }

  if (currentPage === "reserva" && payload.fecha_salida <= payload.fecha_ingreso) {
    $("formError").textContent = "La fecha de salida debe ser posterior a la fecha de ingreso.";
    return;
  }

  $("saveButton").disabled = true;
  $("formError").textContent = "";

  try {
    let query;

    if (editingRow) {
      query = db.from(cfg.table).update(payload);
      cfg.pk.forEach(key => { query = query.eq(key, editingRow[key]); });
    } else {
      query = db.from(cfg.table).insert(payload);
    }

    const { error } = await query;
    if (error) throw error;

    const wasEditing = Boolean(editingRow);
    closeModal();
    notify(wasEditing ? "Registro actualizado." : "Registro creado.");
    relData.delete(cfg.table);   // refresca nombres en otras tablas

    await Promise.all([loadRows(), loadStats()]);

  } catch (e) {
    $("formError").textContent = errorMessage(e);
  } finally {
    $("saveButton").disabled = false;
  }
}

// ======================================
// ELIMINAR REGISTROS
// ======================================

async function deleteRow(row) {
  const cfg = configs[currentPage];

  const ok = await askConfirm(
    "¿Eliminar registro?",
    `Se eliminará <b>${safe(cfg.singular)}</b> con código <b>${safe(row[cfg.pk[0]])}</b>. ` +
    `Si está relacionado con una reserva u otro registro, la base de datos puede impedirlo.`
  );
  if (!ok) return;

  try {
    let query = db.from(cfg.table).delete();
    cfg.pk.forEach(key => { query = query.eq(key, row[key]); });

    const { error } = await query;
    if (error) throw error;

    notify("Registro eliminado.");
    relData.delete(cfg.table);

    await Promise.all([loadRows(), loadStats()]);

  } catch (e) {
    notify("No se pudo eliminar: " + errorMessage(e), "err");
  }
}

// ======================================
// EVENTOS
// ======================================

// Navegación: dock + "Ver reservas"
document.addEventListener("click", e => {
  const nav = e.target.closest("[data-page]");
  if (nav) { showPage(nav.dataset.page); return; }

  const quick = e.target.closest("[data-quick]");
  if (quick) { showPage(quick.dataset.quick); openModal(); return; }

  if (e.target.closest("#modalBackdrop") && e.target.id === "modalBackdrop") closeModal();
  if (e.target.closest("#confirmBackdrop") && e.target.id === "confirmBackdrop") settleConfirm(false);
});

// Ordenar columnas
$("tableHead").addEventListener("click", e => {
  const btn = e.target.closest("[data-sort]");
  if (!btn) return;
  const key = btn.dataset.sort;

  if (sortState.key === key) {
    sortState.dir *= -1;
  } else {
    sortState = { key, dir: 1 };
  }
  refreshTable();
});

// Acciones de fila y estado vacío (delegación)
$("tableBody").addEventListener("click", e => {
  if (e.target.closest("[data-empty-new]")) { openModal(); return; }

  const editBtn = e.target.closest("[data-edit]");
  const delBtn  = e.target.closest("[data-delete]");
  if (!editBtn && !delBtn) return;

  const index = Number(editBtn ? editBtn.dataset.edit : delBtn.dataset.delete);
  const row = currentRows[index];
  if (!row) return;

  if (delBtn) deleteRow(row); else openModal(row);
});

$("newButton").addEventListener("click", () => openModal());
$("cancelButton").addEventListener("click", closeModal);
$("modalClose").addEventListener("click", closeModal);
$("recordForm").addEventListener("submit", saveRow);
$("searchInput").addEventListener("input", refreshTable);
$("exportBtn").addEventListener("click", exportCSV);
$("refreshBtn").addEventListener("click", async () => {
  if (currentPage === "dashboard") await loadDashboard(); else await loadRows();
  await loadStats();
  notify("Datos actualizados.");
});
$("themeToggle").addEventListener("click", toggleTheme);
$("confirmCancel").addEventListener("click", () => settleConfirm(false));
$("confirmOk").addEventListener("click", () => settleConfirm(true));

// Atajos de teclado
document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    if (!$("confirmBackdrop").classList.contains("hidden")) { settleConfirm(false); return; }
    if (!$("modalBackdrop").classList.contains("hidden")) closeModal();
    return;
  }
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k" && currentPage !== "dashboard") {
    e.preventDefault();
    $("searchInput").focus();
  }
  if (e.key === "/" && currentPage !== "dashboard" &&
      !/INPUT|SELECT|TEXTAREA/.test(document.activeElement.tagName)) {
    e.preventDefault();
    $("searchInput").focus();
  }
});

// ======================================
// INICIAR APLICACIÓN (sin login)
// ======================================

mountIcons();
initTheme();
tickClock();
setInterval(tickClock, 1000);
showPage("dashboard");
loadWeather();

})();
