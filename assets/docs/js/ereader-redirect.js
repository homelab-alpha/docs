/*
 * Send Kindle and Kobo browsers to the e-reader version of this page: the
 * href of <link rel="alternate" title="E-reader version"> in the head. The
 * script is the same on every page, so the Content Security Policy needs only
 * one hash for it (layouts/partials/docs/csp.html).
 *
 * Plain ES3 on purpose: it must run on old WebKit builds, before any of the
 * heavier scripts of this site would fail there. Every catch block uses its
 * variable, because the minifier would otherwise rewrite it to "catch {}",
 * which old WebKit cannot parse.
 *
 * Opt out: open any page with "?full=1". The choice is kept for the rest of
 * the browser session, when the browser allows session storage.
 */
(function () {
  function remember(set) {
    try {
      if (set) {
        window.sessionStorage.setItem("full-site", "1");
        return true;
      }
      return window.sessionStorage.getItem("full-site") === "1";
    } catch (e) {
      return e && false;
    }
  }
  try {
    if (!/Kindle|Kobo/i.test(navigator.userAgent || "")) {
      return;
    }
    var loc = window.location;
    if (/[?&]full=1(&|$)/.test(loc.search)) {
      remember(true);
      return;
    }
    if (remember(false)) {
      return;
    }
    var links = document.getElementsByTagName("link");
    for (var i = 0; i < links.length; i++) {
      if (links[i].getAttribute("rel") === "alternate" && links[i].getAttribute("title") === "E-reader version") {
        loc.replace(links[i].getAttribute("href") + loc.hash);
        return;
      }
    }
  } catch (e) {
    return e;
  }
})();
