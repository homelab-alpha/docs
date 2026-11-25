#!/usr/bin/env python3
"""Check the third-party files against .github/vendored_assets.json.

Every listed file must have the SHA-256 in the manifest, and a listed folder
must hold exactly the matching files in the manifest. A mismatch means a file
was edited by hand, or a version was updated (by Renovate) without fetching
the files: run 'npm run vendor:update' and commit the result.

Usage: python3 .github/scripts/check_vendored_assets.py   (exit code 1 on a mismatch)
Standard library only.
"""

import hashlib
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]


def sha256(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main():
    manifest = json.loads((ROOT / ".github/vendored_assets.json").read_text(encoding="utf-8"))
    problems = []
    count = 0
    for name, pkg in manifest["packages"].items():
        label = f"{name}@{pkg['version']}"
        for target, entry in pkg["files"].items():
            expected = entry.get("sha256")
            if not expected:
                problems.append(f"{target} ({label}): no sha256 in the manifest")
                continue
            if target.endswith("/"):
                pattern = re.compile(entry.get("match", "."))
                folder = ROOT / target
                present = sorted(p.name for p in folder.iterdir() if p.is_file() and pattern.search(p.name))
                for extra in sorted(set(present) - set(expected)):
                    problems.append(f"{target}{extra} ({label}): not in the manifest")
                for name_, digest in sorted(expected.items()):
                    path = folder / name_
                    count += 1
                    if not path.is_file():
                        problems.append(f"{target}{name_} ({label}): missing")
                    elif sha256(path) != digest:
                        problems.append(f"{target}{name_} ({label}): SHA-256 does not match")
            else:
                path = ROOT / target
                count += 1
                if not path.is_file():
                    problems.append(f"{target} ({label}): missing")
                elif sha256(path) != expected:
                    problems.append(f"{target} ({label}): SHA-256 does not match")
    for problem in problems:
        print(problem)
    print(f"Checked {count} third-party files; {len(problems)} problem(s).")
    if problems:
        print("Run 'npm run vendor:update' and commit the files with .github/vendored_assets.json.")
    return 1 if problems else 0


if __name__ == "__main__":
    sys.exit(main())
