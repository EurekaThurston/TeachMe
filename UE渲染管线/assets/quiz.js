/* 共享检索练习组件 —— 即时反馈的多选 quiz。
   用法：
   <div class="quiz" data-answer="2">
     <span class="q-tag">检索练习</span>
     <p class="q-text">问题……</p>
     <button class="q-opt">选项 A</button>
     <button class="q-opt">选项 B</button>
     <button class="q-opt">选项 C</button>
     <div class="q-feedback" data-ok="对的解释" data-no="错的解释（点对的选项可看正解）"></div>
   </div>
   选项顺序按出现顺序从 0 计数；data-answer 为正确项下标。 */
(function () {
  function initQuiz(quiz) {
    var answer = parseInt(quiz.getAttribute("data-answer"), 10);
    var opts = Array.prototype.slice.call(quiz.querySelectorAll(".q-opt"));
    var fb = quiz.querySelector(".q-feedback");
    var answered = false;
    opts.forEach(function (opt, i) {
      opt.addEventListener("click", function () {
        if (answered) return;
        answered = true;
        opts.forEach(function (o, j) {
          o.disabled = true;
          if (j === answer) o.classList.add("correct");
        });
        if (i !== answer) opt.classList.add("wrong");
        if (fb) {
          var correct = i === answer;
          fb.textContent = correct
            ? (fb.getAttribute("data-ok") || "正确。")
            : (fb.getAttribute("data-no") || "再想想——绿色为正解。");
          fb.classList.add("show", correct ? "ok" : "no");
        }
      });
    });
  }
  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".quiz[data-answer]").forEach(initQuiz);
  });
})();
