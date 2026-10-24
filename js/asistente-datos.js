// Guion del asistente comercial: un árbol de preguntas fijas, sin inteligencia artificial externa.
// Cada paso guarda su respuesta en el campo "campo" de la línea (ver categorias.js).
// paso con "opciones" = botones; paso con "entrada" = el visitante escribe (puede omitir).
const servicios = (id) => CATEGORIAS.find((c) => c.id === id).servicios;

const ASISTENTE = {
  saludo:
    "Hola, soy el asistente de Mírate MYH. Te ayudo a armar tu consulta para cotizar por WhatsApp. ¿Qué necesitas?",
  cierreNotas: { campo: "notas", pregunta: "¿Quieres contarnos algo más? (opcional)", entrada: "text" },
  flujos: {
    sastreria: {
      intro: "Sastrería y trajes a la medida. Unas preguntas rápidas.",
      pasos: [
        { campo: "prenda", pregunta: "¿Qué necesitas?", opciones: servicios("sastreria") },
        { campo: "ocasion", pregunta: "¿Para qué ocasión es?", opciones: OCASIONES },
        { campo: "plazo", pregunta: "¿Para cuándo lo necesitas?", opciones: PLAZOS },
      ],
    },
    bodas: {
      intro: "Bodas. Unas preguntas rápidas.",
      pasos: [
        { campo: "prenda", pregunta: "¿Qué necesitas para la boda?", opciones: servicios("bodas") },
        { campo: "plazo", pregunta: "¿Para cuándo es la boda?", opciones: PLAZOS },
      ],
    },
    grados: {
      intro: "Grados y ceremonias. Unas preguntas rápidas.",
      pasos: [
        { campo: "prenda", pregunta: "¿Qué necesitas?", opciones: servicios("grados") },
        { campo: "plazo", pregunta: "¿Para cuándo es la ceremonia?", opciones: PLAZOS },
      ],
    },
    eventos: {
      intro: "Smoking y vestidos para eventos.",
      pasos: [
        { campo: "prenda", pregunta: "¿Qué buscas?", opciones: ["Smoking", "Vestido para evento"] },
        { campo: "modalidad", pregunta: "¿Alquiler o venta?", opciones: ["Alquiler", "Venta", "Aún no lo sé"] },
        { campo: "plazo", pregunta: "¿Para cuándo es el evento?", opciones: PLAZOS },
      ],
    },
    dotaciones: {
      intro: "Dotaciones empresariales.",
      pasos: [
        { campo: "tipo", pregunta: "¿Qué prendas o uniformes necesita tu equipo?", entrada: "text", requerido: true },
        { campo: "personas", pregunta: "¿Para cuántas personas?", opciones: ["1 a 10", "11 a 50", "Más de 50", "Aún no lo sé"] },
        { campo: "logo", pregunta: "¿Llevará logo o bordado?", opciones: ["Sí, con logo o bordado", "No", "Aún no lo sé"] },
        { campo: "plazo", pregunta: "¿Para cuándo lo necesitas?", opciones: PLAZOS },
      ],
    },
    ojales: {
      intro: "Máquinas de ojales: consulta referencias, características y disponibilidad por WhatsApp.",
      pasos: [
        { campo: "consulta", pregunta: "¿Qué quieres saber?", opciones: ["Referencias", "Características", "Disponibilidad", "Información y cotización"] },
      ],
    },
  },
};
