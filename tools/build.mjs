/*
 * Build-Skript: schreibt die Speisekarte FEST ins HTML (für Google & ohne JavaScript lesbar).
 *
 *   node tools/build.mjs
 *
 * Quelle bleibt assets/speisekarte.js. Das Skript ersetzt in den HTML-Dateien alles
 * zwischen  <!-- BUILD:name -->  und  <!-- /BUILD:name -->  und erzeugt sitemap.xml + robots.txt.
 * Läuft auch automatisch per GitHub Action bei jedem Push (.github/workflows/build.yml).
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const lies = (f) => readFileSync(join(ROOT, f), "utf8");

// speisekarte.js ausführen und window.SPEISEKARTE auslesen
const sandbox = { window: {} };
vm.runInNewContext(lies("assets/speisekarte.js"), sandbox);
const DATA = sandbox.window.SPEISEKARTE;
const R = DATA.restaurant;
const SITE = R.website;

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const TAGS = { veg: "vegetarisch", fisch: "Fisch", scharf: "scharf" };
const euro = (n) => n.toFixed(2).replace(".", ",");
const TAG_EN = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/* ---------- Bausteine (identisches Markup wie vorher per JavaScript) ---------- */
function katNav() {
  return DATA.kategorien.map((k) => `<a href="#${k.id}" data-cat="${k.id}">${esc(k.titel)}</a>`).join("\n      ");
}

function gericht(k, g) {
  const tags = g.tags || [];
  const suchtext = `${g.nr} ${g.name} ${g.desc} ${k.titel} ${tags.map((t) => TAGS[t]).join(" ")}`.toLowerCase();
  const preis = g.preis != null
    ? `<span class="dish__price">${euro(g.preis)}</span>`
    : `<span class="dish__price dish__price--na">auf Anfrage</span>`;
  const tagHtml = tags.length
    ? `<div class="dish__tags">${tags.map((t) => `<span class="tag tag--${t}">${TAGS[t]}</span>`).join("")}</div>`
    : "";
  return `<li class="dish${g.pruefen ? " is-pruefen" : ""}" id="g-${esc(g.nr)}" data-tags="${tags.join(" ")}" data-suche="${esc(suchtext)}">` +
    `<span class="dish__nr">${esc(g.nr)}</span>` +
    `<h3 class="dish__name">${esc(g.name)}</h3>` +
    preis +
    `<p class="dish__desc">${esc(g.desc)}</p>` +
    `<button class="dish__ask ai-only" type="button" data-frag-gericht="${esc(g.nr)}" aria-label="Pepino zu ${esc(g.name)} fragen" title="Pepino fragen">💬</button>` +
    tagHtml +
    `</li>`;
}

function karte() {
  return DATA.kategorien.map((k) =>
    `<section class="menu-cat" id="${k.id}">\n` +
    `      <h2 class="brush">${esc(k.titel)}</h2>\n` +
    (k.untertitel ? `      <p class="menu-cat__sub">${esc(k.untertitel)}</p>\n` : "") +
    `      <ul class="dishes">\n` +
    k.gerichte.map((g) => "        " + gericht(k, g)).join("\n") +
    `\n      </ul>\n    </section>`
  ).join("\n    ");
}

function kategorieKarten() {
  const hervorheben = ["pizza", "spaghetti", "tagliatelle", "alforno", "rind", "salate"];
  return hervorheben.map((id) => {
    const k = DATA.kategorien.find((c) => c.id === id);
    const preise = k.gerichte.map((g) => g.preis).filter((p) => p != null);
    const meta = k.untertitel && k.untertitel.length < 30 ? k.untertitel : `${k.gerichte.length} Gerichte`;
    return `<a class="card" href="speisekarte.html#${k.id}"><h3 class="card__title">${esc(k.titel)}</h3>` +
      `<div class="card__meta">${esc(meta)}</div><div class="card__price">ab ${euro(Math.min(...preise))} €</div></a>`;
  }).join("\n        ");
}

function zeitenTabelle() {
  return R.oeffnungszeiten.map((o) => {
    const z = o.zeiten.length ? o.zeiten.map((x) => `${x[0]} – ${x[1]}`).join("<br>") : "Ruhetag";
    return `<tr><td>${esc(o.label)}</td><td>${z}</td></tr>`;
  }).join("");
}

/* ---------- Strukturierte Daten (schema.org, JSON-LD) ---------- */
const [plz, ...ortTeile] = R.ort.split(" ");
function restaurantLd(mitMenue) {
  const ld = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": SITE + "#restaurant",
    name: R.name,
    url: SITE,
    image: SITE + "assets/og-image.png",
    telephone: "+49 7571 7494040",
    servesCuisine: ["Italienisch", "Pizza", "Pasta"],
    priceRange: R.preisspanne,
    address: {
      "@type": "PostalAddress",
      streetAddress: R.strasse,
      postalCode: plz,
      addressLocality: ortTeile.join(" "),
      addressRegion: "Baden-Württemberg",
      addressCountry: "DE"
    },
    openingHoursSpecification: R.oeffnungszeiten.flatMap((o) =>
      o.zeiten.map((z) => ({ "@type": "OpeningHoursSpecification", dayOfWeek: o.tage.map((t) => TAG_EN[t]), opens: z[0], closes: z[1] }))
    ),
    acceptsReservations: "True",
    hasMenu: SITE + "speisekarte.html"
  };
  if (mitMenue) {
    ld.hasMenu = {
      "@type": "Menu",
      name: "Speisekarte " + R.name,
      url: SITE + "speisekarte.html",
      inLanguage: "de",
      hasMenuSection: DATA.kategorien.map((k) => ({
        "@type": "MenuSection",
        name: k.titel,
        ...(k.untertitel ? { description: k.untertitel } : {}),
        hasMenuItem: k.gerichte.map((g) => ({
          "@type": "MenuItem",
          name: g.name,
          description: g.desc,
          ...(g.preis != null ? { offers: { "@type": "Offer", price: g.preis.toFixed(2), priceCurrency: "EUR" } } : {}),
          ...((g.tags || []).includes("veg") ? { suitableForDiet: "https://schema.org/VegetarianDiet" } : {})
        }))
      }))
    };
  }
  // "</" darf in einem <script> nicht vorkommen
  return `<script type="application/ld+json">\n${JSON.stringify(ld, null, 2).replace(/</g, "\\u003c")}\n  </script>`;
}

/* ---------- Meta-Tags (Canonical, Open Graph für WhatsApp/Facebook-Vorschau) ---------- */
function metaTags(html, seite) {
  const titel = (html.match(/<title>([^<]*)<\/title>/) || [])[1];
  const beschr = (html.match(/<meta name="description" content="([^"]*)">/) || [])[1];
  const url = SITE + (seite === "index.html" ? "" : seite);
  return [
    `<link rel="canonical" href="${url}">`,
    `<meta property="og:type" content="restaurant">`,
    `<meta property="og:locale" content="de_DE">`,
    `<meta property="og:site_name" content="${esc(R.name)}">`,
    `<meta property="og:title" content="${titel}">`,
    `<meta property="og:description" content="${beschr}">`,
    `<meta property="og:url" content="${url}">`,
    `<meta property="og:image" content="${SITE}assets/og-image.png">`,
    `<meta property="og:image:width" content="1200">`,
    `<meta property="og:image:height" content="630">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<link rel="apple-touch-icon" href="assets/apple-touch-icon.png">`
  ].join("\n  ");
}

/* ---------- Ersetzen zwischen Markern ---------- */
function ersetze(html, name, inhalt, datei) {
  const re = new RegExp(`(<!-- BUILD:${name} -->)[\\s\\S]*?(<!-- /BUILD:${name} -->)`);
  if (!re.test(html)) throw new Error(`Marker BUILD:${name} fehlt in ${datei}`);
  return html.replace(re, (_, a, b) => `${a}\n  ${inhalt}\n  ${b}`);
}

function baue(datei, bloecke) {
  let html = lies(datei);
  for (const [name, fn] of Object.entries(bloecke)) html = ersetze(html, name, fn(html), datei);
  writeFileSync(join(ROOT, datei), html);
}

baue("index.html", {
  meta: (h) => metaTags(h, "index.html"),
  jsonld: () => restaurantLd(false),
  "kategorie-karten": kategorieKarten,
  oeffnungszeiten: zeitenTabelle
});
baue("speisekarte.html", {
  meta: (h) => metaTags(h, "speisekarte.html"),
  jsonld: () => restaurantLd(true),
  "kat-nav": katNav,
  karte
});

/* ---------- sitemap.xml & robots.txt ---------- */
const heute = new Date().toISOString().slice(0, 10);
writeFileSync(join(ROOT, "sitemap.xml"),
`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${SITE}</loc><lastmod>${heute}</lastmod></url>
  <url><loc>${SITE}speisekarte.html</loc><lastmod>${heute}</lastmod></url>
</urlset>
`);
writeFileSync(join(ROOT, "robots.txt"),
`User-agent: *
Allow: /

Sitemap: ${SITE}sitemap.xml
`);

const anzahl = DATA.kategorien.reduce((s, k) => s + k.gerichte.length, 0);
console.log(`✓ ${anzahl} Gerichte in ${DATA.kategorien.length} Kategorien fest ins HTML geschrieben (${SITE})`);
