// Theme menu (layouts/partials/mode-switch.html). The choices are saved in
// localStorage:
// - "theme-override": "light" or "dark"; absent means follow the system.
// - "theme-light", "theme-dark": the variant of each mode ("colorblind",
//   "tritanopia", and for dark "dimmed"); absent means the default.
// - "contrast-light", "contrast-dark": "more" or "normal"; absent means follow
//   the system setting (prefers-contrast: more).
// darkmode-init.js applies them before the first paint; this script applies a
// change and keeps the menu in step.
(() => {
  const panel = document.getElementById("theme-menu-panel");
  if (!panel) {
    return;
  }
  const menu = panel.closest(".theme-menu");
  const button = menu.querySelector(".theme-menu-button");
  const root = document.documentElement;

  // The choices of this page, also when storage is not available.
  const memory = {};
  const read = (key) => {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      return key in memory ? memory[key] : null;
    }
  };
  const write = (key, value) => {
    memory[key] = value;
    try {
      if (value === null) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, value);
      }
    } catch (e) {
      // Storage is not available: the choice only lasts for this page.
    }
  };

  const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const contrastQuery = window.matchMedia("(prefers-contrast: more)");
  const variants = { light: ["colorblind", "tritanopia"], dark: ["dimmed", "colorblind", "tritanopia"] };

  const state = () => {
    const override = read("theme-override");
    const mode = override === "light" || override === "dark" ? override : "system";
    const variant = (shown) => {
      const value = read("theme-" + shown);
      return variants[shown].includes(value) ? value : "default";
    };
    const contrast = (shown) => {
      const value = read("contrast-" + shown);
      return value === null ? contrastQuery.matches : value === "more";
    };
    return {
      mode,
      light: variant("light"),
      dark: variant("dark"),
      contrastLight: contrast("light"),
      contrastDark: contrast("dark"),
    };
  };

  const apply = () => {
    const s = state();
    const dark = s.mode === "system" ? darkQuery.matches : s.mode === "dark";
    const shown = dark ? "dark" : "light";
    let theme = shown;
    if (s[shown] !== "default") {
      theme += "_" + s[shown];
    }
    if (dark ? s.contrastDark : s.contrastLight) {
      theme += "_high_contrast";
    }
    root.toggleAttribute("data-dark-mode", dark);
    root.setAttribute("data-theme-mode", s.mode);
    if (theme === shown) {
      root.removeAttribute("data-theme");
    } else {
      root.setAttribute("data-theme", theme);
    }

    // Keep the controls in step, also after a change in another tab.
    panel.querySelectorAll('input[name="theme-mode"]').forEach((input) => {
      input.checked = input.value === s.mode;
    });
    panel.querySelectorAll('input[name="theme-light"]').forEach((input) => {
      input.checked = input.value === s.light;
    });
    panel.querySelectorAll('input[name="theme-dark"]').forEach((input) => {
      input.checked = input.value === s.dark;
    });
    panel.querySelector('input[name="contrast-light"]').checked = s.contrastLight;
    panel.querySelector('input[name="contrast-dark"]').checked = s.contrastDark;
  };

  panel.addEventListener("change", (event) => {
    const input = event.target;
    if (input.name === "theme-mode") {
      write("theme-override", input.value === "system" ? null : input.value);
    } else if (input.name === "theme-light" || input.name === "theme-dark") {
      write(input.name, input.value === "default" ? null : input.value);
    } else if (input.name === "contrast-light" || input.name === "contrast-dark") {
      // The same as the system setting: follow the system again.
      write(input.name, input.checked === contrastQuery.matches ? null : input.checked ? "more" : "normal");
    }
    apply();
  });

  const open = () => {
    panel.hidden = false;
    button.setAttribute("aria-expanded", "true");
    const checked = panel.querySelector('input[name="theme-mode"]:checked');
    if (checked) {
      checked.focus();
    }
  };
  const close = (focusButton) => {
    if (panel.hidden) {
      return;
    }
    panel.hidden = true;
    button.setAttribute("aria-expanded", "false");
    if (focusButton) {
      button.focus();
    }
  };

  button.addEventListener("click", () => (panel.hidden ? open() : close(false)));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      close(menu.contains(document.activeElement));
    }
  });
  document.addEventListener("click", (event) => {
    if (!menu.contains(event.target)) {
      close(false);
    }
  });
  menu.addEventListener("focusout", (event) => {
    // Ignore focus that goes to an element around the menu (a click on a
    // row can focus a container with tabindex="-1").
    const to = event.relatedTarget;
    if (to && !menu.contains(to) && !to.contains(menu)) {
      close(false);
    }
  });

  darkQuery.addEventListener("change", apply);
  contrastQuery.addEventListener("change", apply);
  window.addEventListener("storage", apply);
  apply();
})();
