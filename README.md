# brunoooo.mp3 – Website

Statische One-Page-Website (HTML, CSS, JavaScript), ohne Build-Tools.
Zum Ansehen einfach `index.html` im Browser öffnen.

## Inhalte austauschen

| Was | Wo |
| --- | --- |
| E-Mail, Instagram, SoundCloud, TikTok | `js/content.js` |
| „Gerade in jedem Set“ | `js/content.js` → `setTracks` |
| Mixes + SoundCloud-Links | `js/content.js` → `mixes`. Sobald ein Link eingetragen ist, erscheint der echte SoundCloud-Player. |
| Gigs | `js/content.js` → `gigs`. Mit `date: "2026-11-14"` sortieren sie sich automatisch in „Demnächst“ oder „Vergangen“ ein. |
| Bio-Text, Genres, Artists | `index.html` (Abschnitte sind kommentiert) |
| Lieblingstracks der Artists | `index.html` → `data-track="…"` bei der jeweiligen Karte |
| Hero-Foto | `assets/img/bruno-hero.jpg` ersetzen (am besten freigestellt auf Schwarz, hochkant, ca. 1000 × 1300 px) |
| Pressefotos | `<div class="ph">…</div>` in `index.html` durch `<img src="assets/img/press-1.jpg" alt="…">` ersetzen |
| Downloads | `assets/press/pressefotos.zip` und `assets/press/logo-paket.zip` ablegen |
| Impressum | `impressum.html` |

> Das aktuelle Hero-Foto ist aus dem Design-Entwurf ausgeschnitten und nur ein Platzhalter. Bitte durch das Originalfoto ersetzen.

## Online stellen

Zum Beispiel kostenlos über **GitHub Pages**: Settings → Pages → Branch auswählen → Speichern.
Alternativ den Ordner bei Netlify per Drag-and-drop hochladen.
