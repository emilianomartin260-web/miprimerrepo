/**
 * admin.js — Panel de administración (admin.html).
 *
 * Dos herramientas:
 *  1) Calculadora rápida: "what-if" suelto, no toca el catálogo.
 *  2) Tabla de productos: edita el catálogo real. Al guardar, escribe en
 *     localStorage bajo la clave perfumeDemo.products — que es lo que
 *     app.js (index.html) lee con prioridad sobre data.js.
 *
 * Nota sobre localStorage y file://: si abriste este archivo con doble clic
 * (protocolo file://), algunos navegadores no comparten localStorage entre
 * archivos igual que lo harían en un servidor real. Ver README para levantar
 * un servidor local en 1 línea y evitar esa sorpresa.
 */

const STORAGE_PRODUCTS = "perfumeDemo.products";

function loadProducts() {
  const raw = localStorage.getItem(STORAGE_PRODUCTS);
  if (!raw) return JSON.parse(JSON.stringify(PRODUCTS)); // copia, no la referencia original
  try {
    return JSON.parse(raw);
  } catch {
    return JSON.parse(JSON.stringify(PRODUCTS));
  }
}

function saveProducts(products) {
  localStorage.setItem(STORAGE_PRODUCTS, JSON.stringify(products));
}

let products = loadProducts();

// ---------- Calculadora rápida ----------
function renderCalc() {
  const bottleCost = Number(document.getElementById("calc-bottleCost").value) || 0;
  const bottleSizeMl = Number(document.getElementById("calc-bottleSizeMl").value) || 1;
  const decantMl = Number(document.getElementById("calc-decantMl").value) || 0;
  const packagingCost = Number(document.getElementById("calc-packagingCost").value) || 0;
  const price = Number(document.getElementById("calc-price").value) || 0;
  const targetMargin = Number(document.getElementById("calc-targetMargin").value) || 0;

  const costo = costoPorDecant({ bottleCost, bottleSizeMl, decantMl, packagingCost });
  const { profit, marginPct, markupPct } = metricas(costo, price);
  const sugerido = precioSugerido(costo, targetMargin);

  document.getElementById("calc-out-costo").textContent = formatARS(costo);
  document.getElementById("calc-out-profit").textContent = formatARS(profit);
  document.getElementById("calc-out-margin").textContent = marginPct.toFixed(1) + "%";
  document.getElementById("calc-out-markup").textContent = markupPct.toFixed(1) + "%";
  document.getElementById("calc-out-sugerido").textContent =
    Number.isFinite(sugerido) ? formatARS(sugerido) : "—";

  const profitEl = document.getElementById("calc-out-profit");
  profitEl.style.color = profit >= 0 ? "var(--ok)" : "var(--bad)";
}

// ---------- Tabla de productos ----------
function renderTable() {
  const tbody = document.getElementById("products-body");
  tbody.innerHTML = products
    .map((p, i) => {
      const costo = costoPorDecant(p);
      const { profit, marginPct } = metricas(costo, p.price);
      return `
        <tr>
          <td class="product-cell">
            <div class="thumb">${decantIconSVG(p, "admin" + i)}</div>
            <div>
              <strong>${p.name}</strong><br>
              <span class="muted">${p.brand} · ${p.family}</span>
            </div>
          </td>
          <td><input type="number" data-field="bottleCost" data-i="${i}" value="${p.bottleCost}" /></td>
          <td><input type="number" data-field="bottleSizeMl" data-i="${i}" value="${p.bottleSizeMl}" /></td>
          <td><input type="number" data-field="decantMl" data-i="${i}" value="${p.decantMl}" /></td>
          <td><input type="number" data-field="packagingCost" data-i="${i}" value="${p.packagingCost}" /></td>
          <td><input type="number" data-field="price" data-i="${i}" value="${p.price}" /></td>
          <td class="muted">${formatARS(costo)}</td>
          <td style="color:${profit >= 0 ? "var(--ok)" : "var(--bad)"}; font-weight:600;">
            ${formatARS(profit)}
          </td>
          <td>${marginPct.toFixed(1)}%</td>
        </tr>`;
    })
    .join("");

  tbody.querySelectorAll("input").forEach((input) => {
    input.addEventListener("input", (e) => {
      const i = Number(e.target.dataset.i);
      const field = e.target.dataset.field;
      // Los precios y costos son números: si esto quedara como string
      // ("2000" + "300" = "2000300" en vez de 2300), toda la calculadora
      // rompería. Number(...) es lo que evita ese error clásico.
      products[i][field] = Number(e.target.value) || 0;
      renderTable();
    });
  });
}

function handleSave() {
  saveProducts(products);
  const status = document.getElementById("save-status");
  status.textContent = "✓ Guardado. El catálogo de la tienda ya refleja estos cambios.";
  setTimeout(() => (status.textContent = ""), 3500);
}

function handleReset() {
  products = JSON.parse(JSON.stringify(PRODUCTS));
  localStorage.removeItem(STORAGE_PRODUCTS);
  renderTable();
  const status = document.getElementById("save-status");
  status.textContent = "↺ Se restauraron los valores de fábrica (data.js).";
  setTimeout(() => (status.textContent = ""), 3500);
}

document.addEventListener("DOMContentLoaded", () => {
  renderTable();
  renderCalc();

  document
    .querySelectorAll("#calculadora input")
    .forEach((input) => input.addEventListener("input", renderCalc));

  document.getElementById("save-btn").addEventListener("click", handleSave);
  document.getElementById("reset-btn").addEventListener("click", handleReset);
});
