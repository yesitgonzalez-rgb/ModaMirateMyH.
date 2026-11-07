# Mírate MYH — Trajes a la medida (demostración)

Versión de demostración de la página comercial de Mírate MYH. Es un sitio estático (HTML, CSS y JavaScript, sin dependencias ni paso de construcción). **No es la publicación oficial**: está pensada para revisión interna y no debe indexarse (ver `vercel.json`).

## Contenido

- `index.html`: página principal.
- `css/estilos.css`: estilos.
- `js/`: datos comerciales (`config.js`), líneas (`categorias.js`), catálogo (`catalogo.js`), carrito de consulta, formulario «Contáctenos» y asistente.
- `img/`: logo, portada, piezas de marca y fotografías de referencia con autorización confirmada.

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

Esta demostración solo incluye imágenes con autorización confirmada. El 2026-11-06 el cliente autorizó la publicación de las fotografías de referencia que estaban pendientes; desde entonces las tarjetas **Bodas** (`bodas-referencia.jpg`), **Ceremonias especiales** (`grados-ceremonias.jpg`) y **Vestidos para eventos** (`vestidos-eventos.jpg`) muestran foto. La foto de **Ceremonias especiales** es una escena de gala y no se presenta como una foto de grados; la tarjeta **Grados y ceremonias** sigue con ícono hasta tener una foto real de grados. Las imágenes de referencia son ilustrativas y no garantizan disponibilidad de una prenda.

## Datos del negocio

Los datos comerciales (nombre, WhatsApp, Instagram) están en `js/config.js`. No se publican dirección, correo ni precios mientras no estén confirmados.

## Pendientes antes de una publicación oficial

- Confirmar dirección y correo, si se van a publicar.
- Confirmar el logo definitivo.
- Revisión de privacidad y de las tipografías (se cargan desde Google Fonts).
- Fotografías propias o con licencia para las tarjetas que hoy usan ícono (grados, dotaciones y máquinas de ojales).
- Dominio, `canonical`, `sitemap.xml`, `robots.txt` y la imagen para redes sociales.
