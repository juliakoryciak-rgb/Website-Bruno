/* ==========================================================================
   INHALTE ZUM AUSTAUSCHEN
   Alles, was sich oft ändert, steht hier an einer Stelle.
   Einfach die Werte zwischen den Anführungszeichen ersetzen und speichern.
   ========================================================================== */

window.SITE = {
  // Kontakt & Social Media
  email: "brunoooo.mp3@gmail.com",      // später z. B. "booking@brunoooo.de"
  instagram: "https://www.instagram.com/brunoooo.mp3",
  soundcloud: "https://on.soundcloud.com/RsOVpTOIP8UOUVqjec",

  // Hero (optional): Video-Loop und Hörprobe
  heroVideo: "",    // z. B. "assets/video/hero.mp4" (stumm, 10–20 Sek., Schwarzweiß wirkt am besten)
  heroSnippet: "",  // z. B. "assets/audio/hoerprobe.mp3" (ca. 30 Sek. aus dem Signature-Set)

  // Presse-Downloads: Pfad zur Datei eintragen, z. B. "assets/press/pressefotos.zip".
  // Solange leer, steht auf dem Button „folgt“.
  press: {
    photosZip: "",
    logoZip: "",
  },

  // „Gerade in jedem Set“ (Bio-Bereich)
  setTracks: [
    { title: "Pick Up the Phone", artist: "Pawsa" },
    { title: "Marea", artist: "Fred again.." },
    { title: "Shinjuku", artist: "Franky Rizardo" },
  ],
  setTracksUpdated: "Oktober 2026",

  // Mixes: „soundcloud“ = Link zum Mix auf SoundCloud.
  // Sobald ein Link drinsteht, erscheint automatisch der echte SoundCloud-Player.
  mixes: [
    { title: "Warm-up / Deep", length: "60–90 min", note: "Ruhiger Einstieg in den Abend", soundcloud: "" },
    { title: "Peak Time",      length: "60–90 min", note: "So klingt es um 1 Uhr nachts",  soundcloud: "" },
    { title: "Signature",      length: "60–90 min", note: "Klingt am meisten nach ihm",    soundcloud: "" },
  ],

  // Gigs
  // date: "JJJJ-MM-TT" oder nur "JJJJ-MM". Gigs ab heute landen unter „Demnächst“.
  // note: Text statt Datum, z. B. "Regelmäßig" (wird zuerst angezeigt).
  gigs: [
    { name: "StrandPauli",           city: "Hamburg",  date: "2026-08" },
    { name: "Sky & Sand Bar",        city: "Hamburg",  date: "2026-06" },
    { name: "Lululemon × Maison Lagree", city: "Hamburg", date: "2026-04" },
    { name: "RipNDip Store Party",   city: "Hamburg",  date: "2026-02" },
    { name: "Baalsaal",              city: "Hamburg",  date: "2026-01" },
    { name: "Kleine Freiheit 3",     city: "Hamburg",  date: "2026-01" },
    { name: "Kasematte 20",          city: "Hamburg",  date: "2025-12" },
    { name: "Maison Lagree Opening", city: "Hamburg",  date: "2025-11" },
    { name: "Club 25, Reeperbahn",   city: "Hamburg",  note: "Regelmäßig" },
    { name: "Zaza Club",             city: "Hannover", note: "Regelmäßig" },
  ],
};
