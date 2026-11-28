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


// The HTML link opens the latest release until its installer is confirmed.
async function refreshDemoRelease() {
  const link = document.getElementById("demo-download-link");
  if (!link) return;

  try {
    const response = await fetch(
      "https://api.github.com/repos/gotadot/doforia-demo-downloads/releases/latest",
      { cache: "no-store" }
    );
    if (!response.ok) return;

    const release = await response.json();
    if (!release || release.draft !== false || release.prerelease !== false ||
        typeof release.tag_name !== "string" ||
        !/^v\d+\.\d+\.\d+$/.test(release.tag_name) ||
        !Array.isArray(release.assets)) return;

    const version = release.tag_name;
    const name = `Doforia-Plus-Demo-${version.slice(1)}-Windows-x64-Setup.exe`;
    const installer = `https://github.com/gotadot/doforia-demo-downloads/releases/download/${version}/${name}`;
    const asset = release.assets.find(item =>
      item && item.name === name &&
      item.state === "uploaded" &&
      item.browser_download_url === installer &&
      Number.isSafeInteger(item.size) && item.size > 0
    );
    if (!asset) return;

    link.href = installer;
    document.querySelectorAll("[data-demo-version]").forEach(el => {
      el.textContent = version + " ";
      el.hidden = false;
    });
    const size = (asset.size / 1000000).toFixed(1) + " MB";
    document.querySelectorAll("[data-demo-size]").forEach(el => {
      el.textContent = " · " + size;
      el.hidden = false;
    });
  } catch (_) {
    // Keep the link to the latest release page.
  }
}
void refreshDemoRelease();
