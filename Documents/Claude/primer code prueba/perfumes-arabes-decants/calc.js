/**
 * calc.js — Fórmulas de costo y ganancia, en un solo lugar.
 *
 * Se usan desde admin.js (calculadora y tabla de productos).
 * Están separadas de la UI a propósito: si mañana querés otra fórmula
 * (por ejemplo, sumar un % de merma o comisión de MercadoPago),
 * este es el ÚNICO archivo que hay que tocar.
 */

/**
 * Costo de un decant individual, sin contar el precio de venta.
 *  costo por ml del frasco  = bottleCost / bottleSizeMl
 *  costo del líquido        = costo por ml * decantMl
 *  costo total del decant   = costo del líquido + packagingCost
 */
function costoPorDecant({ bottleCost, bottleSizeMl, decantMl, packagingCost }) {
  const costoPorMl = bottleCost / bottleSizeMl;
  const costoLiquido = costoPorMl * decantMl;
  return costoLiquido + packagingCost;
}

/**
 * A partir de un costo y un precio de venta, devuelve las métricas de negocio
 * que le importan a quien vende:
 *  - profit:      ganancia en pesos por unidad vendida
 *  - marginPct:   ganancia como % del PRECIO DE VENTA (lo que suele llamarse "margen")
 *  - markupPct:   ganancia como % del COSTO (lo que suele llamarse "markup" o "recargo")
 *
 * Margen y markup se confunden todo el tiempo y dan números distintos
 * para los mismos pesos — por eso se muestran los dos.
 */
function metricas(costo, precio) {
  const profit = precio - costo;
  const marginPct = precio > 0 ? (profit / precio) * 100 : 0;
  const markupPct = costo > 0 ? (profit / costo) * 100 : 0;
  return { profit, marginPct, markupPct };
}

/**
 * Precio sugerido para lograr un margen objetivo (no un markup) dado un costo.
 * Despejando de marginPct = (precio - costo) / precio:
 *   precio = costo / (1 - margenObjetivo)
 */
function precioSugerido(costo, margenObjetivoPct) {
  const m = margenObjetivoPct / 100;
  if (m >= 1) return Infinity; // un margen de 100% o más sobre el precio es matemáticamente imposible
  return costo / (1 - m);
}

function formatARS(n) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(n);
}
