/* Shared motion setting, then the About page builder and the Play page (tickets, art viewer, slide deck). */

/* ---------- nav: Work jumps to the first station, lined up with the pearl ---------- */
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- About: off the clock ----------
   To edit, change ROUTES only. Each item: [title, second line]. Anything starting with "Example" is placeholder copy.
   ink = text color on that line's color (dark on yellow and orange, white on purple and blue). */
const ROUTES = [
  { id: "M", c: "P", ink: "#fff", word: "Music", name: "On repeat", sub: "What I've been listening to", cap: "songs on repeat", items: [
    ["Vienna", "Billy Joel"], ["Advice from Ray", "Zinadelphia"], ["I Have Nothing", "Whitney Houston"], ["The Good Life", "Sammy Rae & The Friends"], ["Anxiety", "Doechii"], ["I Will Overcome", "RAYE"] ] },
  { id: "V", c: "R", ink: "#fff", word: "Values", name: "Core values", sub: "How I work", cap: "values I work by", items: [
    ["Curious", "I ask why until the system makes sense."],
    ["Ambitious", "I aim high, then make the plan to get there."],
    ["Access for everyone", "If someone can’t use it, it isn’t done."],
    ["Translate, don’t gatekeep", "Business, engineering and users should all understand the plan."],
    ["Honest", "I say what I don’t know, then go find out."] ] },
  { id: "C", c: "G", ink: "#fff", word: "Civic tech", name: "Civic tech", sub: "Tech for the public good", cap: "civic projects", items: [
    ["Newlab", "Member through TripSlip. I help startups there, including Motmot, ConStrat and Chip Motors"],
    ["Tech for social good", "VP and director of workshops. Grew the student org from 20 to 150+ members and brought in guest speakers and sponsors"],
    ["PIT-UN student speaker and liaison", "Public Interest Technology University Network, 2024–2025"],
    ["Florida resource map", "Florida Community Innovation Foundation, through UMSI Alternative Spring Break"] ] },
  { id: "L", c: "B", ink: "#fff", word: "Learning", name: "Now learning", sub: "What I’m teaching myself", cap: "things I’m learning", items: [
    ["Building Claude skills", "Like the consulting deck skill on my Play page"],
    ["Branding and marketing", "Building brand systems with Claude, starting with my own"],
    ["Sales", "Learning it hands-on at TripSlip"] ] },
  { id: "H", c: "Y", ink: "#111", word: "Hobbies", name: "Hobbies", sub: "How I recharge", cap: "hobbies", items: [
    ["Rock climbing", ""], ["Yoga", ""], ["Walking", ""], ["Art", ""], ["Cooking", ""] ] },
];
/* ---------- Play: one bus ticket per fun project. kind "art" opens the art here; kind "site" links out.
   To edit, change PROJECTS only. Anything starting with "Example" is placeholder copy; add url for sites, img + alt for art. */
const PROJECTS = [
  // label + letter are optional: they replace "Website/Art · single ticket" and the W/A circle.
  // look = the ticket's format (see TICKET_ART below): "tag" | "stub" | "solid" | "dark" | "strip"
  // art = the shape on it: "dots" | "halves" | "arrow" | "checker" | "quarters". code = the big type on a "tag".
  { kind: "site", label: "Hackathon · winner", letter: "H", look: "tag", code: "45:00", title: "The 45-Minute Mile", sub: "Think Technologies hackathon", c: "Y", ink: "#111", url: "http://the45minutemile.com/" },
  { kind: "site", label: "Civic tech", letter: "C", look: "stub", art: "dots", title: "Florida Resource Map", sub: "UMSI spring break UX sprint for a nonprofit\u2019s resource map", c: "G", ink: "#fff", url: "https://www.linkedin.com/posts/this-is-what-networking-looks-like-when-you-ugcPost-7303531106694270976-0DrN/", go: "See the post" },
  { kind: "site", label: "Client · AI training", letter: "T", look: "solid", art: "halves", title: "Claude for accessibility", sub: "Taught the Nudena Design team to use Claude for accessibility work", c: "B", ink: "#fff", url: "https://nudena.co/nudena-design", go: "See the studio" },
  { kind: "site", label: "Accessibility audit", letter: "A", look: "dark", art: "arrow", title: "League Proof", sub: "Accessibility audit of the League Proof site", c: "R", ink: "#fff", url: "https://leagueproof.com/" },
  { kind: "site", label: "Toolkit · small business", letter: "K", look: "strip", art: "checker", title: "PM starter kit", sub: "SMART goals, a project management guide and a team growth path for small teams", c: "O", ink: "#111", url: "" },
  { kind: "deck", label: "Claude skill", letter: "S", look: "stub", art: "quarters", title: "Consulting deck skill", sub: "My Claude skill for strategy-firm slides: action titles, one exhibit each. Flip through a deck that explains how it works, then download the skill.", c: "P", ink: "#fff", go: "View the deck", download: "/skill/consulting-slide-layouts-SKILL.md", slides: [
    ["/deck3/k-01.jpg", "Consulting decks, on rails"],
    ["/deck3/k-02.jpg", "Every slide proves one point"],
    ["/deck3/k-03.jpg", "01 · Plan the story"],
    ["/deck3/k-04.jpg", "Titles and numbers before slides"],
    ["/deck3/k-05.jpg", "One takeaway, one exhibit"],
    ["/deck3/k-06.jpg", "02 · Build the slide"],
    ["/deck3/k-07.jpg", "Fixed places on every slide"],
    ["/deck3/k-08.jpg", "Five type sizes, 24px floor"],
    ["/deck3/k-09.jpg", "Rules over look-alike cards"],
    ["/deck3/k-10.jpg", "Every number needs a comparison"],
    ["/deck3/k-11.jpg", "03 · Pick the exhibit"],
    ["/deck3/k-12.jpg", "Pick the job, then the exhibit"],
    ["/deck3/k-13.jpg", "18 layouts on one line"],
    ["/deck3/k-14.jpg", "A big number is also a chart"],
    ["/deck3/k-15.jpg", "Bars drawn to scale"],
    ["/deck3/k-16.jpg", "04 · Keep it honest"],
    ["/deck3/k-17.jpg", "Honesty and fit checks"],
    ["/deck3/k-18.jpg", "This deck, by the numbers"],
    ["/deck3/k-19.jpg", "Five stops, notes to deck"],
    ["/deck3/k-20.jpg", "Every slide proves one point"],
    ["/deck3/k-21.jpg", "Contact"] ] }
];
const flood = document.getElementById("flood");
let abBuilt = false, abReturn = null, flReturn = null, tkNarrow = null, flTimer = null;
function abBuild() {
  // kiosk: one big circle per line, then one big tile per line; both open that line's full-color page
  const dots = document.getElementById("kDots"), tiles = document.getElementById("kTiles");
  if (dots && tiles) { dots.innerHTML = ""; tiles.innerHTML = ""; }
  if (dots && tiles) ROUTES.forEach((r, i) => {
    const d = document.createElement("button"); d.type = "button"; d.className = "kdot"; d.textContent = r.id;
    d.style.cssText = `--c:var(--${r.c}); --ink:${r.ink}; animation-delay:${0.1 + i * 0.07}s`;
    d.setAttribute("aria-label", `${r.word}: ${r.sub}`);
    d.addEventListener("click", () => openLine(r.id, d)); dots.appendChild(d);
    const t = document.createElement("button"); t.type = "button"; t.className = "tile";
    t.style.cssText = `--c:var(--${r.c}); --ink:${r.ink}; animation-delay:${0.3 + i * 0.08}s`;
    t.setAttribute("aria-label", `${r.word}, ${r.items.length} on this line: ${r.sub}`);
    t.innerHTML = `<span class="tile-num" aria-hidden="true"><b>${String(r.items.length).padStart(2, "0")}</b></span>
      <span class="tile-word" aria-hidden="true"><span class="w1"></span><span class="w2"><i>${r.id}</i><span class="nm"></span><em></em></span></span>`;
    t.querySelector(".w1").textContent = r.word; t.querySelector(".nm").textContent = r.name; t.querySelector("em").textContent = r.sub;
    t.addEventListener("click", () => openLine(r.id, t.querySelector(".tile-num"))); tiles.appendChild(t);
  });

  // ---- gallery: the same station sign for every line
  const gal = document.getElementById("kGallery");
  if (gal) ROUTES.forEach((r, i) => {
    const b = document.createElement("button"); b.type = "button"; b.className = "sg";
    b.style.cssText = `--c:var(--${r.c}); --ink:${r.ink}; animation-delay:${0.2 + i * 0.07}s`;
    b.setAttribute("aria-label", `${r.word}: ${r.sub}`);
    b.innerHTML = `<span class="sg-top" aria-hidden="true"><span>Line ${r.id}</span><span>${String(r.items.length).padStart(2, "0")} stops</span></span>
      <span class="sg-name" aria-hidden="true"></span><span class="sg-sub" aria-hidden="true"></span>
      <span class="sg-bul" aria-hidden="true"><i class="L">${r.id}</i>${r.items.map((_, j) => `<i>${j + 1}</i>`).join("")}</span>
      <span class="sg-foot" aria-hidden="true"><b><span class="jc-arrow" aria-hidden="true"></span></b><span></span></span>`;
    b.querySelector(".sg-name").textContent = r.word; b.querySelector(".sg-sub").textContent = r.name; b.querySelector(".sg-foot span").textContent = r.sub;
    b.addEventListener("click", () => openLine(r.id, b)); gal.appendChild(b);
  });
  // ---- splash: a different subway object for each line
  const R = Object.fromEntries(ROUTES.map(r => [r.id, r]));
  const n2 = id => String(R[id].items.length).padStart(2, "0");
  const arrowSvg = (rot, col) => `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M6 50H82M50 18l32 32-32 32" fill="none" stroke="${col}" stroke-width="16" stroke-linejoin="miter" transform="rotate(${rot - 45} 50 50)"/></svg>`;
  const sp = document.getElementById("kSplash");
  sp.innerHTML = `
    <button type="button" class="sp-card" data-id="M" aria-label="${R.M.word}: ${R.M.sub}">
      <span class="t" aria-hidden="true">${R.M.word}Card<small>${R.M.id}</small></span>
      <svg viewBox="0 0 600 140" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 40 H330 C420 40 440 140 520 140" stroke="var(--Y)" stroke-width="26" fill="none"/>
        <path d="M0 72 H318 C398 72 418 160 500 160" stroke="var(--O)" stroke-width="26" fill="none"/>
        <path d="M0 104 H306 C376 104 396 180 480 180" stroke="var(--B)" stroke-width="26" fill="none"/></svg>
      <span class="strip" aria-hidden="true"><span>&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;</span><span>${n2("M")} ${R.M.cap.toUpperCase()}</span></span>
    </button>
    <button type="button" class="sp-arrow" data-id="V" aria-label="${R.V.word}: ${R.V.sub}">
      <span class="disc" aria-hidden="true">${arrowSvg(90, "#fff")}</span>
      <span class="sp-foot" aria-hidden="true"><b>${R.V.word}</b><span>${R.V.sub}</span><i>${R.V.id}</i></span>
    </button>
    <button type="button" class="sp-exit sp-civic" data-id="C" aria-label="${R.C.word}: ${R.C.sub}">
      <span class="ltr" aria-hidden="true">${R.C.id}</span><span class="arw" aria-hidden="true">${arrowSvg(-90, "#fff")}</span>
      <span class="blk" aria-hidden="true">${R.C.word}</span>
      <span class="sp-foot" aria-hidden="true"><span>${R.C.sub}</span><i>${n2("C")}</i></span>
    </button>
    <button type="button" class="sp-ticket sp-learn" data-id="L" aria-label="${R.L.word}: ${R.L.sub}">
      <span class="hd" aria-hidden="true"><i>${R.L.id}</i><i>${n2("L")}</i></span>
      <b class="big" aria-hidden="true">${R.L.name}</b><small aria-hidden="true">${R.L.sub}</small>
      <span class="perf" aria-hidden="true"></span>
      <span class="way" aria-hidden="true"><span>ADMIT ONE</span><span>LINE ${R.L.id}</span></span>
    </button>
    <button type="button" class="sp-hob" data-id="H" aria-label="${R.H.word}: ${R.H.items.map(x => x[0]).join(", ")}">
      <span class="hob-dots" aria-hidden="true">${R.H.items.map((x, k) => `<i style="--c:var(--${["O","Y","G","P","R"][k % 5]})" title="${x[0]}">${x[0][0]}</i>`).join("")}<i class="go">${arrowSvg(90, "#111")}</i></span>
      <span class="sp-foot" aria-hidden="true"><b>${R.H.word}</b><span>${R.H.sub}</span><i>${R.H.id}</i></span>
    </button>`;
  sp.querySelectorAll("button[data-id]").forEach(b => b.addEventListener("click", () => openLine(b.dataset.id, b)));
  abBuilt = true;
}
function openLine(id, from) {
  const r = ROUTES.find(x => x.id === id); flReturn = from;
  const box = from.getBoundingClientRect();
  flood.style.setProperty("--ox", `${Math.min(Math.max(box.left + box.width / 2, 0), innerWidth)}px`); flood.style.setProperty("--oy", `${Math.min(Math.max(box.top + box.height / 2, 0), innerHeight)}px`);
  flood.style.setProperty("--fc", `var(--${r.c})`); flood.style.setProperty("--ink", r.ink);
  document.getElementById("flLetter").textContent = r.id;
  const h = document.getElementById("flTitle"); h.textContent = r.name;
  const two = document.createElement("span"); two.className = "two"; two.textContent = r.sub; h.appendChild(two);
  document.getElementById("flCap").textContent = r.cap;
  document.querySelector(".fl-count").hidden = false; document.getElementById("flCards").hidden = false;
  document.getElementById("flArt").hidden = true; document.getElementById("flSub").hidden = true; document.getElementById("flDeck").hidden = true;
  const ol = document.getElementById("flCards"); ol.innerHTML = "";
  r.items.forEach(([a, b], j) => {
    const li = document.createElement("li"); li.style.animationDelay = `${0.25 + j * 0.08}s`;
    li.innerHTML = `<div class="ct"><span class="lt">${r.id}</span></div><b></b><span class="ix">${String(j + 1).padStart(2, "0")}</span>`;
    const bb = li.querySelector("b"); bb.textContent = a; const sp = document.createElement("span"); sp.textContent = b; bb.appendChild(sp);
    // songs: one circle arrow that opens a Spotify search for "title artist" (swap in exact track links later if wanted)
    if (r.id === "M") {
      const q = encodeURIComponent(`${a} ${b}`), ln = document.createElement("span"); ln.className = "listen";
      ln.innerHTML = `<a href="https://open.spotify.com/search/${q}" target="_blank" rel="noopener" title="Play on Spotify"><span class="sr">Play ${a} by ${b} on Spotify (opens in a new tab)</span><span class="jc-arrow" style="--rot:-45deg" aria-hidden="true"></span></a>`;
      li.querySelector(".ct").appendChild(ln);
    }
    ol.appendChild(li);
  });
  document.getElementById("flPh").hidden = !r.items.some(it => /^Example/.test(it[1]));
  // the count rolls up like an arrivals board
  const num = document.getElementById("flNum"); clearInterval(flTimer);
  if (reduce) num.textContent = String(r.items.length).padStart(2, "0");
  else { let k = 0; num.textContent = "00"; flTimer = setInterval(() => { k++; num.textContent = String(k).padStart(2, "0"); if (k >= r.items.length) clearInterval(flTimer); }, 140); }
  flood.hidden = false; flood.scrollTop = 0; void flood.offsetWidth; flood.classList.add("open");
  document.getElementById("flClose").focus({ preventScroll: true });
}
/* Ticket art: decorative SVG shapes, hidden from screen readers. --c is the ticket's line color.
   Each piece is drawn for the panel it sits in: [viewBox, shapes]. "dots" is a CSS pattern instead (.tk-art--dots),
   so it tiles at any size. */
const TICKET_ART = {
  dots: null,
  // the solid ticket's band (wide): half circles flipping up and down
  halves: ["0 0 240 100", [0, 1, 2, 3].map(k => `<path d="M${k * 60} 50a30 30 0 0 ${k % 2} 60 0z" fill="${k % 2 ? "var(--ink)" : "var(--Y)"}"/>`).join("")
    + [0, 1, 2, 3].map(k => `<path d="M${k * 60} 50a30 30 0 0 ${1 - k % 2} 60 0z" fill="${k % 2 ? "var(--Y)" : "var(--ink)"}" opacity=".9"/>`).join("")],
  // the dark ticket's corner (square)
  arrow: ["0 0 100 100", `<path d="M10 90L78 22M34 22h44v44" fill="none" stroke="var(--c)" stroke-width="18" stroke-linejoin="miter"/>`],
  // the strip ticket's top (2:1): checkerboard over stripes
  checker: ["0 0 200 100", [0, 1, 2, 3].flatMap(r => [0, 1, 2, 3, 4, 5, 6, 7].filter(c => (r + c) % 2 === 0).map(c => `<rect x="${c * 25}" y="${r * 12.5}" width="25" height="12.5" fill="var(--c)"/>`)).join("")
    + [0, 1, 2, 3].map(k => `<rect x="0" y="${58 + k * 11}" width="200" height="6" fill="var(--G)"/>`).join("")],
  // the stub ticket's left panel (tall): a Bauhaus stack of quarters and circles
  quarters: ["0 0 100 150", `<rect width="100" height="150" fill="#111"/><path d="M0 0h50v50A50 50 0 0 1 0 0z" fill="var(--c)"/><circle cx="75" cy="25" r="25" fill="var(--Y)"/>
    <path d="M50 100A50 50 0 0 1 100 50v50z" fill="var(--c)"/><circle cx="25" cy="75" r="17" fill="var(--O)"/>
    <path d="M0 150a50 50 0 0 1 100 0z" fill="var(--fg)"/><rect x="0" y="100" width="25" height="25" fill="var(--c)"/>`],
};
let tkBuilt = false;
function buildPlay() {
  if (tkBuilt) return;
  const ul = document.getElementById("tickets"); ul.innerHTML = "";
  PROJECTS.forEach((p, i) => {
    const li = document.createElement("li"); li.style.animationDelay = `${0.15 + i * 0.06}s`;
    const isSite = p.kind === "site", isDeck = p.kind === "deck", live = isSite && p.url;
    const el = document.createElement(live ? "a" : "button");
    if (live) { el.href = p.url; el.target = "_blank"; el.rel = "noopener"; } else el.type = "button";
    el.className = `sp-ticket tk tk--${p.look || "plain"}`; el.style.cssText = `--c:var(--${p.c}); --ink:${p.ink}`;
    const no = String(i + 1).padStart(2, "0");
    el.innerHTML = `<span class="hd" aria-hidden="true"><i>${no}</i><i>${p.letter || (isSite ? "W" : "A")}</i></span>
      <small class="kd"></small><b class="big"></b><small class="sb"></small><span class="perf" aria-hidden="true"></span>
      <span class="way"><span aria-hidden="true">&lt;&lt;&lt;&lt;&lt;&lt;</span><span class="go"></span></span>`;
    // decorative extras, by format: the shape, the tag's big code, the barcode stub
    if (p.art) { const art = TICKET_ART[p.art];
      el.insertAdjacentHTML("afterbegin", `<span class="tk-art tk-art--${p.art}" aria-hidden="true">${art ? `<svg viewBox="${art[0]}" preserveAspectRatio="xMidYMid slice">${art[1]}</svg>` : ""}</span>`); }
    if (p.code) el.insertAdjacentHTML("afterbegin", `<span class="tk-code" aria-hidden="true">${esc(p.code)}</span>`);
    if (p.look === "stub" || p.look === "strip") el.insertAdjacentHTML("beforeend", `<span class="tk-stub" aria-hidden="true"><span class="bars"></span><span class="vt">Admit one · ${no}</span></span>`);
    el.querySelector(".kd").textContent = p.label || ((isSite ? "Website" : "Art") + " · single ticket");
    el.querySelector(".big").textContent = p.title; el.querySelector(".sb").textContent = p.sub;
    { const g = el.querySelector(".go"), txt = isDeck ? (p.go || "View the deck") : isSite ? (live ? (p.go || "Go to site") : "Link coming soon") : "View art"; g.textContent = txt + " ";
      if (!(isSite && !live)) g.insertAdjacentHTML("beforeend", `<span class="jc-arrow" style="--rot:${isSite ? -45 : 0}deg" aria-hidden="true"></span>`); }
    if (live) el.insertAdjacentHTML("beforeend", '<span class="sr">(opens in a new tab)</span>');
    if (isDeck) el.addEventListener("click", () => openDeck(p, el));
    else if (!isSite) el.addEventListener("click", () => openArt(p, el));
    if (isSite && !live) el.setAttribute("aria-disabled", "true");
    li.appendChild(el); ul.appendChild(li);
  });
  tkBuilt = true;
}
function openArt(p, from) {
  flReturn = from; const box = from.getBoundingClientRect();
  flood.style.setProperty("--ox", `${Math.min(Math.max(box.left + box.width / 2, 0), innerWidth)}px`); flood.style.setProperty("--oy", `${Math.min(Math.max(box.top + box.height / 2, 0), innerHeight)}px`);
  flood.style.setProperty("--fc", `var(--${p.c})`); flood.style.setProperty("--ink", p.ink);
  document.getElementById("flLetter").textContent = "A";
  document.getElementById("flTitle").textContent = p.title;
  document.querySelector(".fl-count").hidden = true; document.getElementById("flCards").hidden = true;
  document.getElementById("flDeck").hidden = true;
  const art = document.getElementById("flArt"); art.hidden = false;
  art.innerHTML = p.img ? `<img src="${p.img}" alt="">` : "<span>Artwork image here</span>";
  if (p.img) art.querySelector("img").alt = p.alt || p.title;   // give art its own alt: { img: "...", alt: "..." }
  const sub = document.getElementById("flSub"); sub.hidden = false; sub.textContent = p.sub;
  document.getElementById("flPh").hidden = !/^Example/.test(p.sub);
  flood.hidden = false; flood.scrollTop = 0; void flood.offsetWidth; flood.classList.add("open");
  document.getElementById("flClose").focus({ preventScroll: true });
}
/* a deck ticket: the flood opens on a slide viewer with arrows and a PDF download */
let dk = null, dkAt = 0;
function dkShow(i) {
  if (!dk) return; dkAt = (i + dk.slides.length) % dk.slides.length;
  const img = document.getElementById("dkImg"); img.src = dk.slides[dkAt][0]; img.alt = `Slide ${dkAt + 1}: ${dk.slides[dkAt][1]}`;
  document.getElementById("dkCount").textContent = `${dkAt + 1} / ${dk.slides.length}`;
}
function openDeck(p, from) {
  flReturn = from; dk = p; const box = from.getBoundingClientRect();
  flood.style.setProperty("--ox", `${Math.min(Math.max(box.left + box.width / 2, 0), innerWidth)}px`); flood.style.setProperty("--oy", `${Math.min(Math.max(box.top + box.height / 2, 0), innerHeight)}px`);
  flood.style.setProperty("--fc", `var(--${p.c})`); flood.style.setProperty("--ink", p.ink);
  document.getElementById("flLetter").textContent = p.letter || "D";
  document.getElementById("flTitle").textContent = p.title;
  document.querySelector(".fl-count").hidden = true; document.getElementById("flCards").hidden = true; document.getElementById("flArt").hidden = true;
  document.getElementById("flDeck").hidden = false; document.getElementById("dkDl").href = p.download;
  const sub = document.getElementById("flSub"); sub.hidden = false; sub.textContent = p.sub;
  document.getElementById("flPh").hidden = true;
  dkShow(0);
  flood.hidden = false; flood.scrollTop = 0; void flood.offsetWidth; flood.classList.add("open");
  document.getElementById("flClose").focus({ preventScroll: true });
}
document.getElementById("dkPrev").addEventListener("click", () => dkShow(dkAt - 1));
document.getElementById("dkNext").addEventListener("click", () => dkShow(dkAt + 1));
/* in the claude.ai viewer, plain download links are blocked: hand the file over through the downloads capability; elsewhere the link just works */
document.getElementById("dkDl").addEventListener("click", async e => {
  if (!(window.claude && window.claude.use)) return;   // a normal website: the browser downloads it
  e.preventDefault();
  const a = e.currentTarget, dl = await window.claude.use("downloads");
  if (!dl) { a.textContent = "Download not available here"; return; }
  try {
    const blob = await (await fetch(a.getAttribute("href"))).blob();
    await dl.save({ filename: "consulting-slide-layouts-SKILL.md", data: blob });
  } catch (err) { if (err && err.code !== "declined") a.textContent = "Download not available here"; }
});
document.addEventListener("keydown", e => { if (flood.hidden || document.getElementById("flDeck").hidden) return; if (e.key === "ArrowRight") dkShow(dkAt + 1); if (e.key === "ArrowLeft") dkShow(dkAt - 1); });
function closeLine() {
  if (flood.hidden) return false;
  flood.classList.remove("open");
  setTimeout(() => { if (!flood.classList.contains("open")) flood.hidden = true; }, reduce ? 0 : 700);
  if (flReturn && flReturn.focus) flReturn.focus({ preventScroll: true });
  return true;
}
document.getElementById("flClose").addEventListener("click", closeLine);
