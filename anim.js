/* Animaciones sutiles: barras que se llenan + KPIs que cuentan.
   Se desactiva solo si el usuario pidió reducir animaciones. */
(function () {
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  function run() {
    // (El llenado de las barras ahora es 100% CSS: ver @keyframes fb-grow en aurora.css)

    // KPIs numéricos: cuentan de 0 al valor (solo enteros o porcentajes simples)
    document.querySelectorAll(".kpi .n").forEach(function (n) {
      var t = n.textContent.trim();
      var m = t.match(/^(\d+)(%?)$/);
      if (!m) return; // ignora "6 / 21", "Tue 16", etc.
      var end = parseInt(m[1], 10), suf = m[2], dur = 900, t0 = performance.now();
      function tick(now) {
        var p = Math.min(1, (now - t0) / dur);
        n.textContent = Math.round(p * end) + suf;
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run);
  else run();
})();
