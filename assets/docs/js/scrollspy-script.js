//ScrollSpy - via https://github.com/kimyvgy/simple-scrollspy
// Only on pages with a table of contents (#toc); the landing page and the
// links page have none.
window.onload = function () {
  if (!document.getElementById("toc")) {
    return;
  }
  scrollSpy("toc", {
    sectionClass: "h1,h2,h3,h4",
    //   menuActiveTarget: 'href',
    offset: 100,
    // scrollContainer: null,
    // smooth scroll
    // smoothScroll: true,
    //   smoothScrollBehavior: function(element) {
    //     console.log('run "smoothScrollBehavior"...', element)
    //     element.scrollIntoView({ behavior: 'smooth' })
    //   }
  });
};
