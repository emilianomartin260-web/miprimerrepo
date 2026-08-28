/**
 * data.js — Catálogo "de fábrica".
 *
 * Esto es lo único que tocarías si vendieras otra cosa (ropa, velas, mates...):
 * cambiás esta lista y toda la tienda (catálogo, carrito, panel admin) se adapta sola.
 *
 * Campos de cada producto:
 *  - id             identificador único (string)
 *  - brand          marca
 *  - name           nombre del perfume
 *  - family         familia olfativa (para el filtro)
 *  - badge          etiqueta opcional ("Más vendido", "Nuevo"...) o null
 *  - bottleSizeMl   tamaño del frasco original que se compra para fraccionar
 *  - bottleCost     lo que cuesta ESE frasco completo (costo, en ARS)
 *  - decantMl       tamaño del decant que se vende (ml)
 *  - packagingCost  costo de frasco vacío + etiqueta + insumos, por unidad (ARS)
 *  - price          precio de venta del decant (ARS) — esto es lo que el admin ajusta
 *  - desc           descripción corta para el catálogo
 *
 * El costo real por decant y la ganancia NO se guardan acá: se calculan
 * en vivo (ver calc.js) a partir de bottleCost / bottleSizeMl / decantMl / packagingCost.
 * Así, si cambia el costo del frasco, la ganancia se recalcula sola sin tocar precios a mano.
 */

const PRODUCTS = [
  {
    id: "khamrah",
    brand: "Lattafa",
    name: "Khamrah",
    family: "Amaderado especiado",
    badge: "Más vendido",
    bottleSizeMl: 100,
    bottleCost: 28000,
    decantMl: 5,
    packagingCost: 350,
    price: 3800,
    desc: "Canela, dátil y vainilla sobre una base amaderada cálida. Ideal para la noche.",
  },
  {
    id: "yara",
    brand: "Lattafa",
    name: "Yara",
    family: "Floral afrutado",
    badge: null,
    bottleSizeMl: 100,
    bottleCost: 22000,
    decantMl: 5,
    packagingCost: 350,
    price: 3000,
    desc: "Vainilla, frutas y flores blancas. Dulce, fresco y muy versátil de día.",
  },
  {
    id: "amber-oud",
    brand: "Al Haramain",
    name: "Amber Oud Gold",
    family: "Ambarado",
    badge: null,
    bottleSizeMl: 60,
    bottleCost: 35000,
    decantMl: 5,
    packagingCost: 350,
    price: 4900,
    desc: "Ámbar denso y oud suave. Un clásico de alta fijación para climas fríos.",
  },
  {
    id: "hawas",
    brand: "Rasasi",
    name: "Hawas",
    family: "Fougère fresco",
    badge: null,
    bottleSizeMl: 100,
    bottleCost: 30000,
    decantMl: 5,
    packagingCost: 350,
    price: 4000,
    desc: "Cítricos y lavanda con fondo amaderado. El más elegido para uso diario.",
  },
  {
    id: "shaghaf-oud",
    brand: "Swiss Arabian",
    name: "Shaghaf Oud",
    family: "Oud intenso",
    badge: null,
    bottleSizeMl: 75,
    bottleCost: 42000,
    decantMl: 5,
    packagingCost: 350,
    price: 5800,
    desc: "Oud profundo con especias. Para quien busca proyección real de noche.",
  },
  {
    id: "wisal",
    brand: "Ajmal",
    name: "Wisal",
    family: "Floral oriental",
    badge: null,
    bottleSizeMl: 75,
    bottleCost: 26000,
    decantMl: 5,
    packagingCost: 350,
    price: 3600,
    desc: "Rosa y azafrán sobre almizcle suave. Elegante y discreto.",
  },
  {
    id: "yousuf",
    brand: "Nabeel",
    name: "Yousuf",
    family: "Dulce especiado",
    badge: null,
    bottleSizeMl: 100,
    bottleCost: 24000,
    decantMl: 5,
    packagingCost: 350,
    price: 3300,
    desc: "Especias dulces y ámbar liviano. Buena relación precio-calidad de entrada.",
  },
  {
    id: "9pm",
    brand: "Afnan",
    name: "9 PM",
    family: "Vainilla especiada",
    badge: "Nuevo",
    bottleSizeMl: 100,
    bottleCost: 27000,
    decantMl: 5,
    packagingCost: 350,
    price: 3700,
    desc: "Vainilla, canela y cacao. Dulce sin empalagar, muy usado como 'gateway' al nicho árabe.",
  },
  {
    id: "sweet-fantasy",
    brand: "Lattafa",
    name: "Bade'e Al Oud Sweet Fantasy",
    family: "Gourmand",
    badge: "Más vendido",
    bottleSizeMl: 100,
    bottleCost: 25000,
    decantMl: 5,
    packagingCost: 350,
    price: 3400,
    desc: "Caramelo, vainilla y frutos rojos. El más regalado en fechas especiales.",
  },
];
