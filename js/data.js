/* ============================================================
   Inhalte der Website. Alles, was sich ändert, steht hier.
   Neues Projekt: einen Eintrag in "projekte" ergänzen.
   Die Reihenfolge hier ist die Reihenfolge auf der Seite.
   ============================================================ */
window.SITE = {
  name: "Kilian Einig",
  ort: "Mainz / Antwerpen",
  email: "kilianeinig@gmx.de",
  stand: "Oktober 2026",



  projekte: [
    {
      id: "woven",
      titel: "Woven",
      art: "Möbel",
      stand: "Realisiert",
      kurz: "Stuhl aus alten Messebauplanen und Stahl.",
      text: [
        "Die grafische, dreidimensionale Sitzfläche entsteht durch Weben, Nähen und Spannen. Gepolsterte Textilstreifen werden in ein reduziertes, selbst geschweißtes Stahlgestell gespannt – austauschbar und nachspannbar.",
        "Die Verbindung aus Designentscheidung und konstruktiver Logik ist hier keine Ergänzung, sondern der Kern."
      ],
      fakten: [["Material", "Messebauplanen, Stahl, Klett, Watte"], ["Thema", "Graphics Go 3D"]],
      bild: "img/woven-hero.webp", fokus: "50% 70%",
      bildAlt: "Zwei Woven Loungesessel in Pink und Schwarz, eine Person geht unscharf vorbei",
      zweitbild: "img/woven-detail.webp",
      schritte: [
        ["img/woven-step1.webp", "Gestell", "Ein reduziertes Metallgestell, selbst geschweißt. Es trägt, ohne sich in den Vordergrund zu stellen."],
        ["img/woven-step2.webp", "Weben", "Die Textilstreifen werden im Sitzbereich verwebt und abwechselnd nach oben und unten in das Gestell gespannt."],
        ["img/woven-step3.webp", "Sitzen", "Mit Watte gefüllt und per Klett fixiert, lässt sich die Sitzfläche austauschen und nachspannen."]
      ],
      galerie: [
        ["img/woven-detail.webp", "Gewebte Sitzfläche und schwarzes Stahlgestell"],
        ["img/woven-cushion.webp", "Gepolsterte Streifen in Pink, Orange und Mint"]
      ]
    },
    {
      id: "hochstapler",
      titel: "Hochstapler",
      art: "Architektur",
      stand: "Geplant",
      kurz: "Neues Wohnkonzept mit Fokus auf Gemeinschaft.",
      text: [
        "Drei Zeilenhäuser von Ernst May im Neuen Frankfurt werden zu einem zusammenhängenden Wohnkomplex. Zwei Wohnhäuser umschließen ein Gemeinschaftshaus, das alle Bewohner*innen flexibel nutzen. Der Einzug ist eine bewusste Entscheidung für ein soziales, ökologisches und gemeinschaftliches Wohnen.",
        "In den beiden Wohnhäusern liegen je 28 gleich aufgebaute Schlafkammern, privat gemietete Kapseln mit ein bis zwei Schlafplätzen. Im Gemeinschaftshaus lösen Höhenversätze die trennenden Etagen auf: unten ankommen und sich aufhalten, eine halbe Ebene höher gemeinsam kochen und essen, immer mit Blick in den Wohnraum.",
        "Im 4. Semester haben wir den Entwurf bis in die Werkplanung durchgearbeitet. Um den Bestand zu schonen, erschließt ein eigenes System die Kammern: Die Kammerwand steht als eigenständiges Volumen im Raum, rundum von einem Schacht umgeben, über Einzeltreppen betritt man jede Kapsel. Roher Beton und Stahlgitter markieren Bewegung und Begegnung, Holz steht für Wärme und Rückzug, Rot, Gelb, Lila und Grün setzen Akzente."
      ],
      fakten: [["Team", "Teamprojekt, drei Personen"], ["Kontext", "HS Mainz, 3. und 4. Semester, 2025/26"], ["Ort", "Neues Frankfurt, Zeilenhäuser von Ernst May"], ["Umfang", "Entwurf, Werkplanung, Details, technischer Ausbau"]],
      bild: "img/hs-kammerleben.webp", hell: true,
      bildAlt: "Collage: drei gestapelte L-förmige Schlafkammern, in jeder liegt ein Mensch",
      zweitbild: "img/hs-kammern.webp",
      galerie: [
        ["img/hs-konzept.webp", "Konzept: L-förmige Kammern, gestapelt im Hausvolumen"],
        ["img/hs-kammern.webp", "Die Kammerwand von unten"],
        ["img/hs-schacht.webp", "Schacht und Einzeltreppen entlang der Kammerwand"],
        ["img/hs-p13.webp", "Gemeinschaftshaus"],
        ["img/hs-p22.webp", "Schnitt A-A durch die gestapelten Kammern"],
        ["img/hs-model.webp", "Arbeitsmodell aus Holz"]
      ]
    },
    {
      id: "lmp01",
      titel: "LMP 01",
      art: "Licht",
      stand: "Realisiert",
      interaktiv: "lamellen",
      kurz: "Leuchte, die auf Sensorik reagiert.",
      text: "Ein linearer Träger fasst vertikale Acryl-Lamellen zu einer präzisen Serie. Sensoren registrieren Annäherung und Bewegung, die LEDs schalten nacheinander ein oder aus. Die Lichtquelle bleibt unsichtbar – sichtbar wird das Licht erst im Material. Die Arbeit dekoriert nicht, sie macht Bewegung zum Teil der Komposition.",
      fakten: [["Material", "Acryl, Stahl, LED"], ["Steuerung", "Sensoren für Nähe und Bewegung"]],
      bild: "img/lmp-hero.webp",
      bildAlt: "LMP 01 leuchtet warm im dunklen Raum, dahinter eine Person in Bewegung",
      zweitbild: "img/lmp-hand.webp",
      galerie: [
        ["img/lmp-hand.webp", "Eine Hand vor den Lamellen, nur ein Teil leuchtet"],
        ["img/lmp-tall.webp", "Seitenansicht der Lamellen in warmem Gelb"],
        ["img/lmp-plate.webp", "Namensschild am schwarzen Träger"]
      ]
    },
    {
      id: "lmp02",
      titel: "LMP 02",
      art: "Licht",
      stand: "Prototyp",
      interaktiv: "konfigurator",
      kurz: "Leuchte mit verschiedenen Lichtebenen.",
      hinweis: "Prototyp: funktionierendes Modell aus MDF. Die Version in Aluminium ist geplant und existiert bisher nur als Rendering.",
      text: "Zwei LED-Streifen leuchten in zwei Schichten. Jede Schicht hat einen Regler für Helligkeit und einen für Farbe. Über eine Weboberfläche, die direkt auf dem ESP32 läuft, lassen sich Farben exakt wählen und als Presets speichern. Entwurf, Programmierung, gelaserte Bauteile und Elektrik sind komplett selbst gemacht.",
      fakten: [["Stand", "Prototyp aus MDF, Version in Aluminium geplant"], ["Steuerung", "ESP32, 4 Drehregler, Web-App"], ["Licht", "2 SK6812-LED-Streifen"]],
      bild: "img/lmp02-render.webp",
      bildAlt: "LMP 02 in gebürstetem Aluminium, die Lichtfläche leuchtet türkis mit rotem Kern",
      uebersicht: "img/lmp02-uebersicht.webp",
      zweitbild: "img/lmp02-gruen.webp",
      galerie: [
        ["img/lmp02-explosion.webp", "Aufbau: Frontrahmen, LED-Ring vorne, Bowl, Gehäuse, LED-Ring hinten, Rückwand"],
        ["img/lmp02-tief.webp", "Entwurf in gebürstetem Aluminium, von unten"],
        ["img/lmp02-loop.mp4", "Prototyp aus MDF in Betrieb", "img/lmp02-poster.webp"]
      ]
    },
    {
      id: "regal",
      titel: "Re:gal",
      art: "Architektur",
      stand: "Geplant",
      kurz: "Repair Café als Stadtzentrum.",
      text: [
        "Ein Repair Café im dichten Stadtraum von Mainz, gedacht als architektonische Zurückhaltung. Ein schlankes Volumen schafft Freiraum und überlässt dem Platz die Hauptrolle.",
        "Zentrales Element ist das Regal: innen Lagerfläche für die Werkstatt, außen offenes Bücherregal für alle. Es wird zur Schnittstelle zwischen Architektur, Nutzung und öffentlichem Raum.",
        "Vertikale Lamellen strukturieren die Fassade, geben Sonnenschutz und übersetzen das Regal nach außen. Ihre Dichte nimmt entlang des Gebäudes zu und folgt der Raumfolge innen, vom offenen Café bis zum abgeschirmten Arbeitsraum. So entsteht ein Ort, der Sichtbarkeit und Rückzug gleichermaßen erlaubt."
      ],
      fakten: [["Team", "Teamprojekt, zwei Personen"], ["Kontext", "HS Mainz, BA 2, SoSe 25, Konstruktives Projekt"], ["Fläche", "83 m² Repair Café, 31 m² Terrasse mit Bücherecke"], ["Pläne", "1:50, Details 1:5"]],
      bild: "img/regal-model.webp", fokus: "50% 70%",
      bildAlt: "Modell des Repair Cafés mit Lamellenfassade, davor ein Modellbaum",
      zweitbild: "img/regal-ansichten.webp", zweitHell: true,
      galerie: [
        ["img/regal-lageplan.webp", "Lageplan: der Platz im Mainzer Stadtraum"],
        ["img/regal-ansichten.webp", "Ansichten West, Nord, Ost, Süd 1:50"],
        ["img/regal-plan.webp", "Grundriss, Schnitte und Fassade 1:50, Details 1:5"]
      ]
    },
    {
      id: "lmp03",
      titel: "LMP 03",
      art: "Licht",
      stand: "Entwurf",
      bildLabel: "Rendering",
      kurz: "Leuchtstab im Glasrohr.",
      hinweis: "Entwurf: bisher nur als Rendering, noch nicht gebaut.",
      text: "Ein opaler LED-Stab liegt in einem klaren Glasrohr. Zwei Kappen aus gebürstetem Aluminium schließen das Rohr ab, ein Lochraster in den Stirnseiten lässt die Wärme entweichen. Zwei Stahlseile halten die Leuchte frei im Raum.",
      fakten: [["Stand", "Gerendert in Blender"], ["Material", "Glas, Aluminium, Stahlseil"], ["Länge", "ca. 1,4 m"]],
      bild: "img/lmp03-hero.webp",
      bildAlt: "Rendering von LMP 03: leuchtender Stab in einem Glasrohr mit Aluminiumkappen vor heller Wand",
      zweitbild: "img/lmp03-detail.webp",
      galerie: [["img/lmp03-detail.webp", "Kappe aus gebürstetem Aluminium mit Lochraster"]]
    },
    {
      id: "skelettstuhl",
      titel: "Rib Chair",
      art: "Möbel",
      stand: "Entwurf",
      bildLabel: "3D-Modell",
      kurz: "Futuristischer Stuhlentwurf.",
      hinweis: "Entwurf: eine Idee als 3D-Modell, noch nicht gebaut.",
      text: "Eine geschwungene Wirbelsäule trägt Sitz und Lehne. Von ihr gehen gebogene Rippen ab, die zusammen die Sitzfläche und den Rücken bilden. Der Entwurf ist in Rhino modelliert.",
      fakten: [["Stand", "3D-Entwurf in Rhino"]],
      bild: "img/skelett-render.webp", hell: true,
      bildAlt: "Rendering des Rib Chair: eine geschwungene Wirbelsäule mit gebogenen Rippen als Sitz und Lehne",
      zweitbild: "img/skelett-skizze.webp",
      galerie: [["img/skelett-skizze.webp", "Überarbeitung: Markierungen für Kopf, Lehne und Sitz"]]
    }
  ],

  /* Kleine digitale Projekte, laufen direkt im Browser */
  apps: [
    { titel: "HiChord", art: "Instrument", text: "Ein Akkord-Synthesizer zum Spielen: Tonart wählen, Pads drücken, Drums und Filter dazu.", link: "apps/hichord/" },
    { titel: "Baugeschichte II", art: "Lern-App", text: "Lernkarten von der Aufklärung bis zum Dekonstruktivismus, mit Wiederholungsrhythmus, Stil-Lexikon und Quiz.", link: "apps/lernkarten/" }
  ],

  /* Startseite: Was ich mache. link = Projekt, das man beim Klick öffnet */
  felder: [
    { titel: "Möbel", text: "Entwurf und Bau in der Werkstatt, vom geschweißten Stahlgestell bis zur gewebten Sitzfläche.", link: "woven" },
    { titel: "Leuchten", text: "Licht mit eigener Elektronik und Software, gesteuert über Sensoren, Drehregler oder App.", link: "lmp01" },
    { titel: "Räume", text: "Innenarchitektur und kleine Bauten, vom Entwurf bis in die Werkplanung.", link: "hochstapler" }
  ],

  zitat: "Ich entwerfe nicht nur am Rechner, sondern baue meine Projekte selbst in der Werkstatt.",
  ueber: [
    "Ich bin gelernter Mechatroniker und studiere Innenarchitektur an der Hochschule Mainz. Zurzeit verbringe ich ein Semester in Antwerpen."
  ],
  werkzeuge: ["Rhino", "Blender", "ESP32", "Schweißen", "Lasercut"],

  /* Zahlen-Leiste: n wird hochgezählt */
  zahlen: [
    { n: 7, label: "Projekte" },
    { n: 3, label: "Leuchten" },
    { n: 2, label: "Apps" },
    { n: 56, label: "Schlafkammern im Hochstapler" }
  ],

  ablauf: [
    ["Entwurf", "Skizzen, Konzepte und Pläne. Architekturprojekte entstehen im Team."],
    ["Modell", "Am Rechner als 3D-Modell, oft auch als Arbeitsmodell aus Holz."],
    ["Bauen", "In der Werkstatt: schweißen, lasern, nähen, verdrahten."],
    ["Programmieren", "Die Leuchten bekommen eigene Steuerungen und Weboberflächen."]
  ],
  portrait: "img/portrait.webp"
};
