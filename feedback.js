/* Widget de Feedback — Entrepreneurs Circle
   Cero backend: arma un GitHub Issue pre-llenado en un repo privado y lo abre.
   El usuario (con sesión de GitHub) solo confirma "Submit new issue". */
(function () {
  var REPO = "jnieto-designli/ec-weekly-feedback";

  // Contexto por defecto según la página
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
    + "font:600 14px inherit;cursor:pointer}.fbw-send:hover{background:#123a63}"
    + ".fbw-ok{margin-top:10px;color:#0f7a3d;font-weight:600;display:none}"
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
    + '<button class="fbw-send" type="button">Open issue on GitHub →</button>'
    + '<div class="fbw-ok">Opening GitHub to submit your feedback…</div>';

  document.body.appendChild(btn);
  document.body.appendChild(panel);

  btn.addEventListener("click", function () { panel.classList.toggle("open"); });
  panel.querySelector(".fbw-close").addEventListener("click", function () { panel.classList.remove("open"); });

  panel.querySelector(".fbw-send").addEventListener("click", function () {
    var about = panel.querySelector("#fbw-about").value;
    var type = panel.querySelector("#fbw-type").value;
    var msg = panel.querySelector("#fbw-msg").value.trim();
    if (!msg) { panel.querySelector("#fbw-msg").focus(); return; }

    var typeLabel = type.toLowerCase();
    var title = "[" + type + "] " + about + ": " + msg.slice(0, 60);
    var body =
        "**About:** " + about + "\n"
      + "**Type:** " + type + "\n"
      + "**Page:** " + location.href + "\n"
      + "**Title:** " + (document.title || "") + "\n\n"
      + "---\n\n" + msg;

    var url = "https://github.com/" + REPO + "/issues/new"
      + "?title=" + encodeURIComponent(title)
      + "&body=" + encodeURIComponent(body)
      + "&labels=" + encodeURIComponent("feedback," + typeLabel);

    window.open(url, "_blank");
    panel.querySelector(".fbw-ok").style.display = "block";
    setTimeout(function () { panel.classList.remove("open"); panel.querySelector(".fbw-ok").style.display = "none"; panel.querySelector("#fbw-msg").value = ""; }, 2500);
  });
})();
