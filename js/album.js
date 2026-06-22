/**
 * album.js
 * -----------------------------------------------------------------------
 * Construye y actualiza el DOM del álbum a partir de:
 *   - ALBUM_DATA (data.js)         -> qué cromos existen
 *   - AlbumPages.construirHojas()  -> cómo se agrupan en hojas
 *   - AlbumStorage                 -> qué cromos ya pegó el usuario activo
 *
 * No hay ningún país, jugador o número de slot escrito a mano en este
 * archivo: todo nace de iterar sobre los datos. Si data.js cambia,
 * el álbum se reconstruye solo, con el número de hojas que corresponda.
 */

const Album = (() => {
  let hojas = [];
  let indiceActual = 0;
  let usuarioId = null;

  const $book = document.getElementById("am-book");
  const $dots = document.getElementById("am-dots");
  const $prev = document.getElementById("am-page-prev");
  const $next = document.getElementById("am-page-next");
  const $progressFill = document.getElementById("am-progress-fill");
  const $progressLabel = document.getElementById("am-progress-label");

  // Pequeñas inclinaciones fijas (no aleatorias en cada render) para que
  // cada cromo "se vea pegado a mano" sin que tiemble al re-renderizar.
  const TILTS = [-3, 2, -1.5, 3.5, -2.5, 1, -4, 2.5];
  function tiltPara(cromoId) {
    let hash = 0;
    for (let i = 0; i < cromoId.length; i++) hash = (hash * 31 + cromoId.charCodeAt(i)) >>> 0;
    return TILTS[hash % TILTS.length];
  }

  function iniciar(usuario) {
    usuarioId = usuario;
    hojas = window.AlbumPages.construirHojas(window.ALBUM_DATA);
    indiceActual = -1; // fuerza a que la primera llamada a irAHoja(0) sí pinte los estados
    renderHojas();
    renderDots();
    actualizarProgreso();
    irAHoja(0);

    $prev.addEventListener("click", () => irAHoja(indiceActual - 1));
    $next.addEventListener("click", () => irAHoja(indiceActual + 1));
    document.addEventListener("keydown", (e) => {
      if (document.getElementById("am-app").classList.contains("tw-hidden")) return;
      if (e.key === "ArrowLeft") irAHoja(indiceActual - 1);
      if (e.key === "ArrowRight") irAHoja(indiceActual + 1);
    });
  }

  function numeroGlobal(hojaIdx, posicionEnHoja) {
    let n = 0;
    for (let i = 0; i < hojaIdx; i++) n += hojas[i].cromos.length;
    return n + posicionEnHoja + 1;
  }

  function renderHojas() {
    $book.innerHTML = "";
    hojas.forEach((hoja, hojaIdx) => {
      const $sheet = document.createElement("section");
      $sheet.className = "am-sheet";
      $sheet.dataset.index = hojaIdx;

      const $header = document.createElement("div");
      $header.className = "am-sheet__header";
      $header.innerHTML = `
        <h2 class="am-sheet__conf">${hoja.confederacion}</h2>
        <span class="am-sheet__pageno">Hoja ${hojaIdx + 1} / ${hojas.length}</span>
      `;

      const $grid = document.createElement("div");
      $grid.className = "am-sheet__grid";

      hoja.cromos.forEach((cromo, posicion) => {
        $grid.appendChild(
          crearSlot(cromo, numeroGlobal(hojaIdx, posicion))
        );
      });

      $sheet.appendChild($header);
      $sheet.appendChild($grid);
      $book.appendChild($sheet);
    });
  }

  function crearSlot(cromo, numero) {
    const $slot = document.createElement("div");
    $slot.className = "am-slot";
    $slot.id = `am-slot-${cromo.id}`;
    pintarSlot($slot, cromo, numero, { animar: false });
    return $slot;
  }

  function pintarSlot($slot, cromo, numero, { animar }) {
    const pegado = window.AlbumStorage.estaPegado(usuarioId, cromo.id);
    $slot.dataset.filled = String(pegado);

    if (!pegado) {
      $slot.innerHTML = `
        <div class="am-slot__placeholder">
          <span class="am-slot__placeholder-num">${String(numero).padStart(2, "0")}</span>
          <span class="am-slot__placeholder-name">${cromo.pais}</span>
        </div>
      `;
      return;
    }

    const tilt = tiltPara(cromo.id);
    const video = window.rutaVideo(cromo);
    const poster = window.rutaPoster(cromo);

    $slot.innerHTML = `
      <div class="am-card ${animar ? "am-card--pegando" : ""}" style="--am-tilt:${tilt}deg">
        <div class="am-card__media">
          <video
            class="am-card__video"
            src="${video}"
            poster="${poster}"
            preload="metadata"
            playsinline
            muted
          ></video>
          <button type="button" class="am-card__play" aria-label="Reproducir video de ${cromo.jugador}">▶</button>
        </div>
        <div class="am-card__top">
          <span class="am-card__code">${cromo.codigo}</span>
          <span class="am-card__star">★</span>
        </div>
        <div>
          <p class="am-card__player">${cromo.jugador}</p>
          <p class="am-card__country">${cromo.pais}</p>
        </div>
      </div>
    `;

    activarVideoDeCarta($slot, { autoplayUnaVez: animar });
  }

  /**
   * Cablea el comportamiento del video dentro de una tarjeta ya pintada:
   *  - Clic en la tarjeta (o en el botón de play) -> reproduce desde el inicio.
   *  - Al terminar -> vuelve al primer frame (poster) y muestra el botón de play.
   *  - Si autoplayUnaVez es true (justo cuando se acaba de pegar el cromo),
   *    se reproduce automáticamente una sola vez, sin que el usuario tenga
   *    que hacer clic.
   */
  function activarVideoDeCarta($slot, { autoplayUnaVez }) {
    const $video = $slot.querySelector(".am-card__video");
    const $play = $slot.querySelector(".am-card__play");
    const $card = $slot.querySelector(".am-card");
    if (!$video || !$play || !$card) return;

    function reproducir() {
      $card.classList.add("am-card--reproduciendo");
      $video.currentTime = 0;
      // play() devuelve una Promise que puede rechazar (autoplay bloqueado
      // por el navegador); si falla, simplemente nos quedamos en el poster.
      $video.play().catch(() => {
        $card.classList.remove("am-card--reproduciendo");
      });
    }

    function volverAlPoster() {
      $card.classList.remove("am-card--reproduciendo");
    }

    $video.addEventListener("ended", volverAlPoster);
    $video.addEventListener("pause", volverAlPoster);

    $card.addEventListener("click", (e) => {
      e.stopPropagation();
      if ($video.paused) reproducir();
    });

    if (autoplayUnaVez) {
      // Pequeño respiro para que termine la animación de "pegado" antes
      // de arrancar el video, igual que en un clip real de alineación.
      setTimeout(reproducir, 350);
    }
  }

  function renderDots() {
    $dots.innerHTML = "";
    hojas.forEach((_, i) => {
      const $dot = document.createElement("button");
      $dot.type = "button";
      $dot.setAttribute("aria-label", `Ir a hoja ${i + 1}`);
      $dot.addEventListener("click", () => irAHoja(i));
      $dots.appendChild($dot);
    });
    actualizarDots();
  }

  function actualizarDots() {
    [...$dots.children].forEach((dot, i) => {
      dot.setAttribute("aria-current", String(i === indiceActual));
    });
  }

  function irAHoja(nuevoIndice) {
    if (nuevoIndice < 0 || nuevoIndice >= hojas.length) return;
    if (nuevoIndice === indiceActual) return;
    indiceActual = nuevoIndice;

    // Deshabilitar momentáneamente la navegación mientras la hoja gira:
    // evita que clics muy rápidos encolen transiciones CSS y dejen una
    // hoja a mitad de giro cuando el usuario suelta el dedo del botón.
    $prev.disabled = true;
    $next.disabled = true;

    [...$book.children].forEach(($sheet) => {
      const i = Number($sheet.dataset.index);
      $sheet.dataset.state = i < indiceActual ? "before" : i === indiceActual ? "current" : "after";
    });

    actualizarDots();

    const TRANSICION_MS = 380; // coincide con la transición de .am-sheet en album.css
    setTimeout(() => {
      $prev.disabled = indiceActual === 0;
      $next.disabled = indiceActual === hojas.length - 1;
    }, TRANSICION_MS);
  }

  /** Busca en qué hoja vive un cromo y navega hasta ella. */
  function irAHojaDeCromo(cromoId) {
    const hojaIdx = hojas.findIndex((h) => h.cromos.some((c) => c.id === cromoId));
    if (hojaIdx !== -1) irAHoja(hojaIdx);
    return hojaIdx;
  }

  /** Pega un cromo en su slot, con animación, y refresca el progreso. */
  function pegarConAnimacion(cromo) {
    const $slot = document.getElementById(`am-slot-${cromo.id}`);
    if (!$slot) return;
    const numero = encontrarNumero(cromo.id);
    pintarSlot($slot, cromo, numero, { animar: true });
    actualizarProgreso();
  }

  function encontrarNumero(cromoId) {
    for (let h = 0; h < hojas.length; h++) {
      const pos = hojas[h].cromos.findIndex((c) => c.id === cromoId);
      if (pos !== -1) return numeroGlobal(h, pos);
    }
    return 0;
  }

  function actualizarProgreso() {
    const total = window.ALBUM_DATA.length;
    const pegados = window.AlbumStorage.obtenerProgreso(usuarioId).length;
    const pct = total === 0 ? 0 : Math.round((pegados / total) * 100);
    $progressFill.style.width = `${pct}%`;
    $progressLabel.textContent = `${pegados} / ${total}`;
  }

  return { iniciar, irAHojaDeCromo, pegarConAnimacion, actualizarProgreso };
})();

window.Album = Album;
