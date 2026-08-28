/**
 * illustrations.js — Arte ilustrativo (SVG original, no fotos).
 *
 * Por qué SVG generado y no fotos reales de los frascos:
 *  1) Los frascos de marcas como Lattafa/Rasasi/etc. son propiedad de esas
 *     marcas — usar sus fotos o logos en una tienda no oficial es un
 *     problema de derechos. Un dibujo propio, no.
 *  2) Cero archivos externos que descargar: todo se genera en el navegador,
 *     así que no hay imágenes rotas ni dependencias de internet.
 *  3) Se puede recolorear por familia olfativa sin tener que producir
 *     una foto distinta por producto.
 *
 * Si más adelante conseguís fotos propias de tus decants, alcanza con
 * reemplazar la llamada a decantIconSVG(p) en app.js por un <img src="...">.
 */

// Un color de "líquido" por familia olfativa. Si agregás una familia nueva
// en data.js y no está acá, se usa un dorado por defecto (ver familyColor).
const FAMILY_COLORS = {
  "Amaderado especiado": "#b6752e",
  "Floral afrutado": "#e0789a",
  "Ambarado": "#c98a2c",
  "Fougère fresco": "#6fae7c",
  "Oud intenso": "#6b3f2e",
  "Floral oriental": "#9b5fb0",
  "Dulce especiado": "#cf6b4a",
  "Vainilla especiada": "#d9b36c",
  "Gourmand": "#c76b6b",
};

function familyColor(family) {
  return FAMILY_COLORS[family] || "#a9762f";
}

function initialsFor(name) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

/**
 * Ilustración de un decant individual: frasquito con tapón, líquido
 * coloreado según la familia olfativa, y una etiqueta con las iniciales.
 * `uid` evita que dos <clipPath> con el mismo id se pisen si hay varias
 * tarjetas en pantalla a la vez.
 */
function decantIconSVG(product, uid) {
  const color = familyColor(product.family);
  const label = initialsFor(product.name);
  const clipId = `clip-${product.id}-${uid}`;
  return `
<svg viewBox="0 0 80 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Decant de ${product.name}, ${product.brand}, ${product.decantMl}ml">
  <defs>
    <clipPath id="${clipId}"><rect x="16" y="28" width="48" height="64" rx="10" /></clipPath>
  </defs>
  <rect x="30" y="2" width="20" height="14" rx="3" fill="var(--accent)" />
  <rect x="33" y="14" width="14" height="16" fill="#ffffff" fill-opacity="0.5" stroke="#ffffff" stroke-opacity="0.6" />
  <rect x="16" y="28" width="48" height="64" rx="10" fill="#ffffff" fill-opacity="0.32" stroke="#ffffff" stroke-opacity="0.55" stroke-width="1.5" />
  <rect x="16" y="46" width="48" height="46" fill="${color}" clip-path="url(#${clipId})" />
  <path d="M20 46 Q30 44 20 92" fill="none" stroke="${color}" stroke-opacity="0.6" stroke-width="1" clip-path="url(#${clipId})" />
  <polygon points="22,32 27,32 20,88 16,88" fill="#ffffff" opacity="0.25" />
  <rect x="19" y="59" width="42" height="16" rx="3" fill="#ffffff" fill-opacity="0.92" />
  <text x="40" y="70.5" text-anchor="middle" font-family="Inter, system-ui, sans-serif" font-size="9" font-weight="700" fill="#3a2f33">${label}</text>
</svg>`;
}

/**
 * Ilustración grande para el hero: el frasco original "sirviendo" tres
 * decants más chicos. Es puramente decorativa (aria-hidden).
 */
function decantingHeroSVG() {
  return `
<svg viewBox="0 0 320 140" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <rect x="132" y="10" width="56" height="80" rx="10" fill="#ffffff" fill-opacity="0.28" stroke="#ffffff" stroke-opacity="0.5" stroke-width="1.5" />
  <rect x="132" y="46" width="56" height="44" rx="10" fill="var(--accent)" fill-opacity="0.85" />
  <rect x="150" y="0" width="20" height="14" rx="3" fill="var(--accent)" />
  <polygon points="139,16 145,16 133,84 128,84" fill="#ffffff" opacity="0.22" />

  <g transform="translate(30,78)">
    <rect x="0" y="0" width="34" height="46" rx="8" fill="#ffffff" fill-opacity="0.28" stroke="#ffffff" stroke-opacity="0.5" />
    <rect x="0" y="22" width="34" height="24" rx="8" fill="${familyColor("Floral afrutado")}" fill-opacity="0.9" />
    <rect x="10" y="-8" width="14" height="10" rx="2" fill="var(--accent)" />
  </g>
  <g transform="translate(250,78)">
    <rect x="0" y="0" width="34" height="46" rx="8" fill="#ffffff" fill-opacity="0.28" stroke="#ffffff" stroke-opacity="0.5" />
    <rect x="0" y="22" width="34" height="24" rx="8" fill="${familyColor("Oud intenso")}" fill-opacity="0.9" />
    <rect x="10" y="-8" width="14" height="10" rx="2" fill="var(--accent)" />
  </g>

  <path d="M148 92 C 90 105, 70 108, 55 112" fill="none" stroke="var(--accent)" stroke-opacity="0.55" stroke-width="2" stroke-dasharray="3 5" />
  <path d="M172 92 C 230 105, 250 108, 265 112" fill="none" stroke="var(--accent)" stroke-opacity="0.55" stroke-width="2" stroke-dasharray="3 5" />
</svg>`;
}
