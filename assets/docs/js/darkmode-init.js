// Theme and reading settings before the first paint. See darkmode-switch.js
// and toolbar-menus.js for the choices and their storage keys. Sets on <html>:
// - data-dark-mode when the dark mode is shown;
// - data-theme-mode: "system", "light", or "dark" (for the menu icon);
// - data-theme: the GitHub variant of the shown mode, for example
//   "dark_dimmed" or "light_high_contrast"; absent for the default;
// - data-read-font, data-read-size, data-read-spacing, data-read-narrow, and
//   data-read-motion: the reading settings; absent for the defaults;
// - data-code-size, data-code-linenos, data-code-font, data-code-wrap,
//   data-code-dark, and data-code-ws: the code options; absent for the
//   defaults, "on" or "off" otherwise.
(() => {
  const read = (key) => {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      return null;
    }
  };
  const media = (query) => Boolean(window.matchMedia && window.matchMedia(query).matches);

  const override = read("theme-override");
  const mode = override === "light" || override === "dark" ? override : "system";
  const dark = mode === "system" ? media("(prefers-color-scheme: dark)") : mode === "dark";
  const shown = dark ? "dark" : "light";

  const variants = dark ? ["dimmed", "colorblind", "tritanopia"] : ["colorblind", "tritanopia"];
  const variant = read("theme-" + shown);
  const contrast = read("contrast-" + shown);
  const high = contrast === null ? media("(prefers-contrast: more)") : contrast === "more";

  let theme = shown;
  if (variants.includes(variant)) {
    theme += "_" + variant;
  }
  if (high) {
    theme += "_high_contrast";
  }

  const root = document.documentElement;
  root.toggleAttribute("data-dark-mode", dark);
  root.setAttribute("data-theme-mode", mode);
  if (theme === shown) {
    root.removeAttribute("data-theme");
  } else {
    root.setAttribute("data-theme", theme);
  }

  const reading = { "read-font": ["legible", "dyslexic"], "read-size": ["s", "l", "xl"], "read-spacing": ["wide"] };
  Object.keys(reading).forEach((key) => {
    const value = read(key);
    if (reading[key].includes(value)) {
      root.setAttribute("data-" + key, value);
    }
  });
  root.toggleAttribute("data-read-narrow", read("read-narrow") === "on");
  if (["s", "l"].includes(read("code-size"))) {
    root.setAttribute("data-code-size", read("code-size"));
  }
  // Code switches and their defaults (on for line numbers and the code font).
  const codeSwitches = {
    "code-linenos": true,
    "code-font": true,
    "code-wrap": false,
    "code-dark": true,
    "code-ws": false,
  };
  Object.keys(codeSwitches).forEach((key) => {
    const value = read(key);
    if (value === (codeSwitches[key] ? "off" : "on")) {
      root.setAttribute("data-" + key, value);
    } else {
      root.removeAttribute("data-" + key);
    }
  });
  const motion = read("read-motion");
  root.toggleAttribute(
    "data-read-motion",
    motion === null ? media("(prefers-reduced-motion: reduce)") : motion === "reduce",
  );
})();
