# brunoooo.mp3 – Website

Statische One-Page-Website (HTML, CSS, JavaScript), ohne Build-Tools.
Zum Ansehen einfach `index.html` im Browser öffnen.

## Inhalte austauschen

| Was | Wo |
| --- | --- |
| E-Mail, Instagram, SoundCloud | `js/content.js` |
| „Gerade in jedem Set“ | `js/content.js` → `setTracks` |
| Mixes + SoundCloud-Links | `js/content.js` → `mixes`. Sobald ein Link eingetragen ist, erscheint der echte SoundCloud-Player. |
| Gigs | `js/content.js` → `gigs`. Mit `date: "2026-11-14"` sortieren sie sich automatisch in „Demnächst“ oder „Vergangen“ ein. |
| Bio-Text, Genres, Artists | `index.html` (Abschnitte sind kommentiert) |
| Lieblingstracks der Artists | `index.html` → `data-track="…"` bei der jeweiligen Karte |
| Hero-Foto | `assets/img/bruno-hero.jpg` ersetzen (am besten freigestellt auf Schwarz, hochkant, ca. 1000 × 1300 px) |
| Pressefotos | `<div class="ph">…</div>` in `index.html` durch `<img src="assets/img/press-1.jpg" alt="…">` ersetzen |
| Downloads | ZIP-Dateien z. B. in `assets/press/` ablegen und den Pfad in `js/content.js` → `press` eintragen. Solange leer, steht „folgt“ auf dem Button. |
| Hero-Video / Hörprobe | `js/content.js` → `heroVideo` und `heroSnippet` |
| Story-Fotos | `index.html` → Abschnitt „Story“, `<div class="station__ph">…</div>` durch ein `<img>` ersetzen |
| Link-Vorschau (WhatsApp & Co.) | `assets/img/og-image.jpg`. Nach dem Online-Gang in `index.html` bei `og:image` die volle Adresse eintragen, z. B. `https://brunoooo.de/assets/img/og-image.jpg` |
| Impressum | `impressum.html` |

> Das aktuelle Hero-Foto ist aus dem Design-Entwurf ausgeschnitten und nur ein Platzhalter. Bitte durch das Originalfoto ersetzen.

## Online stellen

Zum Beispiel kostenlos über **GitHub Pages**: Settings → Pages → Branch auswählen → Speichern.
Alternativ den Ordner bei Netlify per Drag-and-drop hochladen.

## Datenschutz-Hinweise zur Technik

- Schriften liegen lokal in `assets/fonts/`, es gibt keine Verbindung zu Google Fonts.
- SoundCloud-Player laden erst nach einem Klick auf „Player laden“ (Zwei-Klick-Lösung). Die Zustimmung merkt sich der Browser.
- Spotify, Instagram und SoundCloud sind nur verlinkt, nicht eingebettet.
