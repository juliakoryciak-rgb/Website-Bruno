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
| Galerie | Foto zweimal in `assets/img/galerie/` ablegen: groß als `name.jpg` (ca. 1600 px) und klein als `name-klein.jpg` (ca. 720 px). Dann in `js/content.js` → `gallery` eine Zeile mit `file`, `alt` und `caption` ergänzen. |
| Hero-Video / Hörprobe | `js/content.js` → `heroVideo` und `heroSnippet` |
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
