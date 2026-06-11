/* Red de partículas tipo "átomos": puntos que se mueven y se conectan/desconectan
   con líneas según la distancia. Fondo sutil detrás del contenido.
   Respeta prefers-reduced-motion: si se reducen animaciones, dibuja un cuadro estático. */
(function () {
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var canvas = document.createElement("canvas");
  canvas.id = "fb-particles";
  canvas.style.cssText = "position:fixed;inset:0;z-index:0;pointer-events:none;";
  document.body.insertBefore(canvas, document.body.firstChild);

  var ctx = canvas.getContext("2d");
  var DPR = Math.min(window.devicePixelRatio || 1, 2);
  var W, H, N, pts = [];
  var COLOR = "10,37,64";   // navy de marca
  var MAXD;                 // distancia máxima para conectar

  function resize() {
    W = canvas.width = innerWidth * DPR;
    H = canvas.height = innerHeight * DPR;
    canvas.style.width = innerWidth + "px";
    canvas.style.height = innerHeight + "px";
    MAXD = 150 * DPR;
    N = Math.max(36, Math.min(100, Math.floor(innerWidth * innerHeight / 15000)));
    pts = [];
    for (var i = 0; i < N; i++) {
      pts.push({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.3 * DPR,
        vy: (Math.random() - 0.5) * 0.3 * DPR,
      });
    }
  }

  function frame() {
    ctx.clearRect(0, 0, W, H);

    for (var i = 0; i < pts.length; i++) {
      var p = pts[i];
      if (!reduce) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
      }
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.8 * DPR, 0, 6.283);
      ctx.fillStyle = "rgba(" + COLOR + ",.6)";
      ctx.fill();
    }

    for (var a = 0; a < pts.length; a++) {
      for (var b = a + 1; b < pts.length; b++) {
        var dx = pts[a].x - pts[b].x, dy = pts[a].y - pts[b].y;
        var d = Math.sqrt(dx * dx + dy * dy);
        if (d < MAXD) {
          ctx.strokeStyle = "rgba(" + COLOR + "," + (1 - d / MAXD) * 0.35 + ")";
          ctx.lineWidth = 1 * DPR;
          ctx.beginPath();
          ctx.moveTo(pts[a].x, pts[a].y);
          ctx.lineTo(pts[b].x, pts[b].y);
          ctx.stroke();
        }
      }
    }
    if (!reduce) requestAnimationFrame(frame);
  }

  addEventListener("resize", resize);
  resize();
  frame();
})();
