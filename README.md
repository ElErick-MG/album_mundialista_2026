# Álbum Mundial 2026 — 48 cromos

Álbum digital de figuritas con 48 espacios fijos (uno por selección clasificada).
Cada cromo tiene un código QR real que, al escanearlo, lo pega automáticamente
en su espacio del álbum — y solo en ese espacio. El progreso se guarda por
usuario en el navegador (localStorage), así que varias personas pueden usar
el mismo dispositivo sin mezclar sus álbumes.

## Cómo probarlo

Es HTML/CSS/JS plano, sin build ni dependencias que instalar. Solo necesita
servirse por HTTP (no `file://`, porque los módulos hacen `fetch`/storage
que algunos navegadores bloquean en local):

```bash
cd album-mundial-2026
python3 -m http.server 8000
# abrir http://localhost:8000
```

O con cualquier otro servidor estático (Live Server de VS Code, `npx serve`, etc.)
También puede subirse tal cual a cualquier hosting estático (GitHub Pages,
Netlify, Vercel, un bucket S3...).

## Cómo funciona el QR

Cada figurita codifica una URL como:

```
https://tu-dominio.com/index.html?cromo=arg&u=carlos
```

- `cromo` = id único del cromo (ver `js/data.js`)
- `u` = id del usuario que generó esa hoja de cromos (opcional; si la persona
  ya tiene sesión abierta en el navegador donde escanea, se usa esa sesión)

Al abrir esa URL, `js/router.js` detecta los parámetros, `js/app.js` valida
que el cromo exista, y `js/album.js` lo pega con una animación, navegando
automáticamente a la hoja donde vive ese cromo. Si el código no corresponde
a ningún cromo del álbum, se avisa con un mensaje de error sin romper nada.

Para imprimir/compartir la hoja de QR de cada usuario: botón **"Hoja de
cromos"** en la barra superior, una vez con sesión iniciada.

## Estructura del proyecto

```
index.html        Estructura de la página (login, álbum, modal de QR)
css/album.css     Todo el diseño visual (papel, libro, pegado, responsive)
js/data.js        ÚNICA fuente de los 48 países + jugador representativo
js/pages.js       Agrupa los 48 cromos en "hojas" por confederación
js/storage.js     Usuarios y progreso en localStorage (multi-usuario)
js/qrgen.js       Genera el SVG del QR real de cada cromo
js/router.js      Lee ?cromo=ID&u=usuario de la URL (simula el escaneo)
js/album.js       Construye el DOM del álbum a partir de los datos
js/app.js         Orquesta login, escaneo, toasts y modal de impresión
js/qrcode.min.js  Librería QR vendorizada (sin depender de ningún CDN)
media/            Videos de cada jugador (ver media/README.md)
```

## Video del jugador en cada cromo

Cada cromo pegado muestra un video corto del jugador (tipo "presentación
de alineación") en la zona superior de la tarjeta:

- Al pegar el cromo (escaneando su QR), el video se **reproduce
  automáticamente una vez**.
- Al terminar, queda pausado mostrando su primer frame con un botón ▶.
- Si en cualquier momento posterior se hace clic/tap sobre la tarjeta,
  el video se reproduce de nuevo.

Los archivos de video van en la carpeta **`media/`**, y se detectan
automáticamente por convención de nombre usando el `id` del cromo
(`media/arg.mp4` para Argentina, `media/bra.mp4` para Brasil, etc.) —
instrucciones completas en `media/README.md`. No es necesario escribir
la ruta a mano en `js/data.js` salvo que quieras un nombre distinto a
la convención.

## Editar selecciones o jugadores

Todo vive en **`js/data.js`**, en el arreglo `ALBUM_DATA`. Cada cromo es:

```js
{ id: "arg", pais: "Argentina", jugador: "Lionel Messi", confederacion: CONFEDERACIONES.CONMEBOL, codigo: "ARG" }
```

- `id`: no lo cambies si ya imprimiste/compartiste códigos QR con ese id
  (el QR queda inválido si el id desaparece de la lista), y además es
  el nombre que debe llevar su archivo de video en `media/`.
- `confederacion`: determina en qué "hoja" del álbum cae el cromo.
- `video` / `poster` (opcionales): solo hace falta agregarlos a mano si
  el archivo no sigue la convención `media/<id>.mp4`.
- El resto del sitio (slots, contador, hojas, QR, video) se reconstruye
  solo a partir de este arreglo — no hay nada de esto escrito a mano en
  el HTML.

El archivo valida en consola si el total deja de ser 48, para detectar
errores de edición rápido.

## Notas de diseño

- Tailwind se carga por CDN con el prefijo `tw-` y el preflight apagado,
  para no chocar con las clases propias del proyecto (todas bajo `am-`).
- Si Tailwind no llega a cargar (sin red, CDN caído), el sitio sigue
  funcionando: `.tw-hidden` tiene un respaldo definido en `album.css`.
- Tipografías: Anton (títulos/display), Karla (texto), JetBrains Mono
  (códigos y contadores), cargadas desde Google Fonts.
