/*
 * da Pepe – gemeinsame Logik für alle Seiten
 *  1. Öffnungsstatus ("Jetzt geöffnet")
 *  2. Handy-Leiste unten + Chat-Button am Desktop
 *  3. "Pepino" – Demo-Chatbot (regelbasiert, OHNE n8n/KI)
 *
 * Später wird nur antworteAufText() durch einen Aufruf an den n8n-Webhook ersetzt.
 * Die UI bleibt gleich.
 */
(function () {
  "use strict";
  var DATA = window.SPEISEKARTE;
  if (!DATA) return;
  var R = DATA.restaurant;
  var AUF_KARTE = /speisekarte(\.html)?\/?$/.test(location.pathname);
  var KARTE_URL = AUF_KARTE ? "" : "speisekarte.html";

  /* ---------- Hilfsfunktionen ---------- */
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var euro = function (n) { return n == null ? "Preis auf Anfrage" : n.toFixed(2).replace(".", ",") + " €"; };
  var zufall = function (arr) { return arr[Math.floor(Math.random() * arr.length)]; };
  var mischen = function (arr) { return arr.map(function (x) { return [Math.random(), x]; }).sort(function (a, b) { return a[0] - b[0]; }).map(function (x) { return x[1]; }); };

  var GERICHTE = [];
  DATA.kategorien.forEach(function (k) {
    k.gerichte.forEach(function (g) { GERICHTE.push(Object.assign({ kat: k.id, katTitel: k.titel, tags: [] }, g)); });
  });
  var hat = function (g, tag) { return g.tags.indexOf(tag) !== -1; };
  var perNr = function (nr) { return GERICHTE.find(function (g) { return g.nr === nr; }); };
  var HAUPT = ["pizza", "spaghetti", "tortellini", "penne", "tagliatelle", "gnocchi", "alforno", "schwein", "pute", "rind", "fisch"];
  var NUDEL = ["spaghetti", "tortellini", "penne", "tagliatelle", "gnocchi", "alforno"];
  var KREBS = /krabben|scampi|meeresfr|gambar|gambr/i;
  var MILCH = /käse|sahne|rahm|mozzarella|gorgonzola|parmesan|hollandaise|formaggi|überbacken|carbonara|panna/i;

  /* ---------- 1. Öffnungsstatus ---------- */
  var TAG_KURZ = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
  var minuten = function (hhmm) { var p = hhmm.split(":"); return +p[0] * 60 + +p[1]; };
  var zeitenAm = function (tag) {
    var e = R.oeffnungszeiten.find(function (o) { return o.tage.indexOf(tag) !== -1; });
    return e ? e.zeiten : [];
  };
  function oeffnungsStatus(jetzt) {
    jetzt = jetzt || new Date();
    var tag = jetzt.getDay(), min = jetzt.getHours() * 60 + jetzt.getMinutes();
    var offen = zeitenAm(tag).find(function (z) { return min >= minuten(z[0]) && min < minuten(z[1]); });
    if (offen) return { offen: true, text: "Jetzt geöffnet · bis " + offen[1] + " Uhr" };
    for (var k = 0; k < 8; k++) {
      var t = (tag + k) % 7;
      var next = zeitenAm(t).find(function (z) { return k > 0 || minuten(z[0]) > min; });
      if (next) {
        var wann = k === 0 ? "heute" : k === 1 ? "morgen" : TAG_KURZ[t];
        return { offen: false, text: "Geschlossen · öffnet " + wann + " um " + next[0] + " Uhr" };
      }
    }
    return { offen: false, text: "Geschlossen" };
  }
  function zeitenTabelle() {
    return R.oeffnungszeiten.map(function (o) {
      var z = o.zeiten.length ? o.zeiten.map(function (x) { return x[0] + " – " + x[1]; }).join("<br>") : "Ruhetag";
      return "<tr><td>" + esc(o.label) + "</td><td>" + z + "</td></tr>";
    }).join("");
  }
  document.querySelectorAll("[data-oeffnungszeiten]").forEach(function (el) { el.innerHTML = zeitenTabelle(); });
  document.querySelectorAll("[data-status]").forEach(function (el) {
    var s = oeffnungsStatus();
    el.className = "status " + (s.offen ? "status--offen" : "status--zu");
    el.innerHTML = '<span class="status__dot"></span>' + esc(s.text);
  });

  /* ---------- 2. Handy-Leiste & Desktop-Button ---------- */
  var ICON = {
    karte: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H11v16H5.5A1.5 1.5 0 0 1 4 18.5zM13 4h5.5A1.5 1.5 0 0 1 20 5.5v13a1.5 1.5 0 0 1-1.5 1.5H13z" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M6.5 8h2.5M6.5 11h2.5M15.5 8h2M15.5 11h2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    tel: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 3.5h2.6l1.4 4.2-2 1.3a12 12 0 0 0 6.4 6.4l1.3-2 4.2 1.4v2.6a2 2 0 0 1-2 2A16.5 16.5 0 0 1 4.6 5.5a2 2 0 0 1 2-2z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
    route: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11z" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="10" r="2.3" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>',
    chat: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v7a2.5 2.5 0 0 1-2.5 2.5H10l-4.5 4v-4A2.5 2.5 0 0 1 4 13.5z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><circle cx="8.5" cy="10" r="1.1" fill="currentColor"/><circle cx="12" cy="10" r="1.1" fill="currentColor"/><circle cx="15.5" cy="10" r="1.1" fill="currentColor"/></svg>',
    senden: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12l16-8-6 16-2.5-6.5z" fill="currentColor"/></svg>',
    zu: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>'
  };
  var ROUTE = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("Pizzeria Ristorante da Pepe " + R.strasse + " " + R.ort);

  document.body.insertAdjacentHTML("beforeend",
    '<nav class="tabbar" aria-label="Schnellzugriff">' +
      '<a class="tabbar__item' + (AUF_KARTE ? ' is-active' : '') + '" href="speisekarte.html">' + ICON.karte + '<span>Karte</span></a>' +
      '<a class="tabbar__item" href="tel:' + R.telefonLink + '">' + ICON.tel + '<span>Anrufen</span></a>' +
      '<a class="tabbar__item" href="' + ROUTE + '" target="_blank" rel="noopener">' + ICON.route + '<span>Route</span></a>' +
      '<button class="tabbar__item tabbar__item--chat ai-only" type="button" data-chat-open>' + ICON.chat + '<span>Fragen</span></button>' +
    '</nav>' +
    '<button class="chat-fab ai-only" type="button" data-chat-open>' + ICON.chat + '<span>Fragen zur Karte?</span></button>' +
    '<div class="ai-toast" role="status" aria-live="polite" hidden></div>' +
    '<div class="chat-teaser ai-only" hidden><button type="button" data-chat-open>Allergie oder keine Idee? <strong>Frag Pepino!</strong></button><button type="button" class="chat-teaser__x" aria-label="Hinweis schließen">×</button></div>'
  );

  /* ---------- 3. Chat-Oberfläche ---------- */
  document.body.insertAdjacentHTML("beforeend",
    '<section class="chat" id="chat" role="dialog" aria-modal="true" aria-labelledby="chat-titel" hidden>' +
      '<header class="chat__head">' +
        '<div class="chat__avatar" aria-hidden="true">P</div>' +
        '<div class="chat__who"><strong id="chat-titel">Pepino</strong><span>Digitaler Kellner · <em>Demo</em></span></div>' +
        '<button class="chat__close" type="button" aria-label="Chat schließen" data-chat-close>' + ICON.zu + '</button>' +
      '</header>' +
      '<div class="chat__log" id="chat-log" aria-live="polite"></div>' +
      '<form class="chat__form" id="chat-form" autocomplete="off">' +
        '<input id="chat-input" type="text" placeholder="Frag mich etwas zur Karte …" aria-label="Nachricht" enterkeyhint="send">' +
        '<button type="submit" aria-label="Senden">' + ICON.senden + '</button>' +
      '</form>' +
      '<p class="chat__legal">Demo · Angaben ohne Gewähr. Bei Allergien bitte immer das Personal informieren.</p>' +
    '</section>'
  );

  var chat = document.getElementById("chat");
  var log = document.getElementById("chat-log");
  var form = document.getElementById("chat-form");
  var input = document.getElementById("chat-input");
  var gestartet = false;
  var zustand = {};

  /* ---------- AI-Schalter ("Mit AI") ---------- */
  var HTML = document.documentElement;
  var aiAn = function () { return HTML.classList.contains("ai-an"); };
  var kopf = document.querySelector(".site-header .wrap");
  if (kopf) {
    kopf.insertAdjacentHTML("beforeend",
      '<button class="ai-switch" type="button" role="switch" aria-checked="false" aria-label="AI-Funktionen einschalten">' +
        '<span class="ai-switch__label">✨ Mit AI</span><span class="ai-switch__track"><span class="ai-switch__knob"></span></span>' +
      "</button>");
    // Schalter vor die Navigation setzen (links von "Start / Speisekarte …")
    var nav = kopf.querySelector(".nav");
    if (nav) kopf.insertBefore(kopf.lastElementChild, nav);
  }
  var schalter = document.querySelector(".ai-switch");
  var toast = document.querySelector(".ai-toast");
  var toastTimer;
  function zeigeToast(html) {
    toast.innerHTML = html;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.hidden = true; }, 3200);
  }
  function setzeAI(an, mitToast) {
    HTML.classList.toggle("ai-an", an);
    if (schalter) schalter.setAttribute("aria-checked", an);
    try { localStorage.setItem("dapepe-ai", an ? "1" : "0"); } catch (e) {}
    if (!an) { schliesseChat(); teaser.hidden = true; }
    if (mitToast) {
      zeigeToast(an
        ? "<strong>✨ AI-Funktionen aktiv</strong><span>Digitaler Kellner Pepino, Allergie-Check, Pizza-Finder & mehr</span>"
        : "<strong>Standard-Website</strong><span>AI-Funktionen ausgeschaltet</span>");
      if (an) {
        HTML.classList.add("ai-wow");
        setTimeout(function () { HTML.classList.remove("ai-wow"); }, 1600);
        setTimeout(function () { if (chat.hidden && aiAn()) teaser.hidden = false; }, 1800);
      }
    }
  }
  if (schalter) {
    schalter.setAttribute("aria-checked", aiAn());
    schalter.addEventListener("click", function () { setzeAI(!aiAn(), true); });
  }

  function oeffneChat(frage) {
    if (!aiAn()) return;
    chat.hidden = false;
    document.documentElement.classList.add("chat-offen");
    teaserWeg();
    if (!gestartet) {
      gestartet = true;
      if (frage) log.innerHTML = '<div class="msg msg--bot"><div class="bubble"><p><strong>Ciao! 👋</strong> Ich bin Pepino, der digitale Kellner von da Pepe.</p></div></div>';
      else begruessung();
    }
    if (frage) setTimeout(frage, 250);
    else if (window.matchMedia("(min-width: 761px)").matches) input.focus();
  }
  function schliesseChat() {
    chat.hidden = true;
    document.documentElement.classList.remove("chat-offen");
  }
  document.addEventListener("click", function (e) {
    if (e.target.closest("[data-chat-open]")) { e.preventDefault(); oeffneChat(); }
    if (e.target.closest("[data-chat-close]")) schliesseChat();
    var direkt = e.target.closest("[data-chat-aktion]");
    if (direkt) { oeffneChat(function () { frage(direkt.textContent.trim(), direkt.getAttribute("data-chat-aktion")); }); }
    var frag = e.target.closest("[data-frag-gericht]");
    if (frag) { e.preventDefault(); var g = perNr(frag.getAttribute("data-frag-gericht")); oeffneChat(function () { frage("Erzähl mir mehr über " + g.name, "gericht:" + g.nr); }); }
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !chat.hidden) schliesseChat(); });

  // Gericht-Link im Chat: auf der Karte am Handy Chat schließen, damit man das Gericht sieht
  log.addEventListener("click", function (e) {
    var a = e.target.closest("a.cd");
    if (a && AUF_KARTE) {
      var filterAktiv = document.querySelector('.chip[aria-pressed="true"]') || (document.getElementById("suche") || {}).value;
      if (filterAktiv && window.dapepeFilterReset) window.dapepeFilterReset();
      if (window.matchMedia("(max-width: 760px)").matches) schliesseChat();
    }
    var btn = e.target.closest("[data-aktion]");
    if (btn) frage(btn.textContent, btn.getAttribute("data-aktion"));
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var t = input.value.trim();
    if (!t) return;
    input.value = "";
    frage(t, null);
  });

  /* ---------- Nachrichten ---------- */
  function scrollUnten() { log.scrollTop = log.scrollHeight; }
  function nutzer(text) {
    log.insertAdjacentHTML("beforeend", '<div class="msg msg--du"><div class="bubble">' + esc(text) + "</div></div>");
    scrollUnten();
  }
  function bot(antwort) {
    // alte Schnellantworten entfernen – nur die neuesten bleiben klickbar
    log.querySelectorAll(".replies").forEach(function (r) { r.remove(); });
    var tipp = document.createElement("div");
    tipp.className = "msg msg--bot";
    tipp.innerHTML = '<div class="bubble bubble--typing"><i></i><i></i><i></i></div>';
    log.appendChild(tipp);
    scrollUnten();
    var dauer = Math.min(1400, 450 + (antwort.html.length / 6));
    setTimeout(function () {
      tipp.innerHTML = '<div class="bubble">' + antwort.html + "</div>";
      if (antwort.replies && antwort.replies.length) {
        log.insertAdjacentHTML("beforeend", '<div class="replies">' + antwort.replies.map(function (r) {
          return '<button type="button" data-aktion="' + esc(r[1]) + '">' + esc(r[0]) + "</button>";
        }).join("") + "</div>");
      }
      // Lange Antworten: Anfang der Antwort zeigen statt ans Ende zu springen
      var start = tipp.offsetTop - log.offsetTop - 12;
      log.scrollTop = (log.scrollHeight - start > log.clientHeight) ? start : log.scrollHeight;
    }, dauer);
  }
  function frage(text, aktion) {
    nutzer(text);
    bot(aktion ? fuehreAus(aktion) : antworteAufText(text));
  }

  /* ---------- Bausteine für Antworten ---------- */
  function karte(g, extra) {
    return '<a class="cd" href="' + KARTE_URL + "#g-" + esc(g.nr) + '">' +
      '<span class="cd__top"><span class="cd__n"><small>' + esc(g.nr) + "</small> " + esc(g.name) + '</span><span class="cd__p">' + euro(g.preis) + "</span></span>" +
      '<span class="cd__d">' + esc(g.katTitel) + " · " + esc(g.desc) + "</span>" +
      (extra ? '<span class="cd__x">' + extra + "</span>" : "") +
      "</a>";
  }
  function karten(liste) { return '<div class="cds">' + liste.map(function (g) { return karte(g); }).join("") + "</div>"; }
  function hinweis(text) { return '<p class="hinweis">⚠️ ' + text + "</p>"; }
  var STANDARD = [
    ["🍕 Pizza-Finder", "finder"],
    ["🌿 Kein Fleisch", "veg"],
    ["🎲 Überrasch mich", "surprise"],
    ["🦐 Krebstier-Allergie", "krebs"]
  ];
  var ALLE_FRAGEN = [
    ["🌿 Ich esse kein Fleisch – was empfiehlst du?", "veg"],
    ["🦐 Ich habe eine Krebstier-Allergie", "krebs"],
    ["🥛 Ich vertrage keine Laktose", "laktose"],
    ["🌶 Was ist richtig scharf?", "scharf"],
    ["💶 Satt werden unter 10 €?", "budget"],
    ["🍕 Hilf mir, die perfekte Pizza zu finden", "finder"],
    ["👫 Stell uns ein Menü für zwei zusammen", "menu2"],
    ["🎲 Überrasch mich!", "surprise"],
    ["🕐 Habt ihr gerade geöffnet?", "zeiten"],
    ["📊 Wie viel Fett hat die Margherita?", "naehrwerte"]
  ];

  function begruessung() {
    var s = oeffnungsStatus();
    bot({
      html: "<p><strong>Ciao! 👋</strong> Ich bin Pepino, der digitale Kellner von da Pepe.</p>" +
        "<p>Ich kenne alle " + GERICHTE.length + " Gerichte unserer Karte und helfe bei Allergien, Empfehlungen und Fragen zu Zutaten.</p>" +
        '<p class="klein">' + (s.offen ? "🟢 " : "🔴 ") + esc(s.text) + "</p>",
      replies: ALLE_FRAGEN
    });
  }

  /* ---------- Aktionen (Beispielfragen) ---------- */
  function fuehreAus(aktion) {
    var teil = aktion.split(":"), was = teil[0], arg = teil[1];
    switch (was) {
      case "start": return { html: "<p>Womit kann ich helfen?</p>", replies: ALLE_FRAGEN };
      case "glutenfrage": return antworteAufText("gluten");

      case "veg": {
        var veg = GERICHTE.filter(function (g) { return hat(g, "veg") && g.preis != null; });
        var tipps = ["pizza", "spaghetti", "gnocchi", "alforno", "salate"].map(function (k) {
          return zufall(veg.filter(function (g) { return g.kat === k; }));
        }).filter(Boolean);
        return {
          html: "<p>Kein Problem! 🌿 Auf der Karte sind <strong>" + veg.length + " vegetarische Gerichte</strong>. Meine Tipps quer durch die Karte:</p>" + karten(tipps) +
            '<p><a class="link" href="speisekarte.html?filter=veg">Alle vegetarischen Gerichte anzeigen →</a></p>' +
            hinweis("Käse wie Parmesan wird oft mit tierischem Lab hergestellt. Wenn Sie streng vegetarisch essen, fragen Sie bitte kurz nach."),
          replies: [["🎲 Andere Tipps", "veg"], ["🍕 Veggie-Pizza-Finder", "finder2:veg"], ["🌱 Und vegan?", "vegan"]]
        };
      }

      case "vegan": {
        var vegan = GERICHTE.filter(function (g) { return hat(g, "veg") && g.kat !== "pizza" && g.kat !== "alforno" && !MILCH.test(g.name + " " + g.desc) && !/\bei\b|tortellini/i.test(g.desc + " " + g.kat); });
        return {
          html: "<p>Vegan ist auf der Karte nicht extra gekennzeichnet. Laut Zutatenliste kommen diese Gerichte <em>ohne</em> Käse, Sahne und Ei aus:</p>" + karten(vegan) +
            hinweis("Nudelteig, Pizzateig und Dressings können trotzdem tierische Zutaten enthalten. Bitte beim Bestellen „vegan“ dazusagen, dann klärt das Team das mit der Küche."),
          replies: [["🌿 Vegetarische Tipps", "veg"], ["📞 Anrufen & nachfragen", "anrufen"]]
        };
      }

      case "krebs": {
        var meiden = GERICHTE.filter(function (g) { return KREBS.test(g.name + " " + g.desc); });
        var proKat = {};
        meiden.forEach(function (g) { (proKat[g.katTitel] = proKat[g.katTitel] || []).push(g); });
        return {
          html: "<p>Danke, dass Sie das sagen – das ist wichtig! 🦐 Diese <strong>" + meiden.length + " Gerichte</strong> enthalten laut Karte Krabben, Scampi oder Meeresfrüchte und sind für Sie <strong>nicht geeignet</strong>:</p>" +
            '<ul class="warnliste">' + Object.keys(proKat).map(function (k) {
              return "<li><strong>" + esc(k) + ":</strong> " + proKat[k].map(function (g) { return esc(g.nr + " " + g.name); }).join(", ") + "</li>";
            }).join("") + "</ul>" +
            "<p>Ohne Krebstiere und ohne Fisch sind zum Beispiel:</p>" +
            karten(mischen(GERICHTE.filter(function (g) { return HAUPT.indexOf(g.kat) !== -1 && !KREBS.test(g.name + " " + g.desc) && !hat(g, "fisch") && g.preis != null && g.nr !== "25"; })).slice(0, 3)) +
            hinweis("Spuren durch gemeinsame Küche sind nicht ausgeschlossen. Bitte informieren Sie beim Bestellen unbedingt das Personal."),
          replies: [["🥛 Und bei Laktose?", "laktose"], ["🍕 Pizza-Finder", "finder"], ["📞 Direkt nachfragen", "anrufen"]]
        };
      }

      case "laktose": {
        var ok = GERICHTE.filter(function (g) {
          return g.kat !== "pizza" && g.kat !== "alforno" && g.kat !== "tortellini" && g.preis != null &&
                 !MILCH.test(g.name + " " + g.desc) && g.nr !== "90";
        });
        var auswahl = ok.filter(function (g) { return HAUPT.indexOf(g.kat) !== -1; });
        return {
          html: "<p>Da schauen wir genau hin! 🥛 Alle Pizzen und alles „Al Forno“ sind mit Käse, viele Pasta-Soßen mit Sahne. <strong>Ohne Käse und Sahne in der Zutatenliste</strong> sind zum Beispiel:</p>" +
            karten(auswahl.slice(0, 8)) +
            "<p>Dazu passen Salate wie Pomodori oder Cetrioli oder die Focaccia Uno.</p>" +
            hinweis("Butter oder Milch in Soßen stehen nicht immer in der Karte. Bitte beim Bestellen „laktosefrei“ sagen."),
          replies: [["🦐 Krebstier-Allergie", "krebs"], ["🌱 Vegane Optionen", "vegan"]]
        };
      }

      case "scharf": {
        var scharf = GERICHTE.filter(function (g) { return hat(g, "scharf"); });
        return {
          html: "<p>Für alle, die es feurig mögen: 🌶🔥</p>" + karten(scharf) +
            "<p class=\"klein\">Tipp: Fragen Sie nach extra Peperoni, falls Ihnen das noch zu harmlos ist. 😉</p>",
          replies: [["🍕 Scharfe Pizza finden", "finder3:scharf"], ["🎲 Überrasch mich", "surprise"]]
        };
      }

      case "budget": {
        var guenstig = GERICHTE.filter(function (g) { return g.preis != null && g.preis < 10 && HAUPT.indexOf(g.kat) !== -1; })
          .sort(function (a, b) { return a.preis - b.preis; });
        return {
          html: "<p>Klar, das geht! 💶 Diese Hauptgerichte gibt es für <strong>unter 10 €</strong>:</p>" + karten(guenstig) +
            "<p class=\"klein\">Kleiner Hunger? Die Focaccia Uno gibt es schon für " + euro(perNr("92").preis) + ".</p>",
          replies: [["👫 Menü für zwei", "menu2"], ["🍕 Pizza-Finder", "finder"]]
        };
      }

      case "zeiten": {
        var st = oeffnungsStatus();
        return {
          html: "<p>" + (st.offen ? "🟢 " : "🔴 ") + "<strong>" + esc(st.text) + "</strong></p>" +
            '<table class="mini-hours">' + zeitenTabelle() + "</table>" +
            "<p>📍 " + esc(R.strasse) + ", " + esc(R.ort) + "</p>",
          replies: [["📞 Tisch reservieren", "anrufen"], ["🗺 Route", "route"]]
        };
      }

      case "anrufen":
        return {
          html: "<p>Am schnellsten geht's telefonisch – das Team hilft gern weiter:</p>" +
            '<p><a class="btn-chat" href="tel:' + R.telefonLink + '">📞 ' + esc(R.telefon) + "</a></p>",
          replies: [["↩︎ Andere Frage", "start"]]
        };

      case "route":
        return {
          html: "<p>Sie finden uns hier:<br><strong>" + esc(R.strasse) + ", " + esc(R.ort) + "</strong></p>" +
            '<p><a class="btn-chat" href="' + ROUTE + '" target="_blank" rel="noopener">🗺 Route in Google Maps</a></p>',
          replies: [["🕐 Öffnungszeiten", "zeiten"], ["↩︎ Andere Frage", "start"]]
        };

      case "naehrwerte":
        return {
          html: "<p>Ehrliche Antwort: Genaue Nährwerte wie Fett oder Kalorien gibt es für unsere Gerichte <strong>noch nicht</strong> – ich möchte Ihnen keine geschätzten Zahlen nennen. 📊</p>" +
            "<p>Wenn Sie etwas Leichteres suchen, schauen Sie sich die gegrillten Gerichte und die Salate an:</p>" +
            karten([perNr("87"), perNr("89"), perNr("101"), perNr("96")]),
          replies: [["🌿 Vegetarische Tipps", "veg"], ["↩︎ Andere Frage", "start"]]
        };

      case "gericht": {
        var g = perNr(arg);
        if (!g) return fallback();
        var extras = [];
        if (g.kat === "pizza") extras.push("Grundbelag: Tomatensoße, Käse und Oregano.");
        if (g.kat === "alforno") extras.push("Wird mit Käse überbacken.");
        if (hat(g, "veg")) extras.push("🌿 Vegetarisch.");
        if (hat(g, "scharf")) extras.push("🌶 Hat Schärfe.");
        if (KREBS.test(g.name + " " + g.desc)) extras.push("🦐 Enthält Krebstiere.");
        else if (hat(g, "fisch")) extras.push("🐟 Enthält Fisch.");
        if (g.nr === "25") extras.push("🎁 Die Überraschung des Chefs – fragen Sie gern, was heute draufkommt.");
        return {
          html: "<p>Gute Wahl! Hier die Details:</p>" + karte(g, extras.join(" ")) +
            "<p class=\"klein\">Alle Allergene nennt Ihnen gern das Personal.</p>",
          replies: [["🍷 Was passt dazu?", "dazu:" + g.nr], ["🎲 Etwas anderes", "surprise"], ["↩︎ Andere Frage", "start"]]
        };
      }

      case "dazu": {
        var h = perNr(arg);
        var vorweg = NUDEL.indexOf(h.kat) !== -1 || h.kat === "pizza"
          ? [perNr("96"), perNr("93")]
          : [perNr("96"), perNr("101")];
        var summe = h.preis + vorweg[0].preis;
        return {
          html: "<p>Zu <strong>" + esc(h.name) + "</strong> empfehle ich vorweg etwas Frisches:</p>" + karten(vorweg) +
            (h.preis != null ? '<p class="klein">' + esc(h.name) + " + " + esc(vorweg[0].name) + " = <strong>" + euro(summe) + "</strong></p>" : ""),
          replies: [["👫 Menü für zwei", "menu2"], ["↩︎ Andere Frage", "start"]]
        };
      }

      case "surprise": {
        var pool = GERICHTE.filter(function (g) { return HAUPT.indexOf(g.kat) !== -1 && g.preis != null; });
        var s = zufall(pool);
        var intro = zufall([
          "Der Steinofen hat gesprochen … 🔥",
          "Trommelwirbel … 🥁",
          "Mein Bauchgefühl sagt heute:",
          "Wenn ich Hunger hätte, würde ich das nehmen:",
          "Mamma mia, heute unbedingt:"
        ]);
        return { html: "<p>" + intro + "</p>" + karte(s), replies: [["🎲 Nochmal!", "surprise"], ["🍷 Was passt dazu?", "dazu:" + s.nr], ["↩︎ Andere Frage", "start"]] };
      }

      /* --- Pizza-Finder in 3 Schritten --- */
      case "finder":
        zustand = {};
        return {
          html: "<p>Los geht's – 3 kurze Fragen, dann weiß ich Ihre Pizza! 🍕</p><p><strong>1/3:</strong> Worauf haben Sie Lust?</p>",
          replies: [["🥩 Mit Fleisch", "finder2:fleisch"], ["🐟 Fisch & Meer", "finder2:fisch"], ["🌿 Vegetarisch", "finder2:veg"]]
        };
      case "finder2":
        zustand = { art: arg };
        return {
          html: "<p><strong>2/3:</strong> Wie mutig sind Sie heute?</p>",
          replies: [["😌 Klassisch", "finder3:mild"], ["🌶 Gern scharf", "finder3:scharf"]]
        };
      case "finder3":
        zustand.schaerfe = arg;
        return {
          html: "<p><strong>3/3:</strong> Und wie groß ist der Hunger?</p>",
          replies: [["🙂 Normal", "finder4:normal"], ["🤤 Riesig!", "finder4:riesig"]]
        };
      case "finder4": {
        zustand.hunger = arg;
        var pizzen = GERICHTE.filter(function (g) { return g.kat === "pizza" && g.preis != null && g.nr !== "25"; });
        var art = zustand.art;
        if (art === "veg") pizzen = pizzen.filter(function (g) { return hat(g, "veg"); });
        else if (art === "fisch") pizzen = pizzen.filter(function (g) { return hat(g, "fisch"); });
        else if (art === "fleisch") pizzen = pizzen.filter(function (g) { return !hat(g, "veg") && /schinken|salami|hähnchen|hackfleisch|peperoniwurst/i.test(g.desc); });
        var bewertet = pizzen.map(function (g) {
          var belag = g.desc.split(/,| und /).length;
          var scharf = hat(g, "scharf") || /peperoni/i.test(g.desc);
          var p = Math.random() * 1.5;
          p += zustand.schaerfe === "scharf" ? (scharf ? 4 : 0) : (scharf ? -3 : 0);
          p += zustand.hunger === "riesig" ? belag * 1.2 : (4 - belag) * 0.6;
          return [p, g];
        }).sort(function (a, b) { return b[0] - a[0]; });
        var top = bewertet.slice(0, 2).map(function (x) { return x[1]; });
        var mutig = zustand.schaerfe === "scharf" && zustand.hunger === "riesig";
        return {
          html: "<p>Ich hab's! 🎯 Für Sie passen perfekt:</p>" + karten(top) +
            (mutig ? '<p class="klein">Ganz mutig? Dann Nr. 25 <strong>Pepe Chef</strong> – lassen Sie sich überraschen! 😏</p>' : ""),
          replies: [["🔁 Nochmal", "finder"], ["🍷 Was passt dazu?", "dazu:" + top[0].nr], ["↩︎ Andere Frage", "start"]]
        };
      }

      /* --- Menü für zwei --- */
      case "menu2": {
        var nurVeg = arg === "veg";
        var passt = function (g) { return g.preis != null && g.nr !== "25" && (!nurVeg || hat(g, "veg")); };
        var vorspeise = zufall(GERICHTE.filter(function (g) { return g.kat === "vorspeisen" && passt(g) && g.nr !== "90"; }));
        var haupt1 = zufall(GERICHTE.filter(function (g) { return g.kat === "pizza" && passt(g); }));
        var haupt2 = zufall(GERICHTE.filter(function (g) { return NUDEL.indexOf(g.kat) !== -1 && passt(g); }));
        var salat = zufall(GERICHTE.filter(function (g) { return g.kat === "salate" && passt(g) && g.preis <= 9.5; }));
        var gang = [vorspeise, salat, haupt1, haupt2];
        var total = gang.reduce(function (s, g) { return s + g.preis; }, 0);
        return {
          html: "<p>Ein kleines Menü für zwei" + (nurVeg ? " (vegetarisch 🌿)" : "") + " – zum Teilen und Genießen: 👫</p>" +
            '<p class="gang">Zum Teilen vorweg</p>' + karten([vorspeise, salat]) +
            '<p class="gang">Hauptgänge</p>' + karten([haupt1, haupt2]) +
            '<p class="summe">Zusammen: <strong>' + euro(total) + "</strong> <span>(" + euro(total / 2) + " pro Person, ohne Getränke)</span></p>",
          replies: [["🎲 Anderes Menü", nurVeg ? "menu2:veg" : "menu2"], nurVeg ? ["🥩 Mit Fleisch & Fisch", "menu2"] : ["🌿 Vegetarisch", "menu2:veg"], ["📞 Tisch reservieren", "anrufen"]]
        };
      }
    }
    return fallback();
  }

  function fallback() {
    return {
      html: "<p>Hmm, da bin ich noch überfragt. 🤔 In dieser Demo kenne ich erst ein paar Themen – später beantworte ich hier jede Frage zur Karte.</p>" +
        '<p>Oder direkt anrufen: <a href="tel:' + R.telefonLink + '">' + esc(R.telefon) + "</a></p>",
      replies: STANDARD
    };
  }

  /* ---------- Freitext → Aktion (wird später durch n8n ersetzt) ---------- */
  var NAMEN = GERICHTE.map(function (g) { return g; }).sort(function (a, b) { return b.name.length - a.name.length; });
  function antworteAufText(text) {
    var t = text.toLowerCase();

    // Nummer, z.B. "Nr. 34" / "nummer 34"
    var nr = t.match(/(?:nr\.?|nummer)\s*(\d{1,3}a?)/);
    if (nr) {
      var n = nr[1].length === 1 ? "0" + nr[1] : nr[1];
      if (perNr(n)) return fuehreAus("gericht:" + n);
    }

    var regeln = [
      [/vegan/, "vegan"],
      [/krebs|krabbe|garnele|shrimp|scampi|meeresfr|schalentier/, "krebs"],
      [/laktose|lactose|milch/, "laktose"],
      [/fett|kalorie|kcal|nährwert|naehrwert|diät|abnehm/, "naehrwerte"],
      [/gluten|zöliak|zoeliak|weizen/, "gluten"],
      [/allergi|allergen|nuss|unverträglich/, "allergie"],
      [/vegetar|kein fleisch|ohne fleisch|fleischlos|veggie/, "veg"],
      [/scharf|würzig|chili|feurig/, "scharf"],
      [/günstig|guenstig|billig|preiswert|budget|unter \d+|wenig geld|studentenfutter/, "budget"],
      [/zwei|2 personen|pärchen|date|menü|menu|zu zweit/, "menu2"],
      [/überrasch|zufall|egal|weiß nicht|weiss nicht|keine ahnung/, "surprise"],
      [/offen|geöffnet|öffnungs|uhrzeit|ruhetag|heute|wann/, "zeiten"],
      [/reserv|tisch|telefon|anruf/, "anrufen"],
      [/adresse|wo seid|wo ist|anfahrt|route|parken|finden/, "route"],
      [/empfehl|lecker|beste|tipp|was soll ich|lust auf pizza|welche pizza/, "finder"],
      [/kind/, "kinder"],
      [/danke|grazie|merci/, "danke"],
      [/^(hallo|hi|hey|ciao|servus|moin|guten)/, "hallo"]
    ];

    // Gericht beim Namen genannt?
    var treffer = NAMEN.filter(function (g) { return t.indexOf(g.name.toLowerCase()) !== -1; });
    if (treffer.length) {
      var name = treffer[0].name;
      var gleich = treffer.filter(function (g) { return g.name === name; });
      if (gleich.length === 1) return fuehreAus("gericht:" + gleich[0].nr);
      return {
        html: "<p>„" + esc(name) + "“ gibt es bei uns gleich " + gleich.length + "-mal:</p>" + karten(gleich),
        replies: gleich.slice(0, 3).map(function (g) { return ["Mehr zu " + g.katTitel + " " + g.name, "gericht:" + g.nr]; })
      };
    }

    for (var i = 0; i < regeln.length; i++) {
      if (!regeln[i][0].test(t)) continue;
      var a = regeln[i][1];
      if (a === "gluten") return {
        html: "<p>Glutenfreie Gerichte sind auf der Karte leider nicht gekennzeichnet. Pizza- und Nudelteig enthalten normalerweise Weizen. 🌾</p>" +
          "<p>Ohne Teig und Nudeln sind zum Beispiel die Grillgerichte:</p>" + karten([perNr("85"), perNr("87"), perNr("89")]) +
          hinweis("Soßen und Panaden können Gluten enthalten. Bitte vor der Bestellung beim Personal nachfragen."),
        replies: [["📞 Direkt nachfragen", "anrufen"], ["🥛 Laktose", "laktose"]]
      };
      if (a === "allergie") return {
        html: "<p>Allergien nehme ich ernst! 💛 Die vollständige Allergenliste liegt im Restaurant vor. Bei diesen Themen kann ich schon jetzt helfen:</p>",
        replies: [["🦐 Krebstiere", "krebs"], ["🥛 Laktose", "laktose"], ["🌾 Gluten", "glutenfrage"], ["📞 Personal fragen", "anrufen"]]
      };
      if (a === "kinder") return {
        html: "<p>Eine eigene Kinderkarte gibt es nicht, aber diese Klassiker kommen bei Kindern immer gut an: 👧🧒</p>" +
          karten([perNr("01"), perNr("37"), perNr("38")]) + "<p class=\"klein\">Ob eine kleinere Portion möglich ist, fragen Sie am besten direkt.</p>",
        replies: STANDARD
      };
      if (a === "danke") return { html: "<p>Prego! 😊 Buon appetito und bis bald bei da Pepe!</p>", replies: STANDARD };
      if (a === "hallo") return { html: "<p>Ciao! 👋 Was darf's sein?</p>", replies: ALLE_FRAGEN };
      return fuehreAus(a);
    }
    return fallback();
  }

  /* ---------- Teaser (einmal pro Sitzung, nur am Handy) ---------- */
  var teaser = document.querySelector(".chat-teaser");
  function teaserWeg() { teaser.hidden = true; try { sessionStorage.setItem("pepino-teaser", "1"); } catch (e) {} }
  teaser.querySelector(".chat-teaser__x").addEventListener("click", teaserWeg);
  var schonGesehen = false;
  try { schonGesehen = sessionStorage.getItem("pepino-teaser") === "1"; } catch (e) {}
  if (!schonGesehen) setTimeout(function () { if (chat.hidden && aiAn()) teaser.hidden = false; }, 4000);

  window.PepinoChat = { oeffnen: oeffneChat };
})();
