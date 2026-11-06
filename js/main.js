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
    return '<a class="tile rv" style="--d:' + (i % 3 * 130) + 'ms" href="' + url(p) + '">' +
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
  }, { rootMargin: '0px 0px -18% 0px' }) : null;
  function reveal(list) {
    if (!revealIO) return;
    document.documentElement.classList.add('anim');
    [].forEach.call(list, function (el) {
      if (el.getBoundingClientRect().top < innerHeight * 0.95) el.classList.add('in'); else revealIO.observe(el);
    });
  }

  /* ================= Startseite ================= */
  /* Katalog als eigene Ansicht, auf Projektseite und Übersicht nutzbar */
  function setupCatalog() {
    /* Katalog: alle Projekte als ein durchgehendes Heft, Doppelseite unter Doppelseite zum Scrollen.
       Heller, ruhiger Hintergrund, weiche Einblendung. Bilder frei im Raster, keins doppelt,
       Zeichnungen und Pläne nie beschnitten. Nur am Rechner. */
    var kat = null, kspreads = [], kindex = {};
    var DRAW = /(plan|schnitt|ansicht|explosion|prinzip|p22|kammerleben|skelett-render)/;
    function katBuild() {
      var two = function (n) { return (n < 10 ? '0' : '') + n; };
      var fig = function (src, alt, cap) {
        return '<figure class="kf' + (DRAW.test(src) ? ' draw' : '') + '"><div class="kf-img"><img src="' + esc(src) + '" alt="' + esc(alt) + '"' + dims(src) + ' decoding="async"></div>' +
          (cap && alt ? '<figcaption>' + esc(alt) + '</figcaption>' : '') + '</figure>';
      };
      /* Galeriebilder frei auf Seiten verteilen: wechselnde Vorlagen, mehr Bilder pro Seite */
      /* Galerie dichter: drei bis vier kleinere Bilder mit ihren Bildunterschriften pro Seite,
         Zeichnungen und Pläne jeweils allein mit Weißrand, nie beschnitten. */
      function mosaik(imgs) {
        var out = [], r = 0;
        while (imgs.length) {
          var g0 = imgs[0];
          if (DRAW.test(g0[0])) { out.push({ cls: 'kp-plan', html: fig(imgs.shift()[0], g0[1], true) }); r++; continue; }
          var run = 0; while (run < imgs.length && !DRAW.test(imgs[run][0])) run++;
          var c = r % 5, want;
          if (run >= 4 && (c === 0 || c === 3)) want = 4;
          else if (run >= 3 && (c === 1 || c === 2 || c === 4)) want = 3;
          else want = Math.min(2, run);
          var k = Math.min(want, run) || 1;
          var cls = k >= 4 ? 'kp-grid4' : k === 3 ? 'kp-grid3' : k === 2 ? 'kp-grid2' : 'kp-solo';
          var part = imgs.splice(0, k);
          out.push({ cls: cls, html: part.map(function (g) { return fig(g[0], g[1], true); }).join('') });
          r++;
        }
        return out;
      }
      var cover = { cls: 'kp-cover dark', html: '<svg viewBox="10 10 90 100" aria-hidden="true"><path d="M10,10 H100 V40 L60,60 L100,80 V110 H10 Z"/></svg><div><p class="kc-name">Kilian Einig</p><p class="label">Projekte · Katalog</p></div>' };
      var toc = { cls: 'kp-toc', html: '' };
      var spreads = [{ proj: null, l: cover, r: toc }];
      S.projekte.forEach(function (q, n) {
        kindex[q.id] = spreads.length;
        var pages = [], used = {};
        used[q.bild] = 1;
        var hasStand = (q.fakten || []).some(function (x) { return x[0] === 'Stand'; });
        var f = [['Art', q.art]].concat(hasStand ? [] : [['Stand', q.stand]], q.fakten || []);
        pages.push({ cls: 'kp-photo', html: fig(q.bild, q.bildAlt, true) });
        pages.push({ cls: 'kp-open', html:
          '<div class="ko-top"><span class="ko-n">' + two(n + 1) + '</span><h2>' + esc(q.titel) + '</h2><p class="ko-kurz">' + esc(q.kurz) + '</p></div>' +
          '<div class="ko-txt">' + [].concat(q.text).map(function (t) { return '<p>' + esc(t) + '</p>'; }).join('') + (q.hinweis ? '<p class="ko-hint">' + esc(q.hinweis) + '</p>' : '') + '</div>' +
          '<dl>' + f.map(function (x) { return '<div><dt>' + esc(x[0]) + '</dt><dd>' + esc(x[1]) + '</dd></div>'; }).join('') + '</dl>' });
        if ((q.schritte || []).length) {
          var st = q.schritte.map(function (x, k) { used[x[0]] = 1; return '<div class="ks">' + fig(x[0], x[1], false) + '<h3><span>' + (k + 1) + '</span>' + esc(x[1]) + '</h3><p>' + esc(x[2]) + '</p></div>'; });
          pages.push({ cls: 'kp-steps one', html: st[0] });
          pages.push({ cls: 'kp-steps', html: st.slice(1).join('') });
        }
        var imgs = (q.galerie || []).map(function (g) { return /\.mp4$/.test(g[0]) ? (g[2] ? [g[2], g[1]] : null) : g; })
          .filter(function (g) { if (!g || used[g[0]]) return false; used[g[0]] = 1; return true; });
        pages = pages.concat(mosaik(imgs));
        var nx = S.projekte[n + 1];
        if (pages.length % 2) pages.push(nx
          ? { cls: 'kp-teaser', html: '<p class="label">Weiter mit</p><button type="button" class="kt-go" data-go="' + (spreads.length + Math.ceil((pages.length + 1) / 2)) + '"><span class="ko-n">' + two(n + 2) + '</span><strong>' + esc(nx.titel) + ' →</strong><span>' + esc(nx.kurz) + '</span></button>' }
          : { cls: 'kp-blank', html: '' });
        for (var i = 0; i < pages.length; i += 2) spreads.push({ proj: q, l: pages[i], r: pages[i + 1] || { cls: 'kp-blank', html: '' } });
      });
      spreads.push({ proj: null, l: { cls: 'kp-contact', html:
        '<p class="label kt-head">Kontakt</p><p class="kc-big">Kilian Einig</p><p><a href="mailto:' + esc(S.email) + '">' + esc(S.email) + '</a></p><p><a href="' + esc(S.instagram.url) + '" target="_blank" rel="noopener">Instagram ' + esc(S.instagram.name) + '</a></p><p>kilianeinig.de</p>' },
        r: { cls: 'kp-cover dark back', html: '<svg viewBox="10 10 90 100" aria-hidden="true"><path d="M10,10 H100 V40 L60,60 L100,80 V110 H10 Z"/></svg><p class="label">kilianeinig.de</p>' } });
      toc.html = '<p class="label kt-head">Inhalt</p><ol class="kt-list">' + S.projekte.map(function (q, n) {
        return '<li><button type="button" data-go="' + kindex[q.id] + '"><span class="ko-n">' + two(n + 1) + '</span><strong>' + esc(q.titel) + '</strong><em>' + esc(q.art) + '</em></button></li>';
      }).join('') + '</ol>';
      kspreads = spreads;

      var page = function (sp, pg, side) {
        var full = /kp-cover|kp-blank/.test(pg.cls);
        return '<div class="kp ' + pg.cls + ' ' + side + '">' +
          (full ? '' : (sp.proj ? '<div class="kp-head"><span>' + esc(sp.proj.titel) + '</span><span>' + esc(sp.proj.art) + '</span></div>' : '')) +
          '<div class="kp-in">' + pg.html + '</div></div>';
      };
      kat = document.createElement('div');
      kat.page = page;
      kat.className = 'kat'; kat.setAttribute('role', 'dialog'); kat.setAttribute('aria-label', 'Katalog');
      kat.innerHTML = '<div class="kat-top"><span class="kat-count label" aria-live="polite"></span><button type="button" class="kat-x">Schließen</button></div>' +
        '<div class="kat-stage">' +
          '<button type="button" class="kat-nav kat-prev" aria-label="Zurückblättern">←</button>' +
          '<div class="kat-book"><div class="kat-spread"></div><div class="kat-leaf" aria-hidden="true"></div></div>' +
          '<button type="button" class="kat-nav kat-next" aria-label="Weiterblättern">→</button>' +
        '</div>';
      document.body.appendChild(kat);
      kat.querySelector('.kat-x').addEventListener('click', katClose);
      kat.querySelector('.kat-prev').addEventListener('click', function () { katFlip(-1); });
      kat.querySelector('.kat-next').addEventListener('click', function () { katFlip(1); });
      kat.querySelector('.kat-spread').addEventListener('click', function (e) {
        var g = e.target.closest && e.target.closest('[data-go]'); if (g) { katRender(+g.dataset.go); return; }
        if (e.target.closest('a, button')) return;
        katFlip(e.target.closest('.kp.l') ? -1 : 1);
      });
      addEventListener('keydown', function (e) {
        if (!kat.classList.contains('on')) return;
        if (e.key === 'Escape') katClose();
        if (e.key === 'ArrowRight') { e.preventDefault(); katFlip(1); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); katFlip(-1); }
      });
    }
    var kcur = 0, kturning = false;
    function kfitText(root) {
      [].forEach.call((root || kat).querySelectorAll('.ko-txt'), function (t) {
        t.style.fontSize = '';
        for (var z = 1; z > .72 && t.scrollHeight > t.clientHeight + 1; z -= .035) t.style.fontSize = 'calc(var(--f) * ' + (1.02 * z).toFixed(3) + ')';
      });
    }
    var kpre = {};
    function katPreload(i) {
      var sp = kspreads[i]; if (!sp) return;
      (sp.l.html + sp.r.html).replace(/src="([^"]+)"/g, function (_, u) {
        if (!kpre[u]) { kpre[u] = new Image(); kpre[u].src = u; }
        return _;
      });
    }
    function katState(i) {
      kcur = Math.max(0, Math.min(i, kspreads.length - 1));
      var sp = kspreads[kcur];
      kat.querySelector('.kat-count').textContent = (sp.proj ? sp.proj.titel + ' · ' : 'Kilian Einig · ') + (kcur + 1) + ' / ' + kspreads.length;
      kat.querySelector('.kat-prev').disabled = kcur === 0;
      kat.querySelector('.kat-next').disabled = kcur === kspreads.length - 1;
      katPreload(kcur + 1); katPreload(kcur - 1);
    }
    function katRender(i) {
      i = Math.max(0, Math.min(i, kspreads.length - 1));
      var sp = kspreads[i], spread = kat.querySelector('.kat-spread');
      spread.innerHTML = kat.page(sp, sp.l, 'l') + kat.page(sp, sp.r, 'r');
      kfitText(spread);
      katState(i);
    }
    function katFlip(dir) {
      var next = kcur + dir;
      if (kturning || next < 0 || next >= kspreads.length) return;
      var from = kspreads[kcur], to = kspreads[next], leaf = kat.querySelector('.kat-leaf');
      var spread = kat.querySelector('.kat-spread');
      if (reduce) { katRender(next); return; }
      kturning = true;
      /* Nur die Hälfte tauschen, die sich wirklich ändert – so wird kein Bild neu
         aufgebaut und es flackert nichts. Das umschlagende Blatt trägt vorne die alte,
         hinten die neue Seite; darunter liegt schon die freigeblätterte Hälfte. */
      var front, back;
      if (dir > 0) {
        front = kat.page(from, from.r, 'r');
        back = kat.page(to, to.l, 'l');
        spread.children[1].outerHTML = kat.page(to, to.r, 'r');   // rechte Seite deckt die neue auf
      } else {
        front = kat.page(from, from.l, 'l');
        back = kat.page(to, to.r, 'r');
        spread.children[0].outerHTML = kat.page(to, to.l, 'l');   // linke Seite deckt die neue auf
      }
      leaf.className = 'kat-leaf ' + (dir > 0 ? 'fwd' : 'bwd');
      leaf.innerHTML = '<div class="lf-face lf-front">' + front + '</div><div class="lf-face lf-back">' + back + '</div>';
      kfitText(spread); kfitText(leaf);
      katState(next);
      leaf.style.transition = 'none';
      leaf.style.transform = 'rotateY(0deg)';
      leaf.offsetWidth;                // Reflow
      leaf.style.transition = 'transform 560ms cubic-bezier(.33,0,.2,1)';
      leaf.style.transform = 'rotateY(' + (dir > 0 ? -180 : 180) + 'deg)';
      var ended = false;
      var done = function () {
        if (ended) return; ended = true;
        leaf.removeEventListener('transitionend', done);
        /* stehende Hälfte auf die Zielseite setzen, solange das Blatt sie noch verdeckt … */
        if (dir > 0) spread.children[0].outerHTML = kat.page(to, to.l, 'l');
        else spread.children[1].outerHTML = kat.page(to, to.r, 'r');
        kfitText(spread);
        leaf.className = 'kat-leaf'; leaf.innerHTML = ''; leaf.style.transition = 'none'; leaf.style.transform = '';  // … dann das Blatt wegnehmen
        kturning = false;
      };
      leaf.addEventListener('transitionend', done);
      setTimeout(done, 720);           // Sicherheitsnetz, falls transitionend ausbleibt
    }
    function katOpen() {
      if (!kat) katBuild();
      if (lenis) lenis.stop();
      document.documentElement.classList.add('kat-lock');
      kat.classList.add('on');
      katRender(0);
    }
    function katClose() {
      kat.classList.remove('on');
      document.documentElement.classList.remove('kat-lock');
      if (lenis) lenis.start();
    }
    var kbtn = $('kat-open'); if (kbtn) kbtn.addEventListener('click', katOpen);
    addEventListener('resize', function () { if (kat && kat.classList.contains('on') && innerWidth <= 900) katClose(); });
  }

  if (PAGE === 'home') {
    /* Projekte: groß untereinander, eins nach dem anderen zum Durchscrollen. Die Übersicht hat ihr eigenes Raster. */
    /* Auf der Startseite nur die ersten vier Projekte groß; der Rest steht in der Übersicht. */
    var HOME = 4;
    $('works').innerHTML = S.projekte.slice(0, HOME).map(function (p, i) {
      return '<a class="big rv" href="' + url(p) + '">' +
        '<div class="big-ph"' + (p.rahmen.bg ? ' style="background:' + p.rahmen.bg + '"' : '') + '>' + frameImg(p.rahmen, p.bildAlt, i === 0) + '</div>' +
        '<div class="big-cap"><h3>' + esc(p.titel) + '</h3><p class="big-kurz">' + esc(p.kurz) + '</p></div></a>';
    }).join('') + (S.projekte.length > HOME
      ? '<a class="big-more rv" href="projekte.html"><span>Weitere Projekte entdecken</span><span aria-hidden="true">→</span></a>'
      : '');
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
    setupCatalog();
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

    var figHtml = function (g) {
      var d = D[g[0]], wide = d && d[0] > d[1] * 1.6;
      var media = /\.mp4$/.test(g[0]) ?
        '<video src="' + esc(g[0]) + '" poster="' + esc(g[2] || '') + '" muted loop playsinline controls preload="metadata" aria-label="' + esc(g[1]) + '"></video>' :
        '<button type="button" class="zoom" aria-label="' + esc(g[1]) + ', groß ansehen"><img src="' + esc(g[0]) + '" alt="' + esc(g[1]) + '"' + dims(g[0]) + ' loading="lazy" decoding="async"></button>';
      return '<figure class="rv' + (wide ? ' wide' : '') + '">' + media + '<figcaption>' + esc(g[1]) + '</figcaption></figure>';
    };
    var gal = (p.galerie || []).length ? '<div class="gal">' + p.galerie.map(figHtml).join('') + '</div>' : '';
    /* Projekte mit Phasen (z. B. Hochstapler: Entwurf 3. Semester, Ausführung 4. Semester) */
    var phasen = (p.phasen || []).map(function (ph) {
      return '<section class="pp-phase">' +
        '<div class="pp-phase-head rv"><span class="label">' + esc(ph.label) + '</span>' +
        '<div class="txt">' + [].concat(ph.text).map(function (t) { return '<p>' + esc(t) + '</p>'; }).join('') + '</div></div>' +
        (ph.bilder && ph.bilder.length ? '<div class="gal">' + ph.bilder.map(figHtml).join('') + '</div>' : '') +
        '</section>';
    }).join('');

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
        lam + steps + gal + phasen +
        '<a class="next rv" href="' + url(nx) + '"><strong>' + esc(nx.titel) + ' <span aria-hidden="true">→</span></strong></a>' +
      '</div>';

    reveal(document.querySelectorAll('#projekt .rv'));

    setupCatalog();

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
  /* Beim Verlassen und beim Zurückkommen alles zurücksetzen, damit der Zurück-Button
     die Seite nicht mit gesperrtem Scrollen (Katalog offen) oder ausgeblendet einfriert. */
  function katReset() {
    var k = document.querySelector('.kat');
    if (k) k.classList.remove('on');
    document.documentElement.classList.remove('kat-lock');
  }
  window.addEventListener('pagehide', function () {
    document.documentElement.classList.remove('leaving'); katReset();
    if (lenis) lenis.start();
  });
  window.addEventListener('pageshow', function (e) {
    document.documentElement.classList.remove('leaving'); katReset();
    if (lenis) lenis.start();
    if (e.persisted) jumpToHash();
  });

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
    /* Normale Links wechseln die Seite direkt – ohne Ausblenden, das hängen bleiben konnte. */
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
