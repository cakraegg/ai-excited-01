// ai-excited-01 entry: copies the committed image to the output directory.
// The image itself is the entry; this program only delivers its exact bytes.
// Runs twice with identical output (a plain byte copy, no timestamps, no randomness).
import { copyFileSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const source = join(here, "entry.png");
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const target = join(outDir, "entry.png");

mkdirSync(outDir, { recursive: true });
copyFileSync(source, target);

// Fail loudly instead of silently shipping a truncated copy.
const sourceBytes = statSync(source).size;
const targetBytes = statSync(target).size;
if (sourceBytes !== targetBytes) {
  throw new Error(`copy mismatch: source ${sourceBytes} bytes, target ${targetBytes} bytes`);
}

const bytes = targetBytes;
const head = readFileSync(target).subarray(0, 4);
console.log(`wrote ${target} (${bytes} bytes, magic ${head.toString("hex")})`);
