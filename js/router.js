/* ROUTER: every view on the site has its own address.

     /              the ride (home page)
     /about         About
     /play          Play
     /work/<id>     a case study. <id> is a key in CASES (js/cases-data.js)

   Why the about/, play/ and work/ folders exist:
   GitHub Pages only serves real files, so visiting /about directly would
   show the 404 page. Each route has a tiny stub page (about/index.html and
   so on, written by tools/build-routes.py) that sends the browser to
   /?route=/about. This file puts /about back in the address bar and opens
   the view.

   How the rest of the site uses it:
   Views call Router.go(path) when they open or close. That adds a browser
   history entry, so Back and Forward work, and updates the tab title.
   When the address changes on its own (Back, Forward, a direct visit),
   show() opens the matching view with no transition. */

const Router = (() => {
  const NAME = "Jess Cummings";
  const HOME_TITLE = document.title;

  // "/about/" and "/about" are the same page
  const clean = path => path.replace(/\/+$/, "") || "/";

  // Turns an address into what to show, or null if the site has no such page.
  function parse(path) {
    path = clean(path);
    if (path === "/") return { view: "home" };
    if (path === "/about" || path === "/play") return { view: path.slice(1) };
    const match = path.match(/^\/work\/([\w-]+)$/);
    if (match && CASES[match[1]] && CASES[match[1]].ready) return { view: "case", id: match[1] };
    return null;
  }

  function titleFor(route) {
    if (!route || route.view === "home") return HOME_TITLE;
    if (route.view === "case") return `${CASES[route.id].name} case study · ${NAME}`;
    return `${route.view === "about" ? "About" : "Play"} · ${NAME}`;
  }

  // Called by the site when a view opens or closes.
  // Only adds a history entry when the address actually changes, so show() can call
  // the same open/close functions without pushing duplicates.
  function go(path) {
    path = clean(path);
    if (clean(location.pathname) !== path) history.pushState(null, "", path + location.search);
    document.title = titleFor(parse(path));
  }

  // Opens whatever the address says, instantly. Used for Back/Forward and direct visits.
  function show(path) {
    const route = parse(path) || { view: "home" };
    closeLine();                                            // any open art or slide viewer
    if (route.view === "case") openCase(route.id, null, true);
    else {
      hideCase();
      if (route.view === "home") closeView();
      else if (openView !== route.view) showView(route.view);
    }
    document.title = titleFor(route);
  }

  window.addEventListener("popstate", () => show(location.pathname));

  // Nav links that lead back to the ride (Work, Contact, the name) also lead back to "/"
  document.querySelectorAll(".nav .route:not([data-view]), .nav .brand").forEach(a =>
    a.addEventListener("click", () => go("/")));

  // First load: called once, below, after Router exists (the views it opens call Router.go).
  function start() {
    const params = new URLSearchParams(location.search);
    const sent = params.get("route");                         // set by a stub page, e.g. "/work/tripslip"
    if (sent) {
      params.delete("route");
      const rest = params.toString();
      history.replaceState(null, "", (parse(sent) ? clean(sent) : "/") + (rest ? "?" + rest : "") + location.hash);
    } else if (location.hash === "#about" || location.hash === "#play") {
      history.replaceState(null, "", "/" + location.hash.slice(1) + location.search);   // old /#about links
    }
    if (clean(location.pathname) !== "/") show(location.pathname);
  }

  return { go, show, parse, start };
})();
Router.start();
