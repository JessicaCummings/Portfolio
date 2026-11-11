/* Copies the home footer onto Play, About and every case study. */

/* the same footer at the end of every page: Play, About and each case study get a copy of the home footer.
   Links in a copy first leave that page, then ride to their stop; "Back to the top" scrolls the page you're on. */
(function () {
  const src = document.querySelector("main .site-foot");
  ["playView", "about", "caseView"].forEach(viewId => {
    const view = document.getElementById(viewId), f = src.cloneNode(true);
    f.classList.add("site-foot--view");
    f.querySelectorAll("[id]").forEach(el => { const old = el.id, nu = old + "-" + viewId; el.id = nu;
      f.querySelectorAll(`[aria-labelledby="${old}"]`).forEach(n => n.setAttribute("aria-labelledby", nu)); });
    view.appendChild(f);
    const leave = then => { Router.go("/"); woosh(() => {
      if (!caseView.hidden) { caseView.classList.remove("open"); caseView.hidden = true; }
      if (openView) closeView(true);
      then();
    }, "Y"); };
    f.addEventListener("click", e => {
      const a = e.target.closest("a"); if (!a || a.target === "_blank" || newTabClick(e)) return;
      e.preventDefault();
      if (a.hasAttribute("data-top")) return view.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
      if (a.dataset.view) { if (openView === a.dataset.view) return view.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }); return document.querySelector(`.route[data-view="${a.dataset.view}"]`).click(); }
      if (a.hasAttribute("data-end")) return leave(() => { const end = document.getElementById("contact"); page.scrollTo({ top: end.offsetTop + end.offsetHeight - innerHeight }); });
      if (a.hasAttribute("data-jump")) { const id = a.getAttribute("href").slice(1); return leave(() => page.scrollTo({ top: pillCenter(document.getElementById(id)) - innerHeight * PEARL_AT })); }
    });
  });
})();

