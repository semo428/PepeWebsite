/*
 * Speisekarte Pizzeria Ristorante da Pepe, Sigmaringen
 * ----------------------------------------------------
 * EINZIGE Datenquelle für die Website (und später für den n8n-Bot).
 * Preise ändern = nur hier anpassen.
 *
 * Quelle: Foto des Aushangs (Restaurant Guru, Stand ca. Juni 2026).
 *
 * Felder pro Gericht:
 *   nr      Nummer auf der Karte
 *   name    Name
 *   desc    Beschreibung / Zutaten
 *   preis   Preis in EUR (null = noch unbekannt)
 *   tags    "veg" = vegetarisch, "fisch" = Fisch/Meeresfrüchte, "scharf"
 *           -> VORLÄUFIG aus den Zutaten abgeleitet, vom Restaurant bestätigen lassen!
 *   allergene  z.B. ["A","C","G"] – TODO: vom Restaurant liefern lassen
 *   pruefen    true = Text/Preis auf dem Foto schlecht lesbar -> mit Restaurant prüfen
 *              (sichtbar mit speisekarte.html?pruefen)
 */
window.SPEISEKARTE = {
  restaurant: {
    name: "Pizzeria Ristorante da Pepe",
    strasse: "In der Vorstadt 8",
    ort: "72488 Sigmaringen",
    telefon: "07571 7494040",
    telefonLink: "+4975717494040",
    // TODO: Öffnungszeiten vom Restaurant bestätigen lassen (Quelle: Restaurant Guru)
    // tage: 0 = Sonntag, 1 = Montag … 6 = Samstag. zeiten leer = Ruhetag.
    // Mehrere Zeitfenster möglich, z.B. [["11:30","14:00"],["17:30","22:00"]]
    oeffnungszeiten: [
      { label: "Montag", tage: [1], zeiten: [] },
      { label: "Dienstag – Sonntag", tage: [2, 3, 4, 5, 6, 0], zeiten: [["11:30", "23:00"]] }
    ]
  },

  kategorien: [
    {
      id: "pizza",
      titel: "Steinofen Pizza",
      untertitel: "Alle Pizzen mit Tomatensoße, Käse und Oregano belegt",
      gerichte: [
        { nr: "01", name: "Margherita", desc: "mit Tomatensoße, Käse, Oregano", preis: 8.50, tags: ["veg"] },
        { nr: "02", name: "Salami", desc: "mit Rinder-Salami", preis: 9.50 },
        { nr: "03", name: "Napoli", desc: "mit Oliven, Sardellen, Kapern", preis: 11.00, tags: ["fisch"], pruefen: true },
        { nr: "04", name: "Diavolo", desc: "mit Paprika und Peperoni", preis: 10.50, tags: ["veg", "scharf"], pruefen: true },
        { nr: "05", name: "Cipolla", desc: "mit Zwiebeln", preis: 9.50, tags: ["veg"], pruefen: true },
        { nr: "06", name: "Funghi", desc: "mit frischen Champignons", preis: 9.50, tags: ["veg"], pruefen: true },
        { nr: "07", name: "Prosciutto", desc: "mit Vorderschinken", preis: 9.50, pruefen: true },
        { nr: "08", name: "Toscana", desc: "mit Vorderschinken und Champignons", preis: 11.00, pruefen: true },
        { nr: "09", name: "Trevisana", desc: "mit Rinder-Salami und Champignons", preis: 11.00 },
        { nr: "10", name: "Hawaii", desc: "mit Vorderschinken und Ananas", preis: 11.00 },
        { nr: "11", name: "Gallina", desc: "mit Vorderschinken, Spinat und Ei", preis: 12.00 },
        { nr: "12", name: "Calzone", desc: "gefüllt mit Vorderschinken, Rinder-Salami, Zwiebeln, Champignons", preis: 12.00 },
        { nr: "13", name: "Enzo", desc: "mit Vorderschinken und Thunfisch", preis: 11.50, tags: ["fisch"] },
        { nr: "14", name: "Don Camillo", desc: "mit Vorderschinken, Spinat, Peperoni und Oliven", preis: 12.50 },
        { nr: "15", name: "Marinara", desc: "mit Thunfisch und Zwiebeln", preis: 11.50, tags: ["fisch"] },
        { nr: "16", name: "Italia", desc: "mit Rinder-Salami, Zwiebeln, Peperoni und Paprika", preis: 12.00 },
        { nr: "17", name: "Quattro Stagioni", desc: "Vorderschinken, Champignons, Paprika, Thunfisch", preis: 12.50, tags: ["fisch"] },
        { nr: "18", name: "Capricciosa", desc: "Vorderschinken, Rinder-Salami, Pilze, Krabben, Knoblauch", preis: 13.00, tags: ["fisch"], pruefen: true },
        { nr: "19", name: "Gambretti", desc: "mit Krabben und Knoblauch", preis: 13.00, tags: ["fisch"] },
        { nr: "20", name: "Pepone", desc: "mit Vorderschinken, Thunfisch, Krabben, Knoblauch", preis: 13.50, tags: ["fisch"] },
        { nr: "21", name: "Frutti di Mare", desc: "mit Meeresfrüchten und Knoblauch", preis: 13.00, tags: ["fisch"] },
        { nr: "22", name: "Romeo-Giulietta", desc: "mit Krabben, Mozzarella, Spinat, Knoblauch", preis: 13.50, tags: ["fisch"] },
        { nr: "23", name: "Bolognese", desc: "mit gewürzter Hackfleischsoße", preis: 9.50 },
        { nr: "24", name: "Salmone", desc: "mit Lachs, Spinat und Knoblauch", preis: 14.50, tags: ["fisch"] },
        { nr: "25", name: "Pepe Chef", desc: "Lassen Sie sich überraschen!", preis: 14.50 },
        { nr: "26", name: "Jenny", desc: "mit Spinat, frischen Tomaten und Gorgonzola", preis: 12.00, tags: ["veg"] },
        { nr: "27", name: "Parma", desc: "mit Parmaschinken, Rucola und Parmesankäse", preis: 15.00 },
        { nr: "27a", name: "Primavera", desc: "mit Rucola, frischen Tomaten und Parmesankäse", preis: 12.00, tags: ["veg"] },
        { nr: "28", name: "Quattro Formaggi", desc: "mit vier verschiedenen Käsesorten", preis: 11.50, tags: ["veg"] },
        { nr: "29", name: "O Sole Mio", desc: "Thunfisch, Rinder-Salami, Vorderschinken und Ei", preis: 12.50, tags: ["fisch"] },
        { nr: "30", name: "Vegetaria", desc: "mit Paprika, Spinat, Pilzen, Brokkoli, Mais, Knoblauch", preis: 12.00, tags: ["veg"] },
        { nr: "31", name: "Verdura", desc: "mit verschiedenen gebratenen Gemüsesorten", preis: 13.00, tags: ["veg"] },
        { nr: "32", name: "Salvatore", desc: "Rinder-Salami, Vorderschinken, Thunfisch, Pilze, Paprika", preis: 13.00, tags: ["fisch"] },
        { nr: "33", name: "Pollo", desc: "mit Hähnchenbruststreifen, Paprika, Mais und Zwiebeln", preis: 14.00 },
        { nr: "34", name: "Rustica", desc: "mit Paprika, Peperoniwurst, Zwiebeln, Weichkäse, Sardellen", preis: 14.00, tags: ["fisch"] },
        { nr: "35", name: "Caprese", desc: "mit frischen Tomaten, Basilikum und Mozzarella", preis: 11.50, tags: ["veg"] },
        { nr: "36", name: "Gerardo", desc: "mit Brokkoli, Spinat, Hollandaisesoße, Hähnchenbruststreifen", preis: 14.00 }
      ]
    },
    {
      id: "spaghetti",
      titel: "Spaghetti",
      gerichte: [
        { nr: "37", name: "Napoli", desc: "mit Tomatensoße und frischen Tomaten", preis: 8.50, tags: ["veg"] },
        { nr: "38", name: "Bolognese", desc: "mit Hackfleischsoße", preis: 9.00 },
        { nr: "39", name: "Carbonara", desc: "mit Vorderschinken, Ei, Sahne und Parmesankäse", preis: 10.50 },
        { nr: "40", name: "Aglio e Olio", desc: "mit Olivenöl, Peperoni, Knoblauch und scharf", preis: 10.00, tags: ["veg", "scharf"], pruefen: true },
        { nr: "41", name: "Arrabiata", desc: "mit Tomatensoße, Paprika, Oliven, Zwiebeln und Peperoni", preis: null, tags: ["veg", "scharf"], pruefen: true },
        { nr: "42", name: "Frutti di Mare", desc: "mit Meeresfrüchten, Weißwein und Tomatensoße", preis: null, tags: ["fisch"], pruefen: true },
        { nr: "43", name: "Aglio Olio Gambaretti", desc: "mit Olivenöl, Peperoni, Krabben, Knoblauch und Tomaten", preis: null, tags: ["fisch", "scharf"], pruefen: true },
        { nr: "44", name: "Gambaretti", desc: "mit Tomatensoße, frischen Tomaten, Krabben und Knoblauch", preis: 13.50, tags: ["fisch"] }
      ]
    },
    {
      id: "tortellini",
      titel: "Tortellini",
      gerichte: [
        { nr: "45", name: "Alla Panna", desc: "mit Vorderschinken und Sahnesoße", preis: 11.50, pruefen: true },
        { nr: "46", name: "Della Casa", desc: "mit Champignons, Vorderschinken und Sahnesoße", preis: 11.50, pruefen: true },
        { nr: "47", name: "Bolognese Panna", desc: "mit Hackfleisch und Sahnesoße", preis: 10.00, pruefen: true },
        { nr: "48", name: "Quattro Formaggi", desc: "mit vier Käsesorten", preis: 11.50, pruefen: true },
        { nr: "49", name: "Broccoli", desc: "mit Vorderschinken, Brokkoli, Sahnesoße und frischen Tomaten", preis: 11.50, pruefen: true },
        { nr: "50", name: "Con Pollo", desc: "mit Putenstreifen, Paprika, Brokkoli, Senf und Sahnesoße", preis: 13.00, pruefen: true }
      ]
    },
    {
      id: "penne",
      titel: "Penne",
      gerichte: [
        { nr: "51", name: "Arrabiata", desc: "mit Speck, Peperoni, frischen Tomaten und scharfer Tomatensoße", preis: 11.00, tags: ["scharf"] },
        { nr: "52", name: "Bolognese", desc: "mit Hackfleischsoße", preis: 9.00 },
        { nr: "53", name: "Quattro Formaggi", desc: "mit vier Käsesorten", preis: 11.00, tags: ["veg"] },
        { nr: "54", name: "Pepe Spezial", desc: "Brokkoli, Pilze, Lachs, Krabben, Tomaten-Sahnesoße, Knoblauch", preis: 14.50, tags: ["fisch"], pruefen: true },
        { nr: "55", name: "Genovese", desc: "mit Putenstreifen, Zwiebeln, Krabben, Paprika, Sahne-Senfsoße", preis: 14.50, tags: ["fisch"] },
        { nr: "56", name: "Al Curry", desc: "mit Putenstreifen, Krabben, Peperoni, Curry-Sahnesoße", preis: 14.50, tags: ["fisch"] }
      ]
    },
    {
      id: "tagliatelle",
      titel: "Tagliatelle",
      gerichte: [
        { nr: "57", name: "Maison", desc: "mit Vorderschinken, Champignons und Rahmsoße", preis: 11.00 },
        { nr: "58", name: "Verde", desc: "mit verschiedenen Gemüsesorten in Olivenöl", preis: 11.50, tags: ["veg"] },
        { nr: "59", name: "Gambretti", desc: "mit Krabben, Knoblauch, frischen Tomaten, Rahmsoße", preis: 13.50, tags: ["fisch"] },
        { nr: "60", name: "Al Salmone", desc: "mit Lachs, Spinat, frischen Tomaten, Sahnesoße und Knoblauch", preis: 14.00, tags: ["fisch"] },
        { nr: "61", name: "Di Manzo", desc: "mit Rindersteakstreifen, Pilzen, Peperoni, Zwiebeln, Tomaten, Sahnesoße", preis: 14.00 },
        { nr: "62", name: "Di Pesce", desc: "mit Krabben, Lachs, Brokkoli, Knoblauch und Rahmsoße", preis: 14.50, tags: ["fisch"] },
        { nr: "63", name: "Delizia con Filetto Pollo", desc: "mit Hähnchenbruststreifen, Champignons, Spinat und Sahnesoße", preis: 14.50 }
      ]
    },
    {
      id: "gnocchi",
      titel: "Gnocchi",
      gerichte: [
        { nr: "64", name: "Gorgonzola", desc: "mit Gorgonzola-Käse", preis: 11.00, tags: ["veg"] },
        { nr: "65", name: "Romana", desc: "mit Putenstreifen, Paprika, Brokkoli, Curry-Sahnesoße", preis: 14.00 },
        { nr: "66", name: "Spinaci", desc: "mit Spinat, Tomaten, Knoblauch und Sahnesoße", preis: 12.00, tags: ["veg"] },
        { nr: "67", name: "Quattro Formaggi", desc: "mit vier Käsesorten", preis: 12.50, tags: ["veg"] },
        { nr: "68", name: "Speziale", desc: "mit verschiedenen Gemüsesorten, Lachs, Knoblauch und Olivenöl", preis: 14.50, tags: ["fisch"] }
      ]
    },
    {
      id: "alforno",
      titel: "Al Forno",
      untertitel: "Mit Käse überbacken",
      gerichte: [
        { nr: "69", name: "Lasagne al Forno", desc: "mit Nudelschichten, Vorderschinken, Ei und Rindfleischsoße und Sahnesoße", preis: 11.50 },
        { nr: "70", name: "Lasagne con Pesce", desc: "mit Nudelschichten, Lachs, Krabben, Spinat, Tomaten, Knoblauch und Sahnesoße", preis: 14.50, tags: ["fisch"] },
        { nr: "71", name: "Pasta Mista al Forno", desc: "mit verschiedenen Nudelsorten, Brokkoli, Vorderschinken, Pilzen, Rindfleischsoße, Sahnesoße", preis: 12.00 },
        { nr: "72", name: "Cannelloni", desc: "mit Gemüse, Rindfleischsoße und Sahnesoße", preis: 12.00 },
        { nr: "73", name: "Pollo Verdura al Forno", desc: "mit verschiedenem Gemüse, Putenstreifen, Tomaten und Sahnesoße", preis: 14.00 },
        { nr: "74", name: "Gnocchi al Forno", desc: "mit Tomatensoße, Basilikum und Mozzarella", preis: 12.00, tags: ["veg"] },
        { nr: "75", name: "Penne mit Zucchini & Auberginen", desc: "mit Paprika, frischen Tomaten und Käse überbacken", preis: 12.50, tags: ["veg"] },
        { nr: "76", name: "Penne con Pollo", desc: "mit Champignons, Hähnchen und Sahnesoße", preis: 14.00, pruefen: true },
        { nr: "77", name: "Gambaretti al Forno", desc: "Krabben, Spinat, Nudeln nach Wahl", preis: 14.00, tags: ["fisch"], pruefen: true },
        { nr: "78", name: "Marinierter Lachs", desc: "feiner Lachs, Spinat, überbacken, Nudeln nach Wahl", preis: 14.50, tags: ["fisch"], pruefen: true }
      ]
    },
    {
      id: "schwein",
      titel: "Carne di Maiale",
      untertitel: "Schweinefleisch",
      gerichte: [
        { nr: "79", name: "Scaloppina Quattro Formaggi", desc: "Schweinemedaillons mit vier verschiedenen Käsesorten-Soße", preis: 21.50 },
        { nr: "80", name: "Scaloppina ai Funghi", desc: "Schweinemedaillons, Champignons und Senf-Sahnesoße", preis: 21.50 },
        { nr: "81", name: "Scaloppina alla Paprika", desc: "Schweinemedaillons, Paprika, Zwiebeln, Rahmsoße", preis: 21.50 },
        { nr: "82", name: "Scaloppina al Vino Bianco", desc: "Schweinemedaillons in Weißweinsoße", preis: 21.50, pruefen: true }
      ]
    },
    {
      id: "pute",
      titel: "Carne di Pollo",
      untertitel: "Putenfleisch",
      gerichte: [
        { nr: "83", name: "Putensteak", desc: "mit Kräuterkruste, Rosmarin", preis: 21.50 },
        { nr: "84", name: "Putensteak", desc: "mit frischen Champignons und Rahmsoße", preis: 22.50 }
      ]
    },
    {
      id: "rind",
      titel: "Carne di Manzo",
      untertitel: "Rindfleisch",
      gerichte: [
        { nr: "85", name: "Bistecca alla Griglia", desc: "Rumpsteak vom Rost mit Rosmarin", preis: 22.50 },
        { nr: "86", name: "Bistecca al Pepe Verde", desc: "Rumpsteak vom Rost mit grüner Pfefferrahmsoße", preis: 22.50 }
      ]
    },
    {
      id: "fisch",
      titel: "Pesce",
      untertitel: "Fischgerichte",
      gerichte: [
        { nr: "87", name: "Salmone alla Griglia", desc: "gegrilltes Lachsfilet", preis: 22.50, tags: ["fisch"] },
        { nr: "88", name: "Filetto di Orata", desc: "Filet vom Wolfsbarsch", preis: 22.50, tags: ["fisch"], pruefen: true },
        { nr: "89", name: "Scampi alla Griglia", desc: "gegrillte Scampi", preis: 22.50, tags: ["fisch"] }
      ]
    },
    {
      id: "vorspeisen",
      titel: "Vorspeisen",
      gerichte: [
        { nr: "90", name: "Antipasto Misto Italiano", desc: "gemischte Vorspeisen nach Art des Hauses", preis: 15.00 },
        { nr: "91", name: "Carpaccio di Manzo", desc: "hauchdünnes Rindfleisch, Rucola, Parmesankäse", preis: 14.00 },
        { nr: "92", name: "Focaccia Uno", desc: "Pizzabrot mit frischen Tomaten, Zwiebeln, Olivenöl, Basilikum", preis: 6.50, tags: ["veg"] },
        { nr: "93", name: "Focaccia Due", desc: "Pizzabrot mit Rucola, Kirschtomaten, Parmesankäse", preis: 8.00, tags: ["veg"] }
      ]
    },
    {
      id: "salate",
      titel: "Insalata",
      untertitel: "Salate",
      gerichte: [
        { nr: "94", name: "Pomodori", desc: "mit Tomaten und Zwiebeln", preis: 7.50, tags: ["veg"] },
        { nr: "95", name: "Cetrioli", desc: "Gurkensalat", preis: 7.50, tags: ["veg"] },
        { nr: "96", name: "Mista", desc: "gemischter Salat", preis: 8.50, tags: ["veg"] },
        { nr: "97", name: "Tonno", desc: "gemischter Salat mit Thunfisch", preis: 9.50, tags: ["fisch"] },
        { nr: "98", name: "Capricciosa", desc: "gemischter Salat, Vorderschinken, Thunfisch, Käse und Ei", preis: 11.00, tags: ["fisch"] },
        { nr: "99", name: "Italiana", desc: "gemischter Salat, Vorderschinken, Ei und Käse", preis: 10.00 },
        { nr: "100", name: "Pepe", desc: "gemischter Salat, Thunfisch, Käse, Ei, Vorderschinken, Krabben", preis: 13.00, tags: ["fisch"] },
        { nr: "101", name: "Caprese", desc: "grüner Salat, Tomaten und Mozzarella", preis: 10.50, tags: ["veg"] },
        { nr: "102", name: "Francese", desc: "gemischter Salat, Hähnchenbruststreifen und Champignons", preis: 13.00 },
        { nr: "103", name: "Ruccola Pollo", desc: "Rucola, Hähnchenbruststreifen, Champignons, Kirschtomaten und gehobelter Parmesan", preis: 13.00 },
        { nr: "104", name: "Greca", desc: "gemischter Salat, Peperoni, Oliven und Schafskäse", preis: 9.50, tags: ["veg"] },
        { nr: "105", name: "Insalata di Manzo", desc: "Blattsalat-Mix, gegrilltes Gemüse, Kirschtomaten und Rindersteakstreifen", preis: 13.00 }
      ]
    }
  ]
};
