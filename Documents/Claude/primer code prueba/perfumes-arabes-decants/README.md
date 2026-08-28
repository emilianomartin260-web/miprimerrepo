# Oasis Decants — tienda demo (perfumes árabes en decants)

Proyecto de demostración: una tienda online completa para un nicho real
(reventa de decants de perfumes árabes), pensada para mostrar en un solo
lugar qué se puede construir, qué errores evitar, cómo mejorar el diseño
y cómo configurar costos/ganancia.

No usa frameworks ni build step: HTML + CSS + JS puro. Se puede abrir
directo con doble clic, aunque para que el carrito y el panel admin
compartan datos correctamente conviene levantar un servidor local:

```bash
python -m http.server 8000
```

y entrar a `http://localhost:8000`. (Alternativa sin Python: `npx serve`.)

## Estructura

| Archivo | Qué hace |
|---|---|
| `data.js` | Catálogo "de fábrica": marca, nombre, costos, precio. Lo único que cambiarías para vender otra cosa. |
| `calc.js` | Fórmulas de costo/ganancia/margen, separadas de la interfaz. |
| `index.html` / `app.js` | Tienda pública: catálogo, filtros, carrito, checkout por WhatsApp. |
| `admin.html` / `admin.js` | Panel privado: calculadora de precios + editor del catálogo con ganancia en vivo. |
| `styles.css` | Todo el diseño, en 3 temas intercambiables por variables CSS. |

## 1. Lo que ya podés tocar y ver funcionando

Abrí `index.html` y mirá el **panel "⚙️ Panel demo"** (esquina inferior derecha):

- **Tema visual**: Básico / Elegante / Oscuro — cambia tipografía, colores,
  bordes y espaciado de todo el sitio con un solo atributo (`data-theme`
  en `<html>`). Ver sección 3.
- **Grilla / Lista**: cambia el layout del catálogo sin tocar el HTML de
  cada producto.
- **Moneda**: ARS / USD, usando una cotización fija como ejemplo (`USD_TO_ARS`
  en `app.js`).
- **Buscador y filtro por familia olfativa.**
- **Carrito** con persistencia en `localStorage` y botón que arma un mensaje
  de WhatsApp con el pedido (reemplazá `WHATSAPP_NUMBER` en `app.js` por
  un número real antes de publicar algo así).

Y en `admin.html`:

- **Calculadora rápida**: costo del frasco, tamaño del decant, envase →
  costo real, ganancia, margen, markup y precio sugerido para un margen
  objetivo.
- **Tabla del catálogo real**: editás costo/precio de cada producto y ves
  la ganancia recalculada en vivo. "Guardar" lo escribe en `localStorage`
  y la tienda pública lo refleja al instante.

## 2. Cómo se calcula costo y ganancia

En `calc.js`:

```
costo por ml       = costo del frasco / tamaño del frasco (ml)
costo del decant    = costo por ml × ml del decant + costo de envase
ganancia            = precio de venta − costo del decant
margen (%)          = ganancia / precio de venta        ← "cuánto de lo que cobro es ganancia"
markup (%)          = ganancia / costo                  ← "cuánto recargué sobre el costo"
```

Margen y markup se confunden todo el tiempo porque para los mismos pesos
de ganancia dan porcentajes distintos (ej: costo 1000, precio 2000 →
margen 50%, markup 100%). El panel admin muestra los dos para que la
diferencia quede visible en los números, no solo en la teoría.

## 3. Cómo mejorar el diseño (demostrado, no solo explicado)

El toggle de temas del panel demo **es** la demostración: los tres temas
usan exactamente el mismo HTML, solo cambian las variables CSS.

- **Básico** (`[data-theme="basico"]` en `styles.css`): a propósito con
  Arial sin cuidar, azul de link genérico, contraste bajo (`#444` sobre
  blanco), sin radios ni sombras, espaciado apretado.
- **Elegante** (el recomendado): tipografía con jerarquía real (`Playfair
  Display` para títulos + `Inter` para texto), paleta acorde al nicho
  (dorado/violeta), contraste alto, espaciado generoso, bordes
  redondeados y sombra suave para dar profundidad.
- **Oscuro**: mismo sistema, otra identidad — muestra que un rediseño
  completo es cambiar variables, no reescribir componentes.

Reglas generales que se pueden extraer de la comparación:

1. **Jerarquía tipográfica**: una fuente con carácter para títulos, una
   neutra y legible para texto largo. Nunca la misma fuente al mismo
   tamaño en todos lados.
2. **Contraste de texto**: `--text` sobre `--bg` debería pasar WCAG AA
   (relación ≥ 4.5:1). El tema básico lo rompe a propósito.
3. **Espaciado consistente**: una escala (`--space` acá) en vez de
   números sueltos por todos lados.
4. **Un solo color de acento**: usarlo para todo lo interactivo (botones,
   links, badges) y nada más — así el ojo sabe qué es clickeable.
5. **Micro-interacciones**: `hover`/`transition` sutiles (ver `.card:hover`)
   comunican "esto responde" sin necesitar texto.

## 4. Errores comunes (con código: mal → bien)

**Sumar precios como texto en vez de número**
```js
// ❌ inputs de <input> siempre devuelven string
const total = precio1 + precio2; // "2000" + "300" = "2000300"

// ✅
const total = Number(precio1) + Number(precio2); // 2300
```
Esto pasa de verdad en `admin.js`: por eso cada edición de la tabla hace
`Number(e.target.value) || 0` antes de guardar.

**Formulario que recarga la página y borra lo que escribiste**
```js
// ❌
form.addEventListener("submit", () => { /* ... */ });

// ✅
form.addEventListener("submit", (e) => {
  e.preventDefault();
  /* ... */
});
```

**Sin `box-sizing: border-box`**
```css
/* ❌ con padding, el elemento termina más ancho que su 100% declarado
   y desborda el contenedor */
.card { width: 100%; padding: 20px; }

/* ✅ */
* { box-sizing: border-box; }
```
(Ya aplicado en `styles.css`, primera regla del archivo.)

**Falta el viewport meta**
```html
<!-- ❌ sin esto, el celular renderiza como si fuera desktop
     y después achica todo — "responsive" roto -->
<head><title>Mi tienda</title></head>

<!-- ✅ -->
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

**Contraste de texto insuficiente**
```css
/* ❌ gris claro sobre blanco: ilegible para bastante gente */
color: #bbbbbb; background: #ffffff;

/* ✅ */
color: #444444; background: #ffffff; /* y mejor aún, más oscuro si es texto principal */
```

**`z-index` que "no funciona"**
```css
/* ❌ z-index no hace nada sin position */
.demo-panel { z-index: 40; }

/* ✅ */
.demo-panel { position: fixed; z-index: 40; }
```

**Imágenes sin `alt`**
```html
<!-- ❌ invisible para lectores de pantalla y peor para SEO -->
<img src="perfume.jpg" />

<!-- ✅ -->
<img src="perfume.jpg" alt="Decant de Khamrah, Lattafa, 5ml" />
```

**Guardar datos sensibles en `localStorage`**
Este proyecto guarda ahí carrito, tema y catálogo porque no es información
sensible. Nunca guardes contraseñas, tokens de pago o datos personales de
clientes en `localStorage`: es texto plano, accesible desde cualquier
script que corra en la página (incluida una extensión de navegador
comprometida). Para eso vas a un backend con sesiones/autenticación real.

## 5. Configurar costos, precios y ganancia para tu propio catálogo

1. Editá `data.js`: por cada producto, `bottleCost` (lo que pagás por el
   frasco entero), `bottleSizeMl`, `decantMl` y `packagingCost`. El
   `price` es el único valor que decidís vos mismo (no se calcula solo).
2. Abrí `admin.html` → tabla de productos: ahí mismo ves qué margen te
   deja cada precio antes de publicarlo.
3. Usá la calculadora rápida para productos nuevos: metés el margen
   objetivo (ej. 55%) y te dice qué precio cobrar.
4. Si vendés en otra moneda o cambia el dólar, ajustá `USD_TO_ARS` en
   `app.js`.

## 6. Ideas para seguir (no implementadas, a propósito)

- Traer la cotización del dólar desde una API en vez de una constante fija.
- Botón "Exportar catálogo a CSV" desde el panel admin.
- Descuento automático por volumen (ej. -10% desde 3 unidades).
- Autenticación real para `admin.html` (hoy cualquiera que tenga el link
  puede editar precios — está bien para una demo local, no para producción).
- Guardar el catálogo en un backend en vez de `localStorage`, para que los
  cambios se compartan entre dispositivos y no se pierdan al limpiar el
  navegador.
