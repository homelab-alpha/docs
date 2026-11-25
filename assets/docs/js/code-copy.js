// Copy buttons of the code blocks (layouts/docs/_markup/render-codeblock.html).
// The button copies the text of the code, without line numbers, and says
// "Copied" for two seconds; screen readers hear it through the status element.
(() => {
  const buttons = document.querySelectorAll(".code-block .code-copy");
  if (buttons.length === 0 || !navigator.clipboard) {
    buttons.forEach((button) => (button.hidden = true));
    return;
  }

  buttons.forEach((button) => {
    const status = button.querySelector(".code-copy-status");
    let timer;
    button.addEventListener("click", async () => {
      const block = button.closest(".code-block");
      // The code without line numbers. Chroma puts them in .ln (inline) or in
      // the first table column (.lnt).
      const code = block.querySelector(".lntd:last-child code") || block.querySelector("pre code");
      const copy = code.cloneNode(true);
      copy.querySelectorAll(".ln, .lnt").forEach((number) => number.remove());
      try {
        await navigator.clipboard.writeText(copy.textContent.replace(/\n$/, ""));
        button.classList.add("is-copied");
        status.textContent = button.dataset.copied || "Copied";
      } catch (e) {
        status.textContent = button.dataset.failed || "Copy failed";
      }
      clearTimeout(timer);
      timer = setTimeout(() => {
        button.classList.remove("is-copied");
        status.textContent = "";
      }, 2000);
    });
  });
})();
