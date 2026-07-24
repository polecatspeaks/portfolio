// Round-5 plan-review fix: Jest's globals (`test`, `expect`, etc.) are auto-injected
// for ordinary CommonJS test files, but a native-ESM `.mjs` test file run under
// Node's `--experimental-vm-modules` does not receive them as ambient globals -
// they must be imported explicitly from `@jest/globals`, or this file's `test(...)`
// call throws `ReferenceError: test is not defined` before ever reaching the
// intended red (missing-script) failure.
import { expect, test } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

test('exits 1 and prints the file when the token string is present in .next/**', () => {
  const dir = mkdtempSync(join(tmpdir(), 'leak-test-'));
  writeFileSync(join(dir, 'page.html'), 'leaked-secret-value-xyz');
  expect(() =>
    execFileSync('node', ['scripts/check-no-secret-leak.mjs', dir], {
      env: { ...process.env, GITHUB_TOKEN: 'leaked-secret-value-xyz' },
    }),
  ).toThrow();
  rmSync(dir, { recursive: true });
});

test('exits 0 when the token string is absent', () => {
  const dir = mkdtempSync(join(tmpdir(), 'leak-test-'));
  writeFileSync(join(dir, 'page.html'), 'nothing secret here');
  execFileSync('node', ['scripts/check-no-secret-leak.mjs', dir], {
    env: { ...process.env, GITHUB_TOKEN: 'leaked-secret-value-xyz' },
  });
  rmSync(dir, { recursive: true });
});
