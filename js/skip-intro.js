/* The Skip intro button on the live site. */

(() => {   // live site: one "Skip intro" button, gone once the home page arrives
  const b = document.getElementById("skipIntro"), s = document.getElementById("skip"), nav = document.querySelector(".nav");
  b.addEventListener("click", () => { s.click(); b.remove(); });
  const t = setInterval(() => { if (!document.body.contains(b)) return clearInterval(t);
    if (nav && parseFloat(getComputedStyle(nav).opacity) > 0.95) { b.remove(); clearInterval(t); } }, 300);
})();
