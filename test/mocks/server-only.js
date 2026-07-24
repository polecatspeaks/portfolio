// Round-3 plan-review fix: Jest-only stand-in for the real `server-only` package
// (mapped via jest.config.js's moduleNameMapper). The real package's only behavior
// is throwing when imported outside a server-build condition Jest doesn't provide;
// this mock is intentionally an empty module - it exists purely so `import
// 'server-only'` resolves to something inert under Jest, not to replicate the real
// package's guard (that guard is Next.js's job at real build time, not Jest's).
module.exports = {};
