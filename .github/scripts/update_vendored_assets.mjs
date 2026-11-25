#!/usr/bin/env node
// Fetch the third-party files in .github/vendored_assets.json from npm, apply their patches (if any), and record
// their SHA-256.
//
// For every package, `npm pack <name>@<version>` downloads the tarball; npm checks it against the integrity
// hash of the registry. The script copies each listed file (or the matching files of a listed folder) into
// the repository and writes their SHA-256 into the manifest. Run it after Renovate updates a version, review
// the diff, and commit the files with the manifest. .github/scripts/check_vendored_assets.py checks them in CI.
//
// Usage: npm run vendor:update            (all packages)
//        npm run vendor:update -- katex   (one package)

import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { copyFileSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";

const root = resolve(dirname(new URL(import.meta.url).pathname), "../..");
const manifestPath = join(root, ".github/vendored_assets.json");
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const only = process.argv.slice(2);

const sha256 = (file) => createHash("sha256").update(readFileSync(file)).digest("hex");

for (const [name, pkg] of Object.entries(manifest.packages)) {
  if (only.length && !only.includes(name)) continue;
  const work = mkdtempSync(join(tmpdir(), "vendored-"));
  try {
    const packed = JSON.parse(
      execFileSync(
        "npm",
        ["pack", `${name}@${pkg.version}`, "--json", "--ignore-scripts", "--pack-destination", work],
        {
          encoding: "utf8",
        },
      ),
    )[0];
    execFileSync("tar", ["-xzf", join(work, packed.filename), "-C", work]);
    const pkgRoot = join(work, "package");
    console.log(`${name}@${pkg.version} (${packed.integrity})`);

    for (const [target, entry] of Object.entries(pkg.files)) {
      if (target.endsWith("/")) {
        // A folder: copy the files of entry.from whose name matches entry.match.
        const pattern = new RegExp(entry.match || ".");
        const names = readdirSync(join(pkgRoot, entry.from))
          .filter((f) => pattern.test(f))
          .sort();
        mkdirSync(join(root, target), { recursive: true });
        // Remove files of an older version that the new one no longer has.
        for (const old of readdirSync(join(root, target)).filter((f) => pattern.test(f) && !names.includes(f))) {
          rmSync(join(root, target, old));
          console.log(`  removed ${target}${old}`);
        }
        entry.sha256 = {};
        for (const f of names) {
          copyFileSync(join(pkgRoot, entry.from, f), join(root, target, f));
          entry.sha256[f] = sha256(join(root, target, f));
        }
        console.log(`  ${target} (${names.length} files)`);
      } else {
        mkdirSync(dirname(join(root, target)), { recursive: true });
        let text = readFileSync(join(pkgRoot, entry.from));
        // Patches: exact text replacements, each of which must match exactly once.
        for (const patch of entry.patches || []) {
          const source = text.toString("utf8");
          const count = source.split(patch.find).length - 1;
          if (count !== 1) {
            throw new Error(`${target}: patch "${patch.find}" matches ${count} times, not once (${patch.why})`);
          }
          text = Buffer.from(
            source.replace(patch.find, () => patch.replace),
            "utf8",
          );
        }
        writeFileSync(join(root, target), text);
        entry.sha256 = sha256(join(root, target));
        console.log(`  ${target}${entry.patches ? ` (${entry.patches.length} patches)` : ""}`);
      }
    }
  } finally {
    rmSync(work, { recursive: true, force: true });
  }
}

writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log("Updated .github/vendored_assets.json. Review the diff, then commit the files and the manifest.");
