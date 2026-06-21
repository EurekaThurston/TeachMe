/* Reusable interactive checklist for 特效美术基础 critique lessons.
 *
 * wireChecklist(containerId, items)
 *   Renders a clickable accordion. Each item:
 *   { q: "检查问题", look: "看什么", fix: "怎么改", lesson: {href, label} }
 *   Clicking a row reveals what to look for, how to fix it, and which lesson to review.
 */
function wireChecklist(containerId, items) {
  const root = document.getElementById(containerId);
  if (!root) return;
  items.forEach((it, i) => {
    const row = document.createElement("div");
    row.className = "ck-row";

    const head = document.createElement("button");
    head.type = "button";
    head.className = "ck-head";
    head.innerHTML =
      '<span class="ck-num">' + (i + 1) + '</span>' +
      '<span class="ck-q">' + it.q + '</span>' +
      '<span class="ck-caret">+</span>';

    const body = document.createElement("div");
    body.className = "ck-body";
    body.style.display = "none";
    body.innerHTML =
      '<p><strong>看什么 ·</strong> ' + it.look + '</p>' +
      '<p><strong>怎么改 ·</strong> ' + it.fix + '</p>' +
      (it.lesson ? '<p class="ck-link">↳ 复习:<a href="' + it.lesson.href + '">' + it.lesson.label + '</a></p>' : '');

    head.addEventListener("click", () => {
      const open = body.style.display !== "none";
      body.style.display = open ? "none" : "block";
      head.classList.toggle("open", !open);
      head.querySelector(".ck-caret").textContent = open ? "+" : "–";
    });

    row.appendChild(head);
    row.appendChild(body);
    root.appendChild(row);
  });
}
