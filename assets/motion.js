/* Site motion: cursor ring + scroll reveals. Mouse-only ring; nothing runs under prefers-reduced-motion. */
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

  // trailing ring that follows a mouse pointer and grows over links
  if (!matchMedia('(pointer: fine)').matches) return;
  var ring = document.createElement('div');
  ring.className = 'jc-ring';
  ring.setAttribute('aria-hidden', 'true');
  document.body.appendChild(ring);
  var x = 0, y = 0, tx = 0, ty = 0, running = false;
  function frame() {
    x += (tx - x) * 0.2; y += (ty - y) * 0.2;
    ring.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0)';
    if (Math.abs(tx - x) + Math.abs(ty - y) > 0.2) requestAnimationFrame(frame); else running = false;
  }
  addEventListener('pointermove', function (e) {
    if (e.pointerType !== 'mouse') return;
    tx = e.clientX; ty = e.clientY;
    if (!ring.classList.contains('on')) { x = tx; y = ty; ring.classList.add('on'); }
    var hot = e.target.closest && e.target.closest('a, button, summary, label, [role=button]');
    ring.classList.toggle('hot', !!hot);
    if (!running) { running = true; requestAnimationFrame(frame); }
  }, { passive: true });
  document.documentElement.addEventListener('mouseleave', function () { ring.classList.remove('on'); });
  addEventListener('pointerdown', function () { ring.classList.add('down'); });
  addEventListener('pointerup', function () { ring.classList.remove('down'); });
  reduce.addEventListener && reduce.addEventListener('change', function (e) { if (e.matches) ring.remove(); });
})();
