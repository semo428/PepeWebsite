# da Pepe – Website & Speisekarte (Demo)

Statische Website für die Pizzeria Ristorante da Pepe, Sigmaringen. Keine Datenbank, kein Framework.

- `index.html` – Startseite
- `speisekarte.html` – Speisekarte mit Suche & Filtern (`?pruefen` markiert unsichere Einträge, `?filter=veg` setzt einen Filter)
- `assets/speisekarte.js` – **einzige Datenquelle** für Gerichte, Preise, Öffnungszeiten, Website-Adresse
- `assets/app.js` – Öffnungsstatus, Handy-Leiste, Schalter „Mit AI“, Demo-Chatbot „Pepino“ (regelbasiert; später `antworteAufText()` durch n8n-Webhook ersetzen)
- `tools/build.mjs` – schreibt Speisekarte, Kategorie-Karten, Öffnungszeiten, JSON-LD, Meta-Tags, `sitemap.xml` und `robots.txt` **fest ins HTML** (SEO)

## Preise oder Gerichte ändern

1. `assets/speisekarte.js` bearbeiten
2. `node tools/build.mjs` ausführen – oder einfach pushen: die GitHub Action (`.github/workflows/build.yml`) baut automatisch

Die Bereiche zwischen `<!-- BUILD:… -->` und `<!-- /BUILD:… -->` in den HTML-Dateien werden überschrieben – dort nichts von Hand ändern.

## Vor dem echten Start

- [ ] Preise/Texte mit dem Restaurant abgleichen (`speisekarte.html?pruefen`)
- [ ] Öffnungszeiten bestätigen
- [ ] Allergene/Zusatzstoffe einpflegen
- [ ] Impressum & Datenschutzerklärung füllen
- [ ] eigene Domain: `website` in `assets/speisekarte.js` ändern, dann bauen
- [ ] `noindex` in `index.html` und `speisekarte.html` entfernen
- [ ] Google Search Console einrichten, Sitemap einreichen
- [ ] Google-Unternehmensprofil beanspruchen, Website-Link eintragen, NAP identisch halten
