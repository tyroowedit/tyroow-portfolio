/* ============================================
   VIDEO DATA — the only file you touch to add/change videos.
   ============================================
   For each video, fill in "youtubeId": the part of the YouTube
   URL after "v=" (normal video) or after "/shorts/" (short).

   "title" is optional — leave it "" and the card shows "Video 1", etc.

   "wide: true" -> this video is horizontal (long-form), and now also
   renders as a bigger card in the grid than the vertical ones.
   "wide: false" -> this video is vertical (short).

   "category": "global" -> shows under the GLOBAL tab (English audience)
   "category": "br"     -> shows under the BRASIL tab (Portuguese audience)

   I set your 3 videos to "global" since the titles are in English —
   change any of them to "br" if that's wrong. Add or remove objects
   freely, both grids adapt on their own.
*/

const videos = [
  { youtubeId: "TryCx-HtYQs", wide: false, category: "global", title: "the BEST way to macro for gems in Anime Expeditions!" },
  { youtubeId: "A4wJoz_FIME", wide: false, category: "global", title: "Tik Tok Edit Best team in Anime Expeditions!" },
  { youtubeId: "Tgywxp0y46g", wide: true, category: "global", title: "Sand's Untitled Battlegrounds Showcase" },
  { youtubeId: "ywGRT50LsvA", wide: true, category: "br", title: "Trecho fã edit de Minecraft do @Bosco" },
  { youtubeId: "zXWAqEo-Q4o", wide: true, category: "br", title: "teste intro de valorant @gab" },
  { youtubeId: "vZqRYxMWpbc", wide: true, category: "br", title: "Trecho fã edit do @JogandoFoddaci de Overcooked 2" },
];
