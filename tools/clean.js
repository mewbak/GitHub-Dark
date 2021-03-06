"use strict";

// this script does some cleanups after perfectionist ran

const {readFile, writeFile} = require("fs").promises;
const {join} = require("path");

const source = join(__dirname, "..", "github-dark.css");

const pairs = [
  {pattern: /\{\/\*!/g, replacement: "{\n /*!"},
  {pattern: /\/\* /g, replacement: "\n  /* "},
  {pattern: /(\s+)?\n(\s+)?\n/gm, replacement: "\n"},
  {pattern: / {2}}\/\*/gm, replacement: "  }\n  /*"},
  {pattern: /,\s+\n/gm, replacement: ",\n"},
  {pattern: /\n\s{23}/gm, replacement: ""}, // unicode-range block
  {pattern: /(-025A9,|-02662,)/gim, replacement: "$&\n                   "}, // unicode-range block
  {pattern: /\/\*\[\[code-wrap/, replacement: "/*[[code-wrap"},
  {pattern: /,\u0020{2,}/g, replacement: ", "},
  {pattern: /\s+domain\(/g, replacement: " domain("},
];

function exit(err) {
  if (err) console.error(err);
  process.exit(err ? 1 : 0);
}

async function main() {
  let css = await readFile(source, "utf8");
  for (const {pattern, replacement} of pairs) {
    css = css.replace(pattern, replacement);
  }
  await writeFile(source, css);
}

main().then(exit).catch(exit);
