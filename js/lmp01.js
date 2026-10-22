/* LMP 01 – Lamellen, die auf Nähe reagieren.
   Nachbau des Verhaltens der Installation: Jede Lamelle hat einen "Sensor";
   je näher Maus oder Finger, desto heller. Bewegung nur, wenn jemand die Lamellen berührt. */
(function () {
  var root = document.getElementById('lmp01-lamellen');
  if (!root) return;
  var cv = root.querySelector('canvas'), ctx = cv.getContext('2d');
  var N = 26, level = new Float32Array(N), target = new Float32Array(N);
  var pointer = null, lastInput = -1e9, dpr = 1, W = 0, H = 0;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function size() {
    dpr = Math.min(2, window.devicePixelRatio || 1);
    var r = cv.getBoundingClientRect(); W = r.width; H = r.height;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener('resize', size); size();

  function geo() {
    var bw = Math.min(W * 0.84, 900), x0 = (W - bw) / 2, top = H * 0.30, lh = H * 0.36;
    return { x0: x0, bw: bw, top: top, lh: lh, step: bw / N };
  }
  function local(e) { var r = cv.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
  root.addEventListener('pointermove', function (e) { pointer = local(e); lastInput = performance.now(); });
  root.addEventListener('pointerdown', function (e) { pointer = local(e); lastInput = performance.now(); });
  root.addEventListener('pointerleave', function () { pointer = null; });

  var visible = false;
  new IntersectionObserver(function (es) { visible = es[0].isIntersecting; if (visible) loop(); }).observe(root);

  function frame(t) {
    var g = geo(), p = pointer;
    for (var i = 0; i < N; i++) {
      var cx = g.x0 + (i + 0.5) * g.step;
      if (p) {
        var dx = (p.x - cx) / (g.bw * 0.16), dy = (p.y - (g.top + g.lh / 2)) / (g.lh * 1.6);
        target[i] = Math.exp(-(dx * dx + dy * dy));
      } else target[i] = 0;
      level[i] += (target[i] - level[i]) * (target[i] > level[i] ? 0.14 : 0.05);   // an schnell, aus langsam
    }
    ctx.clearRect(0, 0, W, H);
    // Glühen auf der Wand
    for (var j = 0; j < N; j++) {
      if (level[j] < 0.02) continue;
      var x = g.x0 + (j + 0.5) * g.step, rg = ctx.createRadialGradient(x, g.top + g.lh * 0.45, 0, x, g.top + g.lh * 0.45, g.lh * 1.1);
      rg.addColorStop(0, 'rgba(255,150,60,' + (0.10 * level[j]) + ')'); rg.addColorStop(1, 'rgba(255,150,60,0)');
      ctx.fillStyle = rg; ctx.fillRect(x - g.lh * 1.1, g.top - g.lh * 0.7, g.lh * 2.2, g.lh * 2.4);
    }
    // Träger und Seile
    ctx.fillStyle = '#0b0907';
    ctx.fillRect(g.x0 - g.step * 0.2, g.top - 12, g.bw + g.step * 0.4, 12);
    ctx.fillRect(g.x0 + g.step * 0.3, 0, 1, g.top - 12); ctx.fillRect(g.x0 + g.bw - g.step * 0.3, 0, 1, g.top - 12);
    // Lamellen: schräg gestellt, Licht kommt von oben aus dem Träger
    for (var k = 0; k < N; k++) {
      var lx = g.x0 + k * g.step + g.step * 0.12, w = g.step * 0.62, sk = (k - (N - 1) / 2) / N * g.step * 0.9;
      var L = level[k], base = 58 + 26 * (1 - Math.abs(k - (N - 1) / 2) / N);
      var lg = ctx.createLinearGradient(0, g.top, 0, g.top + g.lh);
      lg.addColorStop(0, 'rgb(' + Math.round(base + 229 * L) + ',' + Math.round(base * 0.85 + 175 * L) + ',' + Math.round(base * 0.7 + 90 * L) + ')');
      lg.addColorStop(1, 'rgb(' + Math.round(base * 0.7 + 200 * L) + ',' + Math.round(base * 0.6 + 120 * L) + ',' + Math.round(base * 0.5 + 40 * L) + ')');
      ctx.fillStyle = lg;
      ctx.beginPath();
      ctx.moveTo(lx, g.top); ctx.lineTo(lx + w, g.top);
      ctx.lineTo(lx + w + sk, g.top + g.lh); ctx.lineTo(lx + sk, g.top + g.lh); ctx.closePath(); ctx.fill();
    }
  }
  var running = false;
  function loop() {
    if (running) return; running = true;
    (function tick(t) { frame(t); if (visible) requestAnimationFrame(tick); else running = false; })(performance.now());
  }
  frame(0);
})();
