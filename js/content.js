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

  // Galerie: Fotos in assets/img/galerie/ ablegen, jeweils groß (name.jpg) und klein (name-klein.jpg).
  // Reihenfolge hier = Reihenfolge auf der Seite.
  gallery: [
    { file: "strandpauli-pult", alt: "Bruno legt am StrandPauli auf, im Hintergrund die Hafenkräne", caption: "StrandPauli, Hamburg" },
    { file: "bergbar-cdj",      alt: "Bruno am CDJ in einer Bar mit Blick auf die Berge",          caption: "Am CDJ mit Bergblick" },
    { file: "sky-sand",         alt: "Bruno am DJ-Pult im Sky & Sand Beachclub",                   caption: "Sky & Sand Beachclub, Hamburg" },
    { file: "setup-wasser",     alt: "Controller-Setup am Wasser bei Sonnenuntergang",             caption: "Setup am Wasser" },
    { file: "berge-portrait",   alt: "Bruno lächelnd beim Wandern in den Bergen",                  caption: "Unterwegs in den Bergen" },
    { file: "strandpauli-b2b",  alt: "Bruno und ein Freund hinter dem Pult am StrandPauli",         caption: "StrandPauli, Hamburg" },
    { file: "regenbogen",       alt: "Regenbogen über dem Wasser in der Abenddämmerung",           caption: "Abendstimmung" },
    { file: "abendhimmel",      alt: "Bruno von hinten vor rosa Abendhimmel",                      caption: "Abendstimmung" },
    { file: "berge-tal",        alt: "Bruno in einem Bergtal mit Geröll und blauem Himmel",         caption: "Unterwegs in den Bergen" },
  ],

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
