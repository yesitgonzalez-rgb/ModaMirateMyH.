// Las 6 líneas comerciales, en su orden oficial, y los datos que se piden en cada consulta.
// "servicios" es la lista oficial de cada línea: se muestra en la tarjeta de la línea, en el
// formulario Contáctenos y, cuando aplica, en el formulario de consulta.
// No hay precios ni existencias: se confirman por WhatsApp.
// tipo de campo: "select" | "text" | "textarea" | "date"
// enTitulo: campos que ya aparecen en el título de la línea (no se repiten en el detalle).
const PLAZOS = ["Menos de 1 mes", "Entre 1 y 3 meses", "Más de 3 meses", "Aún sin fecha"];
const OCASIONES = ["Boda", "Grado", "Evento corporativo", "Gala o evento social", "Otra"];

const CATEGORIAS = [
  {
    id: "sastreria",
    numero: "01",
    corto: "Sastrería",
    titulo: "Sastrería y trajes a la medida",
    resumen: "Cuéntanos qué necesitas y para cuándo.",
    servicios: ["Trajes a la medida", "Asesoría para prendas personalizadas"],
    enTitulo: ["prenda"],
    titulo_linea: (r) => r.prenda || "Trajes a la medida",
    campos: [
      { id: "prenda", etiqueta: "¿Qué necesitas?", tipo: "select", requerido: true, opciones: "servicios" },
      { id: "ocasion", etiqueta: "Ocasión", tipo: "select", opciones: OCASIONES },
      { id: "plazo", etiqueta: "¿Para cuándo lo necesitas?", tipo: "select", opciones: PLAZOS },
      { id: "fecha", etiqueta: "Fecha del evento (si ya la tienes)", tipo: "date" },
      { id: "detalle", etiqueta: "Color, tela o estilo que tienes en mente", tipo: "text" },
      { id: "notas", etiqueta: "Algo más que quieras contarnos", tipo: "textarea" },
    ],
  },
  {
    id: "bodas",
    numero: "02",
    corto: "Bodas",
    titulo: "Bodas",
    resumen: "Cuéntanos la fecha de tu boda y el estilo que imaginas.",
    servicios: ["Vestuario para novios", "Trajes y smoking para bodas", "Asesoría para ocasiones matrimoniales"],
    enTitulo: ["prenda"],
    titulo_linea: (r) => r.prenda || "Vestuario para bodas",
    campos: [
      { id: "prenda", etiqueta: "¿Qué necesitas?", tipo: "select", requerido: true, opciones: "servicios" },
      { id: "plazo", etiqueta: "¿Para cuándo es la boda?", tipo: "select", opciones: PLAZOS },
      { id: "fecha", etiqueta: "Fecha de la boda (si ya la tienes)", tipo: "date" },
      { id: "detalle", etiqueta: "Colores o estilo que tienes en mente", tipo: "text" },
      { id: "notas", etiqueta: "Algo más que quieras contarnos", tipo: "textarea" },
    ],
  },
  {
    id: "grados",
    numero: "03",
    corto: "Grados y ceremonias",
    titulo: "Grados y ceremonias",
    resumen: "Cuéntanos qué ceremonia es y para cuándo.",
    servicios: ["Vestuario formal para grados", "Prendas para ceremonias y ocasiones especiales"],
    enTitulo: ["prenda"],
    titulo_linea: (r) => r.prenda || "Vestuario para grados y ceremonias",
    campos: [
      { id: "prenda", etiqueta: "¿Qué necesitas?", tipo: "select", requerido: true, opciones: "servicios" },
      { id: "plazo", etiqueta: "¿Para cuándo es la ceremonia?", tipo: "select", opciones: PLAZOS },
      { id: "fecha", etiqueta: "Fecha de la ceremonia (si ya la tienes)", tipo: "date" },
      { id: "talla", etiqueta: "Talla aproximada (opcional)", tipo: "text" },
      { id: "notas", etiqueta: "Algo más que quieras contarnos", tipo: "textarea" },
    ],
  },
  {
    id: "eventos",
    numero: "04",
    corto: "Smoking y vestidos",
    titulo: "Smoking y vestidos para eventos",
    resumen: "Indica si buscas smoking o vestido, y si prefieres alquiler o venta.",
    servicios: [
      "Smoking — alquiler",
      "Smoking — venta",
      "Vestidos para eventos — alquiler",
      "Vestidos para eventos — venta",
    ],
    enTitulo: ["prenda", "modalidad"],
    titulo_linea: (r) => [r.prenda, r.modalidad].filter(Boolean).join(" · ") || "Smoking o vestido",
    campos: [
      { id: "prenda", etiqueta: "¿Qué buscas?", tipo: "select", requerido: true, opciones: ["Smoking", "Vestido para evento"] },
      { id: "modalidad", etiqueta: "Alquiler o venta", tipo: "select", requerido: true, opciones: ["Alquiler", "Venta", "Aún no lo sé"] },
      { id: "ocasion", etiqueta: "Ocasión", tipo: "select", opciones: OCASIONES },
      { id: "plazo", etiqueta: "¿Para cuándo lo necesitas?", tipo: "select", opciones: PLAZOS },
      { id: "fecha", etiqueta: "Fecha del evento (si ya la tienes)", tipo: "date" },
      { id: "talla", etiqueta: "Talla aproximada (opcional)", tipo: "text" },
      { id: "notas", etiqueta: "Algo más que quieras contarnos", tipo: "textarea" },
    ],
  },
  {
    id: "dotaciones",
    numero: "05",
    corto: "Dotaciones",
    titulo: "Dotaciones empresariales",
    resumen: "Dinos qué necesita tu equipo y cuántas personas son.",
    servicios: ["Soluciones de vestuario para empresas", "Solicitudes de información y cotización empresarial"],
    enTitulo: ["tipo"],
    titulo_linea: (r) => r.tipo || "Dotación empresarial",
    campos: [
      { id: "tipo", etiqueta: "¿Qué prendas o uniformes necesitas?", tipo: "text", requerido: true },
      { id: "personas", etiqueta: "¿Para cuántas personas?", tipo: "select", opciones: ["1 a 10", "11 a 50", "Más de 50", "Aún no lo sé"] },
      { id: "logo", etiqueta: "¿Llevará logo o bordado?", tipo: "select", opciones: ["Sí, con logo o bordado", "No", "Aún no lo sé"] },
      { id: "plazo", etiqueta: "¿Para cuándo lo necesitas?", tipo: "select", opciones: PLAZOS },
      { id: "empresa", etiqueta: "Empresa (opcional)", tipo: "text" },
      { id: "notas", etiqueta: "Algo más que quieras contarnos", tipo: "textarea" },
    ],
  },
  {
    id: "ojales",
    numero: "06",
    corto: "Máquinas de ojales",
    titulo: "Máquinas de ojales",
    resumen: "Consulta referencias, características y disponibilidad por WhatsApp.",
    servicios: [
      "Consultas sobre referencias, características y disponibilidad",
      "Solicitudes de información y cotización por WhatsApp",
    ],
    enTitulo: [],
    titulo_linea: () => "Máquinas de ojales",
    campos: [
      { id: "consulta", etiqueta: "¿Qué quieres saber?", tipo: "select", requerido: true,
        opciones: ["Referencias", "Características", "Disponibilidad", "Información y cotización"] },
      { id: "notas", etiqueta: "Algo más que quieras contarnos", tipo: "textarea" },
    ],
  },
];

// opciones: "servicios" significa "usa la lista oficial de la línea".
CATEGORIAS.forEach((c) =>
  c.campos.forEach((campo) => {
    if (campo.opciones === "servicios") campo.opciones = c.servicios;
  })
);
