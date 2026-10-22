/* Kilian Einig – Startseite und Projektseiten.
   Inhalte kommen aus data.js. Die Seite erkennt sich an <body data-page="home|projekt">. */
(function () {
  var S = window.SITE, D = window.DIMS || {}, B = document.body, PAGE = B.dataset.page;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var two = function (n) { return (n < 10 ? '0' : '') + n; };
  var dims = function (src) { return D[src] ? ' width="' + D[src][0] + '" height="' + D[src][1] + '"' : ''; };
  var url = function (p) { return 'projekt.html?id=' + encodeURIComponent(p.id); };

  if ($('foot')) $('foot').textContent = S.name + ' · ' + S.stand;

  /* Kopfzeile: Linie beim Scrollen; auf der Startseite erscheint der Name erst nach dem Auftakt */
  var hd = $('top'), hero = $('start');
  function onScroll() {
    hd.classList.toggle('scrolled', scrollY > 8);
    if (hero) hd.classList.toggle('past', hero.getBoundingClientRect().bottom < 80);
  }
  if (hd) { window.addEventListener('scroll', onScroll, { passive: true }); onScroll(); }

  /* ================= Startseite ================= */
  if (PAGE === 'home') {
    $('works').innerHTML = S.projekte.map(function (p, i) {
      var a = p.uebersicht || p.bild;
      return '<article class="work" id="p-' + esc(p.id) + '" data-i="' + i + '">' +
        '<a href="' + url(p) + '">' +
          '<div class="ph' + (p.hell ? ' light' : '') + '">' +
            '<img src="' + esc(a) + '" alt="' + esc(p.bildAlt) + '"' + dims(a) + (i ? ' loading="lazy"' : '') + ' decoding="async"' + (p.fokus ? ' style="object-position:' + esc(p.fokus) + '"' : '') + '>' +
          '</div>' +
          '<div class="cap">' +
            '<h2>' + esc(p.titel) + '</h2>' +
            '<p class="kurz">' + esc(p.kurz) + '</p>' +
            '<span class="go">Ansehen <span aria-hidden="true">→</span></span>' +
          '</div>' +
        '</a></article>';
    }).join('');

    $('about-text').innerHTML = S.ueber.map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('');
    $('app-list').innerHTML = S.apps.map(function (a) {
      return '<li><a href="' + esc(a.link) + '"><h3>' + esc(a.titel) + '</h3><p>' + esc(a.text) + '</p><span class="go">Öffnen <span aria-hidden="true">→</span></span></a></li>';
    }).join('');
    $('mail').href = 'mailto:' + S.email; $('mail').textContent = S.email;

    /* Der eine große Moment: Die Kerbe schneidet sich in den Block */
    (function () {
      var poly = $('kerbe');
      var set = function (x) { poly.setAttribute('points', '10,10 100,10 100,40 ' + x.toFixed(2) + ',60 100,80 100,110 10,110'); };
      if (reduce) return;
      var back = function (p) { var c = 1.6; return 1 + (c + 1) * Math.pow(p - 1, 3) + c * Math.pow(p - 1, 2); };
      var t0 = null; set(100);
      requestAnimationFrame(function step(t) {
        if (t0 === null) t0 = t;
        var p = Math.min(1, Math.max(0, (t - t0 - 300) / 850));
        set(100 - 40 * back(p));
        if (p < 1) requestAnimationFrame(step);
      });
    })();
  }

  /* ================= Projektseite ================= */
  if (PAGE === 'projekt') {
    var id = new URLSearchParams(location.search).get('id');
    var i = S.projekte.findIndex(function (p) { return p.id === id; });
    if (i < 0) { location.replace('./#projekte'); return; }
    var p = S.projekte[i], nx = S.projekte[(i + 1) % S.projekte.length];
    document.title = p.titel + ' · Kilian Einig';

    var heroImg = p.interaktiv === 'konfigurator' ? konfig() :
      '<figure class="pp-hero' + (p.hell ? ' light' : '') + '">' + (p.bildLabel ? '<span class="blabel meta">' + esc(p.bildLabel) + '</span>' : '') +
      '<img src="' + esc(p.bild) + '" alt="' + esc(p.bildAlt) + '"' + dims(p.bild) + ' decoding="async" fetchpriority="high"' + (p.fokus ? ' style="object-position:' + esc(p.fokus) + '"' : '') + '></figure>';

    var lam = p.interaktiv === 'lamellen' ?
      '<div class="stage-dark lamellen" id="lmp01-lamellen" role="img" aria-label="Simulation von LMP 01: Lamellen leuchten auf, wenn sich Maus oder Finger nähern"><canvas></canvas><p class="hint">Fahr mit Maus oder Finger über die Lamellen.</p></div>' : '';

    var steps = (p.schritte || []).length ? '<ol class="steps">' + p.schritte.map(function (s, k) {
      return '<li><img src="' + esc(s[0]) + '" alt="' + esc(s[1]) + '"' + dims(s[0]) + ' loading="lazy" decoding="async"><h3><span>' + (k + 1) + '</span>' + esc(s[1]) + '</h3><p>' + esc(s[2]) + '</p></li>';
    }).join('') + '</ol>' : '';

    var gal = (p.galerie || []).length ? '<div class="gal">' + p.galerie.map(function (g) {
      var d = D[g[0]], wide = d && d[0] > d[1] * 1.6;
      var media = /\.mp4$/.test(g[0]) ?
        '<video src="' + esc(g[0]) + '" poster="' + esc(g[2] || '') + '" muted loop playsinline controls preload="metadata" aria-label="' + esc(g[1]) + '"></video>' :
        '<button type="button" class="zoom" aria-label="' + esc(g[1]) + ', groß ansehen"><img src="' + esc(g[0]) + '" alt="' + esc(g[1]) + '"' + dims(g[0]) + ' loading="lazy" decoding="async"></button>';
      return '<figure class="' + (wide ? 'wide' : '') + '">' + media + '<figcaption>' + esc(g[1]) + '</figcaption></figure>';
    }).join('') + '</div>' : '';

    var facts = [['Art', p.art], ['Stand', p.stand]].concat(p.fakten || []).map(function (f) { return '<div><dt class="meta">' + esc(f[0]) + '</dt><dd>' + esc(f[1]) + '</dd></div>'; }).join('');

    $('projekt').innerHTML =
      '<div class="wrap">' +
        '<header class="pp-head">' +
          '<a class="back" href="./#p-' + esc(p.id) + '">← Alle Projekte</a>' +
          '<h1 class="pp-title"><span>' + esc(p.titel) + '</span></h1>' +
          '<p class="pp-kurz">' + esc(p.kurz) + '</p>' +
        '</header>' +
        heroImg +
        '<div class="pp-body"><dl>' + facts + '</dl><div class="txt">' + [].concat(p.text).map(function (t) { return '<p>' + esc(t) + '</p>'; }).join('') +
          (p.hinweis ? '<p class="hinweis">' + esc(p.hinweis) + '</p>' : '') + '</div></div>' +
        lam + steps + gal +
        '<a class="next" href="' + url(nx) + '"><span class="meta">Nächstes Projekt</span><strong>' + esc(nx.titel) + ' <span aria-hidden="true">→</span></strong></a>' +
      '</div>';

    /* Großansicht für Galeriebilder */
    var lb = $('lb');
    document.addEventListener('click', function (e) {
      var z = e.target.closest && e.target.closest('.zoom');
      if (z) {
        var im = z.querySelector('img');
        lb.querySelector('img').src = im.src; lb.querySelector('img').alt = im.alt;
        lb.querySelector('p').textContent = im.alt;
        lb.showModal();
      } else if (e.target === lb || (e.target.closest && e.target.closest('.x'))) lb.close();
    });
  }

  function konfig() {
    var k = [['hv', 'Helligkeit vorne', 'hell'], ['fv', 'Farbe vorne', 'farbe'], ['hh', 'Helligkeit hinten', 'hell'], ['fh', 'Farbe hinten', 'farbe']];
    return '<div class="konfig" id="lmp02-konfig">' +
      '<div class="view"><img src="img/lmp02-render.webp" alt="Rendering von LMP 02 in gebürstetem Aluminium"><canvas role="img" aria-label="LMP 02, live gemischtes Rendering mit den eingestellten Farben"></canvas></div>' +
      '<div class="panel"><div><p class="ptitle">Stell das Licht ein, wie am Objekt.</p><p class="psub">Vier Regler, zwei Ebenen.</p></div>' +
      '<div class="knobs">' + k.map(function (x) { return '<div class="kn ' + x[2] + '"><div class="knob" tabindex="0" role="slider" aria-label="' + x[1] + '" aria-valuemin="0" aria-valuemax="100" data-key="' + x[0] + '" data-kind="' + x[2] + '"></div><span class="lab">' + x[1] + '</span><output></output></div>'; }).join('') + '</div>' +
      '<div><div class="presets" role="group" aria-label="Voreinstellungen">' + ['Aus', 'Abendlicht', 'Türkis, Rot', 'Weiß'].map(function (p) { return '<button type="button" class="preset" data-preset="' + p + '" aria-pressed="false">' + p + '</button>'; }).join('') + '</div>' +
      '<p class="note">Drehen durch Ziehen, Scrollen oder mit den Pfeiltasten.</p></div></div></div>';
  }
})();
