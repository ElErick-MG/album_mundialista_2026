/**
 * storage.js
 * -----------------------------------------------------------------------
 * Toda la persistencia del álbum vive aquí. Un único namespace en
 * localStorage guarda:
 *   - la lista de usuarios que han abierto el álbum en este navegador
 *   - el progreso (cromos pegados) de cada usuario, por separado
 *
 * Nada de esto sabe qué es un "país" o un "jugador": solo guarda y
 * recupera arreglos de IDs de cromo. La capa de datos (data.js) y la
 * capa de UI (album.js) son las que le dan significado a esos IDs.
 */

const AlbumStorage = (() => {
  const NS = "album-mundial-2026";
  const KEY_USERS = `${NS}:usuarios`;
  const KEY_ACTIVE = `${NS}:usuario-activo`;
  const keyProgreso = (usuario) => `${NS}:progreso:${normalizarUsuario(usuario)}`;
  const keyFecha = (usuario) => `${NS}:fechas:${normalizarUsuario(usuario)}`;

  function normalizarUsuario(nombre) {
    return String(nombre || "").trim().toLowerCase().replace(/\s+/g, "-");
  }

  function disponible() {
    try {
      const test = "__storage_test__";
      window.localStorage.setItem(test, "1");
      window.localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  function leerJSON(key, fallback) {
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function escribirJSON(key, value) {
    window.localStorage.setItem(key, JSON.stringify(value));
  }

  function listarUsuarios() {
    return leerJSON(KEY_USERS, []);
  }

  function registrarUsuario(nombreVisible) {
    const id = normalizarUsuario(nombreVisible);
    if (!id) return null;
    const usuarios = listarUsuarios();
    const existente = usuarios.find((u) => u.id === id);
    if (!existente) {
      usuarios.push({ id, nombre: nombreVisible.trim() });
      escribirJSON(KEY_USERS, usuarios);
    }
    return id;
  }

  function obtenerUsuarioActivo() {
    return window.localStorage.getItem(KEY_ACTIVE) || null;
  }

  function establecerUsuarioActivo(id) {
    window.localStorage.setItem(KEY_ACTIVE, id);
  }

  function cerrarSesion() {
    window.localStorage.removeItem(KEY_ACTIVE);
  }

  function obtenerNombreVisible(id) {
    const usuario = listarUsuarios().find((u) => u.id === id);
    return usuario ? usuario.nombre : id;
  }

  /** Devuelve el set de IDs de cromo ya pegados para un usuario. */
  function obtenerProgreso(usuarioId) {
    return leerJSON(keyProgreso(usuarioId), []);
  }

  function estaPegado(usuarioId, cromoId) {
    return obtenerProgreso(usuarioId).includes(cromoId);
  }

  /**
   * Marca un cromo como pegado para un usuario.
   * Devuelve { yaEstaba, fecha } para que la UI sepa si debe animar
   * un pegado nuevo o solo informar que ya estaba en el álbum.
   */
  function pegarCromo(usuarioId, cromoId) {
    const progreso = obtenerProgreso(usuarioId);
    const yaEstaba = progreso.includes(cromoId);
    if (!yaEstaba) {
      progreso.push(cromoId);
      escribirJSON(keyProgreso(usuarioId), progreso);

      const fechas = leerJSON(keyFecha(usuarioId), {});
      fechas[cromoId] = new Date().toISOString();
      escribirJSON(keyFecha(usuarioId), fechas);
    }
    return { yaEstaba, fecha: leerJSON(keyFecha(usuarioId), {})[cromoId] };
  }

  function fechaDePegado(usuarioId, cromoId) {
    return leerJSON(keyFecha(usuarioId), {})[cromoId] || null;
  }

  /** Utilidad de desarrollo/demo: vacía el álbum de un usuario. */
  function reiniciarProgreso(usuarioId) {
    window.localStorage.removeItem(keyProgreso(usuarioId));
    window.localStorage.removeItem(keyFecha(usuarioId));
  }

  return {
    disponible,
    listarUsuarios,
    registrarUsuario,
    obtenerUsuarioActivo,
    establecerUsuarioActivo,
    cerrarSesion,
    obtenerNombreVisible,
    obtenerProgreso,
    estaPegado,
    pegarCromo,
    fechaDePegado,
    reiniciarProgreso,
    normalizarUsuario,
  };
})();

window.AlbumStorage = AlbumStorage;
