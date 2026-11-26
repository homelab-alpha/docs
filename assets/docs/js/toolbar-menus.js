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
//
// The code options are in the reading menu too, and the options button of each
// code block (layouts/partials/docs/code-block.html) opens a copy of that
// section next to the block. They are saved and applied the same way:
// - "code-size": "s" or "l" (data-code-size); absent is "m";
// - "code-linenos", "code-font" (JetBrains Mono), "code-dark": on by default,
//   "off" when turned off (data-code-linenos="off", data-code-font="off",
//   data-code-dark="off");
// - "code-wrap", "code-ws": off by default, "on" when turned on
//   (data-code-wrap="on", data-code-ws="on").
// Visible whitespace needs markers around the spaces, tabs, and line ends of
// the code; they are added the first time it is turned on.
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

  // Code switches and their defaults. Only a value other than the default is
  // saved and set as an attribute.
  const codeSwitches = {
    "code-linenos": true,
    "code-font": true,
    "code-wrap": false,
    "code-dark": true,
    "code-ws": false,
  };
  const codeKeys = Object.keys(codeSwitches);
  const codeSection = panel.querySelector("[data-code-options]");

  const state = () => {
    const s = {};
    for (const key of Object.keys(values)) {
      const value = read(key);
      s[key] = values[key].includes(value) ? value : defaults[key];
    }
    s["read-narrow"] = read("read-narrow") === "on";
    const motion = read("read-motion");
    s["read-motion"] = motion === null ? motionQuery.matches : motion === "reduce";
    const size = read("code-size");
    s["code-size"] = size === "s" || size === "l" ? size : "m";
    codeKeys.forEach((key) => {
      const value = read(key);
      s[key] = value === "on" ? true : value === "off" ? false : codeSwitches[key];
    });
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

    if (s["code-size"] === "m") {
      root.removeAttribute("data-code-size");
    } else {
      root.setAttribute("data-code-size", s["code-size"]);
    }
    codeKeys.forEach((key) => {
      if (s[key] === codeSwitches[key]) {
        root.removeAttribute("data-" + key);
      } else {
        root.setAttribute("data-" + key, s[key] ? "on" : "off");
      }
    });
    document.querySelectorAll("[data-code-option]").forEach((input) => {
      const key = input.dataset.codeOption;
      input.checked = key === "code-size" ? input.value === s[key] : s[key];
    });
    if (s["code-ws"]) {
      markWhitespace();
    }
  };

  // Markers for visible whitespace: a span around each space and tab, and an
  // empty span before each line end. The text of the code stays the same, so
  // copying is not affected; CSS shows the markers when data-code-ws is set.
  const markWhitespace = () => {
    document.querySelectorAll(".code-block:not([data-ws-marked]) .cl").forEach((line) => {
      const walker = document.createTreeWalker(line, NodeFilter.SHOW_TEXT);
      const nodes = [];
      while (walker.nextNode()) {
        nodes.push(walker.currentNode);
      }
      nodes.forEach((node) => {
        if (!/[ \t\n]/.test(node.nodeValue)) {
          return;
        }
        const fragment = document.createDocumentFragment();
        node.nodeValue.split(/([ \t\n])/).forEach((part) => {
          if (part === " " || part === "\t") {
            const span = document.createElement("span");
            span.className = part === " " ? "ws-space" : "ws-tab";
            span.textContent = part;
            fragment.append(span);
          } else if (part === "\n") {
            const span = document.createElement("span");
            span.className = "ws-eol";
            fragment.append(span, part);
          } else if (part) {
            fragment.append(part);
          }
        });
        node.replaceWith(fragment);
      });
    });
    document.querySelectorAll(".code-block").forEach((block) => block.setAttribute("data-ws-marked", ""));
  };

  // A change in the code options, in the reading menu or next to a code block.
  const changeCode = (input) => {
    const key = input.dataset.codeOption;
    if (key === "code-size") {
      write(key, input.value === "m" ? null : input.value);
    } else {
      write(key, input.checked === codeSwitches[key] ? null : input.checked ? "on" : "off");
    }
    apply();
  };

  panel.addEventListener("change", (event) => {
    const input = event.target;
    if (input.dataset.codeOption) {
      changeCode(input);
    } else if (input.name in values) {
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
    ["read-font", "read-size", "read-spacing", "read-narrow", "read-motion", "code-size", ...codeKeys].forEach((key) =>
      write(key, null),
    );
    apply();
  });

  wire(panel, () => {
    const checked = panel.querySelector('input[name="read-font"]:checked');
    if (checked) {
      checked.focus();
    }
  });

  // Options button of the code blocks: opens a copy of the code options of the
  // reading menu under the button. One panel serves every block; it moves to
  // the block whose button was used.
  const codeButtons = document.querySelectorAll(".code-block .code-options-button");
  if (codeSection && codeButtons.length > 0) {
    const popover = document.createElement("div");
    popover.className = "theme-menu-panel code-options-panel";
    popover.id = "code-options-panel";
    popover.setAttribute("role", "group");
    popover.setAttribute("aria-label", codeSection.querySelector(".theme-menu-heading").textContent);
    popover.hidden = true;
    const copy = codeSection.cloneNode(true);
    copy.removeAttribute("aria-labelledby");
    copy.removeAttribute("data-code-options");
    copy.querySelector(".theme-menu-heading").removeAttribute("id");
    copy.querySelectorAll("input").forEach((input) => (input.name = "panel-" + input.name));
    popover.append(copy);
    popover.addEventListener("change", (event) => {
      if (event.target.dataset.codeOption) {
        changeCode(event.target);
      }
    });

    let opener = null;
    const closeCode = (focusButton) => {
      if (popover.hidden) {
        return;
      }
      popover.hidden = true;
      opener.setAttribute("aria-expanded", "false");
      if (focusButton) {
        opener.focus();
      }
    };
    codeButtons.forEach((button) => {
      button.hidden = false;
      button.setAttribute("aria-controls", popover.id);
      button.addEventListener("click", () => {
        if (opener === button && !popover.hidden) {
          closeCode(false);
          opener = null;
          return;
        }
        if (opener) {
          closeCode(false);
        }
        opener = button;
        button.parentElement.append(popover);
        apply();
        popover.hidden = false;
        button.setAttribute("aria-expanded", "true");
        const first = popover.querySelector("input:checked") || popover.querySelector("input");
        if (first) {
          first.focus();
        }
      });
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !popover.hidden) {
        closeCode(popover.contains(document.activeElement));
      }
    });
    document.addEventListener("click", (event) => {
      if (opener && !popover.contains(event.target) && !opener.contains(event.target)) {
        closeCode(false);
        opener = null;
      }
    });
    popover.addEventListener("focusout", (event) => {
      const to = event.relatedTarget;
      // As in wire(): a click on a row can focus a container around it.
      if (to && !popover.contains(to) && to !== opener && !to.contains(popover)) {
        closeCode(false);
        opener = null;
      }
    });
  }

  motionQuery.addEventListener("change", apply);
  window.addEventListener("storage", apply);
  apply();
})();
