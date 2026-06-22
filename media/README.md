# Carpeta de videos de jugadores

Acá van los clips cortos de cada jugador (tipo "presentación de
alineación"). El sitio los encuentra automáticamente por convención
de nombre, usando el mismo `id` que tiene el cromo en `js/data.js`.

## Convención de nombres

Para un cromo con `id: "arg"` (Argentina / Messi):

```
media/arg.mp4          <- el video (obligatorio)
media/arg-poster.jpg   <- primer frame / miniatura (opcional)
```

Si no subes el `-poster.jpg`, el navegador genera uno automáticamente
tomando el primer frame del video — funciona, pero un poster recortado
y elegido a mano normalmente se ve mejor.

## Para ver todos los IDs disponibles

Cada uno de los 48 países tiene su `id` en `js/data.js`, por ejemplo:

```js
{ id: "mex", pais: "México", jugador: "Edson Álvarez", ... }   -> media/mex.mp4
{ id: "bra", pais: "Brasil", jugador: "Vinícius Júnior", ... } -> media/bra.mp4
{ id: "fra", pais: "Francia", jugador: "Kylian Mbappé", ... }  -> media/fra.mp4
```

## Recomendaciones del archivo de video

- Formato: **MP4 con codec H.264** (el más compatible en todos los
  navegadores y celulares).
- Corto: 3-6 segundos es suficiente para el efecto de "presentación".
- Vertical o cuadrado funciona mejor que horizontal, porque el video
  ocupa la zona superior de una tarjeta de cromo (más alta que ancha).
- Sin audio, o con audio pero asumiendo que casi nunca se escuchará:
  el video arranca en automático apenas se pega el cromo, y los
  navegadores bloquean el sonido en reproducciones automáticas. El
  audio sí se escucha si la persona vuelve a darle clic manualmente
  a la tarjeta más tarde.
- Peso liviano (un par de MB como máximo por video): se cargan varios
  a la vez si el usuario tiene muchos cromos pegados en la misma hoja.

## Si un jugador tiene un nombre de archivo distinto

No es necesario que sigas la convención al pie de la letra. En
`js/data.js`, puedes agregar campos `video` y/o `poster` a mano en
ese cromo puntual, y el sitio los usará en vez de la convención:

```js
{ id: "arg", pais: "Argentina", jugador: "Lionel Messi", ...,
  video: "media/clips/messi-alineacion.mp4",
  poster: "media/clips/messi-poster.jpg" }
```
