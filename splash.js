/* Splash de intro: al cargar (primera vez de la sesión) muestra a Pepe,
   crece desde el centro y se desvanece. Se desactiva si se reducen animaciones. */
(function () {
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  // Solo la primera vez de la sesión (no en cada navegación interna)
  try {
    if (sessionStorage.getItem("ec_splash")) return;
    sessionStorage.setItem("ec_splash", "1");
  } catch (e) { /* sin storage: igual se muestra */ }

  function go() {
    var overlay = document.createElement("div");
    overlay.id = "pepe-splash";
    var img = document.createElement("img");
    img.src = "pepe.png";
    img.alt = "";
    overlay.appendChild(img);
    document.body.appendChild(overlay);

    img.addEventListener("animationend", function () { overlay.remove(); });
    setTimeout(function () { if (overlay.parentNode) overlay.remove(); }, 2600); // respaldo
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", go);
  else go();
})();
