#!/usr/bin/env python3
"""Check the Content Security Policy of a built site.

For every HTML page in the folder (default: public), check that:
- every inline script is allowed by a SHA-256 hash in the page's
  Content-Security-Policy meta tag, which comes before it;
- no element has an inline event handler (onclick and the like);
- no link or form points to a javascript: URL.

The policy is made in layouts/partials/docs/csp.html. Exit code 1 when a page
breaks a rule, so the Build & Deploy workflow fails before a broken page is
deployed. Standard library only.

Usage: python3 .github/scripts/check_csp.py [site folder]   (default: $SITE_DIR, else public)
"""

import base64
import hashlib
import os
import re
import sys
from html.parser import HTMLParser
from pathlib import Path


class PageParser(HTMLParser):
    """Collect the policy, the inline scripts, and unsafe attributes."""

    def __init__(self):
        super().__init__(convert_charrefs=False)
        self.policy = None
        self.policy_line = None
        self.scripts = []  # (line, text, policy seen before it)
        self.problems = []
        self._script = None

    def handle_starttag(self, tag, attrs):
        attrs = {name.lower(): (value or "") for name, value in attrs}
        line = self.getpos()[0]
        if tag == "meta" and attrs.get("http-equiv", "").lower() == "content-security-policy":
            if self.policy is None:
                self.policy = attrs.get("content", "")
                self.policy_line = line
        for name, value in attrs.items():
            if name.startswith("on"):
                self.problems.append(f"line {line}: inline event handler {name}= on <{tag}>")
            if name in ("href", "src", "action", "formaction") and value.strip().lower().startswith("javascript:"):
                self.problems.append(f"line {line}: javascript: URL in {name}= on <{tag}>")
        if tag == "script" and "src" not in attrs:
            script_type = attrs.get("type", "").lower()
            # Data blocks (JSON and the like) are not run, so CSP ignores them.
            if script_type in ("", "module", "text/javascript", "application/javascript"):
                self._script = {"line": line, "parts": [], "policy": self.policy is not None}

    def handle_endtag(self, tag):
        if tag == "script" and self._script is not None:
            self.scripts.append((self._script["line"], "".join(self._script["parts"]), self._script["policy"]))
            self._script = None

    def handle_data(self, data):
        if self._script is not None:
            self._script["parts"].append(data)

    # A script's text is raw: keep entity and character references as written.
    def handle_entityref(self, name):
        self.handle_data(f"&{name};")

    def handle_charref(self, name):
        self.handle_data(f"&#{name};")


def allowed_hashes(policy):
    """Return the sha256 sources of script-src (or default-src)."""
    directives = {}
    for part in policy.split(";"):
        words = part.split()
        if words:
            directives[words[0].lower()] = words[1:]
    sources = directives.get("script-src", directives.get("default-src", []))
    return {s.strip("'") for s in sources if s.strip("'").startswith("sha256-")}


def check_page(path):
    parser = PageParser()
    parser.feed(path.read_text(encoding="utf-8"))
    parser.close()
    problems = list(parser.problems)
    if not parser.scripts:
        return problems, parser.policy is not None
    if parser.policy is None:
        problems.append("inline scripts, but no Content-Security-Policy meta tag")
        return problems, False
    hashes = allowed_hashes(parser.policy)
    for line, text, after_policy in parser.scripts:
        digest = "sha256-" + base64.b64encode(hashlib.sha256(text.encode("utf-8")).digest()).decode()
        if not after_policy:
            problems.append(f"line {line}: inline script before the policy")
        elif digest not in hashes:
            preview = re.sub(r"\s+", " ", text.strip())[:60]
            problems.append(f"line {line}: inline script not in the policy ({digest}): {preview}")
    return problems, True


def main():
    site = Path(sys.argv[1] if len(sys.argv) > 1 else os.environ.get("SITE_DIR", "public"))
    pages = sorted(site.rglob("*.html"))
    if not pages:
        print(f"No HTML pages in {site}.")
        return 1
    failed = 0
    with_policy = 0
    for page in pages:
        problems, has_policy = check_page(page)
        with_policy += has_policy
        if problems:
            failed += 1
            for problem in problems:
                print(f"{page.relative_to(site)}: {problem}")
    print(f"Checked {len(pages)} pages ({with_policy} with a policy); {failed} with problems.")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
