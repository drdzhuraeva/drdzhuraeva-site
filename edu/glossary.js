/* ============================================================
   Глоссарий: кликабельные сноски к терминам.
   Страница задаёт словарь через window.GLOSSARY = { key: [title, html] }.
   Термины в разметке: <span class="term" data-term="key">…</span>
   ============================================================ */
(function () {
  "use strict";
  function init() {
    var G = window.GLOSSARY || {};
    var pop = null;
    function close() { if (pop) { pop.remove(); pop = null; } }
    function open(el) {
      close();
      var d = G[el.getAttribute("data-term")];
      if (!d) return;
      pop = document.createElement("div");
      pop.className = "term-pop";
      pop.innerHTML = '<span class="tp-title">' + d[0] + "</span>" + d[1];
      document.body.appendChild(pop);
      var r = el.getBoundingClientRect(), sx = window.scrollX, sy = window.scrollY;
      var top = r.bottom + sy + 10, left = r.left + sx, pw = pop.offsetWidth;
      if (left + pw > window.innerWidth + sx - 12) left = window.innerWidth + sx - pw - 12;
      if (left < sx + 8) left = sx + 8;
      if (r.bottom + 10 + pop.offsetHeight > window.innerHeight) { top = r.top + sy - pop.offsetHeight - 10; pop.classList.add("below"); }
      pop.style.top = top + "px"; pop.style.left = left + "px";
      pop.style.setProperty("--ax", Math.max(12, Math.min(r.left + sx - left + r.width / 2 - 7, pw - 20)) + "px");
      pop._for = el;
    }
    document.addEventListener("click", function (e) {
      var t = e.target.closest(".term");
      if (t) { e.preventDefault(); if (pop && pop._for === t) close(); else open(t); return; }
      if (!e.target.closest(".term-pop")) close();
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
    window.addEventListener("resize", close);
    document.querySelectorAll(".term").forEach(function (el) {
      el.setAttribute("tabindex", "0"); el.setAttribute("role", "button");
      el.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(el); } });
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
