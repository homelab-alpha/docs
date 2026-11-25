// Mobile bar (layouts/partials/docs/mobile-bar.html): "On this page" opens the
// table of contents in a sheet. The sheet is a modal <dialog>, so it keeps the
// focus inside and closes with Escape. A link or the close button closes it.
// Also: the sidebar menu closes with Escape on narrow screens, and the menu
// button reports whether the menu is open.
(() => {
  const sheet = document.getElementById("toc-sheet");
  const open = document.querySelector(".mobile-bar-toc");
  if (sheet && open && typeof sheet.showModal === "function") {
    open.addEventListener("click", () => sheet.showModal());
    sheet.querySelector(".toc-sheet-close")?.addEventListener("click", () => sheet.close());
    sheet.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => sheet.close()));
    // A click on the backdrop (outside the panel) closes the sheet.
    sheet.addEventListener("click", (event) => {
      if (event.target === sheet) sheet.close();
    });
  } else if (open) {
    open.hidden = true;
  }

  const wrapper = document.querySelector(".page-wrapper");
  const menuButton = document.getElementById("close-sidebar");
  if (!wrapper || !menuButton) return;
  const narrow = window.matchMedia("(max-width: 1024px)");
  // On a large window the class "toggled" means open; on a narrow one, closed.
  const isOpen = () =>
    narrow.matches ? !wrapper.classList.contains("toggled") : wrapper.classList.contains("toggled");
  const update = () => menuButton.setAttribute("aria-expanded", String(isOpen()));
  menuButton.setAttribute("aria-controls", "sidebar");
  new MutationObserver(update).observe(wrapper, { attributes: true, attributeFilter: ["class"] });
  narrow.addEventListener("change", update);
  update();

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && narrow.matches && isOpen()) {
      wrapper.classList.add("toggled");
      menuButton.focus();
    }
  });
})();
