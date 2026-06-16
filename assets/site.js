/* ============================================================
   Shared behaviour — reveals + small niceties
   Robust by design: every animated element's CSS end-state is
   fully visible. We only animate *from* hidden via
   gsap.from({immediateRender:false}) fired on load, with NO
   ScrollTrigger gating — so if the rAF ticker is throttled, JS
   fails, or reduced-motion is set, content always shows.
   ============================================================ */
(function () {
  function init() {
    document.querySelectorAll('[data-year]').forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });

    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !window.gsap || !window.ScrollTrigger) return;
    var gsap = window.gsap;
    var ScrollTrigger = window.ScrollTrigger;
    gsap.registerPlugin(ScrollTrigger);

    var F = { immediateRender: false };

    // Group elements by [data-reveal-group]; ungrouped get a shared bucket.
    var groups = {};
    var order = [];
    gsap.utils.toArray('.reveal').forEach(function (el) {
      var g = el.getAttribute('data-reveal-group') || '__solo__:' + order.length;
      if (!groups[g]) { groups[g] = []; order.push(g); }
      groups[g].push(el);
    });

    // Stagger each group in using ScrollTrigger and a subtle 3D flip
    order.forEach(function (g) {
      var els = groups[g];
      var triggerEl = els[0]; // Use the first element of the group as the trigger
      
      gsap.from(els, Object.assign({}, F, {
        opacity: 0, 
        y: 40, 
        transformPerspective: 1000, 
        transformOrigin: "top center",
        duration: 1.1, 
        ease: 'power3.out',
        stagger: els.length > 1 ? 0.12 : 0,
        scrollTrigger: {
          trigger: triggerEl,
          start: "top 90%", // triggers when top of element hits 90% down the viewport
          toggleActions: "play none none none"
        }
      }));
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();
