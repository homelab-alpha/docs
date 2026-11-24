// Highlight code blocks when they come near the visible part of the page,
// not all at once on load. A long page with many code blocks then does not
// block the main thread on load (Lighthouse: Total Blocking Time). Prism
// plugins (line numbers, toolbar, copy button) run per block, as before.
(() => {
  const prism = window.Prism;
  if (!prism || typeof prism.highlightElement !== "function") {
    return;
  }

  const selector = 'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code';
  const blocks = document.querySelectorAll(selector);

  if (!("IntersectionObserver" in window)) {
    prism.highlightAll();
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          observer.unobserve(entry.target);
          prism.highlightElement(entry.target);
        }
      }
    },
    { rootMargin: "400px 0px" },
  );

  blocks.forEach((block) => observer.observe(block));

  // Print the page with every block highlighted.
  window.addEventListener("beforeprint", () => {
    observer.disconnect();
    prism.highlightAll();
  });
})();
