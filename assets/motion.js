/* Site motion: scroll reveals. Nothing runs under prefers-reduced-motion. */
(function () {
  var reduce = matchMedia('(prefers-reduced-motion: reduce)');
  if (reduce.matches) return;

  // scroll reveals: content stays visible without JS; only hidden once JS is confirmed
  if ('IntersectionObserver' in window) {
    document.documentElement.classList.add('jc-js');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    document.querySelectorAll('.page main section > *, .page main > dl, .page footer').forEach(function (el) {
      if (el.querySelector('.rise')) return;
      el.classList.add('reveal');
      io.observe(el);
    });
  }

})();
