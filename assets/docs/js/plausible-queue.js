// Queue Plausible events until its script has loaded (layouts/partials/docs/head/plausible.html).
window.plausible =
  window.plausible ||
  function () {
    (window.plausible.q = window.plausible.q || []).push(arguments);
  };
