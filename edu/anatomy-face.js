/* ============================================================
   Интерактивная анатомическая модель лица (авторская SVG-схема).
   Универсальный модуль: работает на любой странице, где есть
   разметка атласа. Данные точек инъекций страница задаёт через
   window.ATLAS_POINTS = { "id": { title, muscle, action, units,
   depth, indication, verify } }.
   ============================================================ */
(function () {
  "use strict";

  function init() {
    var atlas = document.querySelector("[data-atlas]");
    if (!atlas) return;

    var svgWrap = atlas.querySelector("[data-atlas-figure]");
    var info = atlas.querySelector("[data-atlas-info]");
    var points = Array.prototype.slice.call(atlas.querySelectorAll("[data-point]"));
    var toggles = Array.prototype.slice.call(atlas.querySelectorAll("[data-toggle]"));
    var DATA = window.ATLAS_POINTS || {};
    var defaultInfo = info ? info.innerHTML : "";

    // ---- Переключение слоёв ----
    toggles.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var layer = btn.getAttribute("data-toggle");
        var on = btn.classList.toggle("off"); // off=true => скрываем
        btn.setAttribute("aria-pressed", String(!on));
        svgWrap.classList.toggle("hide-" + layer, on);
      });
    });

    // ---- Клик по точке инъекции ----
    function activate(el) {
      points.forEach(function (p) { p.classList.remove("active"); });
      el.classList.add("active");
      var id = el.getAttribute("data-point");
      var d = DATA[id];
      if (!d || !info) return;
      var rows = "";
      if (Array.isArray(d.rows)) {
        // Гибкий формат: массив [метка, значение, withBadge?]
        d.rows.forEach(function (r) {
          rows += row(r[0], r[1] + (r[2] ? verifyBadge(true) : ""));
        });
      } else {
        if (d.muscle) rows += row("Мышца", d.muscle);
        if (d.action) rows += row("Действие / вектор", d.action);
        if (d.units) rows += row("Ориентир, единиц", d.units + verifyBadge(d.verify));
        if (d.depth) rows += row("Глубина / техника", d.depth);
        if (d.indication) rows += row("Показание", d.indication);
      }
      info.innerHTML =
        '<div class="ai-title">' + (d.title || id) + "</div>" +
        '<dl class="ai-list">' + rows + "</dl>" +
        (d.verify ? '<p class="ai-verify">⚠ Параметры ориентировочны, требуют верификации врачом и зависят от аппарата/препарата.</p>' : "");
    }

    function row(k, v) { return "<dt>" + k + "</dt><dd>" + v + "</dd>"; }
    function verifyBadge(v) { return v ? ' <span class="badge-verify">проверить</span>' : ""; }

    points.forEach(function (el) {
      el.style.cursor = "pointer";
      el.setAttribute("tabindex", "0");
      el.setAttribute("role", "button");
      el.addEventListener("click", function () { activate(el); });
      el.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); activate(el); }
      });
    });

    // Сброс по клику на пустое место фигуры.
    var resetBtn = atlas.querySelector("[data-atlas-reset]");
    if (resetBtn) resetBtn.addEventListener("click", function () {
      points.forEach(function (p) { p.classList.remove("active"); });
      if (info) info.innerHTML = defaultInfo;
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
