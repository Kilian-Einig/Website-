/* Kilian Einig – Startseite und Projektseiten.
   Inhalte kommen aus data.js. Die Seite erkennt sich an <body data-page="home|projekt">. */
(function () {
  var S = window.SITE, D = window.DIMS || {}, B = document.body, PAGE = B.dataset.page;
  var KEYS = Object.keys(S.disziplinen);
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var two = function (n) { return (n < 10 ? '0' : '') + n; };
  var dims = function (src) { return D[src] ? ' width="' + D[src][0] + '" height="' + D[src][1] + '"' : ''; };
  var url = function (p) { return 'projekt.html?id=' + encodeURIComponent(p.id); };

  /* Drei Felder M I P: gefüllt, wenn die Disziplin im Projekt steckt */
  function code(p) {
    var names = p.disziplinen.map(function (k) { return S.disziplinen[k].name; }).join(', ');
    return '<span class="code" role="img" aria-label="Disziplinen: ' + esc(names) + '">' + KEYS.map(function (k) {
      return '<i class="' + (p.disziplinen.indexOf(k) > -1 ? 'on' : '') + '" aria-hidden="true">' + S.disziplinen[k].kurz + '</i>';
    }).join('') + '</span>';
  }

  if ($('foot')) $('foot').textContent = S.name + ' · Stand ' + S.stand;

  /* Kopfzeile bekommt beim Scrollen eine Linie */
  var hd = $('top');
  if (hd) {
    var onScroll = function () { hd.classList.toggle('scrolled', scrollY > 8); };
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  }

  /* ================= Startseite ================= */
  if (PAGE === 'home') {
    var active = KEYS.slice();
    var count = function (k) { return S.projekte.filter(function (p) { return p.disziplinen.indexOf(k) > -1; }).length; };

    /* Die drei Disziplinen als Schalter */
    $('mixer').innerHTML = '<legend class="vh">Projekte nach Disziplin filtern</legend>' + KEYS.map(function (k, i) {
      return '<button type="button" class="mix" data-k="' + k + '" aria-pressed="true" style="--i:' + i + '">' +
        '<span class="sq" aria-hidden="true"></span><span class="w"><span>' + esc(S.disziplinen[k].name) + '</span></span>' +
        '<span class="n" aria-hidden="true">' + two(count(k)) + '</span></button>';
    }).join('');

    $('filter').innerHTML = '<button type="button" class="chip" data-k="alle" aria-pressed="true">Alle</button>' + KEYS.map(function (k) {
      return '<button type="button" class="chip" data-k="' + k + '" aria-pressed="true"><span class="k" aria-hidden="true">' + S.disziplinen[k].kurz + '</span><span class="t">' + esc(S.disziplinen[k].name) + '</span><span class="vh">' + esc(S.disziplinen[k].name) + '</span></button>';
    }).join('') + '<span class="count meta muted" id="count"></span>';
    // Kurzname nur einmal vorlesen: sichtbarer Text ist aria-hidden auf schmalen Bildschirmen über .vh abgedeckt
    [].forEach.call(document.querySelectorAll('.chip .t'), function (t) { t.setAttribute('aria-hidden', 'true'); });

    /* Projektraster: wechselnde Breiten statt gleicher Kacheln */
    var LAYOUT = [
      { s: 7, r: '4/3' }, { s: 5, r: '4/5', drop: 'clamp(48px,9vw,160px)' },
      { s: 5, r: '4/5' }, { s: 7, r: '4/3', drop: 'clamp(24px,5vw,80px)' }
    ];
    $('works').innerHTML = S.projekte.map(function (p, i) {
      var a = p.uebersicht || p.bild;
      return '<article class="work" data-k="' + p.disziplinen.join(' ') + '">' +
        '<a href="' + url(p) + '">' +
          '<div class="ph' + (p.hell ? ' light' : '') + '">' +
            (p.bildLabel ? '<span class="tag meta">' + esc(p.bildLabel) + '</span>' : '') +
            '<img class="a" src="' + esc(a) + '" alt="' + esc(p.bildAlt) + '"' + dims(a) + ' loading="lazy" decoding="async"' + (p.fokus ? ' style="object-position:' + esc(p.fokus) + '"' : '') + '>' +
            (p.zweitbild ? '<img class="b' + (p.zweitHell ? ' contain' : '') + '" src="' + esc(p.zweitbild) + '" alt=""' + dims(p.zweitbild) + ' loading="lazy" decoding="async">' : '') +
          '</div>' +
          '<div class="cap">' +
            '<span class="nr meta muted">' + two(i + 1) + '</span>' +
            '<h3>' + esc(p.titel) + '<span class="arr" aria-hidden="true">→</span></h3>' +
            '<div class="side">' + code(p) + '<span class="meta muted">' + esc(p.art) + ' · ' + esc(p.stand) + '</span></div>' +
            '<p class="kurz">' + esc(p.kurz) + '</p>' +
          '</div>' +
        '</a></article>';
    }).join('');
    var works = [].slice.call(document.querySelectorAll('.work'));

    function layout() {
      var vis = works.filter(function (w) { return !w.hidden; });
      vis.forEach(function (w, i) {
        var L = vis.length === 1 ? { s: 12, r: '16/9' } : LAYOUT[i % LAYOUT.length];
        if (i === vis.length - 1 && i % 2 === 0 && vis.length > 1) L = { s: 8, r: '16/10' };   // allein in der letzten Reihe
        w.style.setProperty('--span', L.s);
        w.style.setProperty('--ratio', L.r);
        w.style.setProperty('--drop', L.drop || '0px');
        w.style.gridColumn = (i === vis.length - 1 && i % 2 === 0 && vis.length > 1) ? '5 / span 8' : '';
      });
    }

    function apply(animate) {
      var run = function () {
        works.forEach(function (w) {
          var on = w.dataset.k.split(' ').some(function (k) { return active.indexOf(k) > -1; });
          if (on && w.hidden && animate) { w.classList.remove('enter'); void w.offsetWidth; w.classList.add('enter'); }
          w.hidden = !on;
        });
        layout();
        [].forEach.call(document.querySelectorAll('.mix,.chip'), function (b) {
          var k = b.dataset.k;
          b.setAttribute('aria-pressed', k === 'alle' ? String(active.length === KEYS.length) : String(active.indexOf(k) > -1));
        });
        var n = works.filter(function (w) { return !w.hidden; }).length;
        $('count').textContent = two(n) + ' / ' + two(works.length);
        var names = active.length === KEYS.length ? 'Alle Disziplinen' : active.map(function (k) { return S.disziplinen[k].name; }).join(' + ');
        $('mix-hint').innerHTML = esc(names) + ': ' + n + ' Projekte · <a href="#projekte">ansehen ↓</a>';
        $('live').textContent = names + ', ' + n + ' von ' + works.length + ' Projekten sichtbar';
      };
      if (animate && !reduce && document.startViewTransition) document.startViewTransition(run); else run();
    }

    /* Erster Klick hebt eine Disziplin hervor, weitere Klicks mischen dazu oder nehmen weg */
    function toggle(k) {
      if (k === 'alle') active = KEYS.slice();
      else if (active.length === KEYS.length) active = [k];
      else if (active.indexOf(k) > -1) { active = active.filter(function (x) { return x !== k; }); if (!active.length) active = KEYS.slice(); }
      else active = KEYS.filter(function (x) { return x === k || active.indexOf(x) > -1; });
      apply(true);
    }
    document.addEventListener('click', function (e) {
      var b = e.target.closest && e.target.closest('.mix,.chip');
      if (b) toggle(b.dataset.k);
    });
    apply(false);

    $('apps').innerHTML = S.apps.map(function (a) {
      return '<li><a href="' + esc(a.link) + '"><h3>' + esc(a.titel) + '</h3><span class="meta muted">' + esc(a.art) + '</span><p class="txt">' + esc(a.text) + '</p><span class="go">Öffnen →</span></a></li>';
    }).join('');

    $('about-text').innerHTML = S.ueber.map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('');
    $('facts').innerHTML = S.fakten.map(function (f) { return '<div><dt class="meta">' + esc(f[0]) + '</dt><dd>' + esc(f[1]) + '</dd></div>'; }).join('');
    $('ort').textContent = S.ort;
    $('stand').textContent = 'Stand ' + S.stand;

    /* Der eine große Moment: Die Kerbe schneidet sich in den Block */
    (function () {
      var poly = $('kerbe');
      var set = function (x) { poly.setAttribute('points', '10,10 100,10 100,40 ' + x.toFixed(2) + ',60 100,80 100,110 10,110'); };
      if (reduce) { set(60); return; }
      var back = function (p) { var c = 1.6; return 1 + (c + 1) * Math.pow(p - 1, 3) + c * Math.pow(p - 1, 2); };
      var t0 = null; set(100);
      requestAnimationFrame(function step(t) {
        if (t0 === null) t0 = t;
        var p = Math.min(1, Math.max(0, (t - t0 - 350) / 850));
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
    document.title = p.titel + ' – Kilian Einig';

    var hero = p.interaktiv === 'konfigurator' ? konfig() :
      '<figure class="pp-hero' + (p.hell ? ' light' : '') + '">' + (p.bildLabel ? '<span class="blabel meta">' + esc(p.bildLabel) + '</span>' : '') +
      '<img src="' + esc(p.bild) + '" alt="' + esc(p.bildAlt) + '"' + dims(p.bild) + ' decoding="async" fetchpriority="high"' + (p.fokus ? ' style="object-position:' + esc(p.fokus) + '"' : '') + '></figure>';

    var lam = p.interaktiv === 'lamellen' ?
      '<div class="stage-dark lamellen" id="lmp01-lamellen" role="img" aria-label="Simulation von LMP 01: Lamellen leuchten auf, wenn sich Maus oder Finger nähern"><canvas></canvas><p class="hint">Fahr mit Maus oder Finger über die Lamellen. Nähe macht das Licht heller.</p></div>' : '';

    var steps = (p.schritte || []).length ? '<ol class="steps grid">' + p.schritte.map(function (s, k) {
      return '<li><img src="' + esc(s[0]) + '" alt="' + esc(s[1]) + '"' + dims(s[0]) + ' loading="lazy" decoding="async"><h3><span>' + two(k + 1) + '</span>' + esc(s[1]) + '</h3><p>' + esc(s[2]) + '</p></li>';
    }).join('') + '</ol>' : '';

    var gal = (p.galerie || []).length ? '<div class="gal grid">' + p.galerie.map(function (g) {
      var d = D[g[0]], wide = d && d[0] > d[1] * 1.6;
      var media = /\.mp4$/.test(g[0]) ?
        '<video src="' + esc(g[0]) + '" poster="' + esc(g[2] || '') + '" muted loop playsinline controls preload="metadata" aria-label="' + esc(g[1]) + '"></video>' :
        '<button type="button" class="zoom" aria-label="' + esc(g[1]) + ', groß ansehen"><img src="' + esc(g[0]) + '" alt="' + esc(g[1]) + '"' + dims(g[0]) + ' loading="lazy" decoding="async"></button>';
      return '<figure class="' + (wide ? 'wide' : '') + '">' + media + '<figcaption class="meta">' + esc(g[1]) + '</figcaption></figure>';
    }).join('') + '</div>' : '';

    var facts = [['Art', p.art], ['Stand', p.stand]].concat(p.fakten || []).map(function (f) { return '<div><dt class="meta">' + esc(f[0]) + '</dt><dd>' + esc(f[1]) + '</dd></div>'; }).join('');

    $('projekt').innerHTML =
      '<div class="pp-head wrap">' +
        '<div class="pp-run meta">' +
          '<p><span>Projekt</span>' + two(i + 1) + ' / ' + two(S.projekte.length) + '</p>' +
          '<p><span>Art</span>' + esc(p.art) + '</p>' +
          '<p><span>Stand</span>' + esc(p.stand) + '</p>' +
          '<p><span>Disziplinen</span>' + code(p) + '</p>' +
        '</div>' +
        '<h1 class="pp-title"><span>' + esc(p.titel) + '</span></h1>' +
        '<div class="pp-sub grid">' +
          '<a class="back" href="./#projekte">← Alle Projekte</a>' +
          '<p class="kurz">' + esc(p.kurz) + '</p>' +
          (p.hinweis ? '<p class="hinweis">' + esc(p.hinweis) + '</p>' : '') +
        '</div>' +
      '</div>' +
      '<div class="wrap">' + hero +
        '<div class="pp-body grid"><dl>' + facts + '</dl><div class="txt">' + [].concat(p.text).map(function (t) { return '<p>' + esc(t) + '</p>'; }).join('') + '</div></div>' +
        lam + steps + gal +
        '<a class="next" href="' + url(nx) + '"><span class="meta">Nächstes Projekt</span><strong>' + esc(nx.titel) + ' →</strong></a>' +
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
      '<div class="panel"><div><p class="ptitle">Stell das Licht ein, wie am Objekt.</p><p class="psub">Vier Regler, zwei Ebenen. Gemischt werden drei echte Renderings, das Licht addiert sich wie in der Leuchte.</p></div>' +
      '<div class="knobs">' + k.map(function (x) { return '<div class="kn ' + x[2] + '"><div class="knob" tabindex="0" role="slider" aria-label="' + x[1] + '" aria-valuemin="0" aria-valuemax="100" data-key="' + x[0] + '" data-kind="' + x[2] + '"></div><span class="lab">' + x[1] + '</span><output></output></div>'; }).join('') + '</div>' +
      '<div><div class="presets" role="group" aria-label="Voreinstellungen">' + ['Aus', 'Abendlicht', 'Türkis, Rot', 'Weiß'].map(function (p) { return '<button type="button" class="preset" data-preset="' + p + '" aria-pressed="false">' + p + '</button>'; }).join('') + '</div>' +
      '<p class="note">Drehen durch Ziehen, Scrollen oder mit den Pfeiltasten. „Abendlicht“ ist ein Preset aus der Firmware.</p></div></div></div>';
  }
})();
