# Mírate MYH — Trajes a la medida (demostración)

Versión de demostración de la página comercial de Mírate MYH. Es un sitio estático (HTML, CSS y JavaScript, sin dependencias ni paso de construcción). **No es la publicación oficial**: está pensada para revisión interna y no debe indexarse (ver `vercel.json`).

## Contenido

- `index.html`: página principal.
- `css/estilos.css`: estilos.
- `js/`: datos comerciales (`config.js`), líneas (`categorias.js`), catálogo (`catalogo.js`), carrito de consulta, formulario «Contáctenos» y asistente.
- `img/`: logo, portada y piezas de marca con autorización confirmada.

## Cómo verla

Abre `index.html` en el navegador, o sirve la carpeta con cualquier servidor estático, por ejemplo:

```
python -m http.server 8000
```

y entra a `http://localhost:8000/`.

## Qué incluye

- Seis líneas comerciales y catálogo con filtros.
- Carrito de consulta: arma el mensaje y abre WhatsApp. No hay pagos en línea ni precios publicados.
- Formulario «Contáctenos» y asistente de ayuda con reglas fijas; ningún dato se envía a un servidor propio.

## Fotografías

Esta demostración solo incluye imágenes con autorización confirmada. Las tarjetas **Bodas**, **Grados y ceremonias** y **Vestidos para eventos** muestran un ícono hasta que haya fotografías con permiso de uso. Las imágenes de referencia son ilustrativas y no garantizan disponibilidad de una prenda.

## Datos del negocio

Los datos comerciales (nombre, WhatsApp, Instagram) están en `js/config.js`. No se publican dirección, correo ni precios mientras no estén confirmados.

## Pendientes antes de una publicación oficial

- Confirmar dirección y correo, si se van a publicar.
- Confirmar el logo definitivo.
- Revisión de privacidad y de las tipografías (se cargan desde Google Fonts).
- Fotografías propias o con licencia para las tarjetas que hoy usan ícono.
- Dominio, `canonical`, `sitemap.xml`, `robots.txt` y la imagen para redes sociales.
