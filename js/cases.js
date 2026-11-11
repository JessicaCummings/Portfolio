/* Case study pages: renders CASES into a page, builds the left rail, handles the password gate. */

const caseView = document.getElementById("caseView"), caseBody = document.getElementById("caseBody"), caseRail = document.getElementById("caseRail");
const railNav = caseRail.closest(".case-rail");   // the <nav>; it takes focus when a case opens (see focusCaseStart)
let caseReturn = null, caseIO = null;
const esc = t => String(t).replace(/[&<>"]/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch]));
// Every figure needs alt text. tools/check-alt.py fails the build if one is missing; this warning catches it while editing.
function figHTML(f) {
  if (!f.alt) console.warn(`Missing alt text for ${f.src}: add alt to this figure in js/cases-data.js`);
  return `<figure class="cs-fig${f.size ? " " + f.size : ""}"><div class="cs-frame"><img src="${esc(f.src)}" alt="${esc(f.alt || "")}" loading="lazy"></div>${f.cap ? `<figcaption>${esc(f.cap)}</figcaption>` : ""}</figure>`;
}
// "49% → 96%" reads as a before/after: the old number sits small above, with a down arrow, and the new one stays big
const statN = n => { const m = String(n).split(" \u2192 "); return m.length === 2 ? `<span class="was">${esc(m[0])} <span class="jc-arrow" style="--rot:90deg" aria-hidden="true"></span><span class="sr"> to</span></span>${esc(m[1])}` : esc(n); };
/* password gate: one password opens both protected case studies. The page holds only the encrypted text;
   the password derives the key in the browser and is kept for this tab only (sessionStorage). */
const caseKey = {};
const b64d = t => Uint8Array.from(atob(t), ch => ch.charCodeAt(0));
async function unlockCases(pw) {
  if (!window.crypto || !crypto.subtle) throw new Error("no-crypto");
  const base = await crypto.subtle.importKey("raw", new TextEncoder().encode(pw), "PBKDF2", false, ["deriveKey"]);
  const key = await crypto.subtle.deriveKey({ name: "PBKDF2", salt: b64d(LOCKED.salt), iterations: 250000, hash: "SHA-256" }, base, { name: "AES-GCM", length: 256 }, false, ["decrypt"]);
  for (const id in LOCKED.cases) {
    const { iv, ct } = LOCKED.cases[id];
    const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv: b64d(iv) }, key, b64d(ct));   // throws on a wrong password
    Object.assign(CASES[id], JSON.parse(new TextDecoder().decode(plain)), { locked: false });
  }
  try { sessionStorage.setItem("jc-case-pw", pw); } catch (e) {}
}
function renderGate(id) {
  const c = CASES[id];
  caseView.style.setProperty("--cc", `var(--${c.c})`); caseView.style.setProperty("--cink", c.ink); caseView.style.setProperty("--cc-text", "var(--fg)");
  caseBody.innerHTML = `<section class="cs-sec cs-lock" id="cs-top" data-rail="Password">
    <div class="cs-head"><span class="bullet" aria-hidden="true">${esc(c.letter)}</span><span class="pill">${esc(c.name)}</span></div>
    <p class="cs-kicker">Password protected</p>
    <h2 class="cs-title" id="caseTitle" tabindex="-1">Enter the password to ride.</h2>
    <p class="cs-lede">This case study covers client work I can’t share publicly.</p>
    <form class="lock-form" novalidate>
      <label for="casePw">Password</label>
      <div class="lock-row"><input id="casePw" type="password" autocomplete="current-password" spellcheck="false" required aria-describedby="casePwMsg">
      <button type="submit" class="cta">Unlock</button></div>
      <p class="lock-msg" id="casePwMsg" role="status" aria-live="polite"></p>
    </form>
    <a class="lock-ask" href="#contact" data-end>Ask me for the password</a>
  </section>`;
  caseRail.innerHTML = `<li class="on"><a href="#cs-top" aria-current="step">Password</a></li>`;
  railNav.setAttribute("aria-label", `${c.name} case study: stops`);
  const form = caseBody.querySelector(".lock-form"), input = form.querySelector("input"), msg = form.querySelector(".lock-msg");
  form.addEventListener("submit", async e => {
    e.preventDefault();
    if (!input.value) { msg.textContent = "Type the password first."; input.focus(); return; }
    msg.textContent = "Checking…";
    try { await unlockCases(input.value); renderCase(id); caseView.scrollTop = 0; document.getElementById("caseTitle").focus({ preventScroll: true }); }
    catch (err) { msg.textContent = err.message === "no-crypto" ? "This browser can’t unlock it here. Try opening the page over https." : "That password didn’t work. Check it and try again."; input.select(); input.focus(); }
  });
  caseBody.querySelector(".lock-ask").addEventListener("click", e => { e.preventDefault(); Router.go("/"); woosh(() => { hideCase(); const end = document.getElementById("contact"); page.scrollTo({ top: end.offsetTop + end.offsetHeight - innerHeight }); }, "G"); });
}
// a password already entered in this tab unlocks without asking again
(async () => { let pw = null; try { pw = sessionStorage.getItem("jc-case-pw"); } catch (e) {} if (pw) try { await unlockCases(pw); } catch (e) {} })();
function renderCase(id) {
  const c = CASES[id];
  if (c.locked) return renderGate(id);
  caseView.style.setProperty("--cc", `var(--${c.c})`); caseView.style.setProperty("--cink", c.ink); caseView.style.setProperty("--cc-text", c.text || "var(--fg)");
  const secs = [];
  // header
  secs.push(`<section class="cs-sec" id="cs-top" data-rail="Overview">
    <div class="cs-head"><span class="bullet" aria-hidden="true">${esc(c.letter)}</span><span class="pill">${esc(c.name)}</span></div>
    <p class="cs-kicker">${esc(c.kicker)}</p>
    <h2 class="cs-title" id="caseTitle" tabindex="-1">${esc(c.title[0])}<span class="two">${esc(c.title[1])}</span></h2>
    <p class="cs-lede">${esc(c.lede)}</p>
    <dl class="cs-meta">${c.meta.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${Array.isArray(v) ? v.map(x => `<span class="cs-line">${esc(x)}</span>`).join("") : esc(v)}</dd></div>`).join("")}</dl>
    ${c.hero ? figHTML(c.hero) : ""}
  </section>`);
  c.sections.forEach((s, i) => {
    const sid = `cs-${i}`;
    let inner = `<p class="cs-kicker">${esc(s.k)}</p>${s.h ? `<h3>${esc(s.h)}</h3>` : ""}`;
    (s.p || []).forEach(t => inner += `<p class="cs-p">${esc(t)}</p>`);
    if (s.list) inner += `<ul class="cs-list">${s.list.map(t => `<li>${esc(t)}</li>`).join("")}</ul>`;
    if (s.stats) inner += `<div class="cs-stats">${s.stats.map(st => `<div class="cs-stat"><b class="${st.hi ? "hi" : ""}">${statN(st.n)}</b><span>${esc(st.label)}</span>${st.how ? `<small>${esc(st.how)}</small>` : ""}</div>`).join("")}</div>`;
    if (s.decisions) s.decisions.forEach((d, k) => {
      inner += `<div class="cs-dec"><div class="cs-dec-n"><i aria-hidden="true">${k + 1}</i><h3>${esc(d.h)}</h3></div>
        <dl class="cs-dl"><dt>The situation</dt><dd>${esc(d.ctx)}</dd><dt>What I chose</dt><dd>${esc(d.chose)}</dd><dt class="tr">The tradeoff</dt><dd class="tr">${esc(d.tradeoff)}</dd>${d.evidence ? `<dt>Evidence</dt><dd>${esc(d.evidence)}</dd>` : ""}</dl>
        ${d.fig ? figHTML(d.fig) : ""}</div>`;
    });
    if (s.bars) inner += `<div class="cs-bars" role="list">${s.bars.map(b => `<div class="cs-bar" role="listitem"><span class="lb">${esc(b.label)}</span><span class="tr"><i style="width:${Math.round(b.n / b.of * 100)}%"></i></span><b>${esc(b.show || (b.n + " of " + b.of))}</b></div>`).join("")}</div>`;
    if (s.quotes) inner += s.quotes.map(q => `<blockquote class="cs-quote"><p>${esc(q[0])}</p><cite>${esc(q[1])}</cite></blockquote>`).join("");
    if (s.quote) inner += `<blockquote class="cs-quote"><p>${esc(s.quote[0])}</p><cite>${esc(s.quote[1])}</cite></blockquote>`;
    if (s.figs) inner += `<div class="cs-figs">${s.figs.map(figHTML).join("")}</div>`;
    if (s.note) inner += `<p class="cs-note">${esc(s.note)}</p>`;
    secs.push(`<section class="cs-sec" id="${sid}" data-rail="${esc(s.rail || s.k)}">${inner}</section>`);
  });
  if (c.next && CASES[c.next]) {
    const n = CASES[c.next];
    secs.push(`<a class="cs-next" href="/work/${c.next}" data-next="${c.next}" style="--nc:var(--${n.c})"><span><small>Next stop</small><b>${esc(n.name)}</b></span><span class="bullet" aria-hidden="true" style="color:${n.ink}">${esc(n.letter)}</span></a>`);
  }
  caseBody.innerHTML = secs.join("");
  caseRail.innerHTML = [...caseBody.querySelectorAll(".cs-sec")].map(sec => `<li><a href="#${sec.id}">${esc(sec.dataset.rail)}</a></li>`).join("");
  railNav.setAttribute("aria-label", `${c.name} case study: stops`);
  wireRail();
  const nx = caseBody.querySelector("[data-next]");
  if (nx) nx.addEventListener("click", e => {
    if (newTabClick(e)) return;
    e.preventDefault(); const next = nx.dataset.next;
    Router.go(`/work/${next}`);
    woosh(() => { renderCase(next); caseView.scrollTop = 0; focusCaseStart(); }, CASES[next].c);
  });
  // the rail follows the reader
  if (caseIO) caseIO.disconnect();
  const items = [...caseRail.children];
  // one pearl rides the rail to whichever stop you're reading
  const pearlEl = document.createElement("li"); pearlEl.className = "case-pearl"; pearlEl.setAttribute("aria-hidden", "true"); pearlEl.setAttribute("role", "presentation");
  caseRail.appendChild(pearlEl);
  const setOn = k => {
    items.forEach((li, j) => { li.classList.toggle("on", j === k); const a = li.querySelector("a"); if (j === k) a.setAttribute("aria-current", "step"); else a.removeAttribute("aria-current"); });
    const li = items[k]; if (li) pearlEl.style.transform = `translateY(${li.offsetTop + li.offsetHeight / 2 - 11}px)`;
  };
  caseIO = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    setOn([...caseBody.querySelectorAll(".cs-sec")].indexOf(e.target));
  }), { root: caseView, rootMargin: "-30% 0px -60% 0px" });
  caseBody.querySelectorAll(".cs-sec").forEach(sec => caseIO.observe(sec));
  requestAnimationFrame(() => setOn(0));
}
/* ---------- keyboard: the left rail ----------
   When a case study opens, focus goes to the rail, so the first Tab lands on its first stop.
   Tabbing through the stops scrolls the page to each one (a preview of where Enter will take you).
   Enter jumps into that section and moves focus there, so the next Tab continues from it.
   Shift+Tab from the article climbs back up to the rail. */
function scrollToSection(sec) { sec.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" }); }
function wireRail() {
  caseRail.querySelectorAll("a").forEach(a => {
    const sec = () => document.getElementById(a.getAttribute("href").slice(1));
    a.addEventListener("focus", e => {
      if (!a.matches(":focus-visible")) return;                      // keyboard focus only, not mouse clicks
      // Shift+Tab back up from the article lands on the stop you're reading, not the last stop on the rail
      const current = caseRail.querySelector("li.on a");
      if (caseBody.contains(e.relatedTarget) && current && current !== a) return current.focus();
      scrollToSection(sec());
    });
    a.addEventListener("click", e => {
      e.preventDefault();
      const s = sec(); scrollToSection(s);
      s.setAttribute("tabindex", "-1"); s.focus({ preventScroll: true });
    });
  });
}
// Where focus goes when a case study opens: the rail on wide screens; the title on phones, where the rail is hidden,
// and on the password gate, where the title explains what to do.
function focusCaseStart() {
  const railShown = railNav.offsetParent !== null && !caseBody.querySelector(".cs-lock");
  const target = railShown ? railNav : document.getElementById("caseTitle");
  target.focus({ preventScroll: true });
}
/* Hides the case study with no transition and no URL change. The router and the nav use this. */
function hideCase() {
  if (caseView.hidden) return;
  caseView.classList.remove("open"); caseView.hidden = true;
}
// instant = open with no transition (direct visits to /work/<id> and the browser's Back/Forward buttons)
function openCase(id, from, instant) {
  caseReturn = from;
  Router.go(`/work/${id}`);
  const swap = () => {
    if (clock < DURATION) { clock = DURATION; render(clock); }   // skip the rest of the intro
    if (openView) closeView(true);
    renderCase(id);
    caseView.hidden = false; caseView.classList.remove("open"); void caseView.offsetWidth; caseView.classList.add("open"); caseView.scrollTop = 0;
    focusCaseStart();
  };
  instant ? swap() : woosh(swap, CASES[id].c);
}
function closeCase(instant) {
  if (caseView.hidden) return false;
  Router.go("/");
  const swap = () => { hideCase(); if (caseReturn && caseReturn.focus) caseReturn.focus({ preventScroll: true }); };
  instant ? swap() : woosh(swap, "Y");
  return true;
}
document.getElementById("caseBack").addEventListener("click", () => closeCase());
document.addEventListener("keydown", e => { if (e.key === "Escape" && !caseView.hidden && flood.hidden) closeCase(); });
document.querySelectorAll(".nav .route, .nav .brand").forEach(a => a.addEventListener("click", hideCase));

