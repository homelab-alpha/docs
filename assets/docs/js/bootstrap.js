// Import the Bootstrap components we want to use.
// See https://github.com/twbs/bootstrap/blob/main/js/index.umd.js
import ScrollSpy from "js/bootstrap/src/scrollspy";
import Tooltip from "js/bootstrap/src/tooltip";
import Collapse from "/js/bootstrap/src/collapse";
import Dropdown from "/js/bootstrap/src/dropdown";
import Tab from "/js/bootstrap/src/tab";
import SelectorEngine from "js/bootstrap/src/dom/selector-engine";

// Headings can have an id that is not a valid CSS selector, such as
// "1-introduction" or "section-3.5". ScrollSpy looks them up with
// querySelector("#1-introduction"), which throws. Escape such an id instead.
const findOne = SelectorEngine.findOne;
SelectorEngine.findOne = function (selector, element = document.documentElement) {
  try {
    return findOne.call(this, selector, element);
  } catch (error) {
    if (typeof selector === "string" && selector.startsWith("#")) {
      return element.querySelector(`#${CSS.escape(selector.slice(1))}`);
    }
    throw error;
  }
};

export default {
  Tab,
  Collapse,
  Dropdown,
  ScrollSpy,
  Tooltip,
};

window.Collapse = Collapse;
window.Tooltip = Tooltip;
