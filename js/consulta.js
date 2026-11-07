// Carrito de consulta: guarda las líneas en el navegador y arma la solicitud para WhatsApp.
// No procesa pagos. Los subtotales solo existen si el producto del catálogo tiene un precio real.
const Consulta = (() => {
  const CLAVE = "mirate-consulta";
  const MAX_TEXTO = 400;
  const MAX_CANT = 99;
  const oyentes = [];
  let lineas = [];

  // Nombres breves de los campos para el resumen y el mensaje de WhatsApp.
  const ETIQUETAS_CORTAS = {
    ocasion: "Ocasión", plazo: "Plazo", fecha: "Fecha del evento", detalle: "Color, tela o estilo",
    notas: "Notas", talla: "Talla aproximada", personas: "Personas", logo: "Logo o bordado",
    empresa: "Empresa", consulta: "Consulta",
  };

  const categoria = (id) => CATEGORIAS.find((c) => c.id === id);
  const producto = (id) => CATALOGO.find((p) => p.id === id);
  const entero = (n) => Math.min(MAX_CANT, Math.max(1, Number.parseInt(n, 10) || 1));

  // Deja solo campos conocidos y textos cortos: lo guardado en el navegador no es de fiar.
  function limpiar(l) {
    const cat = l && categoria(l.cat);
    if (!cat || typeof l.id !== "string" || !l.datos || typeof l.datos !== "object") return null;
    const datos = {};
    cat.campos.forEach((c) => {
      const v = l.datos[c.id];
      if ((typeof v === "string" || typeof v === "number") && String(v).trim()) {
        datos[c.id] = String(v).trim().slice(0, MAX_TEXTO);
      }
    });
    const prod = l.producto && producto(l.producto);
    return { id: l.id.slice(0, 40), cat: cat.id, producto: prod ? prod.id : null, cant: entero(l.cant), datos };
  }

  function cargar() {
    try {
      const guardado = JSON.parse(localStorage.getItem(CLAVE) || "[]");
      return Array.isArray(guardado) ? guardado.map(limpiar).filter(Boolean) : [];
    } catch {
      return [];
    }
  }

  // Se restaura aquí, después de declarar las constantes que usa limpiar().
  lineas = cargar();

  function cambiar() {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(lineas));
    } catch {
      // Sin almacenamiento: el carrito vive solo durante esta visita.
    }
    oyentes.forEach((f) => f(lineas));
  }

  const nuevoId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

  // Línea armada con un formulario o con el asistente.
  function agregar(cat, datos) {
    const linea = limpiar({ id: nuevoId(), cat, datos, cant: 1 });
    if (!linea) return null;
    lineas.push(linea);
    cambiar();
    return linea;
  }

  // Tarjeta del catálogo: si ya está en el carrito, suma una unidad.
  function agregarProducto(idProducto) {
    const prod = producto(idProducto);
    if (!prod) return null;
    const existente = lineas.find((l) => l.producto === prod.id);
    if (existente) existente.cant = entero(existente.cant + 1);
    else lineas.push(limpiar({ id: nuevoId(), cat: prod.cat, producto: prod.id, cant: 1, datos: prod.datos }));
    cambiar();
    return prod;
  }

  function cambiarCantidad(id, delta) {
    const l = lineas.find((x) => x.id === id);
    if (!l) return;
    l.cant = entero(l.cant + delta);
    cambiar();
  }

  function quitar(id) {
    lineas = lineas.filter((l) => l.id !== id);
    cambiar();
  }

  function vaciar() {
    lineas = [];
    cambiar();
  }

  const precioUnidad = (l) => {
    const p = l.producto && producto(l.producto);
    return p && Number.isFinite(p.precio) ? p.precio : null;
  };

  // Subtotal de una línea, o null si no tiene precio real.
  const subtotal = (l) => (precioUnidad(l) === null ? null : precioUnidad(l) * l.cant);

  // Total solo si todas las líneas tienen precio real.
  function total(lista = lineas) {
    if (!lista.length || lista.some((l) => subtotal(l) === null)) return null;
    return lista.reduce((suma, l) => suma + subtotal(l), 0);
  }

  const formatoPrecio = (n) =>
    new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);

  // Título y detalles legibles de una línea.
  function resumen(l) {
    const cat = categoria(l.cat);
    const prod = l.producto && producto(l.producto);
    const detalles = cat.campos
      .filter((c) => !cat.enTitulo.includes(c.id) && l.datos[c.id])
      .map((c) => [ETIQUETAS_CORTAS[c.id] || c.etiqueta, l.datos[c.id]]);
    return { categoria: cat.corto, titulo: prod ? prod.nombre : cat.titulo_linea(l.datos), detalles };
  }

  function mensaje(lista, contacto = {}) {
    const nombre = (contacto.nombre || "").trim();
    const ciudad = (contacto.ciudad || "").trim();
    const texto = [
      `${nombre ? `Hola, soy ${nombre}.` : "Hola."} Quiero solicitar una cotización en ${CONFIG.nombre}:`,
      "",
    ];
    lista.forEach((l, i) => {
      const r = resumen(l);
      // Si la línea y el producto se llaman igual, el nombre va una sola vez.
      const nombre = r.categoria === r.titulo ? r.titulo : `${r.categoria}: ${r.titulo}`;
      texto.push(`${i + 1}. ${nombre} — Cantidad: ${l.cant || 1}`);
      if (precioUnidad(l) !== null) texto.push(`   - Precio por unidad: ${formatoPrecio(precioUnidad(l))}`);
      r.detalles.forEach(([etiqueta, valor]) => texto.push(`   - ${etiqueta}: ${valor}`));
      texto.push("");
    });
    const suma = total(lista);
    if (suma !== null) texto.push(`Total estimado: ${formatoPrecio(suma)}`, "");
    if (ciudad) texto.push(`Mi ciudad: ${ciudad}`);
    texto.push("¿Me confirman precios y disponibilidad? Gracias.");
    return texto.join("\n");
  }

  const urlWhatsapp = (texto) => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(texto)}`;

  return {
    todas: () => lineas.slice(),
    cantidad: () => lineas.reduce((suma, l) => suma + l.cant, 0),
    agregar, agregarProducto, cambiarCantidad, quitar, vaciar,
    resumen, subtotal, total, formatoPrecio, mensaje, urlWhatsapp,
    alCambiar: (f) => oyentes.push(f),
  };
})();
