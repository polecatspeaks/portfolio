import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = process.argv[2] ?? '.next';
const token = process.env.GITHUB_TOKEN;

if (!token) {
  console.error('GITHUB_TOKEN not set - cannot verify it is absent from build output');
  process.exit(1);
}

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      walk(full);
    } else {
      const contents = readFileSync(full, 'utf8').toString();
      if (contents.includes(token)) {
        console.error(`GITHUB_TOKEN literal value found in build output: ${full}`);
        process.exit(1);
      }
    }
  }
}

walk(root);
process.exit(0);
