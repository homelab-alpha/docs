// Follow the system theme. A visitor can override it with the switch; the
// override is saved under "theme-override" and removed again when the visitor
// switches back to the system theme. The old key "theme" is no longer used,
// because the previous version saved the system theme there on the first visit.
(() => {
  let override = null;
  try {
    override = localStorage.getItem("theme-override");
  } catch (e) {
    // Storage is not available: follow the system theme.
  }

  const systemDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const dark = override === null ? systemDark : override === "dark";

  if (dark) {
    document.documentElement.setAttribute("data-dark-mode", "");
  }
})();
