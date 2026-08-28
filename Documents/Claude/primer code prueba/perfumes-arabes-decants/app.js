/**
 * app.js — Lógica de la tienda (index.html).
 *
 * Todo lo que es "configuración de negocio" vive en constantes acá arriba
 * a propósito: es lo primero que tocarías para adaptar la demo.
 */

// Número de WhatsApp de ejemplo — reemplazar por el real antes de publicar.
const WHATSAPP_NUMBER = "5491100000000";

// Cotización dólar usada SOLO para el toggle de moneda de la demo.
// En un caso real esto vendría de una API (ver README, sección "mejoras posibles").
const USD_TO_ARS = 1250;

const STORAGE = {
  theme: "perfumeDemo.theme",
  layout: "perfumeDemo.layout",
  currency: "perfumeDemo.currency",
  cart: "perfumeDemo.cart",
  products: "perfumeDemo.products", // lo escribe admin.html cuando editás precios/costos
};

/** Devuelve el catálogo: si el panel admin guardó ediciones, se usan esas;
 *  si no, se usa el PRODUCTS "de fábrica" de data.js. */
function getProducts() {
  const raw = localStorage.getItem(STORAGE.products);
  if (!raw) return PRODUCTS;
  try {
    return JSON.parse(raw);
  } catch {
    // JSON corrupto (alguien tocó localStorage a mano): no rompemos la tienda,
    // volvemos al catálogo de fábrica.
    return PRODUCTS;
  }
}

// ---------- Estado ----------
let state = {
  theme: localStorage.getItem(STORAGE.theme) || "elegante",
  layout: localStorage.getItem(STORAGE.layout) || "grid",
  currency: localStorage.getItem(STORAGE.currency) || "ARS",
  search: "",
  family: "todas",
  cart: JSON.parse(localStorage.getItem(STORAGE.cart) || "[]"), // [{id, qty}]
};

// ---------- Utilidades de formato ----------
function formatPrice(ars) {
  if (state.currency === "USD") {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
      ars / USD_TO_ARS
    );
  }
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(ars);
}

// ---------- Render de catálogo ----------
function renderFamilyOptions() {
  const select = document.getElementById("family-filter");
  const families = ["todas", ...new Set(getProducts().map((p) => p.family))];
  select.innerHTML = families
    .map((f) => `<option value="${f}">${f === "todas" ? "Todas las familias" : f}</option>`)
    .join("");
  select.value = state.family;
}

function renderCatalog() {
  const grid = document.getElementById("catalog");
  const products = getProducts().filter((p) => {
    const matchesSearch =
      state.search.trim() === "" ||
      `${p.brand} ${p.name}`.toLowerCase().includes(state.search.toLowerCase());
    const matchesFamily = state.family === "todas" || p.family === state.family;
    return matchesSearch && matchesFamily;
  });

  grid.className = `catalog ${state.layout === "list" ? "list" : ""}`;

  if (products.length === 0) {
    grid.innerHTML = `<p class="cart-empty">No encontramos perfumes con ese filtro.</p>`;
    return;
  }

  grid.innerHTML = products
    .map(
      (p, i) => `
      <article class="card">
        <div class="swatch">${decantIconSVG(p, i)}</div>
        <div class="card-body">
          ${p.badge ? `<span class="badge">${p.badge}</span>` : ""}
          <div class="brand-name">${p.brand}</div>
          <h3>${p.name}</h3>
          <p class="desc">${p.desc}</p>
          <div class="card-footer">
            <div class="price">${formatPrice(p.price)} <span class="ml">/ ${p.decantMl}ml</span></div>
            <button class="btn" data-add="${p.id}">Agregar</button>
          </div>
        </div>
      </article>`
    )
    .join("");

  grid.querySelectorAll("[data-add]").forEach((btn) => {
    btn.addEventListener("click", () => addToCart(btn.dataset.add));
  });
}

// ---------- Carrito ----------
function addToCart(id) {
  const item = state.cart.find((i) => i.id === id);
  if (item) {
    item.qty += 1;
  } else {
    state.cart.push({ id, qty: 1 });
  }
  persistCart();
  renderCart();
  openCart();
}

function removeFromCart(id) {
  state.cart = state.cart.filter((i) => i.id !== id);
  persistCart();
  renderCart();
}

function persistCart() {
  localStorage.setItem(STORAGE.cart, JSON.stringify(state.cart));
}

function cartTotal() {
  const products = getProducts();
  return state.cart.reduce((sum, item) => {
    const p = products.find((prod) => prod.id === item.id);
    return p ? sum + p.price * item.qty : sum;
  }, 0);
}

function renderCart() {
  const products = getProducts();
  const container = document.getElementById("cart-items");
  const countEl = document.getElementById("cart-count");
  const totalEl = document.getElementById("cart-total");
  const totalQty = state.cart.reduce((n, i) => n + i.qty, 0);

  countEl.textContent = totalQty;
  countEl.style.display = totalQty > 0 ? "inline-flex" : "none";

  if (state.cart.length === 0) {
    container.innerHTML = `<p class="cart-empty">Tu carrito está vacío.</p>`;
  } else {
    container.innerHTML = state.cart
      .map((item) => {
        const p = products.find((prod) => prod.id === item.id);
        if (!p) return "";
        return `
          <div class="cart-item">
            <div>
              <strong>${p.name}</strong><br>
              <span style="color:var(--text-muted); font-size:0.8rem;">
                ${item.qty} x ${formatPrice(p.price)}
              </span><br>
              <button class="remove" data-remove="${p.id}">Quitar</button>
            </div>
            <div>${formatPrice(p.price * item.qty)}</div>
          </div>`;
      })
      .join("");
    container.querySelectorAll("[data-remove]").forEach((btn) => {
      btn.addEventListener("click", () => removeFromCart(btn.dataset.remove));
    });
  }

  totalEl.innerHTML = `<span>Total</span><span>${formatPrice(cartTotal())}</span>`;

  const waBtn = document.getElementById("wa-checkout");
  waBtn.disabled = state.cart.length === 0;
}

function openCart() {
  document.getElementById("cart-drawer").classList.add("open");
  document.getElementById("overlay").classList.add("open");
}
function closeCart() {
  document.getElementById("cart-drawer").classList.remove("open");
  document.getElementById("overlay").classList.remove("open");
}

function buildWhatsAppLink() {
  const products = getProducts();
  const lines = state.cart.map((item) => {
    const p = products.find((prod) => prod.id === item.id);
    return p ? `- ${p.name} (${p.decantMl}ml) x${item.qty}` : "";
  });
  const msg = encodeURIComponent(
    `Hola! Quiero consultar por estos decants:\n${lines.join("\n")}\n\nTotal aprox: ${formatPrice(
      cartTotal()
    )}`
  );
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
}

// ---------- Tema / layout / moneda (panel demo) ----------
function applyTheme(theme) {
  state.theme = theme;
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(STORAGE.theme, theme);
  document.querySelectorAll("[data-theme-btn]").forEach((b) => {
    b.classList.toggle("active", b.dataset.themeBtn === theme);
  });
}

function applyLayout(layout) {
  state.layout = layout;
  localStorage.setItem(STORAGE.layout, layout);
  document.querySelectorAll("[data-layout-btn]").forEach((b) => {
    b.classList.toggle("active", b.dataset.layoutBtn === layout);
  });
  renderCatalog();
}

function applyCurrency(currency) {
  state.currency = currency;
  localStorage.setItem(STORAGE.currency, currency);
  document.querySelectorAll("[data-currency-btn]").forEach((b) => {
    b.classList.toggle("active", b.dataset.currencyBtn === currency);
  });
  renderCatalog();
  renderCart();
}

// ---------- Inicialización ----------
document.addEventListener("DOMContentLoaded", () => {
  const heroArt = document.getElementById("hero-art");
  if (heroArt) heroArt.innerHTML = decantingHeroSVG();

  applyTheme(state.theme);
  applyLayout(state.layout);
  applyCurrency(state.currency);
  renderFamilyOptions();
  renderCatalog();
  renderCart();

  document.getElementById("search").addEventListener("input", (e) => {
    state.search = e.target.value;
    renderCatalog();
  });
  document.getElementById("family-filter").addEventListener("change", (e) => {
    state.family = e.target.value;
    renderCatalog();
  });

  document.querySelectorAll("[data-theme-btn]").forEach((b) =>
    b.addEventListener("click", () => applyTheme(b.dataset.themeBtn))
  );
  document.querySelectorAll("[data-layout-btn]").forEach((b) =>
    b.addEventListener("click", () => applyLayout(b.dataset.layoutBtn))
  );
  document.querySelectorAll("[data-currency-btn]").forEach((b) =>
    b.addEventListener("click", () => applyCurrency(b.dataset.currencyBtn))
  );

  document.getElementById("cart-toggle").addEventListener("click", openCart);
  document.getElementById("cart-close").addEventListener("click", closeCart);
  document.getElementById("overlay").addEventListener("click", closeCart);

  document.getElementById("wa-checkout").addEventListener("click", () => {
    window.open(buildWhatsAppLink(), "_blank", "noopener");
  });
});
