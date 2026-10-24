// Motor del asistente comercial: recorre el guion de asistente-datos.js y arma una línea de consulta.
const Asistente = (() => {
  let ui;
  let estado;

  const el = (etiqueta, clase, texto) => {
    const nodo = document.createElement(etiqueta);
    if (clase) nodo.className = clase;
    if (texto !== undefined) nodo.textContent = texto;
    return nodo;
  };

  function burbuja(quien, texto) {
    const b = el("div", `burbuja burbuja--${quien}`, texto);
    ui.log.append(b);
    ui.log.scrollTop = ui.log.scrollHeight;
    return b;
  }

  // Los controles cambian la altura del registro: se vuelve al final cuando ya se acomodaron.
  const alFinal = () => requestAnimationFrame(() => (ui.log.scrollTop = ui.log.scrollHeight));

  function limpiarControles() {
    ui.opciones.replaceChildren();
    ui.form.hidden = true;
    ui.input.value = "";
  }

  // opciones: [{ etiqueta, accion } | { etiqueta, enlace }]
  function mostrarOpciones(opciones) {
    limpiarControles();
    opciones.forEach((o) => {
      const b = o.enlace ? el("a", "chip-asistente", o.etiqueta) : el("button", "chip-asistente", o.etiqueta);
      if (o.enlace) {
        b.href = o.enlace;
        b.target = "_blank";
        b.rel = "noopener";
      } else {
        b.type = "button";
        b.addEventListener("click", o.accion);
      }
      ui.opciones.append(b);
    });
    // Con el asistente abierto, el foco pasa a la primera opción nueva (los botones anteriores ya no existen).
    if (ui.opciones.closest(".panel.abierto")) ui.opciones.firstElementChild?.focus();
    alFinal();
  }

  function pedirTexto(paso, alEnviar) {
    limpiarControles();
    ui.form.hidden = false;
    ui.input.type = paso.entrada === "number" ? "number" : "text";
    ui.input.placeholder = "Escribe aquí…";
    ui.input.required = !!paso.requerido;
    ui.omitir.hidden = !!paso.requerido;
    ui.form.onsubmit = (e) => {
      e.preventDefault();
      const valor = ui.input.value.trim();
      if (paso.requerido && !valor) return;
      if (valor) burbuja("usuario", valor);
      alEnviar(valor);
    };
    ui.omitir.onclick = () => {
      burbuja("usuario", "Omitir");
      alEnviar("");
    };
    ui.input.focus();
    alFinal();
  }

  function inicio() {
    estado = { cat: null, paso: 0, datos: {} };
    ui.log.replaceChildren();
    burbuja("bot", ASISTENTE.saludo);
    menuPrincipal();
  }

  function menuPrincipal() {
    mostrarOpciones([
      ...CATEGORIAS.map((c) => ({ etiqueta: c.titulo, accion: () => elegir(c.id) })),
      { etiqueta: "Hablar directamente por WhatsApp", enlace: Consulta.urlWhatsapp(CONFIG.saludoWhatsapp) },
    ]);
  }

  function elegir(id) {
    const cat = CATEGORIAS.find((c) => c.id === id);
    estado = { cat: id, paso: 0, datos: { ...(ASISTENTE.flujos[id].fijos || {}) } };
    burbuja("usuario", cat.titulo);
    burbuja("bot", ASISTENTE.flujos[id].intro);
    siguiente();
  }

  function siguiente() {
    const flujo = ASISTENTE.flujos[estado.cat];
    const paso = flujo.pasos[estado.paso] || (estado.paso === flujo.pasos.length ? ASISTENTE.cierreNotas : null);
    if (!paso) return resumen();
    burbuja("bot", paso.pregunta);
    const avanzar = (valor) => {
      if (valor) estado.datos[paso.campo] = valor;
      estado.paso += 1;
      siguiente();
    };
    if (paso.opciones) {
      mostrarOpciones(paso.opciones.map((o) => ({
        etiqueta: o,
        accion: () => {
          burbuja("usuario", o);
          avanzar(o);
        },
      })));
      ui.opciones.querySelector("button")?.focus();
    } else {
      pedirTexto(paso, avanzar);
    }
  }

  function resumen() {
    const linea = { cat: estado.cat, datos: estado.datos };
    const r = Consulta.resumen(linea);
    const texto = [`${r.categoria}: ${r.titulo}`, ...r.detalles.map(([e, v]) => `• ${e}: ${v}`)].join("\n");
    burbuja("bot", "Este es el resumen de tu consulta:");
    burbuja("resumen", texto);
    mostrarOpciones([
      {
        etiqueta: "Agregar a mi carrito",
        accion: () => {
          Consulta.agregar(estado.cat, estado.datos);
          burbuja("bot", "Listo, lo agregué a tu carrito. Puedes revisarlo o sumar otra cosa.");
          mostrarOpciones([
            { etiqueta: "Ver mi carrito", accion: () => ui.alAbrirConsulta() },
            { etiqueta: "Agregar otra cosa", accion: () => { burbuja("bot", "¿Qué más necesitas?"); menuPrincipal(); } },
          ]);
        },
      },
      {
        etiqueta: "Enviar solo esto por WhatsApp",
        enlace: Consulta.urlWhatsapp(Consulta.mensaje([{ id: "x", ...linea }])),
      },
      { etiqueta: "Empezar de nuevo", accion: inicio },
    ]);
  }

  // elementos: { log, opciones, form, input, omitir, alAbrirConsulta }
  function iniciar(elementos) {
    ui = elementos;
    inicio();
  }

  return { iniciar, reiniciar: inicio };
})();
