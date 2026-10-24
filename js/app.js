// Interfaz: menú, formularios por línea comercial, panel de consulta, asistente y botón de WhatsApp.
(function () {
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  function el(etiqueta, atributos = {}, ...hijos) {
    const nodo = document.createElement(etiqueta);
    Object.entries(atributos).forEach(([k, v]) => {
      if (k === "class") nodo.className = v;
      else if (k === "text") nodo.textContent = v;
      else if (v !== false && v != null) nodo.setAttribute(k, v === true ? "" : v);
    });
    nodo.append(...hijos);
    return nodo;
  }

  // ---------- Avisos ----------
  let temporizador;
  function aviso(texto) {
    const a = $("#aviso");
    a.textContent = texto; // se anuncia a los lectores de pantalla aunque no se muestre
    clearTimeout(temporizador);
    // Con un panel abierto el aviso taparía su contenido: el panel ya muestra el cambio.
    if ($(".panel.abierto")) {
      a.classList.remove("visible");
      return;
    }
    a.classList.add("visible");
    temporizador = setTimeout(() => a.classList.remove("visible"), 2600);
  }

  // ---------- Paneles laterales (consulta y asistente) ----------
  // Al abrir un panel el resto de la página queda inactiva (inert) y el foco entra en el panel;
  // al cerrarlo, el foco vuelve al botón que lo abrió.
  let origenFoco = null;
  const FONDO = "header, main, footer, .flotante, .saltar";
  const fondoInert = (valor) => $$(FONDO).forEach((e) => (e.inert = valor));

  function cerrarPaneles(devolverFoco = true) {
    const habiaAbierto = $(".panel.abierto");
    $$(".panel.abierto").forEach((p) => {
      p.classList.remove("abierto");
      p.inert = true;
    });
    $("#velo").hidden = true;
    fondoInert(false);
    if (devolverFoco && habiaAbierto && origenFoco && document.contains(origenFoco)) origenFoco.focus();
    origenFoco = null;
  }

  function abrirPanel(panel) {
    // Si se abre desde dentro de otro panel (por ejemplo, «Ver mi carrito» en el asistente),
    // se conserva el botón original de la página como destino al cerrar.
    const previo = origenFoco;
    const activo = document.activeElement;
    cerrarPaneles(false);
    const sinOrigenUtil = !activo || activo === document.body || activo.closest(".panel");
    origenFoco = sinOrigenUtil ? previo : activo;
    fondoInert(true);
    $("#aviso").classList.remove("visible");
    panel.inert = false;
    panel.classList.add("abierto");
    $("#velo").hidden = false;
    panel.querySelector("[data-foco]")?.focus();
  }

  function abrirConsulta() {
    renderConsulta();
    abrirPanel($("#consulta"));
  }

  function abrirAsistente() {
    abrirPanel($("#asistente"));
  }

  // ---------- Formulario por línea comercial ----------
  function abrirFormulario(idCategoria) {
    const cat = CATEGORIAS.find((c) => c.id === idCategoria);
    $("#modalTitulo").textContent = cat.titulo;
    $("#modalResumen").textContent = cat.resumen;
    const form = $("#formCategoria");
    form.replaceChildren();

    cat.campos.forEach((c) => {
      const id = `f-${c.id}`;
      let control;
      if (c.tipo === "select") {
        control = el("select", { id, name: c.id, required: !!c.requerido },
          el("option", { value: "", text: "Elige una opción" }),
          ...c.opciones.map((o) => el("option", { value: o, text: o })));
      } else if (c.tipo === "textarea") {
        control = el("textarea", { id, name: c.id, rows: 3, maxlength: 400 });
      } else {
        control = el("input", { id, name: c.id, type: c.tipo, maxlength: 120, min: c.tipo === "number" ? 1 : false });
      }
      form.append(el("div", { class: "campo" },
        el("label", { for: id, text: c.etiqueta + (c.requerido ? " *" : "") }), control,
        el("p", { class: "campo__error", id: `e-${c.id}`, hidden: true, text: "Completa este dato para continuar." })));
    });

    form.append(el("div", { class: "modal__acciones" },
      el("button", { class: "btn btn--primario", type: "submit", text: "Agregar al carrito" }),
      el("button", { class: "btn btn--secundario", type: "button", "data-cerrar-modal": true, text: "Cancelar" })));

    form.onsubmit = (e) => {
      e.preventDefault();
      const datos = {};
      let valido = true;
      cat.campos.forEach((c) => {
        const valor = form.elements[c.id].value.trim();
        const falta = c.requerido && !valor;
        $(`#e-${c.id}`).hidden = !falta;
        if (falta && valido) form.elements[c.id].focus();
        if (falta) valido = false;
        if (valor) datos[c.id] = valor;
      });
      if (!valido) return;
      Consulta.agregar(cat.id, datos);
      $("#modal").close();
      abrirConsulta();
    };
    $("#modal").showModal();
  }

  // ---------- Panel de consulta ----------
  const contacto = { nombre: "", ciudad: "" };

  function renderConsulta() {
    const lineas = Consulta.todas();
    const lista = $("#consultaLista");
    lista.replaceChildren();
    if (!lineas.length) {
      lista.append(el("p", { class: "panel__vacio", text: "Tu carrito está vacío. Elige un producto del catálogo, una línea o usa el asistente." }));
    }
    lineas.forEach((l) => {
      const r = Consulta.resumen(l);
      const subtotal = Consulta.subtotal(l);
      lista.append(el("article", { class: "linea" },
        el("div", { class: "linea__cuerpo" },
          el("p", { class: "linea__cat", text: r.categoria }),
          el("h3", { text: r.titulo }),
          el("ul", {}, ...r.detalles.map(([e, v]) => el("li", { text: `${e}: ${v}` }))),
          el("div", { class: "linea__cantidad" },
            el("button", { type: "button", "data-menos": l.id, "aria-label": `Quitar una unidad de ${r.titulo}`, disabled: l.cant <= 1, text: "−" }),
            el("span", { "aria-label": `Cantidad: ${l.cant}`, text: String(l.cant) }),
            el("button", { type: "button", "data-mas": l.id, "aria-label": `Agregar una unidad de ${r.titulo}`, text: "+" }),
            subtotal === null ? "" : el("strong", { class: "linea__subtotal", text: Consulta.formatoPrecio(subtotal) }))),
        el("button", { class: "linea__quitar", type: "button", "data-quitar": l.id,
          "aria-label": `Quitar ${r.titulo} del carrito`, text: "×" })));
    });
    const total = Consulta.total(lineas);
    $("#consultaTotal").hidden = total === null;
    if (total !== null) $("#consultaTotalValor").textContent = Consulta.formatoPrecio(total);
    $("#enviarConsulta").disabled = lineas.length === 0;
    $("#vaciarConsulta").hidden = lineas.length === 0;
    $("#consultaContacto").hidden = lineas.length === 0;
  }

  function actualizarContador() {
    const n = Consulta.cantidad();
    $("#contador").textContent = n;
    $("#contador").classList.toggle("visible", n > 0);
    $("#abrirConsulta").setAttribute("aria-label", n ? `Carrito, ${n} ${n === 1 ? "artículo" : "artículos"}` : "Carrito");
  }

  function enviarConsulta() {
    const lineas = Consulta.todas();
    if (!lineas.length) return;
    const url = Consulta.urlWhatsapp(Consulta.mensaje(lineas, contacto));
    window.open(url, "_blank", "noopener");
  }

  // ---------- Catálogo ----------
  function renderCatalogo() {
    const filtros = $("#catalogoFiltros");
    [{ id: "todos", corto: "Todo" }, ...CATEGORIAS].forEach((c, i) => {
      filtros.append(el("button", { class: "filtro", type: "button", "data-filtro": c.id,
        "aria-pressed": i === 0 ? "true" : "false", text: c.corto }));
    });

    const rejilla = $("#catalogoRejilla");
    CATALOGO.forEach((p) => {
      const visual = p.imagen
        ? el("img", { src: p.imagen, alt: p.alt, width: 720, height: 900, loading: "lazy" })
        : (() => {
            const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.setAttribute("class", "producto__icono");
            svg.setAttribute("aria-hidden", "true");
            const uso = document.createElementNS("http://www.w3.org/2000/svg", "use");
            uso.setAttribute("href", `#${p.icono}`);
            svg.append(uso);
            return svg;
          })();
      rejilla.append(el("article", { class: "producto", "data-cat": p.cat },
        el("div", { class: p.imagen ? "producto__imagen" : "producto__imagen producto__imagen--icono" },
          visual, p.etiqueta ? el("span", { class: "producto__etiqueta", text: p.etiqueta }) : ""),
        el("div", { class: "producto__info" },
          p.titulo ? "" : el("p", { class: "producto__cat", text: CATEGORIAS.find((c) => c.id === p.cat).corto }),
          el("h3", p.titulo ? { class: "producto__titulo", text: p.titulo } : { text: p.nombre }),
          p.subtitulo ? el("p", { class: "producto__sub", text: p.subtitulo }) : "",
          el("p", { class: "producto__desc", text: p.descripcion }),
          el("button", { class: "btn btn--primario", type: "button", "data-producto": p.id,
            "aria-label": `Agregar ${p.nombre} al carrito`, text: "Agregar al carrito" }))));
    });

    filtros.addEventListener("click", (e) => {
      const b = e.target.closest("[data-filtro]");
      if (!b) return;
      filtros.querySelectorAll("[data-filtro]").forEach((x) => x.setAttribute("aria-pressed", x === b));
      rejilla.querySelectorAll(".producto").forEach((t) => {
        t.hidden = b.dataset.filtro !== "todos" && t.dataset.cat !== b.dataset.filtro;
      });
    });
    rejilla.addEventListener("click", (e) => {
      const b = e.target.closest("[data-producto]");
      if (!b) return;
      const p = Consulta.agregarProducto(b.dataset.producto);
      if (p) aviso(`${p.nombre} agregado al carrito`);
    });
  }

  // ---------- Formulario Contáctenos ----------
  function iniciarContacto() {
    const form = $("#formContacto");
    const llenar = (select, lista, vacio) => {
      select.replaceChildren(el("option", { value: "", text: vacio }), ...lista.map((o) => el("option", { value: o, text: o })));
    };
    llenar(form.elements.tipo, Contacto.TIPOS, "Selecciona un tipo de solicitud");
    llenar(form.elements.linea, Contacto.LINEAS, "Selecciona una línea comercial");

    // El servicio específico depende de la línea elegida.
    const actualizarEspecifico = () => {
      const linea = form.elements.linea.value;
      const lista = Contacto.especificos(linea);
      const select = form.elements.especifico;
      const vacio = !linea ? "Primero elige una línea comercial"
        : lista.length ? "Sin especificar (opcional)" : "No aplica para esta opción";
      llenar(select, lista, vacio);
      select.disabled = lista.length === 0;
    };
    actualizarEspecifico();

    const CAMPOS = ["nombre", "telefono", "tipo", "linea", "especifico", "mensaje"];
    const marcar = (campo, texto) => {
      const error = $(`#ce-${campo}`);
      error.hidden = !texto;
      error.textContent = texto || "";
      form.elements[campo].setAttribute("aria-invalid", texto ? "true" : "false");
    };
    // Al corregir un campo se limpia su error.
    CAMPOS.forEach((c) => form.elements[c].addEventListener("input", () => marcar(c, "")));
    form.elements.linea.addEventListener("change", actualizarEspecifico);

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const datos = Object.fromEntries(CAMPOS.map((c) => [c, form.elements[c].value]));
      const errores = Contacto.validar(datos);
      CAMPOS.forEach((c) => marcar(c, errores[c]));
      const primero = CAMPOS.find((c) => errores[c]);
      $("#contactoEstado").hidden = true;
      if (primero) {
        form.elements[primero].focus();
        return;
      }
      const url = Contacto.url(datos);
      $("#contactoEnlace").href = url;
      $("#contactoEstado").hidden = false;
      window.open(url, "_blank", "noopener");
    });
  }

  // ---------- Botones flotantes en móvil ----------
  // En pantallas pequeñas se ocultan al bajar y en lo alto de la página (donde ya hay botones propios)
  // y reaparecen al subir, para no tapar el contenido. Con el teclado siempre se pueden alcanzar.
  function iniciarFlotantes() {
    let anterior = window.scrollY;
    const actualizar = () => {
      const y = window.scrollY;
      if (y < 300 || y > anterior + 8) document.body.classList.add("flotantes-ocultos");
      else if (y < anterior - 8) document.body.classList.remove("flotantes-ocultos");
      if (Math.abs(y - anterior) > 8) anterior = y;
    };
    window.addEventListener("scroll", actualizar, { passive: true });
    $$(".flotante").forEach((f) => f.addEventListener("focusin", () => document.body.classList.remove("flotantes-ocultos")));
    actualizar();
  }

  // ---------- WhatsApp flotante según la sección visible ----------
  function seguirSecciones() {
    const flotante = $("#waFlotante");
    flotante.href = Consulta.urlWhatsapp(CONFIG.saludoWhatsapp);
    if (!("IntersectionObserver" in window)) return;
    const observador = new IntersectionObserver((entradas) => {
      entradas.forEach((e) => {
        if (e.isIntersecting) flotante.href = Consulta.urlWhatsapp(e.target.dataset.wa);
      });
    }, { rootMargin: "-45% 0px -45% 0px" });
    $$("[data-wa]").forEach((s) => observador.observe(s));
  }

  // ---------- Inicio ----------
  function iniciar() {
    $("#anio").textContent = new Date().getFullYear();
    $$("[data-whatsapp]").forEach((a) => {
      a.href = Consulta.urlWhatsapp(CONFIG.saludoWhatsapp);
      a.target = "_blank";
      a.rel = "noopener";
    });
    $$("[data-instagram]").forEach((a) => {
      a.href = CONFIG.instagram;
      a.target = "_blank";
      a.rel = "noopener";
    });
    $$("[data-tel]").forEach((n) => (n.textContent = CONFIG.whatsappVisible));
    $$("[data-usuario-ig]").forEach((n) => (n.textContent = CONFIG.instagramUsuario));

    // Menú móvil
    const burger = $("#burger");
    burger.addEventListener("click", () => {
      const abierto = $("#menu").classList.toggle("abierto");
      burger.setAttribute("aria-expanded", abierto);
    });
    $$("#menu a").forEach((a) => a.addEventListener("click", () => {
      $("#menu").classList.remove("abierto");
      burger.setAttribute("aria-expanded", "false");
    }));

    // Líneas comerciales
    $$("[data-consultar]").forEach((b) => b.addEventListener("click", () => abrirFormulario(b.dataset.consultar)));
    $("#modal").addEventListener("click", (e) => {
      if (e.target === $("#modal") || e.target.closest("[data-cerrar-modal]")) $("#modal").close();
    });

    // Consulta
    $("#abrirConsulta").addEventListener("click", abrirConsulta);
    $("#consultaLista").addEventListener("click", (e) => {
      const b = e.target.closest("[data-quitar], [data-mas], [data-menos]");
      if (!b) return;
      const id = b.dataset.quitar || b.dataset.mas || b.dataset.menos;
      if (b.dataset.quitar) Consulta.quitar(id);
      if (b.dataset.mas) Consulta.cambiarCantidad(id, 1);
      if (b.dataset.menos) Consulta.cambiarCantidad(id, -1);
      // La lista se vuelve a dibujar: el foco se devuelve a un control equivalente para no perder el lugar.
      const siguiente = b.dataset.quitar
        ? $("#consultaLista .linea__quitar") || $("#consulta [data-foco]")
        : $(`#consultaLista [data-${b.dataset.mas ? "mas" : "menos"}="${id}"]:not(:disabled)`) ||
          $(`#consultaLista [data-mas="${id}"]`);
      siguiente?.focus();
    });
    $("#vaciarConsulta").addEventListener("click", () => {
      Consulta.vaciar();
      $("#consulta [data-foco]")?.focus(); // el botón «Vaciar» se oculta: el foco pasa al botón de cerrar
    });
    $("#enviarConsulta").addEventListener("click", enviarConsulta);
    $("#contactoNombre").addEventListener("input", (e) => (contacto.nombre = e.target.value));
    $("#contactoCiudad").addEventListener("input", (e) => (contacto.ciudad = e.target.value));
    Consulta.alCambiar(() => {
      actualizarContador();
      renderConsulta();
    });

    // Asistente
    Asistente.iniciar({
      log: $("#asistenteLog"),
      opciones: $("#asistenteOpciones"),
      form: $("#asistenteForm"),
      input: $("#asistenteEntrada"),
      omitir: $("#asistenteOmitir"),
      alAbrirConsulta: abrirConsulta,
    });
    $$("[data-abrir-asistente]").forEach((b) => b.addEventListener("click", abrirAsistente));
    $("#reiniciarAsistente").addEventListener("click", () => Asistente.reiniciar());

    // Cierre de paneles
    $$("[data-cerrar-panel]").forEach((b) => b.addEventListener("click", cerrarPaneles));
    $("#velo").addEventListener("click", cerrarPaneles);
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      if ($(".panel.abierto")) cerrarPaneles();
      else if ($("#menu").classList.contains("abierto")) {
        $("#menu").classList.remove("abierto");
        burger.setAttribute("aria-expanded", "false");
        burger.focus();
      }
    });

    renderCatalogo();
    iniciarContacto();
    actualizarContador();
    renderConsulta();
    seguirSecciones();
    iniciarFlotantes();
  }

  iniciar();
})();
