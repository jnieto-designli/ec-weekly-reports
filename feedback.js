/* Widget de Feedback — Entrepreneurs Circle
   Envía dentro de la página: hace POST a un Cloudflare Worker que crea el GitHub Issue
   con un token guardado del lado del servidor (nunca en el navegador).
   Si el Worker falla, cae a un GitHub Issue pre-llenado como respaldo. */
(function () {
  var WORKER_URL = "https://ec-feedback.julian-nieto.workers.dev";
  var REPO = "jnieto-designli/ec-weekly-feedback"; // solo para el respaldo

  var path = location.pathname;
  var isIndex = path.endsWith("/") || path.endsWith("index.html");
  var defaultAbout = isIndex ? "Page" : "Report content";

  var css = ""
    + ".fbw-btn{position:fixed;bottom:20px;right:20px;z-index:9999;background:#00a3e0;color:#fff;border:none;"
    + "border-radius:99px;padding:12px 20px;font:600 14px -apple-system,Segoe UI,Roboto,sans-serif;cursor:pointer;"
    + "box-shadow:0 6px 20px rgba(10,37,64,.35)}"
    + ".fbw-btn:hover{background:#0079b8}"
    + ".fbw-panel{position:fixed;bottom:74px;right:20px;z-index:9999;width:330px;max-width:calc(100vw - 40px);"
    + "background:#fff;border:1px solid #e6e9ef;border-radius:16px;box-shadow:0 18px 50px rgba(10,37,64,.30);"
    + "padding:18px;display:none;font:14px -apple-system,Segoe UI,Roboto,sans-serif;color:#1c2430}"
    + ".fbw-panel.open{display:block}"
    + ".fbw-panel h3{margin:0 0 12px;font-size:16px;color:#0a2540}"
    + ".fbw-panel label{display:block;font-size:11px;text-transform:uppercase;letter-spacing:.4px;color:#64707f;"
    + "font-weight:700;margin:10px 0 4px}"
    + ".fbw-panel select,.fbw-panel textarea{width:100%;border:1px solid #e6e9ef;border-radius:8px;padding:8px 10px;"
    + "font:14px inherit;box-sizing:border-box}"
    + ".fbw-panel textarea{min-height:84px;resize:vertical}"
    + ".fbw-send{margin-top:14px;width:100%;background:#0a2540;color:#fff;border:none;border-radius:8px;padding:11px;"
    + "font:600 14px inherit;cursor:pointer}.fbw-send:hover{background:#123a63}.fbw-send:disabled{opacity:.6;cursor:default}"
    + ".fbw-msg-out{margin-top:10px;font-weight:600;display:none}"
    + ".fbw-msg-out.ok{color:#0f7a3d}.fbw-msg-out.err{color:#c0392b}"
    + ".fbw-close{position:absolute;top:12px;right:14px;border:none;background:none;font-size:18px;cursor:pointer;color:#64707f}";

  var style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  var btn = document.createElement("button");
  btn.className = "fbw-btn";
  btn.type = "button";
  btn.textContent = "Feedback";

  var panel = document.createElement("div");
  panel.className = "fbw-panel";
  panel.innerHTML =
      '<button class="fbw-close" type="button" aria-label="Close">&times;</button>'
    + '<h3>Send feedback</h3>'
    + '<label>About</label>'
    + '<select id="fbw-about"><option' + (defaultAbout === "Page" ? " selected" : "") + '>Page</option>'
    + '<option' + (defaultAbout === "Report content" ? " selected" : "") + '>Report content</option></select>'
    + '<label>Type</label>'
    + '<select id="fbw-type"><option>Suggestion</option><option>Bug</option><option>Question</option></select>'
    + '<label>Message</label>'
    + '<textarea id="fbw-msg" placeholder="Describe your feedback..."></textarea>'
    + '<button class="fbw-send" type="button">Send</button>'
    + '<div class="fbw-msg-out"></div>';

  document.body.appendChild(btn);
  document.body.appendChild(panel);

  var out = panel.querySelector(".fbw-msg-out");
  var sendBtn = panel.querySelector(".fbw-send");

  btn.addEventListener("click", function () { panel.classList.toggle("open"); });
  panel.querySelector(".fbw-close").addEventListener("click", function () { panel.classList.remove("open"); });

  function show(kind, text) { out.className = "fbw-msg-out " + kind; out.textContent = text; out.style.display = "block"; }

  sendBtn.addEventListener("click", function () {
    var about = panel.querySelector("#fbw-about").value;
    var type = panel.querySelector("#fbw-type").value;
    var msg = panel.querySelector("#fbw-msg").value.trim();
    if (!msg) { panel.querySelector("#fbw-msg").focus(); return; }

    var payload = { about: about, type: type, message: msg, page: location.href, title: document.title || "" };

    sendBtn.disabled = true;
    show("ok", "Sending…");

    fetch(WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    .then(function (r) { return r.json().catch(function () { return { ok: false }; }); })
    .then(function (res) {
      if (res && res.ok) {
        show("ok", "Thanks! Your feedback was sent ✓");
        panel.querySelector("#fbw-msg").value = "";
        setTimeout(function () { panel.classList.remove("open"); out.style.display = "none"; sendBtn.disabled = false; }, 2200);
      } else {
        throw new Error("worker");
      }
    })
    .catch(function () {
      // Respaldo: abrir GitHub con el issue pre-llenado
      var title = "[" + type + "] " + about + ": " + msg.slice(0, 60);
      var body = "**About:** " + about + "\n**Type:** " + type + "\n**Page:** " + location.href + "\n\n---\n\n" + msg;
      var url = "https://github.com/" + REPO + "/issues/new?title=" + encodeURIComponent(title) + "&body=" + encodeURIComponent(body) + "&labels=" + encodeURIComponent("feedback," + type.toLowerCase());
      show("err", "Couldn't send automatically — opening GitHub as backup…");
      window.open(url, "_blank");
      sendBtn.disabled = false;
    });
  });
})();
