// Toolbar menus next to the theme menu (darkmode-switch.js):
// - the reading menu (layouts/partials/reading-menu.html);
// - the language menu (layouts/partials/language-menu.html), when the site has
//   more than one language.
// Each opens a panel under its button; Escape, a click outside, or moving the
// focus out of the menu closes it.
//
// The reading settings are saved in localStorage, and darkmode-init.js applies
// them before the first paint, as attributes on <html>:
// - "read-font": "legible" or "dyslexic" (data-read-font);
// - "read-size": "s", "l", or "xl" (data-read-size); absent is "m";
// - "read-spacing": "wide" (data-read-spacing);
// - "read-narrow": "on" (data-read-narrow);
// - "read-motion": "reduce" or "normal"; absent follows the system setting
//   (prefers-reduced-motion). data-read-motion="reduce" when motion is reduced.
(() => {
  const root = document.documentElement;

  const wire = (panel, onOpen) => {
    if (!panel) {
      return;
    }
    const menu = panel.closest(".theme-menu");
    const button = menu.querySelector(".theme-menu-button");
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
    button.addEventListener("click", () => {
      if (panel.hidden) {
        panel.hidden = false;
        button.setAttribute("aria-expanded", "true");
        onOpen();
      } else {
        close(false);
      }
    });
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
  };

  // Language menu: move the focus to the current language.
  const languages = document.getElementById("language-menu-panel");
  wire(languages, () => {
    const current = languages.querySelector('[aria-current="true"]') || languages.querySelector("a");
    if (current) {
      current.focus();
    }
  });

  // Reading menu.
  const panel = document.getElementById("reading-menu-panel");
  if (!panel) {
    return;
  }
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

  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const values = { "read-font": ["legible", "dyslexic"], "read-size": ["s", "l", "xl"], "read-spacing": ["wide"] };
  const defaults = { "read-font": "default", "read-size": "m", "read-spacing": "normal" };

  const state = () => {
    const s = {};
    for (const key of Object.keys(values)) {
      const value = read(key);
      s[key] = values[key].includes(value) ? value : defaults[key];
    }
    s["read-narrow"] = read("read-narrow") === "on";
    const motion = read("read-motion");
    s["read-motion"] = motion === null ? motionQuery.matches : motion === "reduce";
    return s;
  };

  const apply = () => {
    const s = state();
    for (const key of Object.keys(values)) {
      if (s[key] === defaults[key]) {
        root.removeAttribute("data-" + key);
      } else {
        root.setAttribute("data-" + key, s[key]);
      }
      panel.querySelectorAll(`input[name="${key}"]`).forEach((input) => {
        input.checked = input.value === s[key];
      });
    }
    root.toggleAttribute("data-read-narrow", s["read-narrow"]);
    root.toggleAttribute("data-read-motion", s["read-motion"]);
    panel.querySelector('input[name="read-narrow"]').checked = s["read-narrow"];
    panel.querySelector('input[name="read-motion"]').checked = s["read-motion"];
  };

  panel.addEventListener("change", (event) => {
    const input = event.target;
    if (input.name in values) {
      write(input.name, input.value === defaults[input.name] ? null : input.value);
    } else if (input.name === "read-narrow") {
      write("read-narrow", input.checked ? "on" : null);
    } else if (input.name === "read-motion") {
      // The same as the system setting: follow the system again.
      write("read-motion", input.checked === motionQuery.matches ? null : input.checked ? "reduce" : "normal");
    }
    apply();
  });

  panel.querySelector(".reading-menu-reset").addEventListener("click", () => {
    ["read-font", "read-size", "read-spacing", "read-narrow", "read-motion"].forEach((key) => write(key, null));
    apply();
  });

  wire(panel, () => {
    const checked = panel.querySelector('input[name="read-font"]:checked');
    if (checked) {
      checked.focus();
    }
  });

  motionQuery.addEventListener("change", apply);
  window.addEventListener("storage", apply);
  apply();
})();
