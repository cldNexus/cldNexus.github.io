/* cyberfetch-Skull im Browser: Port von cyberfetch (Punktwolke, Rotation, Blinn-Phong, Z-Buffer, ASCII-Rampe).
   Farbe: von links nach rechts Cyan -> Magenta -> Rot (Nico + Nick). Daten: assets/skull-data.js */
(function () {
  var S = window.SKULL;
  var canvas = document.getElementById("skull");
  if (!S || !canvas) return;
  var ctx = canvas.getContext("2d");

  var COLS = 42, ROWS = 26, CW = 14, CH = 22;
  var RAMP = " .:-=+*#%@";
  var CYAN = [0, 229, 255], MAGENTA = [255, 43, 214], RED = [255, 77, 77];
  var n = S.n, P = S.p, NR = S.nr, LUM = S.l;

  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = COLS * CW * dpr;
  canvas.height = ROWS * CH * dpr;
  ctx.scale(dpr, dpr);
  ctx.font = (CH - 1) + 'px "Share Tech Mono", Consolas, monospace';
  ctx.textBaseline = "top";

  var lx = -0.5, ly = 0.6, lz = 0.65, ll = Math.sqrt(lx * lx + ly * ly + lz * lz);
  lx /= ll; ly /= ll; lz /= ll;
  var hx = lx, hy = ly, hz = lz + 1, hl = Math.sqrt(hx * hx + hy * hy + hz * hz);
  hx /= hl; hy /= hl; hz /= hl;

  var depth = new Float32Array(ROWS * COLS);
  var best = new Int32Array(ROWS * COLS);
  var scy = ROWS / 2 / 1.18, scx = scy * (CH / CW);

  function mix(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; }
  function base(x) {            // x in [-0.7, 0.7] -> Cyan | Magenta | Rot
    var t = Math.max(0, Math.min(1, (x + 0.55) / 1.1));
    return t < 0.5 ? mix(CYAN, MAGENTA, t / 0.5) : mix(MAGENTA, RED, (t - 0.5) / 0.5);
  }

  function frame(t) {
    var ax = 0.35 * Math.sin(t * 0.7), ay = t * 0.9;
    var cx = Math.cos(ax), sx = Math.sin(ax), cy = Math.cos(ay), sy = Math.sin(ay);
    // R = Ry * Rx
    var r00 = cy, r01 = sy * sx, r02 = sy * cx;
    var r10 = 0, r11 = cx, r12 = -sx;
    var r20 = -sy, r21 = cy * sx, r22 = cy * cx;

    depth.fill(-1e9);
    best.fill(-1);
    var X = new Float32Array(n), Y = new Float32Array(n), Z = new Float32Array(n);
    for (var i = 0; i < n; i++) {
      var px = P[3 * i] / 1000, py = P[3 * i + 1] / 1000, pz = P[3 * i + 2] / 1000;
      var x = r00 * px + r01 * py + r02 * pz;
      var y = r10 * px + r11 * py + r12 * pz;
      var z = r20 * px + r21 * py + r22 * pz;
      X[i] = x; Y[i] = y; Z[i] = z;
      var c = Math.max(0, Math.min(COLS - 1, Math.floor(COLS / 2 + x * scx)));
      var r = Math.max(0, Math.min(ROWS - 1, Math.floor(ROWS / 2 - y * scy)));
      var k = r * COLS + c;
      if (z > depth[k]) { depth[k] = z; best[k] = i; }
    }

    ctx.clearRect(0, 0, COLS * CW, ROWS * CH);
    for (var row = 0; row < ROWS; row++) {
      for (var col = 0; col < COLS; col++) {
        var p = best[row * COLS + col];
        if (p < 0) continue;
        var nx0 = NR[3 * p] / 100, ny0 = NR[3 * p + 1] / 100, nz0 = NR[3 * p + 2] / 100;
        var nx = r00 * nx0 + r01 * ny0 + r02 * nz0;
        var ny = r10 * nx0 + r11 * ny0 + r12 * nz0;
        var nz = r20 * nx0 + r21 * ny0 + r22 * nz0;
        var diff = Math.max(0, Math.min(1, nx * lx + ny * ly + nz * lz));
        var spec = Math.pow(Math.max(0, Math.min(1, nx * hx + ny * hy + nz * hz)), 24);
        var lum = Math.max(0.3, Math.min(1, LUM[p] / 100));
        var inten = Math.max(0, Math.min(1.2, Math.pow(lum, 0.75) * (0.42 + 0.7 * diff) + 0.5 * spec * lum));
        var b = base(X[p]);
        var f = Math.min(inten, 1), over = Math.max(inten - 1, 0) * 255 + spec * 127.5;
        var ch = RAMP.charAt(Math.min(RAMP.length - 1, Math.floor(inten / 1.1 * (RAMP.length - 1)) + 1));
        ctx.fillStyle = "rgb(" + Math.min(255, Math.round(b[0] * f + over)) + "," +
          Math.min(255, Math.round(b[1] * f + over)) + "," + Math.min(255, Math.round(b[2] * f + over)) + ")";
        ctx.fillText(ch, col * CW, row * CH);
      }
    }
  }

  var m = /[#&]t=(-?[0-9.]+)/.exec(location.hash);
  if (m) { frame(parseFloat(m[1])); return; }
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) { frame(0.9); return; }
  var t0 = performance.now(), last = 0;
  function loop(now) {
    if (now - last > 40) { last = now; frame((now - t0) / 1000 + 0.9); }   // ca. 25 fps
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();
