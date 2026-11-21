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


// Keep the Windows Demo installer in sync with the newest public GitHub Release.
// The hardcoded v1.0.2 link and labels in index.html remain usable if this
// request is blocked, rate-limited, or the user is offline.
async function refreshDemoRelease() {
  const link = document.getElementById("demo-download-link");
  if (!link) return;

  try {
    const response = await fetch(
      "https://api.github.com/repos/gotadot/doforia-demo-downloads/releases/latest"
    );
    if (!response.ok) return;

    const release = await response.json();
    if (!release || release.draft || release.prerelease ||
        typeof release.tag_name !== "string" ||
        !/^v?\d+(?:\.\d+){1,3}(?:[-+][0-9A-Za-z.-]+)?$/.test(release.tag_name) ||
        !Array.isArray(release.assets)) return;

    const asset = release.assets.find(item =>
      typeof item.name === "string" &&
      item.name.endsWith("-Windows-x64-Setup.exe") &&
      typeof item.browser_download_url === "string"
    );
    if (!asset) return;

    const installer = new URL(asset.browser_download_url);
    if (installer.protocol !== "https:" ||
        installer.hostname !== "github.com" ||
        !installer.pathname.startsWith("/gotadot/doforia-demo-downloads/releases/download/")) return;

    link.href = installer.href;
    const version = release.tag_name.startsWith("v")
      ? release.tag_name : "v" + release.tag_name;

    document.querySelectorAll("[data-demo-version]").forEach(el => {
      el.textContent = version;
    });
    if (Number.isFinite(asset.size) && asset.size > 0) {
      const size = (asset.size / 1000000).toFixed(1) + " MB";
      document.querySelectorAll("[data-demo-size]").forEach(el => {
        el.textContent = size;
      });
    }
  } catch (_) {
    // Preserve the verified fallback installer and version in the HTML.
  }
}
void refreshDemoRelease();
