# cldNexus.github.io (Website der Org)

Statische Seite der Org cldNexus, erreichbar unter https://cldnexus.github.io (GitHub Pages aus `main`, kein Build). Das Repo ist **öffentlich**, jede Zeile ist weltweit lesbar.

## Vor jeder Änderung pullen
Vor **jedem** Change zuerst `git pull --ff-only` (auf dem aktuellen Branch), damit Änderungen von Nico und Nick nicht überschrieben werden. Für einen Feature-Branch: erst `main` pullen, den Branch von dort anlegen, vor dem Push erneut `git pull --rebase`. Bei einem Fehler (Konflikt, uncommittete Änderungen) nichts erzwingen und kein `--force`, sondern dem User den Stand zeigen und nachfragen.

## Struktur
- `index.html`: die ganze Seite (CSS inline): Logo, Überschrift, Terminal-Karte „cftch“ mit Skull-Canvas, Infos, Karte „Was wir bauen“, Links.
- `assets/avatar.jpg`: Branding-Bild (Logo und Favicon).
- `assets/skull-data.js`: Punktwolke des Skulls (`window.SKULL`: `n`, `p`, `nr`, `l` = Punkte, Normalen, Helligkeit) aus dem Höhenrelief des cyberfetch-Logos.
- `assets/skull.js`: Port des cyberfetch-Renderers (Rotation, Blinn-Phong, Z-Buffer, ASCII-Rampe) auf ein Canvas. Farbverlauf Cyan → Magenta → Rot nach Bildschirm-x. `#t=<Sekunden>` in der URL friert ein Bild ein (für Screenshots und das GIF im Org-Profil), `prefers-reduced-motion` zeigt ein statisches Bild.
- `fonts/ShareTechMono-Regular.ttf`: Schrift (SIL OFL 1.1), lokal eingebunden.

## Regeln
- **Keine externen Anfragen**: keine CDNs, Google Fonts, Tracker oder Skripte von Dritten. Alles liegt im Repo.
- **Nur Harmloses**: keine Links auf private Repos oder interne Systeme, keine Mailadressen, Server, Tokens oder persönlichen Daten.
- Branding: Cyan `#00E5FF`, Magenta `#FF2BD6`, Rot `#FF4D4D`, Hintergrund `#05020A`, Text `#BFF8FF`, Schrift Share Tech Mono; Glow links Cyan, rechts Rot, Mitte Magenta; Kontrast mind. 4,5:1.
- Barrierefrei bleiben: sinnvolle `alt`-Texte, `aria-label` am Canvas, Bewegung abschaltbar, Touch-Ziele der Buttons groß genug, Seite auf 320 px Breite ohne horizontales Scrollen.
- Vor dem Push lokal ansehen (`index.html` im Browser oder per Headless-Chrome-Screenshot) und die Ansicht prüfen, danach die Pages-Auslieferung kontrollieren (`gh api repos/cldNexus/cldNexus.github.io/pages/builds/latest`).
- Sprache: Deutsch, Du-Form. Push nur auf Auftrag des Users (Änderungen sind sofort öffentlich). Größere Umbauten auf einem Feature-Branch mit Pull Request (Skill `feature-branch-workflow`).
