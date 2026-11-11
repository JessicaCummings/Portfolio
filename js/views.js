/* Full-screen views (Play, About) over the ride, the page-change transition, and the nav links that open them. */

/* Play and About are full-screen views over the ride; only one is open at a time */
const VIEWS = {
  play:  { el: document.getElementById("playView"),  link: document.querySelector('.route[data-view="play"]'),  title: "playTitle",  build: buildPlay },
  about: { el: document.getElementById("about"), link: document.querySelector('.route[data-view="about"]'), title: "aboutTitle", build: () => { if (!abBuilt) abBuild(); } }
};
let openView = null, viewReturn = null;
// cmd/ctrl/shift-click or middle-click: let the browser open the link's real URL in a new tab instead
const newTabClick = e => e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0;
function showView(name) {
  if (clock < DURATION) { clock = DURATION; render(clock); }
  if (openView === name) return closeView();
  if (openView) closeView(true); else viewReturn = document.activeElement;
  const v = VIEWS[name];
  v.el.hidden = false; v.el.classList.remove("open"); void v.el.offsetWidth;   // replay the entrance each time
  v.build(); v.el.classList.add("open"); v.el.scrollTop = 0;
  v.link.setAttribute("aria-current", "page"); openView = name;
  Router.go("/" + name);
  const h = document.getElementById(v.title); h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: true });
}
function closeView(switching) {
  closeLine();
  if (!openView) return;
  const v = VIEWS[openView]; v.el.classList.remove("open"); v.el.hidden = true; v.link.removeAttribute("aria-current"); openView = null;
  if (!switching) Router.go("/");
  if (!switching && viewReturn && viewReturn.focus) viewReturn.focus({ preventScroll: true });
}
/* the woosh: colored cars rush in from the left, the page swaps while the screen is covered, then they rush out to the right */
const wooshEl = document.getElementById("woosh"); let wooshing = false;
/* TRANSITION STYLE: "line" = the page fades while one line in the destination's color zips across (default);
   "train" = the five colored cars rush over the screen. To go back to the train for good, change "line" to "train" here. */
let WOOSH_STYLE = "line";
const wStyle = document.getElementById("wStyle");
if (wStyle) { wStyle.value = WOOSH_STYLE; wStyle.addEventListener("change", () => WOOSH_STYLE = wStyle.value); }
const wlineEl = document.getElementById("wline");
function wline(swap, c) {
  wooshing = true; wlineEl.hidden = false; wlineEl.style.setProperty("--c", `var(--${c || "Y"})`);
  const rail = wlineEl.querySelector(".wl-rail"), ease = "cubic-bezier(.6,0,.2,1)";
  const vIn = wlineEl.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 240, easing: "ease-out", fill: "forwards" });
  const rIn = rail.animate([{ clipPath: "inset(-30px 100% -30px 0)" }, { clipPath: "inset(-30px 0 -30px 0)" }], { duration: 420, easing: ease, fill: "forwards" });
  Promise.all([vIn.finished, rIn.finished]).then(() => {
    swap();
    const vOut = wlineEl.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 320, easing: "ease-in", fill: "forwards" });
    const rOut = rail.animate([{ clipPath: "inset(-30px 0 -30px 0)" }, { clipPath: "inset(-30px 0 -30px 100%)" }], { duration: 320, easing: ease, fill: "forwards" });
    Promise.all([vOut.finished, rOut.finished]).then(() => { [vIn, rIn, vOut, rOut].forEach(a => a.cancel()); wlineEl.hidden = true; wooshing = false; });
  });
}
function woosh(swap, c) {
  if (reduce || wooshing || !wooshEl.animate) return swap();
  if (WOOSH_STYLE === "line") return wline(swap, c);
  wooshing = true; wooshEl.hidden = false;
  const cars = [...wooshEl.children], ease = "cubic-bezier(.7,0,.3,1)";
  const ins = cars.map((c, i) => c.animate([{ transform: "translateX(-102%)" }, { transform: "translateX(0)" }], { duration: 420, delay: i * 45, easing: ease, fill: "forwards" }));
  Promise.all(ins.map(a => a.finished)).then(() => {
    swap();
    const outs = cars.map((c, i) => c.animate([{ transform: "translateX(0)" }, { transform: "translateX(102%)" }], { duration: 460, delay: 60 + i * 45, easing: ease, fill: "forwards" }));
    Promise.all(outs.map(a => a.finished)).then(() => { cars.forEach(c => c.getAnimations().forEach(a => a.cancel())); wooshEl.hidden = true; wooshing = false; });
  });
}
Object.entries(VIEWS).forEach(([name, v]) => v.link.addEventListener("click", e => { if (newTabClick(e)) return; e.preventDefault(); if (openView === name) return; woosh(() => showView(name), name === "play" ? "P" : "R"); }));
document.getElementById("playBack").addEventListener("click", () => woosh(() => closeView(), "Y"));
document.getElementById("aboutBack").addEventListener("click", () => woosh(() => closeView(), "Y"));
document.addEventListener("keydown", e => { if (e.key === "Escape" && !closeLine()) closeView(); });
document.querySelectorAll(".nav .route:not([data-view]), .nav .brand").forEach(a => a.addEventListener("click", () => { if (openView) woosh(() => closeView(), a.matches("[data-end]") ? "G" : "Y"); }));
// About: the route circles jump to their sign
document.querySelectorAll("#about .kiosk-dots a").forEach(a => a.addEventListener("click", e => {
  e.preventDefault(); const t = document.querySelector(a.getAttribute("href"));
  t.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" }); t.setAttribute("tabindex", "-1"); t.focus({ preventScroll: true });
}));
// About exit sign: contact rides to the end of the line; resume is a placeholder for now
document.getElementById("exitContact").addEventListener("click", e => { e.preventDefault(); woosh(() => { closeView(); document.querySelector('.route[data-end]').click(); }); });

function rideTo(id) {
  const s = document.getElementById(id); if (!s) return;
  if (clock < DURATION) { clock = DURATION; render(clock); }   // skip the rest of the intro (and unlock scrolling) if someone clicks early
  page.scrollTo({ top: pillCenter(s) - innerHeight * PEARL_AT, behavior: reduce ? "auto" : "smooth" });
}
document.querySelector(".scroll-cue").addEventListener("click", () => rideTo("tripslip"));
document.querySelectorAll("[data-end]").forEach(a => a.addEventListener("click", e => {
  e.preventDefault();
  if (clock < DURATION) { clock = DURATION; render(clock); }
  const end = document.getElementById("contact");
  page.scrollTo({ top: end.offsetTop + end.offsetHeight - innerHeight, behavior: reduce ? "auto" : "smooth" });
}));
document.querySelectorAll("[data-top]").forEach(a => a.addEventListener("click", e => { e.preventDefault(); page.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }); }));
document.querySelectorAll(".site-foot [data-view]").forEach(a => a.addEventListener("click", e => { if (newTabClick(e)) return; e.preventDefault(); document.querySelector(`.route[data-view="${a.dataset.view}"]`).click(); }));
document.querySelectorAll("[data-jump]").forEach(a => a.addEventListener("click", e => { e.preventDefault(); rideTo(a.getAttribute("href").slice(1)); }));
document.querySelector(".brand").addEventListener("click", e => { e.preventDefault(); page.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }); });
document.querySelectorAll(".cta:not([data-file]), .poster").forEach(a => a.addEventListener("click", e => {
  if (newTabClick(e) && a.closest(".stop")) return;
  e.preventDefault();
  const id = a.closest(".stop") && a.closest(".stop").id;
  if (id && CASES[id] && CASES[id].ready) openCase(id, a);
}));


