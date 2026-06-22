/**
 * app.js
 * -----------------------------------------------------------------------
 * Orquesta el flujo completo:
 *   1. Si hay ?cromo=ID en la URL, resuelve quién está "escaneando".
 *   2. Si no hay usuario activo, muestra el login (pidiendo nombre).
 *   3. Una vez hay usuario, inicia el álbum y, si venía de un escaneo,
 *      pega el cromo correspondiente con su animación.
 *   4. Maneja la "hoja de cromos" (modal con QR reales para cada figurita).
 */

(function () {
  const $login = document.getElementById("am-login");
  const $loginForm = document.getElementById("am-login-form");
  const $loginInput = document.getElementById("am-login-input");
  const $loginExisting = document.getElementById("am-login-existing");
  const $loginList = document.getElementById("am-login-list");

  const $app = document.getElementById("am-app");
  const $userName = document.getElementById("am-user-name");
  const $btnLogout = document.getElementById("am-btn-logout");
  const $btnImprimir = document.getElementById("am-btn-imprimir");

  const $toast = document.getElementById("am-toast");

  const $printModal = document.getElementById("am-print-modal");
  const $printClose = document.getElementById("am-print-close");
  const $printGrid = document.getElementById("am-print-grid");
  const $printPage = document.getElementById("am-print-page");

  let toastTimer = null;
  let pendiente = null; // cromo en espera de que el usuario inicie sesión

  function mostrarToast(mensaje, tipo = "ok") {
    clearTimeout(toastTimer);
    $toast.textContent = mensaje;
    $toast.className = `am-toast am-toast--show am-toast--${tipo}`;
    $toast.classList.remove("tw-hidden");
    toastTimer = setTimeout(() => $toast.classList.add("tw-hidden"), 3200);
  }

  function mostrarApp(usuarioId) {
    $login.classList.add("tw-hidden");
    $app.classList.remove("tw-hidden");
    $userName.textContent = window.AlbumStorage.obtenerNombreVisible(usuarioId);
    window.Album.iniciar(usuarioId);
  }

  function mostrarLogin() {
    $app.classList.add("tw-hidden");
    $login.classList.remove("tw-hidden");
    const usuarios = window.AlbumStorage.listarUsuarios();
    if (usuarios.length) {
      $loginExisting.classList.remove("tw-hidden");
      $loginList.innerHTML = "";
      usuarios.forEach((u) => {
        const $btn = document.createElement("button");
        $btn.type = "button";
        $btn.textContent = u.nombre;
        $btn.addEventListener("click", () => entrarComo(u.id));
        const $li = document.createElement("li");
        $li.appendChild($btn);
        $loginList.appendChild($li);
      });
    } else {
      $loginExisting.classList.add("tw-hidden");
    }
  }

  function entrarComo(usuarioId) {
    window.AlbumStorage.establecerUsuarioActivo(usuarioId);
    mostrarApp(usuarioId);
  }

  $loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const nombre = $loginInput.value.trim();
    if (!nombre) return;
    const id = window.AlbumStorage.registrarUsuario(nombre);
    entrarComo(id);

    if (pendiente) {
      const cromoPendiente = pendiente;
      pendiente = null;
      setTimeout(() => procesarCromo(cromoPendiente.id, id), 350);
    }
  });

  $btnLogout.addEventListener("click", () => {
    window.AlbumStorage.cerrarSesion();
    mostrarLogin();
  });

  // ----------------------------------------------------------------------
  // Hoja de cromos para escanear / imprimir
  // ----------------------------------------------------------------------
  async function abrirHojaDeCromos() {
    const usuarioId = window.AlbumStorage.obtenerUsuarioActivo();
    $printGrid.innerHTML = "";
    $printModal.classList.remove("tw-hidden");

    for (const cromo of window.ALBUM_DATA) {
      const pegado = window.AlbumStorage.estaPegado(usuarioId, cromo.id);
      const $card = document.createElement("div");
      $card.className = "am-print-card";
      $card.dataset.filled = String(pegado);

      const svg = await window.AlbumQR.svgParaCromo(cromo.id, usuarioId);
      $card.innerHTML = `
        <div class="am-print-card__qr">${svg}</div>
        <p class="am-print-card__name">${cromo.jugador}</p>
        <p class="am-print-card__country">${cromo.pais}</p>
      `;

      if (!pegado) {
        // En este mismo dispositivo, un clic simula el escaneo de cámara.
        $card.style.cursor = "pointer";
        $card.addEventListener("click", () => {
          $printModal.classList.add("tw-hidden");
          procesarCromo(cromo.id, usuarioId);
        });
      }

      $printGrid.appendChild($card);
    }
  }

  $btnImprimir.addEventListener("click", abrirHojaDeCromos);
  $printClose.addEventListener("click", () => $printModal.classList.add("tw-hidden"));
  $printModal.addEventListener("click", (e) => {
    if (e.target === $printModal) $printModal.classList.add("tw-hidden");
  });
  $printPage.addEventListener("click", () => window.print());

  // ----------------------------------------------------------------------
  // Procesar el "escaneo" de un cromo (desde la URL o desde la hoja)
  // ----------------------------------------------------------------------
  function procesarCromo(cromoId, usuarioIdSugerido) {
    const cromo = window.ALBUM_DATA.find((c) => c.id === cromoId);
    if (!cromo) {
      mostrarToast("Este código QR no corresponde a ningún cromo del álbum.", "error");
      return;
    }

    const usuarioActivo = window.AlbumStorage.obtenerUsuarioActivo();
    const usuarioId = usuarioActivo || usuarioIdSugerido;

    if (!usuarioId) {
      // No hay sesión: pedimos nombre y dejamos el cromo pendiente.
      pendiente = cromo;
      mostrarLogin();
      mostrarToast(`Escaneaste a ${cromo.jugador}. Escribe tu nombre para pegarlo.`, "warn");
      return;
    }

    const { yaEstaba } = window.AlbumStorage.pegarCromo(usuarioId, cromo.id);
    window.Album.irAHojaDeCromo(cromo.id);

    if (yaEstaba) {
      mostrarToast(`Ya tenías el cromo de ${cromo.jugador} (${cromo.pais}). ¡Repetida!`, "warn");
    } else {
      window.Album.pegarConAnimacion(cromo);
      mostrarToast(`¡Pegaste a ${cromo.jugador}! ${cromo.pais} ya está en tu álbum.`, "ok");
    }
  }

  // ----------------------------------------------------------------------
  // Arranque
  // ----------------------------------------------------------------------
  function arrancar() {
    const { cromo, cromoIdInvalido, usuarioId: usuarioDesdeQR } = window.AlbumRouter.resolverEscaneo(window.ALBUM_DATA);
    window.AlbumRouter.limpiarURL();

    const usuarioActivo = window.AlbumStorage.obtenerUsuarioActivo();

    if (usuarioActivo) {
      mostrarApp(usuarioActivo);
    } else {
      mostrarLogin();
    }

    if (cromoIdInvalido) {
      mostrarToast("Ese código QR no es válido para este álbum.", "error");
      return;
    }

    if (cromo) {
      procesarCromo(cromo.id, usuarioDesdeQR);
    }
  }

  if (!window.AlbumStorage.disponible()) {
    mostrarToast("Tu navegador no permite guardar el progreso (almacenamiento bloqueado).", "error");
  }

  arrancar();
})();
