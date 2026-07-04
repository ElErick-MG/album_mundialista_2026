/**
 * qrgen.js
 * -----------------------------------------------------------------------
 * Genera el código QR real de cada cromo. Cada QR codifica una URL de
 * esta misma página con el parámetro ?cromo=ID.
 * Al "escanearlo" (abrir esa URL, sea con cámara o con un clic en la
 * hoja de cromos para imprimir), router.js detecta los parámetros y
 * pega el cromo automáticamente en su slot — y solo en ese slot.
 *
 * Usa la librería vendorizada qrcode.min.js (expone window.QRCodeLib),
 * sin depender de ningún CDN externo en producción.
 */

const AlbumQR = (() => {
  function urlBase() {
    const url = new URL(window.location.href);
    url.search = "";
    url.hash = "";
    return url.toString();
  }

  function urlParaCromo(cromoId) {
    const url = new URL(urlBase());
    url.searchParams.set("cromo", cromoId);
    return url.toString();
  }

  /** Devuelve una Promise<string> con el SVG del QR como markup. */
  async function svgParaCromo(cromoId, opts = {}) {
    const texto = urlParaCromo(cromoId);
    const svg = await window.QRCodeLib.toString(texto, {
      type: "svg",
      margin: 0,
      color: {
        dark: opts.dark || "#16241c",
        light: opts.light || "#00000000",
      },
    });
    return svg;
  }

  return { urlParaCromo, svgParaCromo, urlBase };
})();

window.AlbumQR = AlbumQR;
