/* The clock that plays the intro, the scroll ride between stations, and About's scroll-in effects. */

/* ---------- playback ---------- */
const scrub = document.getElementById("scrub"), timeEl = document.getElementById("time"),
      beatNum = document.getElementById("beatNum"), beatText = document.getElementById("beatText"),
      playBtn = document.getElementById("play");
let clock = 0, playing = true, last = null;
function frame(now) {
  if (playing) { if (last != null) clock += (now - last) / 1000; last = now; }
  if (MODE === "phone-intro" && clock > DURATION + 4) { clock = 0; page.scrollTop = 0; }   // the preview phone loops the intro
  render(clock);
  requestAnimationFrame(frame);
}
function setPlaying(v) { playing = v; last = null; playBtn.textContent = v ? "Pause" : "Play"; }
playBtn.addEventListener("click", () => setPlaying(!playing));
document.getElementById("replay").addEventListener("click", () => { clock = 0; page.scrollTop = 0; setPlaying(true); });
document.getElementById("skip").addEventListener("click", () => { clock = DURATION; setPlaying(true); });
scrub.addEventListener("input", () => { setPlaying(false); clock = +scrub.value; });

if (reduce) { clock = DURATION; }

/* Phone preview modes, used by the mobile preview page: #phone-intro loops the intro,
   #phone-home opens on the home screen, #phone-stop opens riding at the first station.
   The review bar is hidden in all of them. */
const MODE = location.hash.startsWith("#phone") ? location.hash.slice(1) : null;
if (MODE) document.querySelector(".bar").hidden = true;
if (MODE === "phone-home" || MODE === "phone-stop") clock = DURATION;
render(clock);
if (MODE === "phone-stop") { page.scrollTop = pillCenter(stops[0]) - innerHeight * PEARL_AT; smoothY = page.scrollTop; }
requestAnimationFrame(frame);

/* ---------- the ride: the line slides so the current stop sits under the pearl; neighbors wait by the arrows ---------- */
(() => {
  const view = document.getElementById("rideView"), track = document.getElementById("rideTrack");
  if (!view || !track) return;
  const STOPS = [
    { name: "Discover", c: "B", ink: "#fff", desc: "Watch people do the work. Log what I hear." },
    { name: "Define",   c: "B", ink: "#fff", desc: "Agree on one problem, and what solved looks like." },
    { name: "Develop",  c: "G", ink: "#fff", desc: "Reuse what exists. Test options with real users." },
    { name: "Deliver",  c: "G", ink: "#fff", desc: "Hand off every state. Check accessibility before release." },
    { name: "Measure",  c: "GR", ink: "#111", desc: "Compare to where we started, then go again." }
  ];
  // line color arriving at / leaving each stop
  const LINE = [["GR","B"],["B","B"],["G","G"],["G","GR"],["GR","GR"]];
  const n = STOPS.length, slots = [n - 1, ...STOPS.keys(), 0];   // a copy at each end so the loop always has a neighbor
  const K = document.getElementById("rideK"), D = document.getElementById("rideD");
  slots.forEach((si, k) => {
    const st = STOPS[si], d = document.createElement("div"); d.className = "ride-slot";
    d.style.cssText = `--in:var(--${LINE[si][0]}); --out:var(--${LINE[si][1]}); --c:var(--${st.c}); --ink:${st.ink}`;
    d.innerHTML = `<span class="ride-tick"></span><span class="ride-pill"><i>${String(si + 1).padStart(2, "0")}</i></span>`;
    d.querySelector(".ride-pill").append(st.name);
    d.querySelector(".ride-pill").addEventListener("click", () => { const off = k - pos; if (off === 1 || off === -1) step(off); });
    track.appendChild(d);
  });
  const els = [...track.children];
  let pos = 1, busy = false;   // pos = slot index under the pearl
  const slotW = () => Math.max(160, view.clientWidth * 0.38);
  const place = (anim) => {
    const w = slotW(); els.forEach(e => e.style.width = w + "px");
    track.style.transition = anim && !reduce ? "transform .75s cubic-bezier(.6,.05,.25,1)" : "none";
    track.style.transform = `translateX(${view.clientWidth / 2 - (pos + 0.5) * w}px)`;
    els.forEach((e, k) => { e.classList.toggle("on", k === pos); e.classList.toggle("far", Math.abs(k - pos) > 1); });
  };
  const map = document.getElementById("ddMap");
  const show = () => { const si = slots[pos], st = STOPS[si]; if (map) map.dataset.at = si; K.textContent = `Stop ${si + 1} of ${n}`; D.textContent = st.desc; };
  function step(dir) {
    if (busy) return; busy = !reduce; pos += dir; place(true); show();
    const settle = () => { if (pos === 0) pos = n; if (pos === n + 1) pos = 1; place(false); busy = false; };
    if (reduce) settle(); else setTimeout(settle, 760);
  }
  document.getElementById("ridePrev").addEventListener("click", () => step(-1));
  document.getElementById("rideNext").addEventListener("click", () => step(1));
  view.addEventListener("keydown", e => { if (e.key === "ArrowRight") step(1); if (e.key === "ArrowLeft") step(-1); });
  addEventListener("resize", () => place(false));
  new ResizeObserver(() => place(false)).observe(view);
  place(false); show();
})();



/* ---------- how I design: pick a layer; the note below swaps ---------- */
(() => {
  const btns = [...document.querySelectorAll("#stackLayers .layer")];
  if (!btns.length) return;
  const K = document.getElementById("stK"), D = document.getElementById("stD"), note = K.parentElement;
  const pick = b => {
    btns.forEach(x => x.setAttribute("aria-pressed", String(x === b)));
    const swap = () => { K.textContent = b.dataset.k; D.textContent = b.dataset.d; };
    if (reduce) return swap();
    note.classList.add("out");
    setTimeout(() => { swap(); note.classList.remove("out"); }, 180);
  };
  btns.forEach(b => b.addEventListener("click", () => pick(b)));
})();

/* ---------- About: each sign slides up as it scrolls into view ---------- */
(() => {
  const ab = document.getElementById("about"); if (!ab || reduce) return;
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { root: ab, threshold: .12 });
  ab.querySelectorAll(".signs > .sn:not(#sg-process)").forEach(el => { el.classList.add("rv"); io.observe(el); });
})();

