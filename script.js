"use strict";
const taskBoxes = Array.from(document.querySelectorAll("#demo-tasks input[type=checkbox]"));
const taskCount = document.getElementById("task-count");
const taskPercent = document.getElementById("task-percent");
const progressRing = document.getElementById("progress-ring");
function updateTasks() {
  const completed = taskBoxes.filter(box => box.checked).length;
  const percent = Math.round(completed / taskBoxes.length * 100);
  taskCount.textContent = String(completed);
  taskPercent.textContent = String(percent);
  progressRing.style.setProperty("--pct", percent + "%");
  progressRing.setAttribute("aria-label", percent + "% of demo actions completed");
}
taskBoxes.forEach(box => box.addEventListener("change", updateTasks));
updateTasks();

const display = document.getElementById("timer-display");
const toggle = document.getElementById("timer-toggle");
const reset = document.getElementById("timer-reset");
let remaining = 25 * 60;
let interval = null;
function updateTimer() {
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  display.textContent = String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0");
}
function stopTimer() {
  if (interval !== null) clearInterval(interval);
  interval = null;
  toggle.textContent = "Start";
  toggle.setAttribute("aria-label", "Start focus timer");
}
toggle.addEventListener("click", () => {
  if (interval !== null) { stopTimer(); return; }
  if (remaining === 0) remaining = 25 * 60;
  toggle.textContent = "Pause";
  toggle.setAttribute("aria-label", "Pause focus timer");
  interval = setInterval(() => {
    remaining = Math.max(0, remaining - 1);
    updateTimer();
    if (remaining === 0) stopTimer();
  }, 1000);
  updateTimer();
});
reset.addEventListener("click", () => { stopTimer(); remaining = 25 * 60; updateTimer(); });
document.getElementById("year").textContent = String(new Date().getFullYear());
