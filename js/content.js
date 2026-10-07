/* ==========================================================================
   INHALTE ZUM AUSTAUSCHEN
   Alles, was sich oft ändert, steht hier an einer Stelle.
   Einfach die Werte zwischen den Anführungszeichen ersetzen und speichern.
   ========================================================================== */

window.SITE = {
  // Kontakt & Social Media
  email: "booking@[domain]",            // z. B. "booking@brunoooo.de"
  instagram: "",                        // z. B. "https://instagram.com/brunoooo.mp3"
  soundcloud: "",                       // z. B. "https://soundcloud.com/brunoooo"

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
    { title: "Tech House",     length: "60 min", soundcloud: "" },
    { title: "Melodic & Afro", length: "75 min", soundcloud: "" },
    { title: "90s & 2000s",    length: "90 min", soundcloud: "" },
  ],

  // Gigs: date im Format "JJJJ-MM-TT". Ohne Datum entscheidet „upcoming“,
  // ob der Gig unter „Demnächst“ (true) oder „Vergangen“ (false) steht.
  gigs: [
    { name: "StrandPauli",        city: "Hamburg", date: "", upcoming: false },
    { name: "Club 25, Reeperbahn", city: "Hamburg", date: "", upcoming: false },
    { name: "[Club / Event]",     city: "[Stadt]", date: "", upcoming: true },
    { name: "[Club / Event]",     city: "[Stadt]", date: "", upcoming: true },
    { name: "[Club / Event]",     city: "[Stadt]", date: "", upcoming: false },
    { name: "[Club / Event]",     city: "[Stadt]", date: "", upcoming: false },
  ],
};
