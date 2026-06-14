/* ============================================================
   Образовательный портал — «мягкий» вход для специалистов.
   ВНИМАНИЕ: это клиентский барьер (deterrent), а НЕ защита.
   Пароль виден в исходном коде. Для настоящей закрытости нужен
   внешний сервис авторизации/мембершип (см. заметку в README).
   Пароль меняется в одном месте — переменной ACCESS_PASSWORD ниже.
   ============================================================ */
(function () {
  "use strict";

  // >>> Пароль доступа. Поменяйте здесь и сообщите специалистам. <<<
  var ACCESS_PASSWORD = "derma2026";

  var KEY = "edu_specialist_access_v1";

  function unlock() {
    document.body.classList.add("unlocked");
    document.body.classList.remove("locked");
    var gate = document.getElementById("edu-gate");
    if (gate) gate.style.display = "none";
  }

  document.addEventListener("DOMContentLoaded", function () {
    var gate = document.getElementById("edu-gate");
    // Страница без гейта — ничего не делаем.
    if (!gate) { document.body.classList.add("unlocked"); return; }

    // Уже подтверждён доступ в этой сессии браузера.
    if (sessionStorage.getItem(KEY) === "ok") { unlock(); return; }

    document.body.classList.add("locked");

    var form = document.getElementById("gate-form");
    var pass = document.getElementById("gate-pass");
    var chk = document.getElementById("gate-chk");
    var err = document.getElementById("gate-err");

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      err.textContent = "";
      if (!chk.checked) { err.textContent = "Подтвердите, что вы специалист."; return; }
      if (pass.value.trim() === ACCESS_PASSWORD) {
        sessionStorage.setItem(KEY, "ok");
        unlock();
      } else {
        err.textContent = "Неверный пароль доступа.";
        pass.value = "";
        pass.focus();
      }
    });
  });
})();
