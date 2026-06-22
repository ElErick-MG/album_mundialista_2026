/**
 * router.js
 * -----------------------------------------------------------------------
 * Simula "escanear" un cromo: cuando el usuario abre una URL con
 * ?cromo=ID (y opcionalmente &u=usuario), esta capa la detecta, valida
 * que el ID exista en data.js, y entrega el resultado a quien la llame
 * (app.js) para que decida qué hacer en la UI (pedir usuario si falta,
 * animar el pegado, avisar que ya estaba pegado, avisar si el ID no
 * existe, etc).
 *
 * Después de procesar el parámetro, limpia la URL para que un refresh
 * de página no vuelva a "pegar" el mismo cromo por accidente.
 */

const AlbumRouter = (() => {
  function leerParametros() {
    const params = new URLSearchParams(window.location.search);
    return {
      cromoId: params.get("cromo"),
      usuarioId: params.get("u"),
    };
  }

  function limpiarURL() {
    const url = new URL(window.location.href);
    url.searchParams.delete("cromo");
    url.searchParams.delete("u");
    window.history.replaceState({}, document.title, url.toString());
  }

  /**
   * @returns {{cromo: object|null, cromoIdInvalido: string|null, usuarioId: string|null}}
   */
  function resolverEscaneo(albumData) {
    const { cromoId, usuarioId } = leerParametros();
    if (!cromoId) {
      return { cromo: null, cromoIdInvalido: null, usuarioId };
    }
    const cromo = albumData.find((c) => c.id === cromoId) || null;
    return {
      cromo,
      cromoIdInvalido: cromo ? null : cromoId,
      usuarioId,
    };
  }

  return { leerParametros, limpiarURL, resolverEscaneo };
})();

window.AlbumRouter = AlbumRouter;
