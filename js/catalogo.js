// Tarjetas del catálogo. Cada una se agrega al carrito de consulta (consulta.js).
// No inventes datos: sin precio no hay subtotal y la cotización se pide por WhatsApp.
//   cat:    id de una categoría (categorias.js)
//   imagen: ruta de una pieza o foto con autorización confirmada; sin imagen se usa el ícono
//   icono:  símbolo del sprite de index.html (solo si no hay imagen)
//   datos:  respuestas ya conocidas de esa categoría
//   titulo / subtitulo: (opcionales) la tarjeta muestra el título grande y el subtítulo debajo; `nombre` sigue siendo el nombre en el carrito
//   precio: (opcional) número en COP. Solo agrégalo si el precio es real y está confirmado.
const CATALOGO = [
  {
    id: "traje-a-la-medida",
    cat: "sastreria",
    nombre: "Trajes a la medida",
    descripcion: "Trajes diseñados sobre tus medidas para tu ocasión. Cuéntanos el estilo que imaginas y lo cotizamos por WhatsApp.",
    imagen: "img/catalogo/traje-a-la-medida.jpg",
    alt: "Traje gris de tres piezas con corbata roja sobre un maniquí, con fondo de madera oscura. Texto: Moda Mírate MYH.",
    etiqueta: "Referencia visual",
    datos: { prenda: "Trajes a la medida" },
  },
  {
    id: "bodas",
    cat: "bodas",
    nombre: "Vestuario para bodas",
    titulo: "Bodas",
    subtitulo: "Vestuario para bodas",
    descripcion: "Vestuario para novios, trajes y smoking para bodas, y asesoría para ocasiones matrimoniales. Cuéntanos tu fecha y te cotizamos por WhatsApp.",
    icono: "i-bodas",
    datos: { prenda: "Vestuario para novios" },
  },
  {
    id: "grados-ceremonias",
    cat: "grados",
    nombre: "Grados y ceremonias",
    descripcion: "Vestuario formal para grados y prendas para ceremonias y ocasiones especiales. Indícanos la fecha y te cotizamos por WhatsApp.",
    icono: "i-grados",
    datos: { prenda: "Vestuario formal para grados" },
  },
  {
    id: "smoking-negro",
    cat: "eventos",
    nombre: "Smoking negro",
    descripcion: "Smoking con solapa y corbatín para bodas y eventos de gala. Consulta alquiler o venta para tu fecha.",
    imagen: "img/catalogo/smoking-negro.jpg",
    alt: "Smoking negro con corbatín y solapa de contraste sobre un maniquí, con fondo de madera oscura. Texto: Moda Mírate MYH.",
    etiqueta: "Referencia visual",
    datos: { prenda: "Smoking" },
  },
  {
    id: "smoking-marfil",
    cat: "eventos",
    nombre: "Smoking marfil",
    descripcion: "Saco marfil con solapa negra, chaleco cruzado y corbatín. Consulta si está disponible en alquiler o venta para tu fecha.",
    imagen: "img/catalogo/smoking-marfil.jpg",
    alt: "Smoking marfil con solapa negra, chaleco cruzado y corbatín sobre un maniquí, en una biblioteca de madera. Texto: Moda Mírate MYH.",
    etiqueta: "Referencia visual",
    datos: { prenda: "Smoking" },
  },
  {
    id: "vestidos-evento",
    cat: "eventos",
    nombre: "Vestidos para eventos",
    descripcion: "Vestidos para bodas, galas y celebraciones. Cuéntanos tu ocasión y tu fecha para cotizar el alquiler o la compra.",
    icono: "i-vestido",
    datos: { prenda: "Vestido para evento" },
  },
  {
    id: "dotaciones",
    cat: "dotaciones",
    nombre: "Dotaciones empresariales",
    descripcion: "Prendas para el equipo de tu empresa. Indícanos qué necesitas y para cuántas personas, y te cotizamos.",
    icono: "i-dotaciones",
    datos: {},
  },
  {
    id: "maquinas-ojales",
    cat: "ojales",
    nombre: "Máquinas de ojales",
    descripcion: "Consulta disponibilidad y referencias por WhatsApp.",
    icono: "i-ojales",
    datos: {},
  },
];
