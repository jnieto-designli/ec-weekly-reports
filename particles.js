/* Red de partículas tipo "átomos": puntos que se mueven y se conectan/desconectan
   con líneas según la distancia. Reaccionan al cursor (se apartan y se conectan a él).
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
  var COLOR = "120,140,170";   // azul-gris suave (más tenue que el navy)
  var MAXD;                    // distancia para conectar puntos
  var MOUSE_R;                 // radio de influencia del cursor
  var mouse = { x: null, y: null };

  function resize() {
    W = canvas.width = innerWidth * DPR;
    H = canvas.height = innerHeight * DPR;
    canvas.style.width = innerWidth + "px";
    canvas.style.height = innerHeight + "px";
    MAXD = 150 * DPR;
    MOUSE_R = 130 * DPR;
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

  addEventListener("mousemove", function (e) { mouse.x = e.clientX * DPR; mouse.y = e.clientY * DPR; });
  addEventListener("mouseout", function () { mouse.x = mouse.y = null; });

  function frame() {
    ctx.clearRect(0, 0, W, H);

    for (var i = 0; i < pts.length; i++) {
      var p = pts[i];
      if (!reduce) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;

        // Repulsión suave del cursor
        if (mouse.x !== null) {
          var mdx = p.x - mouse.x, mdy = p.y - mouse.y;
          var md = Math.sqrt(mdx * mdx + mdy * mdy);
          if (md < MOUSE_R && md > 0.01) {
            var force = (MOUSE_R - md) / MOUSE_R;
            p.x += (mdx / md) * force * 2.4 * DPR;
            p.y += (mdy / md) * force * 2.4 * DPR;
          }
        }
      }
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.8 * DPR, 0, 6.283);
      ctx.fillStyle = "rgba(" + COLOR + ",.5)";
      ctx.fill();
    }

    // Líneas entre puntos
    for (var a = 0; a < pts.length; a++) {
      for (var b = a + 1; b < pts.length; b++) {
        var dx = pts[a].x - pts[b].x, dy = pts[a].y - pts[b].y;
        var d = Math.sqrt(dx * dx + dy * dy);
        if (d < MAXD) {
          ctx.strokeStyle = "rgba(" + COLOR + "," + (1 - d / MAXD) * 0.22 + ")";
          ctx.lineWidth = 1 * DPR;
          ctx.beginPath();
          ctx.moveTo(pts[a].x, pts[a].y);
          ctx.lineTo(pts[b].x, pts[b].y);
          ctx.stroke();
        }
      }
    }

    // Líneas del cursor a los puntos cercanos (efecto "pro")
    if (mouse.x !== null) {
      for (var k = 0; k < pts.length; k++) {
        var cdx = pts[k].x - mouse.x, cdy = pts[k].y - mouse.y;
        var cd = Math.sqrt(cdx * cdx + cdy * cdy);
        if (cd < MOUSE_R) {
          ctx.strokeStyle = "rgba(0,163,224," + (1 - cd / MOUSE_R) * 0.45 + ")";
          ctx.lineWidth = 1 * DPR;
          ctx.beginPath();
          ctx.moveTo(mouse.x, mouse.y);
          ctx.lineTo(pts[k].x, pts[k].y);
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
