module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
  // Round-3 plan-review fix (1/2): the real `server-only` package throws when
  // imported outside Next's own "react-server" build condition, which Jest (running
  // plain CommonJS/ts-jest, not Next's bundler) never provides - every test that
  // transitively imports a module starting with `import 'server-only'` (Tasks B.1,
  // C.2) would otherwise fail before exercising its own behavior. Mapped to a local,
  // no-op mock instead.
  moduleNameMapper: { '^server-only$': '<rootDir>/test/mocks/server-only.js' },
  // Round-3 plan-review fix (2/2): default Jest `testMatch` only picks up
  // `.test.[tj]s(x)` files, not `.test.mjs` - Task E.1's script-level integration
  // test (`scripts/check-no-secret-leak.test.mjs`) is plain-ESM `.mjs` by design
  // (it's a build-time CLI step, not a TypeScript module), so it needs an explicit
  // match pattern to be discovered at all. `.mjs` is ALREADY always treated as ESM
  // by Jest itself and must NOT also be listed in `extensionsToTreatAsEsm` - Jest's
  // own validation throws "must not include .mjs" if it is (round-4 plan-review
  // fix: an earlier draft incorrectly added `.mjs` there; removed). ESM execution
  // is instead enabled at the Node level, via `package.json`'s `test` script
  // (round-4 plan-review fix: changed from plain `"jest"` to `"node
  // --experimental-vm-modules node_modules/jest/bin/jest.js"`, Jest's own
  // documented invocation for running any ESM test file under Node's experimental
  // VM-modules flag) - this also means every earlier task's `npm test -- <pattern>`
  // command in this plan is unaffected, since `npm test` just forwards to this one
  // script regardless of which file pattern follows it.
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[tj]s?(x)',
    '**/?(*.)+(spec|test).mjs',
  ],
};
