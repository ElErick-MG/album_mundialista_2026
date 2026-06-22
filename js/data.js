/**
 * data.js
 * -----------------------------------------------------------------------
 * Fuente única de datos del álbum: las 48 selecciones clasificadas al
 * Mundial 2026 y su jugador más representativo.
 *
 * Esta es la ÚNICA parte del proyecto donde "datos" y "presentación"
 * se mezclan a propósito: es el archivo que cualquier persona sin tocar
 * el resto del código puede editar para corregir un país o un jugador.
 * Todo el resto del sitio (render del álbum, slots, páginas, QR...)
 * se construye leyendo este arreglo. Nada de esto está repetido o
 * hardcodeado en el HTML.
 *
 * Estructura de cada cromo:
 *  - id            : identificador único, estable, usado en la URL del QR (?cromo=ID)
 *  - pais          : nombre de la selección
 *  - jugador       : jugador más representativo
 *  - confederacion : agrupador editorial (define las "hojas" del álbum)
 *  - codigo        : código ISO-3 aproximado, solo decorativo (escudo/sello tipográfico)
 *
 * VIDEO de cada jugador (clip tipo "presentación de alineación"):
 *  No hace falta escribir la ruta a mano en cada uno de los 48 objetos.
 *  Basta con guardar el archivo en site/media/ siguiendo esta convención
 *  de nombre, usando el mismo "id" del cromo:
 *
 *      site/media/<id>.mp4       (obligatorio: el video en sí)
 *      site/media/<id>-poster.jpg (opcional: primer frame; si no existe,
 *                                  el navegador genera el poster solo)
 *
 *  Ejemplo para Argentina (id: "arg"):
 *      site/media/arg.mp4
 *      site/media/arg-poster.jpg
 *
 *  Si en algún caso particular el archivo tiene otro nombre o vive en
 *  otra carpeta, se puede sobreescribir agregando "video"/"poster" a
 *  mano en ese objeto puntual — ver función rutaVideo()/rutaPoster()
 *  más abajo, que es la que usa el resto del sitio.
 */

const CONFEDERACIONES = {
  CONCACAF: "CONCACAF",
  CONMEBOL: "CONMEBOL",
  UEFA: "UEFA",
  AFC: "AFC (Asia)",
  CAF: "CAF (África)",
  OFC: "OFC (Oceanía)",
};

const MEDIA_BASE = "media/";

/** Ruta del video de un cromo: usa el campo "video" si se definió a mano,
 *  o cae a la convención media/<id>.mp4 si no. */
function rutaVideo(cromo) {
  return cromo.video || `${MEDIA_BASE}${cromo.id}.mp4`;
}

/** Ruta del poster (miniatura/primer frame) de un cromo: igual lógica. */
function rutaPoster(cromo) {
  return cromo.poster || `${MEDIA_BASE}${cromo.id}-poster.jpg`;
}

const ALBUM_DATA = [
  // ---------------------------------------------------------------- CONCACAF
  { id: "mex", pais: "México", jugador: "Edson Álvarez", confederacion: CONFEDERACIONES.CONCACAF, codigo: "MEX", media: "media/mex.mp4"},
  { id: "can", pais: "Canadá", jugador: "Alphonso Davies", confederacion: CONFEDERACIONES.CONCACAF, codigo: "CAN", media: "media/can.mp4" },
  { id: "usa", pais: "Estados Unidos", jugador: "Christian Pulisic", confederacion: CONFEDERACIONES.CONCACAF, codigo: "USA", media: "media/usa.mp4" },
  { id: "hai", pais: "Haití", jugador: "Duckens Nazon", confederacion: CONFEDERACIONES.CONCACAF, codigo: "HAI", media: "media/hai.mp4" },
  { id: "cuw", pais: "Curazao", jugador: "Leandro Bacuna", confederacion: CONFEDERACIONES.CONCACAF, codigo: "CUW", media: "media/cuw.mp4" },
  { id: "pan", pais: "Panamá", jugador: "Adalberto Carrasquilla", confederacion: CONFEDERACIONES.CONCACAF, codigo: "PAN", media: "media/pan.mp4" },

  // ---------------------------------------------------------------- CONMEBOL
  { id: "bra", pais: "Brasil", jugador: "Vinícius Júnior", confederacion: CONFEDERACIONES.CONMEBOL, codigo: "BRA", media: "media/bra.mp4" },
  { id: "arg", pais: "Argentina", jugador: "Lionel Messi", confederacion: CONFEDERACIONES.CONMEBOL, codigo: "ARG", media: "media/arg.mp4" },
  { id: "par", pais: "Paraguay", jugador: "Miguel Almirón", confederacion: CONFEDERACIONES.CONMEBOL, codigo: "PAR", media: "media/par.mp4" },
  { id: "ecu", pais: "Ecuador", jugador: "Moisés Caicedo", confederacion: CONFEDERACIONES.CONMEBOL, codigo: "ECU", media: "media/ecu.mp4" },
  { id: "col", pais: "Colombia", jugador: "Luis Díaz", confederacion: CONFEDERACIONES.CONMEBOL, codigo: "COL", media: "media/col.mp4" },
  { id: "uru", pais: "Uruguay", jugador: "Federico Valverde", confederacion: CONFEDERACIONES.CONMEBOL, codigo: "URU", media: "media/uru.mp4" },

  // ---------------------------------------------------------------- UEFA
  { id: "ale", pais: "Alemania", jugador: "Jamal Musiala", confederacion: CONFEDERACIONES.UEFA, codigo: "GER", media: "media/ale.mp4" },
  { id: "esp", pais: "España", jugador: "Lamine Yamal", confederacion: CONFEDERACIONES.UEFA, codigo: "ESP", media: "media/esp.mp4" },
  { id: "fra", pais: "Francia", jugador: "Kylian Mbappé", confederacion: CONFEDERACIONES.UEFA, codigo: "FRA", media: "media/fra.mp4" },
  { id: "por", pais: "Portugal", jugador: "Cristiano Ronaldo", confederacion: CONFEDERACIONES.UEFA, codigo: "POR", media: "media/por.mp4" },
  { id: "ing", pais: "Inglaterra", jugador: "Harry Kane", confederacion: CONFEDERACIONES.UEFA, codigo: "ENG", media: "media/ing.mp4" },
  { id: "cro", pais: "Croacia", jugador: "Luka Modrić", confederacion: CONFEDERACIONES.UEFA, codigo: "CRO", media: "media/cro.mp4" },
  { id: "ned", pais: "Países Bajos", jugador: "Virgil van Dijk", confederacion: CONFEDERACIONES.UEFA, codigo: "NED", media: "media/ned.mp4" },
  { id: "bel", pais: "Bélgica", jugador: "Kevin De Bruyne", confederacion: CONFEDERACIONES.UEFA, codigo: "BEL", media: "media/bel.mp4" },
  { id: "sui", pais: "Suiza", jugador: "Granit Xhaka", confederacion: CONFEDERACIONES.UEFA, codigo: "SUI", media: "media/sui.mp4" },
  { id: "sue", pais: "Suecia", jugador: "Alexander Isak", confederacion: CONFEDERACIONES.UEFA, codigo: "SWE", media: "media/sue.mp4" },
  { id: "aut", pais: "Austria", jugador: "David Alaba", confederacion: CONFEDERACIONES.UEFA, codigo: "AUT", media: "media/aut.mp4" },
  { id: "nor", pais: "Noruega", jugador: "Erling Haaland", confederacion: CONFEDERACIONES.UEFA, codigo: "NOR", media: "media/nor.mp4" },
  { id: "esc", pais: "Escocia", jugador: "Scott McTominay", confederacion: CONFEDERACIONES.UEFA, codigo: "SCO", media: "media/esc.mp4" },
  { id: "rch", pais: "República Checa", jugador: "Patrik Schick", confederacion: CONFEDERACIONES.UEFA, codigo: "CZE", media: "media/rch.mp4" },
  { id: "bih", pais: "Bosnia y Herzegovina", jugador: "Edin Džeko", confederacion: CONFEDERACIONES.UEFA, codigo: "BIH", media: "media/bih.mp4" },

  // ---------------------------------------------------------------- AFC (Asia)
  { id: "cor", pais: "Corea del Sur", jugador: "Son Heung-min", confederacion: CONFEDERACIONES.AFC, codigo: "KOR", media: "media/cor.mp4" },
  { id: "jap", pais: "Japón", jugador: "Takefusa Kubo", confederacion: CONFEDERACIONES.AFC, codigo: "JPN", media: "media/jap.mp4" },
  { id: "irn", pais: "Irán", jugador: "Mehdi Taremi", confederacion: CONFEDERACIONES.AFC, codigo: "IRN", media: "media/irn.mp4" },
  { id: "ksa", pais: "Arabia Saudita", jugador: "Salem Al-Dawsari", confederacion: CONFEDERACIONES.AFC, codigo: "KSA", media: "media/ksa.mp4" },
  { id: "uzb", pais: "Uzbekistán", jugador: "Eldor Shomurodov", confederacion: CONFEDERACIONES.AFC, codigo: "UZB", media: "media/uzb.mp4" },
  { id: "jor", pais: "Jordania", jugador: "Mousa Al-Tamari", confederacion: CONFEDERACIONES.AFC, codigo: "JOR", media: "media/jor.mp4" },
  { id: "irq", pais: "Irak", jugador: "Aymen Hussein", confederacion: CONFEDERACIONES.AFC, codigo: "IRQ", media: "media/irq.mp4" },
  { id: "qat", pais: "Catar", jugador: "Akram Afif", confederacion: CONFEDERACIONES.AFC, codigo: "QAT", media: "media/qat.mp4" },
  { id: "aus", pais: "Australia", jugador: "Mathew Leckie", confederacion: CONFEDERACIONES.AFC, codigo: "AUS", media: "media/aus.mp4" },

  // ---------------------------------------------------------------- CAF (África)
  { id: "rsa", pais: "Sudáfrica", jugador: "Percy Tau", confederacion: CONFEDERACIONES.CAF, codigo: "RSA", media: "media/rsa.mp4" },
  { id: "mar", pais: "Marruecos", jugador: "Achraf Hakimi", confederacion: CONFEDERACIONES.CAF, codigo: "MAR", media: "media/mar.mp4" },
  { id: "civ", pais: "Costa de Marfil", jugador: "Sébastien Haller", confederacion: CONFEDERACIONES.CAF, codigo: "CIV", media: "media/civ.mp4" },
  { id: "tun", pais: "Túnez", jugador: "Hannibal Mejbri", confederacion: CONFEDERACIONES.CAF, codigo: "TUN", media: "media/tun.mp4" },
  { id: "egy", pais: "Egipto", jugador: "Mohamed Salah", confederacion: CONFEDERACIONES.CAF, codigo: "EGY", media: "media/egy.mp4" },
  { id: "cpv", pais: "Cabo Verde", jugador: "Ryan Mendes", confederacion: CONFEDERACIONES.CAF, codigo: "CPV", media: "media/cpv.mp4" },
  { id: "sen", pais: "Senegal", jugador: "Sadio Mané", confederacion: CONFEDERACIONES.CAF, codigo: "SEN", media: "media/sen.mp4" },
  { id: "alg", pais: "Argelia", jugador: "Riyad Mahrez", confederacion: CONFEDERACIONES.CAF, codigo: "ALG", media: "media/alg.mp4" },
  { id: "gha", pais: "Ghana", jugador: "Mohammed Kudus", confederacion: CONFEDERACIONES.CAF, codigo: "GHA", media: "media/gha.mp4" },
  { id: "rdc", pais: "República Democrática del Congo", jugador: "Chancel Mbemba", confederacion: CONFEDERACIONES.CAF, codigo: "DRC", media: "media/rdc.mp4" },

  // ---------------------------------------------------------------- OFC (Oceanía)
  { id: "nzl", pais: "Nueva Zelanda", jugador: "Chris Wood", confederacion: CONFEDERACIONES.OFC, codigo: "NZL", media: "media/nzl.mp4" },
];

// Validación temprana: si algún día se edita este archivo y se rompe el
// número exacto de cromos del álbum (48), que falle ruidosamente en
// consola en lugar de mostrar un álbum incompleto en silencio.
if (ALBUM_DATA.length !== 48) {
  console.warn(
    `[data.js] Se esperaban 48 cromos y se encontraron ${ALBUM_DATA.length}. ` +
    `Revisa ALBUM_DATA en data.js.`
  );
}

// Se expone como global simple (el proyecto es HTML/CSS/JS plano, sin bundler).
window.ALBUM_DATA = ALBUM_DATA;
window.rutaVideo = rutaVideo;
window.rutaPoster = rutaPoster;
window.CONFEDERACIONES = CONFEDERACIONES;
