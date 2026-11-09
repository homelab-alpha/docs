// Low light switcher. The theme follows the system theme until the visitor
// uses the switch. See darkmode-init.js for the first paint.
const mode = document.getElementById("mode");

if (mode !== null) {
  const systemQuery = window.matchMedia("(prefers-color-scheme: dark)");

  const getOverride = () => {
    try {
      return localStorage.getItem("theme-override");
    } catch (e) {
      return null;
    }
  };

  const setOverride = (value) => {
    try {
      if (value === null) {
        localStorage.removeItem("theme-override");
      } else {
        localStorage.setItem("theme-override", value);
      }
    } catch (e) {
      // Storage is not available: the choice only lasts for this page.
    }
  };

  const apply = (dark) => {
    document.documentElement.toggleAttribute("data-dark-mode", dark);
  };

  // Follow a change of the system theme, unless the visitor chose a theme.
  systemQuery.addEventListener("change", (event) => {
    if (getOverride() === null) {
      apply(event.matches);
    }
  });

  // The switch overrides the system theme. Switching to the same theme as the
  // system removes the override, so the page follows the system again.
  mode.addEventListener("click", () => {
    const dark = !document.documentElement.hasAttribute("data-dark-mode");
    apply(dark);
    setOverride(dark === systemQuery.matches ? null : dark ? "dark" : "light");
  });

  const override = getOverride();
  apply(override === null ? systemQuery.matches : override === "dark");
}
