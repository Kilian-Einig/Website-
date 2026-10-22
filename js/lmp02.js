/* LMP 02 – Lichtkonfigurator.
   Drei Renderings aus derselben Kamera werden live gemischt:
   Basis (Studiolicht) + LED vorne × Farbe × Helligkeit + LED hinten × Farbe × Helligkeit.
   Licht addiert sich linear, deshalb ist das Ergebnis physikalisch dasselbe wie ein neues Rendering. */
(function () {
  var root = document.getElementById('lmp02-konfig');
  if (!root) return;
  var SRC = { basis: 'img/lmp02_pass_basis.webp', vorne: 'img/lmp02_pass_vorne.webp', hinten: 'img/lmp02_pass_hinten.webp' };
  var HEADROOM = 8.0;   // Passes wurden mit Belichtung −3 gespeichert
  var EXPOSURE = 0.6;
  var LEDGAIN = 0.5;   // Verhältnis LED-Licht zu Studiolicht

  var state = { hv: 0.85, fv: 0.55, hh: 0.80, fh: 0.1 };
  var PRESETS = {
    'Aus':        { hv: 0, fv: 0.05, hh: 0, fh: 0.05 },
    'Abendlicht': { hv: 0.71, fv: 0.1875, hh: 0.47, fh: 0.6325 },   // aus preset_schema.json: #ffb347 / 180, #4f9dff / 120
    'Türkis, Rot':{ hv: 0.85, fv: 0.55, hh: 0.80, fh: 0.1 },
    'Weiß':       { hv: 0.9, fv: 0.05, hh: 0.9, fh: 0.05 }
  };

  /* Farbregler: erstes Zehntel ist Weiß, danach einmal durch den Farbkreis (wie am Poti) */
  function colorOf(f) {
    if (f < 0.1) return [1.0, 0.86, 0.70];   // warmweiß
    var h = (f - 0.1) / 0.9;
    return hsv(h, 1, 1);
  }
  function hsv(h, s, v) {
    var i = Math.floor(h * 6), f = h * 6 - i, p = v * (1 - s), q = v * (1 - f * s), t = v * (1 - (1 - f) * s);
    switch (((i % 6) + 6) % 6) { case 0: return [v, t, p]; case 1: return [q, v, p]; case 2: return [p, v, t]; case 3: return [p, q, v]; case 4: return [t, p, v]; default: return [v, p, q]; }
  }
  function css(rgb) { return 'rgb(' + rgb.map(function (c) { return Math.round(Math.pow(c, 1 / 1.6) * 255); }).join(',') + ')'; }

  var canvas = root.querySelector('canvas');
  var gl = canvas.getContext('webgl', { premultipliedAlpha: false, preserveDrawingBuffer: false });
  var imgs = {}, loaded = 0;
  ['basis', 'vorne', 'hinten'].forEach(function (k) {
    var im = new Image(); im.decoding = 'async';
    im.onload = function () { imgs[k] = im; if (++loaded === 3) init(); };
    im.onerror = function () { root.classList.add('failed'); };
    im.src = SRC[k];
  });

  var draw = function () {};
  function init() {
    canvas.width = imgs.basis.naturalWidth; canvas.height = imgs.basis.naturalHeight;
    draw = gl ? initGL() : init2D();
    root.classList.add('ready');
    render();
  }

  function initGL() {
    var vs = 'attribute vec2 p;varying vec2 uv;void main(){uv=vec2(p.x*.5+.5,.5-p.y*.5);gl_Position=vec4(p,0.,1.);}';
    var fs = [
      'precision highp float;varying vec2 uv;uniform sampler2D B,V,H;uniform vec3 cv,ch;uniform float hr,ex;',
      'vec3 lin(vec3 c){return mix(c/12.92,pow((c+.055)/1.055,vec3(2.4)),step(.04045,c));}',
      'vec3 srgb(vec3 c){return mix(c*12.92,1.055*pow(c,vec3(1./2.4))-.055,step(.0031308,c));}',
      'vec3 aces(vec3 x){return clamp((x*(2.51*x+.03))/(x*(2.43*x+.59)+.14),0.,1.);}',
      'void main(){vec3 b=lin(texture2D(B,uv).rgb)*hr;vec3 v=lin(texture2D(V,uv).rgb)*hr;vec3 h=lin(texture2D(H,uv).rgb)*hr;',
      'vec3 c=(b+v*cv+h*ch)*ex;gl_FragColor=vec4(srgb(aces(c)),1.);}'
    ].join('\n');
    function sh(t, src) { var s = gl.createShader(t); gl.shaderSource(s, src); gl.compileShader(s); return s; }
    var pr = gl.createProgram(); gl.attachShader(pr, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(pr); gl.useProgram(pr);
    var buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    ['basis', 'vorne', 'hinten'].forEach(function (k, i) {
      var t = gl.createTexture(); gl.activeTexture(gl.TEXTURE0 + i); gl.bindTexture(gl.TEXTURE_2D, t);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, imgs[k]);
      gl.uniform1i(gl.getUniformLocation(pr, 'BVH'[i]), i);
    });
    gl.uniform1f(gl.getUniformLocation(pr, 'hr'), HEADROOM);
    gl.uniform1f(gl.getUniformLocation(pr, 'ex'), EXPOSURE);
    var uv = gl.getUniformLocation(pr, 'cv'), uh = gl.getUniformLocation(pr, 'ch');
    gl.viewport(0, 0, canvas.width, canvas.height);
    return function (cv, ch) { gl.uniform3fv(uv, cv); gl.uniform3fv(uh, ch); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); };
  }

  function init2D() {   // Rückfall ohne WebGL: dieselbe Rechnung pro Pixel
    var ctx = canvas.getContext('2d'), w = canvas.width, h = canvas.height;
    function data(im) { var c = document.createElement('canvas'); c.width = w; c.height = h; var x = c.getContext('2d'); x.drawImage(im, 0, 0); return x.getImageData(0, 0, w, h).data; }
    var L = new Float32Array(256); for (var i = 0; i < 256; i++) { var c = i / 255; L[i] = (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)) * HEADROOM; }
    var B = data(imgs.basis), V = data(imgs.vorne), H = data(imgs.hinten), out = ctx.createImageData(w, h), O = out.data;
    function tm(x) { x *= EXPOSURE; x = (x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14); x = Math.min(1, Math.max(0, x)); return 255 * (x <= 0.0031308 ? x * 12.92 : 1.055 * Math.pow(x, 1 / 2.4) - 0.055); }
    return function (cv, ch) {
      for (var p = 0; p < O.length; p += 4) for (var k = 0; k < 3; k++) O[p + k] = tm(L[B[p + k]] + L[V[p + k]] * cv[k] + L[H[p + k]] * ch[k]);
      for (var q = 3; q < O.length; q += 4) O[q] = 255;
      ctx.putImageData(out, 0, 0);
    };
  }

  /* Regler */
  var knobs = [].slice.call(root.querySelectorAll('.knob'));
  var raf = 0;
  function render() {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(function () {
      var cv = colorOf(state.fv).map(function (c) { return c * state.hv * state.hv * LEDGAIN; });
      var ch = colorOf(state.fh).map(function (c) { return c * state.hh * state.hh * LEDGAIN; });
      draw(cv, ch);
      knobs.forEach(function (k) {
        var key = k.dataset.key, v = state[key];
        k.style.setProperty('--rot', (-135 + v * 270) + 'deg');
        k.setAttribute('aria-valuenow', Math.round(v * 100));
        var label = k.dataset.kind === 'farbe' ? (v < 0.1 ? 'Weiß' : Math.round((v - 0.1) / 0.9 * 360) + '°') : Math.round(v * 100) + ' %';
        k.setAttribute('aria-valuetext', label);
        var out = k.parentNode.querySelector('output'); if (out) out.textContent = label;
        if (k.dataset.kind === 'farbe') k.parentNode.style.setProperty('--swatch', css(colorOf(v)));
      });
      root.querySelectorAll('.preset').forEach(function (b) {
        var p = PRESETS[b.dataset.preset], on = Object.keys(p).every(function (k) { return Math.abs(p[k] - state[k]) < 0.005; });
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
    });
  }

  knobs.forEach(function (k) {
    var start = null;
    function val(e) {
      var r = k.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      var a = Math.atan2(e.clientX - cx, cy - e.clientY) * 180 / Math.PI;   // 0° oben, im Uhrzeigersinn
      a = Math.max(-135, Math.min(135, a));
      return (a + 135) / 270;
    }
    k.addEventListener('pointerdown', function (e) { start = true; k.setPointerCapture(e.pointerId); state[k.dataset.key] = val(e); render(); e.preventDefault(); });
    k.addEventListener('pointermove', function (e) { if (!start) return; state[k.dataset.key] = val(e); render(); });
    k.addEventListener('pointerup', function () { start = null; });
    k.addEventListener('pointercancel', function () { start = null; });
    k.addEventListener('keydown', function (e) {
      var d = { ArrowUp: 0.02, ArrowRight: 0.02, ArrowDown: -0.02, ArrowLeft: -0.02, PageUp: 0.1, PageDown: -0.1 }[e.key];
      if (e.key === 'Home') d = -1; if (e.key === 'End') d = 1;
      if (d === undefined) return;
      state[k.dataset.key] = Math.max(0, Math.min(1, state[k.dataset.key] + d)); render(); e.preventDefault();
    });
    k.addEventListener('wheel', function (e) {
      state[k.dataset.key] = Math.max(0, Math.min(1, state[k.dataset.key] - e.deltaY * 0.0015)); render(); e.preventDefault();
    }, { passive: false });
  });

  /* Voreinstellungen gleiten statt springen */
  var anim = 0;
  root.querySelectorAll('.preset').forEach(function (b) {
    b.addEventListener('click', function () {
      var from = Object.assign({}, state), to = PRESETS[b.dataset.preset], t0 = performance.now();
      var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      cancelAnimationFrame(anim);
      (function step(t) {
        var p = reduce ? 1 : Math.min(1, (t - t0) / 700), e = 1 - Math.pow(1 - p, 3);
        Object.keys(to).forEach(function (k) { state[k] = from[k] + (to[k] - from[k]) * e; });
        render(); if (p < 1) anim = requestAnimationFrame(step);
      })(t0);
    });
  });
})();
