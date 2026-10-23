/* Intro der Startseite, angelehnt an einen schnell geschnittenen Reel:
   1. Farbige Streifen mit den Projektnamen fahren hoch und wieder heraus.
   2. Wortmarke erscheint, die Schrift klappt weg, die Kerbe „beißt“ zweimal.
   3. Projektbilder ploppen als Collage auf.
   4. Die Kerbe fliegt in die Kopfleiste, die Seite liegt frei.
   Läuft einmal pro Sitzung, nicht bei reduzierter Bewegung, jederzeit überspringbar. */
(function () {
  var H = document.documentElement;
  if (!H.classList.contains('intro-on')) return;
  var S = window.SITE;
  var done = false, timers = [];
  var KERBE = function (d) { return '10,10 100,10 100,40 ' + d + ',60 100,80 100,110 10,110'; };
  var wait = function (ms) { return new Promise(function (r) { timers.push(setTimeout(r, ms)); }); };
  var lenis = window.__lenis; if (lenis) lenis.stop();

  /* Streifen: eine Farbe pro Projekt, aus dem Reel übernommen */
  var COLORS = [['#1F2BFF', '#FAFAFA'], ['#CFE9DA', '#141414'], ['#FFF200', '#141414'], ['#141414', '#FAFAFA'], ['#F6B8D6', '#141414'], ['#FAFAFA', '#141414'], ['#1F2BFF', '#FAFAFA']];
  var stripes = S.projekte.map(function (p, i) {
    var c = COLORS[i % COLORS.length];
    return '<div class="i-stripe" style="background:' + c[0] + ';color:' + c[1] + '"><span>' + p.titel + ' / ' + p.art + ' / ' + p.kurz.replace(/\.$/, '') + ' /</span></div>';
  }).join('');
  var pics = S.projekte.map(function (p) { return p.uebersicht || p.bild; }).concat(['img/woven-cushion.webp', 'img/lmp-hand.webp']);
  var SPOTS = [[6, 10, 26], [60, 6, 30], [30, 36, 32], [4, 58, 24], [66, 50, 28], [42, 4, 18], [44, 64, 22], [76, 24, 18], [16, 34, 16]];

  var el = document.createElement('div');
  el.id = 'intro'; el.setAttribute('aria-hidden', 'true');
  el.innerHTML =
    '<div class="i-stripes">' + stripes + '</div>' +
    '<div class="i-collage">' + pics.map(function (src, i) {
      var s = SPOTS[i % SPOTS.length];
      return '<img src="' + src + '" alt="" style="left:' + s[0] + '%;top:' + s[1] + '%;--w:' + s[2] + 'vw">';
    }).join('') + '</div>' +
    '<div class="i-lock"><svg viewBox="10 10 90 100"><polygon points="' + KERBE(60) + '"/></svg><span class="i-name"><span>Kilian Einig</span></span></div>' +
    '<button type="button" class="i-skip label">Überspringen</button>';
  document.body.appendChild(el);

  var st = [].slice.call(el.querySelectorAll('.i-stripe')), imgs = [].slice.call(el.querySelectorAll('.i-collage img'));
  var lock = el.querySelector('.i-lock'), name = el.querySelector('.i-name'), poly = lock.querySelector('polygon');
  var ease = 'cubic-bezier(.16,1,.3,1)', snap = 'cubic-bezier(.7,0,.2,1)';

  function bite(times) {
    var frames = [];
    for (var k = 0; k < times; k++) frames.push(60, 96, 60);
    var t0 = performance.now(), dur = 180 * frames.length;
    return new Promise(function (res) {
      (function step(t) {
        if (done) return res();
        var p = Math.min(1, (t - t0) / dur), f = p * (frames.length - 1), i = Math.floor(f), r = f - i;
        var a = frames[i], b = frames[Math.min(i + 1, frames.length - 1)];
        poly.setAttribute('points', KERBE((a + (b - a) * (r * r * (3 - 2 * r))).toFixed(2)));
        if (p < 1) requestAnimationFrame(step); else res();
      })(t0);
    });
  }

  async function run() {
    /* 1 · Streifen */
    st.forEach(function (s, i) { s.animate([{ transform: 'translateY(105%)' }, { transform: 'none' }], { duration: 650, delay: i * 55, easing: ease, fill: 'both' }); });
    await wait(1250); if (done) return;
    st.forEach(function (s, i) { s.animate([{ transform: 'none' }, { transform: 'translateY(-105%)' }], { duration: 500, delay: i * 45, easing: snap, fill: 'forwards' }); });
    await wait(350); if (done) return;

    /* 2 · Wortmarke, Schrift klappt weg, Kerbe beißt */
    lock.classList.add('on');
    lock.animate([{ clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0 0 0 0)' }], { duration: 600, easing: ease, fill: 'both' });
    await wait(950); if (done) return;
    var w = name.offsetWidth;
    name.animate([{ width: w + 'px', opacity: 1 }, { width: '0px', opacity: 0 }], { duration: 500, easing: snap, fill: 'forwards' });
    await wait(450); if (done) return;
    await bite(2); if (done) return;

    /* 3 · Collage */
    imgs.forEach(function (im, i) {
      im.animate([{ opacity: 0, transform: 'scale(.86)' }, { opacity: 1, transform: 'none' }], { duration: 260, delay: i * 140, easing: ease, fill: 'both' });
    });
    await wait(imgs.length * 140 + 500); if (done) return;
    imgs.forEach(function (im, i) { im.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, delay: (imgs.length - i) * 30, fill: 'forwards' }); });
    await wait(300); if (done) return;

    /* 4 · Kerbe fliegt in die Kopfleiste */
    var from = lock.querySelector('svg').getBoundingClientRect();
    var target = document.querySelector('.nav .brand svg');
    var to = target ? target.getBoundingClientRect() : { left: 16, top: 16, width: 22, height: 24 };
    lock.animate([{ transform: 'none' }, { transform: 'translate(' + (to.left - from.left) + 'px,' + (to.top - from.top) + 'px) scale(' + (to.width / from.width) + ')' }], { duration: 750, easing: snap, fill: 'forwards' });
    el.animate([{ backgroundColor: 'rgba(250,250,250,1)' }, { backgroundColor: 'rgba(250,250,250,0)' }], { duration: 650, delay: 250, easing: 'ease', fill: 'forwards' });
    await wait(820);
    finish();
  }

  function finish() {
    if (done) return; done = true;
    timers.forEach(clearTimeout);
    try { sessionStorage.setItem('ke-intro', '1'); } catch (e) {}
    el.remove();
    H.classList.remove('intro-on');
    if (lenis) lenis.start();
    window.dispatchEvent(new Event('introdone'));
  }

  el.querySelector('.i-skip').addEventListener('click', finish);
  el.addEventListener('click', finish);
  window.addEventListener('keydown', function k(e) { if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') { finish(); window.removeEventListener('keydown', k); } });
  window.addEventListener('wheel', finish, { once: true, passive: true });
  window.addEventListener('touchmove', finish, { once: true, passive: true });
  setTimeout(finish, 9000);   // Sicherheitsnetz: die Seite bleibt nie verdeckt
  run();
})();
