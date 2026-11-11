/* Small UI pieces: phone menu, review bar, light/dark theme. */

/* phones: hamburger menu */
const menuBtn = document.getElementById("menuBtn");
function setMenu(open) { nav.classList.toggle("menu-open", open); menuBtn.setAttribute("aria-expanded", String(open)); menuBtn.setAttribute("aria-label", open ? "Close menu" : "Menu"); }
menuBtn.addEventListener("click", () => setMenu(!nav.classList.contains("menu-open")));
nav.querySelectorAll("#navList a").forEach(a => a.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", e => { if (e.key === "Escape" && nav.classList.contains("menu-open")) { setMenu(false); menuBtn.focus(); } });
document.addEventListener("click", e => { if (nav.classList.contains("menu-open") && !nav.contains(e.target)) setMenu(false); });
/* keep the theme pill above the review bar */
const barEl = document.querySelector(".bar");
const barMini = () => matchMedia("(max-width: 760px)").matches && !barEl.classList.contains("open");
const setBarH = () => document.documentElement.style.setProperty("--barH", (barEl && getComputedStyle(barEl).display !== "none" && !barMini() ? barEl.offsetHeight : 0) + "px");
/* on phones the review bar folds into one small pill so the page gets the whole screen */
const barTog = document.getElementById("barTog");
if (barTog) barTog.addEventListener("click", () => { const o = barEl.classList.toggle("open"); barTog.setAttribute("aria-expanded", o); barTog.textContent = o ? "Hide tools" : "Review tools"; setBarH(); });
if (barEl && "ResizeObserver" in window) new ResizeObserver(setBarH).observe(barEl); setBarH();
/* review option: platform posters or car cards */
const adStyle = document.getElementById("adStyle");
const setAd = () => document.documentElement.dataset.ad = adStyle.value;
adStyle.addEventListener("change", setAd); setAd();
/* ---------- light / dark toggle (remembers the choice in this browser) ---------- */
const themeBtn = document.getElementById("themeBtn"), themeText = document.getElementById("themeText"), themeIcon = document.getElementById("themeIcon");
const sysLight = matchMedia("(prefers-color-scheme: light)");
const currentTheme = () => document.documentElement.dataset.theme || (sysLight.matches ? "light" : "dark");
function showThemeBtn() {
  const next = currentTheme() === "dark" ? "light" : "dark";
  themeText.textContent = next === "light" ? "Light" : "Dark";
  themeIcon.textContent = next === "light" ? "☼" : "☾";
  themeBtn.setAttribute("aria-label", `Switch to ${next} mode`);
}
try { const saved = localStorage.getItem("portfolio-theme"); if (saved) document.documentElement.dataset.theme = saved; } catch (e) {}
themeBtn.addEventListener("click", () => {
  const next = currentTheme() === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = next;
  try { localStorage.setItem("portfolio-theme", next); } catch (e) {}
  showThemeBtn();
});
sysLight.addEventListener("change", showThemeBtn);
showThemeBtn();
/* DARK ONLY: the site always shows in dark mode and the Light/Dark pill is hidden.
   To bring the toggle (and light mode) back, change "dark" to "" here. */
const THEME_LOCK = "dark";
if (THEME_LOCK) { document.documentElement.dataset.theme = THEME_LOCK; themeBtn.hidden = true; }
