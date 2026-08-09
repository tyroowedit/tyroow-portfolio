/* ============================================
   VIDEO DATA — the only file you touch to add/change videos.
   ============================================
   For each video, fill in "youtubeId": it's the part of the
   YouTube URL after "v=" (normal video) or after "/shorts/" (short).
   Example: youtube.com/watch?v=dQw4w9WgXcQ  -> id is dQw4w9WgXcQ
            youtube.com/shorts/dQw4w9WgXcQ   -> id is dQw4w9WgXcQ
   Same field either way. The thumbnail is pulled automatically.

   "title" is optional — leave it "" and the card just shows
   "Video 1", "Video 2", etc.

   "wide: true"  -> horizontal card, good for long-form videos.
   "wide: false" -> vertical card, good for shorts.

   Add or remove objects freely, the grid adapts on its own.
*/

const videos = [
  { youtubeId: "TryCx-HtYQs", wide: false, title: "the BEST way to macro for gems in Anime Expeditions!" },
  { youtubeId: "A4wJoz_FIME", wide: false, title: "Tik Tok Edit Best team in Anime Expeditions!" },
];
