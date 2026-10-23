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

  if ($('foot')) $('foot').textContent = '© ' + new Date().getFullYear() + ' ' + S.name + ' · ' + S.ort;

  /* Kopfzeile: durchsichtig über dem Auftakt, weiß beim Scrollen */
  var hd = $('top');
  function onScroll() { hd.classList.toggle('scrolled', scrollY > 8); }
  if (hd) { window.addEventListener('scroll', onScroll, { passive: true }); onScroll(); }

  /* Auftauchen beim Scrollen. Was beim Laden schon im Bild ist, bleibt sofort sichtbar. */
  var revealIO = (!reduce && 'IntersectionObserver' in window) ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); revealIO.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -10% 0px' }) : null;
  function reveal(list) {
    if (!revealIO) return;
    document.documentElement.classList.add('anim');
    [].forEach.call(list, function (el) {
      if (el.getBoundingClientRect().top < innerHeight * 0.95) el.classList.add('in'); else revealIO.observe(el);
    });
  }

  /* ================= Startseite ================= */
  if (PAGE === 'home') {
    /* Projekte: zwei Spalten, Formate wechseln 4:3 und 3:4. Auf dem Handy eine Spalte in der richtigen Reihenfolge. */
    var card = function (p, i) {
      var a = p.uebersicht || p.bild, ratio = D[a] ? D[a][0] + '/' + D[a][1] : '4/3';   // ganzes Bild, nichts beschnitten
      return '<article class="work rv" id="p-' + esc(p.id) + '" style="--d:' + (i % 2 * 100) + 'ms">' +
        '<a href="' + url(p) + '">' +
          '<div class="ph" style="aspect-ratio:' + ratio + '">' +
            '<img src="' + esc(a) + '" alt="' + esc(p.bildAlt) + '"' + dims(a) + (i > 1 ? ' loading="lazy"' : '') + ' decoding="async">' +
            '<div class="ov" aria-hidden="true"><h3>' + esc(p.titel) + '</h3><p class="label">' + esc(p.art) + ' · ' + esc(p.stand) + '</p><p class="ov-kurz">' + esc(p.kurz) + '</p></div>' +
          '</div>' +
          '<div class="cap"><h3>' + esc(p.titel) + '</h3><p class="label muted">' + esc(p.art) + ' · ' + esc(p.stand) + '</p></div>' +
        '</a></article>';
    };
    var mq = window.matchMedia('(max-width: 760px)');
    var grid = function () {
      var cards = S.projekte.map(card);
      $('works').innerHTML = mq.matches ? '<div class="col">' + cards.join('') + '</div>' :
        '<div class="col">' + cards.filter(function (c, i) { return i % 2 === 0; }).join('') + '</div>' +
        '<div class="col">' + cards.filter(function (c, i) { return i % 2 === 1; }).join('') + '</div>';
      reveal(document.querySelectorAll('#works .rv'));
    };
    $('count').textContent = '( ' + two(S.projekte.length) + ' Projekte )';

    var byId = function (id) { return S.projekte.filter(function (p) { return p.id === id; })[0]; };
    $('felder').innerHTML = S.felder.map(function (f) {
      return '<li class="rv feld"><h3>' + esc(f.titel) + '</h3><p class="feld-text">' + esc(f.text) + '</p>' +
        '<ul class="punkte">' + f.punkte.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' +
        '<p class="feld-proj"><span class="label muted">Projekte</span>' + f.projekte.map(function (id) { var p = byId(id); return '<a href="' + url(p) + '">' + esc(p.titel) + ' →</a>'; }).join('') + '</p></li>';
    }).join('');

    $('zitat').innerHTML = '<p>' + esc(S.zitat) + '</p>';
    $('about-text').innerHTML = S.ueber.map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('');
    $('chips').innerHTML = S.werkzeuge.map(function (w) { return '<li class="label">' + esc(w) + '</li>'; }).join('');

    $('steps').innerHTML = S.ablauf.map(function (st, k) {
      return '<li class="rv" style="--d:' + (k * 120) + 'ms"><span class="big" aria-hidden="true">' + two(k + 1) + '</span><h3>' + esc(st[0]) + '</h3><p>' + esc(st[1]) + '</p></li>';
    }).join('');

    $('app-list').innerHTML = S.apps.map(function (a) {
      return '<li class="rv"><a href="' + esc(a.link) + '"><h3>' + esc(a.titel) + '</h3><p>' + esc(a.text) + '</p><span class="arr" aria-hidden="true">→</span></a></li>';
    }).join('');
    $('mail').href = 'mailto:' + S.email; $('mail').textContent = S.email + ' →';

    grid();
    if (mq.addEventListener) mq.addEventListener('change', grid); else mq.addListener(grid);
    reveal(document.querySelectorAll('.rv:not(.work)'));
    [].forEach.call(document.querySelectorAll('.contact .w'), function (w, k) { w.style.setProperty('--d', (k * 150) + 'ms'); });
    reveal(document.querySelectorAll('.contact h2'));

    /* Laufband: Projektnamen in farbigen Feldern, läuft endlos, hält beim Drüberfahren */
    var items = S.projekte.map(function (p) {
      return '<a href="' + url(p) + '" style="background:' + p.farbe + '"><strong>' + esc(p.titel) + '</strong><span>' + esc(p.art) + '</span></a>';
    }).join('');
    $('band').innerHTML = items + '<span class="band-dup" aria-hidden="true">' + items.replace(/<a /g, '<a tabindex="-1" ') + '</span>';

    /* Auftaktbild: ein Bild pro Projekt, jedes ganz zu sehen. Das neue Bild blendet über dem alten ein,
       das alte bleibt stehen, bis der Übergang fertig ist – so gibt es kein Flackern und keine Dopplung. */
    var heroBox = $('hero-img'), pauseBtn = $('hero-pause');
    var slides = S.projekte.map(function (p) { return { src: p.id === 'hochstapler' ? 'img/hs-kammern.webp' : (p.uebersicht || p.bild), alt: p.titel + ': ' + p.kurz }; });
    heroBox.querySelector('img').remove();
    slides.forEach(function (sl, k) {
      var box = document.createElement('div'); box.className = 'slide' + (k === 0 ? ' on' : '');
      var im = new Image(); im.src = sl.src; im.alt = sl.alt; im.decoding = 'async';
      if (D[sl.src]) { im.width = D[sl.src][0]; im.height = D[sl.src][1]; }
      if (k === 0) im.fetchPriority = 'high';
      box.appendChild(im);
      heroBox.insertBefore(box, heroBox.querySelector('.hero-logo'));
    });
    var heroImgs = [].slice.call(heroBox.querySelectorAll('.slide')), cur = 0, playing = false, slideTimer = 0;
    function show(k) {
      var old = heroImgs[cur], nu = heroImgs[k];
      heroImgs.forEach(function (im) { if (im !== old && im !== nu) im.className = 'slide'; });
      old.className = 'slide prev'; nu.className = 'slide on'; cur = k;
    }
    function loop() { slideTimer = setTimeout(function () { show((cur + 1) % heroImgs.length); loop(); }, 2600); }
    function play(on) { playing = on; clearTimeout(slideTimer); if (on) loop(); }
    var userPaused = false;
    if (!reduce) {
      pauseBtn.hidden = false;
      pauseBtn.addEventListener('click', function (e) {
        e.stopPropagation(); userPaused = !userPaused; play(!userPaused);
        pauseBtn.setAttribute('aria-pressed', String(userPaused)); pauseBtn.textContent = userPaused ? 'Abspielen' : 'Pause';
      });
      if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { if (!userPaused) play(es[0].isIntersecting); }).observe(heroBox);
    }

    /* Die Kerbe schneidet sich ins Bild, sobald das Intro vorbei ist */
    var cutIn = function () {
      var poly = $('kerbe');
      var set = function (x) { poly.setAttribute('points', '10,10 100,10 100,40 ' + x.toFixed(2) + ',60 100,80 100,110 10,110'); };
      if (reduce) return;
      var back = function (p) { var c = 1.6; return 1 + (c + 1) * Math.pow(p - 1, 3) + c * Math.pow(p - 1, 2); };
      var t0 = null; set(100);
      requestAnimationFrame(function step(t) {
        if (t0 === null) t0 = t;
        var p = Math.min(1, Math.max(0, (t - t0 - 250) / 850));
        set(100 - 40 * back(p));
        if (p < 1) requestAnimationFrame(step);
      });
    };
    if (document.documentElement.classList.contains('intro-on')) window.addEventListener('introdone', cutIn, { once: true }); else cutIn();
  }

  /* ================= Projektseite ================= */
  if (PAGE === 'projekt') {
    var id = new URLSearchParams(location.search).get('id');
    var i = S.projekte.findIndex(function (p) { return p.id === id; });
    if (i < 0) { location.replace('./#projekte'); return; }
    var p = S.projekte[i], nx = S.projekte[(i + 1) % S.projekte.length];
    document.title = p.titel + ' · Kilian Einig';

    var heroImg = p.interaktiv === 'konfigurator' ? konfig() :
      '<figure class="pp-hero' + (p.hell ? ' light' : '') + '">' + (p.bildLabel ? '<span class="blabel label">' + esc(p.bildLabel) + '</span>' : '') +
      '<img src="' + esc(p.bild) + '" alt="' + esc(p.bildAlt) + '"' + dims(p.bild) + ' decoding="async" fetchpriority="high"' + (p.fokus ? ' style="object-position:' + esc(p.fokus) + '"' : '') + '></figure>';

    var lam = p.interaktiv === 'lamellen' ?
      '<div class="stage-dark lamellen" id="lmp01-lamellen" role="img" aria-label="Simulation von LMP 01: Lamellen leuchten auf, wenn sich Maus oder Finger nähern"><canvas></canvas><p class="hint">Fahr mit Maus oder Finger über die Lamellen.</p></div>' : '';

    var steps = (p.schritte || []).length ? '<ol class="steps">' + p.schritte.map(function (s, k) {
      return '<li class="rv" style="--d:' + (k * 120) + 'ms"><img src="' + esc(s[0]) + '" alt="' + esc(s[1]) + '"' + dims(s[0]) + ' loading="lazy" decoding="async"><h3><span>' + (k + 1) + '</span>' + esc(s[1]) + '</h3><p>' + esc(s[2]) + '</p></li>';
    }).join('') + '</ol>' : '';

    var gal = (p.galerie || []).length ? '<div class="gal">' + p.galerie.map(function (g) {
      var d = D[g[0]], wide = d && d[0] > d[1] * 1.6;
      var media = /\.mp4$/.test(g[0]) ?
        '<video src="' + esc(g[0]) + '" poster="' + esc(g[2] || '') + '" muted loop playsinline controls preload="metadata" aria-label="' + esc(g[1]) + '"></video>' :
        '<button type="button" class="zoom" aria-label="' + esc(g[1]) + ', groß ansehen"><img src="' + esc(g[0]) + '" alt="' + esc(g[1]) + '"' + dims(g[0]) + ' loading="lazy" decoding="async"></button>';
      return '<figure class="rv' + (wide ? ' wide' : '') + '">' + media + '<figcaption>' + esc(g[1]) + '</figcaption></figure>';
    }).join('') + '</div>' : '';

    var facts = [['Art', p.art], ['Stand', p.stand]].concat(p.fakten || []).map(function (f) { return '<div><dt class="label">' + esc(f[0]) + '</dt><dd>' + esc(f[1]) + '</dd></div>'; }).join('');

    $('projekt').innerHTML =
      '<div class="wrap">' +
        '<header class="pp-head">' +
          '<a class="back" href="./#p-' + esc(p.id) + '">← Alle Projekte</a>' +
          '<h1 class="pp-title"><span>' + esc(p.titel) + '</span></h1>' +
          '<p class="pp-kurz">' + esc(p.kurz) + '</p>' +
        '</header>' +
        heroImg +
        '<div class="pp-body rv"><dl>' + facts + '</dl><div class="txt">' + [].concat(p.text).map(function (t) { return '<p>' + esc(t) + '</p>'; }).join('') +
          (p.hinweis ? '<p class="hinweis">' + esc(p.hinweis) + '</p>' : '') + '</div></div>' +
        lam + steps + gal +
        '<a class="next rv" href="' + url(nx) + '"><span class="label">Nächstes Projekt</span><strong>' + esc(nx.titel) + ' <span aria-hidden="true">→</span></strong></a>' +
      '</div>';

    reveal(document.querySelectorAll('#projekt .rv'));

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


  /* ================= Gemeinsames Verhalten ================= */

  /* Logo in Kopfleiste und Fuß: die Kerbe „beißt“ beim Drüberfahren */
  [].forEach.call(document.querySelectorAll('.brand svg'), function (svg) {
    svg.innerHTML = '<polygon points="10,10 100,10 100,40 60,60 100,80 100,110 10,110"/>';
    var poly = svg.firstChild, busy = false;
    svg.parentNode.addEventListener('mouseenter', function () {
      if (busy || reduce) return; busy = true;
      var t0 = performance.now(), seq = [60, 100, 60, 100, 60];
      (function step(t) {
        var p = Math.min(1, (t - t0) / 560), f = p * (seq.length - 1), i = Math.floor(f), r = f - i;
        var a = seq[i], b = seq[Math.min(i + 1, seq.length - 1)], x = a + (b - a) * r * r * (3 - 2 * r);
        poly.setAttribute('points', '10,10 100,10 100,40 ' + x.toFixed(2) + ',60 100,80 100,110 10,110');
        if (p < 1) requestAnimationFrame(step); else busy = false;
      })(t0);
    });
  });


  /* Jede Seite beginnt oben, auch nach „Nächstes Projekt“ und beim Zurückgehen.
     Nur ein Anker in der Adresse (#p-woven, #kontakt) springt gezielt dorthin. */
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  var lenis = null;
  function jumpToHash() {
    var t = location.hash && document.getElementById(location.hash.slice(1));
    if (t) { var y = t.getBoundingClientRect().top + scrollY - (t.id === 'start' ? 0 : hd.offsetHeight); window.scrollTo(0, y); if (lenis) lenis.scrollTo(y, { immediate: true }); }
    else { window.scrollTo(0, 0); if (lenis) lenis.scrollTo(0, { immediate: true }); }
  }

  /* Weiches Scrollen mit Schwung */
  if (window.Lenis && !reduce) {
    lenis = window.__lenis = new Lenis({ duration: 1.1, easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); } });
    (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(0);
    lenis.on('scroll', onScroll);
  }
  jumpToHash(); requestAnimationFrame(jumpToHash);
  window.addEventListener('load', jumpToHash);
  window.addEventListener('pageshow', function (e) { document.documentElement.classList.remove('leaving'); if (e.persisted) jumpToHash(); });

  /* Anker auf derselben Seite: weich hinscrollen, Kopfleiste mitdenken */
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a');
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || a.target) return;
    var h = a.getAttribute('href') || '';
    if (h.charAt(0) === '#') {
      var t = document.getElementById(h.slice(1)); if (!t) return;
      e.preventDefault();
      var off = t.id === 'start' ? -hd.offsetHeight : -hd.offsetHeight;
      if (lenis) lenis.scrollTo(t.id === 'start' ? 0 : t, { offset: off }); else window.scrollTo({ top: t.id === 'start' ? 0 : t.getBoundingClientRect().top + scrollY + off, behavior: reduce ? 'auto' : 'smooth' });
      return;
    }
    /* Seitenwechsel: kurz ausblenden, dann laden */
    if (/^(mailto|tel|https?):/.test(h) || reduce) return;
    e.preventDefault();
    document.documentElement.classList.add('leaving');
    setTimeout(function () { location.href = a.href; }, 260);
  });

  /* Kopfleiste zeigt, in welchem Abschnitt man gerade ist */
  var navLinks = [].slice.call(document.querySelectorAll('.nav .links a[href^="#"]'));
  if (navLinks.length && 'IntersectionObserver' in window) {
    var secIO = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        navLinks.forEach(function (l) { if (l.getAttribute('href') === '#' + e.target.id) l.setAttribute('aria-current', 'true'); else l.removeAttribute('aria-current'); });
      });
    }, { rootMargin: '-50% 0px -50% 0px' });
    ['start', 'projekte', 'arbeit', 'ueber', 'ablauf', 'apps', 'kontakt'].forEach(function (id) { if ($(id)) secIO.observe($(id)); });
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
