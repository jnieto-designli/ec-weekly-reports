/* Splash de intro: Pepe crece desde el centro y se desvanece.
   SOLO PARA JULIAN: se activa si la URL lleva "#pepe" (queda recordado en este navegador
   vía localStorage). El jefe, con el link normal, nunca lo ve.
   Se muestra en cada carga/refresh y respeta prefers-reduced-motion. */
(function () {
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  // ¿Habilitado en este navegador?
  var enabled = false;
  try {
    if (location.hash.toLowerCase().indexOf("pepe") !== -1) localStorage.setItem("ec_pepe", "1");
    enabled = localStorage.getItem("ec_pepe") === "1";
  } catch (e) {
    enabled = location.hash.toLowerCase().indexOf("pepe") !== -1;
  }
  if (!enabled) return;

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
