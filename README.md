# da Pepe – Website & Speisekarte (Demo)

Statische Website für die Pizzeria Ristorante da Pepe, Sigmaringen. Kein Build-Schritt, keine Datenbank.

- `index.html` – Startseite
- `speisekarte.html` – Speisekarte mit Suche & Filtern (`?pruefen` markiert unsichere Einträge, `?filter=veg` setzt einen Filter)
- `assets/speisekarte.js` – **einzige Datenquelle** für Gerichte, Preise, Öffnungszeiten
- `assets/app.js` – Öffnungsstatus, Handy-Leiste, Demo-Chatbot „Pepino“ (regelbasiert; später `antworteAufText()` durch n8n-Webhook ersetzen)

## Vor dem echten Start

- [ ] Preise/Texte mit dem Restaurant abgleichen (`speisekarte.html?pruefen`)
- [ ] Öffnungszeiten bestätigen
- [ ] Allergene/Zusatzstoffe einpflegen
- [ ] Impressum & Datenschutzerklärung füllen
- [ ] `noindex` in `index.html` und `speisekarte.html` entfernen
- [ ] eigene Domain verbinden
