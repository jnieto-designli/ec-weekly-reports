/* Splash de intro: Pepe crece desde el centro y se desvanece.
   SOLO PARA JULIAN: aparece ÚNICAMENTE si la URL lleva "#pepe" al final.
   El link normal (sin #pepe) nunca lo muestra — ideal para el jefe.
   Se muestra en cada carga/refresh y respeta prefers-reduced-motion. */
(function () {
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  // Solo si la URL trae "#pepe" (sin memoria). El link normal queda limpio.
  if (location.hash.toLowerCase().indexOf("pepe") === -1) return;

  // Se muestra en cada carga/refresh (solo para quien tiene #pepe activado).

  function go() {
    var overlay = document.createElement("div");
    overlay.id = "pepe-splash";
    var img = document.createElement("img");
    img.src = "pepe.png";
    img.alt = "";
    overlay.appendChild(img);
    document.body.appendChild(overlay);
    img.addEventListener("animationend", function () { overlay.remove(); });
    setTimeout(function () { if (overlay.parentNode) overlay.remove(); }, 2600);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", go);
  else go();
})();
