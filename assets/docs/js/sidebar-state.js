// Keep the sidebar collapsed on desktop when the visitor collapsed it (see
// app.js). Runs inline right after the page wrapper, before the first paint,
// so the sidebar does not jump. Its hash is in the Content Security Policy
// (layouts/partials/docs/csp.html).
try {
  if (localStorage.getItem("sidebar-state") === "collapsed" && window.matchMedia("(min-width: 1025px)").matches) {
    document.querySelector(".page-wrapper").classList.remove("toggled");
  }
} catch (e) {}
