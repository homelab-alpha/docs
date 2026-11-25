// Render the math on a page with KaTeX (auto-render), after the page is parsed.
// A file, not an inline script, for the Content Security Policy. Loaded by
// layouts/partials/docs/footer/katex.html after katex.js and auto-render.js.
document.addEventListener("DOMContentLoaded", function () {
  renderMathInElement(document.getElementById("content"), {
    delimiters: [
      { left: "$$", right: "$$", display: true },
      { left: "$", right: "$", display: false },
      { left: "\\(", right: "\\)", display: false },
      { left: "\\[", right: "\\]", display: true },
    ],
    throwOnError: false,
  });
});
