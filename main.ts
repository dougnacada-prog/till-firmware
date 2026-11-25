// Till Firmware Do Us Part — entry program.
// Writes one robot wedding vow (120 characters) to ENTRY_OUTPUT,
// or /output/entry.txt when unset. No trailing newline.
// Gate (RULES.txt): output must be UTF-8 text of 1 to 200 characters,
// not only white space, exactly one sentence on one line.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const VOW =
  "I have calculated a thousand futures, and in every one where I am happy, you are standing beside me holding the charger.";

if (VOW.length < 1 || VOW.length > 200) {
  throw new Error(`entry must be 1-200 characters, got ${VOW.length}`);
}
if (VOW.trim().length === 0 || VOW.includes("\n")) {
  throw new Error("entry must be a single non-blank line");
}
// No leading/trailing whitespace, no control characters at all.
// Written as a charCodeAt loop on purpose: a regex with backslash
// escapes is easy to get wrong in a one-line entry program.
if (VOW !== VOW.trim()) {
  throw new Error("entry must not start or end with whitespace");
}
for (let i = 0; i < VOW.length; i++) {
  if (VOW.charCodeAt(i) < 0x20 || VOW.charCodeAt(i) === 0x7f) {
    throw new Error("entry must not contain control characters");
  }
}

const out = process.env.ENTRY_OUTPUT ?? "/output/entry.txt";
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, VOW, "utf8");
