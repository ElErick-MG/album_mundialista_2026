/**
 * pages.js
 * -----------------------------------------------------------------------
 * Convierte el arreglo plano de 48 cromos (data.js) en una estructura
 * de "hojas" para el álbum: cada hoja pertenece a una confederación y
 * contiene como máximo CROMOS_POR_HOJA cromos. Esto es puramente de
 * presentación — no modifica ni duplica los datos originales.
 */

const AlbumPages = (() => {
  const CROMOS_POR_HOJA = 6; // 2 columnas x 3 filas, como una hoja real de álbum

  /**
   * @param {Array} datos - ALBUM_DATA completo
   * @returns {Array<{confederacion: string, cromos: Array}>} hojas
   */
  function construirHojas(datos) {
    const porConfederacion = new Map();

    datos.forEach((cromo) => {
      if (!porConfederacion.has(cromo.confederacion)) {
        porConfederacion.set(cromo.confederacion, []);
      }
      porConfederacion.get(cromo.confederacion).push(cromo);
    });

    const hojas = [];
    porConfederacion.forEach((cromos, confederacion) => {
      for (let i = 0; i < cromos.length; i += CROMOS_POR_HOJA) {
        hojas.push({
          confederacion,
          cromos: cromos.slice(i, i + CROMOS_POR_HOJA),
        });
      }
    });

    return hojas;
  }

  return { construirHojas, CROMOS_POR_HOJA };
})();

window.AlbumPages = AlbumPages;
