// Formulario "Contáctenos": valida los datos y prepara el mensaje para WhatsApp.
// No guarda nada ni lo envía a ningún servidor: todo ocurre en el navegador del visitante.
// Las líneas y sus servicios específicos salen de categorias.js (una sola fuente).
const Contacto = (() => {
  const TIPOS = ["Información general", "Cotización", "Realizar un pedido", "Consulta de alquiler", "Dotación empresarial"];
  const OTRO = "Otro servicio o consulta";
  const LINEAS = [...CATEGORIAS.map((c) => c.titulo), OTRO];
  const MAX = { nombre: 80, telefono: 25, mensaje: 600 };

  // Servicios específicos de una línea ([] si no hay línea o es "Otro").
  const especificos = (linea) => (CATEGORIAS.find((c) => c.titulo === linea) || { servicios: [] }).servicios;

  const linea = (v, max) => String(v ?? "").replace(/\s+/g, " ").trim().slice(0, max);
  const parrafo = (v, max) =>
    String(v ?? "").replace(/\r\n?/g, "\n").replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim().slice(0, max);

  // Devuelve los datos ya limpios.
  function limpiar(d = {}) {
    return {
      nombre: linea(d.nombre, MAX.nombre),
      telefono: linea(d.telefono, MAX.telefono),
      tipo: String(d.tipo ?? ""),
      linea: String(d.linea ?? ""),
      especifico: String(d.especifico ?? ""),
      mensaje: parrafo(d.mensaje, MAX.mensaje),
    };
  }

  // Devuelve { campo: texto del error }. Vacío = datos válidos.
  function validar(datos) {
    const d = limpiar(datos);
    const errores = {};
    if (d.nombre.length < 2) errores.nombre = "Escribe tu nombre para que sepamos cómo llamarte.";
    if (d.telefono) {
      const digitos = d.telefono.replace(/\D/g, "");
      if (!/^[+\d\s().-]+$/.test(d.telefono) || digitos.length < 7 || digitos.length > 15) {
        errores.telefono = "Escribe un teléfono válido, con 7 a 15 dígitos, o déjalo en blanco.";
      }
    }
    if (!TIPOS.includes(d.tipo)) errores.tipo = "Selecciona un tipo de solicitud.";
    if (!LINEAS.includes(d.linea)) errores.linea = "Selecciona una línea comercial.";
    else if (d.especifico && !especificos(d.linea).includes(d.especifico)) {
      errores.especifico = "Elige una opción de la lista o déjalo sin seleccionar.";
    }
    if (d.linea === OTRO && !d.mensaje) errores.mensaje = "Cuéntanos tu consulta en el mensaje.";
    return errores;
  }

  function mensaje(datos) {
    const d = limpiar(datos);
    const texto = [`Hola, soy ${d.nombre}. Les escribo desde la página de ${CONFIG.nombre}.`];
    if (d.telefono) texto.push(`Mi teléfono: ${d.telefono}`);
    texto.push("", `Tipo de solicitud: ${d.tipo}`, `Línea comercial: ${d.linea}`);
    if (d.especifico) texto.push(`Producto o servicio específico: ${d.especifico}`);
    if (d.mensaje) texto.push("", "Mensaje:", d.mensaje);
    return texto.join("\n");
  }

  return {
    TIPOS, LINEAS, OTRO, especificos, limpiar, validar, mensaje,
    url: (datos) => Consulta.urlWhatsapp(mensaje(datos)),
  };
})();
