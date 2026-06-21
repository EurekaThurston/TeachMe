/* Reusable quiz widget for C++-for-VFX lessons.
 *
 * Usage in a lesson:
 *   <div class="quiz" id="myquiz"></div>
 *   <script src="../assets/quiz.js"></script>
 *   <script>
 *     renderQuiz("myquiz", [
 *       {
 *         q: "Question text (HTML allowed)",
 *         options: ["A", "B", "C"],   // keep options equal length where possible
 *         correct: 1,                 // index of correct option
 *         why: "Explanation shown after answering."
 *       },
 *       ...
 *     ]);
 *   </script>
 *
 * Design notes:
 * - Immediate, automatic feedback (tight feedback loop for skill building).
 * - One attempt per question; reveals the correct answer + explanation.
 * - No formatting clues that betray the right answer.
 */
function renderQuiz(containerId, questions) {
  const root = document.getElementById(containerId);
  if (!root) return;

  questions.forEach((item, qi) => {
    const card = document.createElement("div");
    card.className = "quiz-q";

    const qText = document.createElement("div");
    qText.className = "q-text";
    qText.innerHTML = (qi + 1) + ". " + item.q;
    card.appendChild(qText);

    const fb = document.createElement("div");
    fb.className = "quiz-feedback";

    const buttons = [];
    item.options.forEach((opt, oi) => {
      const btn = document.createElement("button");
      btn.className = "quiz-opt";
      btn.innerHTML = opt;
      btn.addEventListener("click", () => {
        if (card.dataset.answered) return;
        card.dataset.answered = "1";
        const right = oi === item.correct;
        buttons.forEach((b, bi) => {
          b.disabled = true;
          if (bi === item.correct) b.classList.add("correct");
          if (bi === oi && !right) b.classList.add("wrong");
        });
        fb.classList.add(right ? "correct" : "wrong");
        fb.innerHTML = (right ? "✓ 对了。" : "✗ 不对。") + (item.why ? " " + item.why : "");
      });
      buttons.push(btn);
      card.appendChild(btn);
    });

    card.appendChild(fb);
    root.appendChild(card);
  });
}
