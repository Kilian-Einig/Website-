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
  var byId = function (id) { return S.projekte.filter(function (p) { return p.id === id; })[0]; };
  /* Ein Bild im einheitlichen Rahmen: Ausschnitt (pos) oder ganz eingepasst (fit: contain) */
  /* Projektkachel: gleicher 3:2-Ausschnitt, Name, Art, Kurzsatz. Für Startseite und Übersicht. */
  var tile = function (p, i) {
    return '<a class="tile rv" style="--d:' + (i % 3 * 90) + 'ms" href="' + url(p) + '">' +
      '<div class="tile-ph"' + (p.rahmen.bg ? ' style="background:' + p.rahmen.bg + '"' : '') + '>' + frameImg(p.rahmen, p.bildAlt, i < 3) + '</div>' +
      '<div class="tile-cap"><h3>' + esc(p.titel) + '</h3></div>' +
      '<p class="tile-kurz">' + esc(p.kurz) + '</p></a>';
  };
  var frameImg = function (r, alt, eager) {
    return '<img src="' + esc(r.src) + '" alt="' + esc(alt) + '"' + dims(r.src) + (eager ? '' : ' loading="lazy"') + ' decoding="async" style="object-fit:' + (r.fit || 'cover') + ';object-position:' + (r.pos || '50% 50%') + '">';
  };

  /* Bilder blenden erst ein, wenn sie geladen sind, statt mitten in einer Bewegung aufzuploppen */
  function softImgs(root) {
    [].forEach.call((root || document).querySelectorAll('img'), function (im) {
      if (!im.getAttribute('src')) return;
      var hero = im.closest('.pp-hero'), loaded = im.complete && im.naturalWidth;
      if (loaded && !hero) return;
      im.classList.add('ld');
      var done = function () { requestAnimationFrame(function () { requestAnimationFrame(function () { im.classList.remove('ld'); }); }); };
      if (loaded) { done(); return; }
      im.addEventListener('load', done, { once: true }); im.addEventListener('error', done, { once: true });
    });
  }

  [].forEach.call(document.querySelectorAll('[data-insta]'), function (a) { a.href = S.instagram.url; if (a.dataset.insta === 'name') a.textContent = S.instagram.name; });
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
    /* Projekte: groß untereinander, eins nach dem anderen zum Durchscrollen. Die Übersicht hat ihr eigenes Raster. */
    $('works').innerHTML = S.projekte.map(function (p, i) {
      return '<a class="big rv" href="' + url(p) + '">' +
        '<div class="big-ph"' + (p.rahmen.bg ? ' style="background:' + p.rahmen.bg + '"' : '') + '>' + frameImg(p.rahmen, p.bildAlt, i === 0) + '</div>' +
        '<div class="big-cap"><h3>' + esc(p.titel) + '</h3><p class="big-kurz">' + esc(p.kurz) + '</p></div></a>';
    }).join('');
    $('felder').innerHTML = S.felder.map(function (f) {
      return '<li class="rv feld"><h3>' + esc(f.titel) + '</h3><p class="feld-text">' + esc(f.text) + '</p></li>';
    }).join('');

    $('zitat').innerHTML = '<p>' + esc(S.zitat) + '</p>';
    $('about-text').innerHTML = S.ueber.map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('');

    $('mail').href = 'mailto:' + S.email; $('mail').textContent = S.email + ' →';

    reveal(document.querySelectorAll('.rv'));
    [].forEach.call(document.querySelectorAll('.contact .w'), function (w, k) { w.style.setProperty('--d', (k * 150) + 'ms'); });
    reveal(document.querySelectorAll('.contact h2'));

  }

  /* ================= Projektübersicht ================= */
  if (PAGE === 'uebersicht') {
    $('count').textContent = '( ' + two(S.projekte.length) + ' Projekte )';
    $('overview').innerHTML = S.projekte.map(tile).join('');
    reveal(document.querySelectorAll('#overview .rv'));
  }

  /* ================= Projektseite ================= */
  if (PAGE === 'projekt') {
    var id = new URLSearchParams(location.search).get('id');
    var i = S.projekte.findIndex(function (p) { return p.id === id; });
    if (i < 0) { location.replace('projekte.html'); return; }
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
          '<div class="pp-tools"><a class="back" href="projekte.html">← Alle Projekte</a><button type="button" class="kat-open" id="kat-open">Katalogansicht</button></div>' +
          '<h1 class="pp-title"><span>' + esc(p.titel) + '</span></h1>' +
          '<p class="pp-kurz">' + esc(p.kurz) + '</p>' +
        '</header>' +
        heroImg +
        '<div class="pp-body rv"><dl>' + facts + '</dl><div class="txt">' + [].concat(p.text).map(function (t) { return '<p>' + esc(t) + '</p>'; }).join('') +
          (p.hinweis ? '<p class="hinweis">' + esc(p.hinweis) + '</p>' : '') + '</div></div>' +
        lam + steps + gal +
        '<a class="next rv" href="' + url(nx) + '"><strong>' + esc(nx.titel) + ' <span aria-hidden="true">→</span></strong></a>' +
      '</div>';

    reveal(document.querySelectorAll('#projekt .rv'));

    /* Katalogansicht: das ganze Projekt als Doppelseiten zum Durchblättern.
       Links Hauptbild mit Name und Kurzsatz, dann Text, Schritte und Bilder.
       Auf schmalen Bildschirmen wird Seite für Seite geblättert. */
    var kat = document.createElement('dialog');
    kat.className = 'kat'; kat.setAttribute('aria-label', 'Katalogansicht ' + p.titel);
    var img = function (src, alt) { return '<img src="' + esc(src) + '" alt="' + esc(alt) + '"' + dims(src) + ' decoding="async">'; };
    var pages = [];
    pages.push('<div class="kp kp-cover"><figure>' + img(p.bild, p.bildAlt) + '</figure><div class="kp-cap"><h2>' + esc(p.titel) + '</h2><p>' + esc(p.kurz) + '</p></div></div>');
    pages.push('<div class="kp kp-text"><p class="kp-label label">' + esc(p.titel) + '</p><div class="kp-txt">' + [].concat(p.text).map(function (t) { return '<p>' + esc(t) + '</p>'; }).join('') +
      (p.hinweis ? '<p class="kp-hinweis">' + esc(p.hinweis) + '</p>' : '') + '</div><dl>' + facts + '</dl></div>');
    if ((p.schritte || []).length) pages.push('<div class="kp kp-steps">' + p.schritte.map(function (st, k) {
      return '<div><figure>' + img(st[0], st[1]) + '</figure><h3><span>' + (k + 1) + '</span>' + esc(st[1]) + '</h3><p>' + esc(st[2]) + '</p></div>';
    }).join('') + '</div>');
    var bilder = (p.galerie || []).map(function (g) { return /\.mp4$/.test(g[0]) ? (g[2] ? [g[2], g[1]] : null) : g; }).filter(Boolean);
    for (var b = 0; b < bilder.length; b += 2) pages.push('<div class="kp kp-gal">' + bilder.slice(b, b + 2).map(function (g) {
      return '<figure>' + img(g[0], g[1]) + '<figcaption>' + esc(g[1]) + '</figcaption></figure>';
    }).join('') + '</div>');
    if (pages.length % 2) pages.push('<div class="kp kp-end"><svg viewBox="10 10 90 100" aria-hidden="true"><path d="M10,10 H100 V40 L60,60 L100,80 V110 H10 Z"/></svg><p>Kilian Einig</p><p class="label">kilianeinig.de</p></div>');
    kat.innerHTML = '<div class="kat-bar"><span class="kat-count label" aria-live="polite"></span><button type="button" class="kat-x">Schließen</button></div>' +
      '<div class="kat-stage"><button type="button" class="kat-nav kat-prev" aria-label="Zurückblättern">←</button><div class="kat-spread"></div><button type="button" class="kat-nav kat-next" aria-label="Weiterblättern">→</button></div>';
    document.body.appendChild(kat);
    var spread = kat.querySelector('.kat-spread'), first = 0, step = 2;
    var single = function () { return matchMedia('(max-width: 820px), (orientation: portrait)').matches; };
    /* n = Index der ersten sichtbaren Seite */
    function show(n) {
      step = single() ? 1 : 2;
      first = Math.max(0, Math.min(Math.floor(n / step) * step, pages.length - step));
      spread.innerHTML = pages.slice(first, first + step).join('');
      spread.classList.remove('turn'); void spread.offsetWidth; spread.classList.add('turn');
      kat.querySelector('.kat-count').textContent = p.titel + ' · ' + (step === 1 ? 'Seite ' + (first + 1) : 'Seiten ' + (first + 1) + '–' + (first + 2)) + ' von ' + pages.length;
      kat.querySelector('.kat-prev').disabled = first === 0;
      kat.querySelector('.kat-next').disabled = first + step >= pages.length;
    }
    $('kat-open').addEventListener('click', function () { if (lenis) lenis.stop(); show(0); kat.showModal(); });
    kat.addEventListener('close', function () { if (lenis) lenis.start(); });
    kat.querySelector('.kat-x').addEventListener('click', function () { kat.close(); });
    kat.querySelector('.kat-prev').addEventListener('click', function () { show(first - step); });
    kat.querySelector('.kat-next').addEventListener('click', function () { show(first + step); });
    kat.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); show(first + step); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); show(first - step); }
    });
    var sx = null;
    spread.addEventListener('pointerdown', function (e) { sx = e.clientX; });
    spread.addEventListener('pointerup', function (e) { if (sx !== null && Math.abs(e.clientX - sx) > 50) show(first + (e.clientX < sx ? step : -step)); sx = null; });
    addEventListener('resize', function () { if (kat.open) show(first); });

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
  if (!reduce) softImgs();

  /* Auftakt erst starten, wenn Schrift geladen und die ersten Frames gezeichnet sind */
  var ready = function () { requestAnimationFrame(function () { requestAnimationFrame(function () { document.documentElement.classList.add('ready'); }); }); };
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(ready);
  setTimeout(ready, 1200);

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
    setTimeout(function () { location.href = a.href; }, 380);
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
    ['start', 'projekte', 'arbeit', 'ueber', 'kontakt'].forEach(function (id) { if ($(id)) secIO.observe($(id)); });
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
