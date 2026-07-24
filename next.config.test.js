const nextConfig = require('./next.config.js');

// Issue #1: this site sent zero security headers of its own (only Vercel's
// platform-default Strict-Transport-Security). This test asserts the app-level
// headers() config directly, since a full HTTP round-trip isn't available in
// this Node-environment Jest setup (see jest.config.js's testEnvironment note).
describe('next.config.js security headers', () => {
  it('exports a headers() function', () => {
    expect(typeof nextConfig.headers).toBe('function');
  });

  it('applies the same header set to every route', async () => {
    const rules = await nextConfig.headers();
    expect(Array.isArray(rules)).toBe(true);
    expect(rules).toHaveLength(1);
    expect(rules[0].source).toBe('/(.*)');
  });

  it('sets Content-Security-Policy restricting to same-origin by default', async () => {
    const rules = await nextConfig.headers();
    const csp = rules[0].headers.find((h) => h.key === 'Content-Security-Policy');
    expect(csp).toBeDefined();
    expect(csp.value).toContain("default-src 'self'");
  });

  it('sets X-Content-Type-Options to nosniff', async () => {
    const rules = await nextConfig.headers();
    const header = rules[0].headers.find((h) => h.key === 'X-Content-Type-Options');
    expect(header?.value).toBe('nosniff');
  });

  it('sets X-Frame-Options to DENY', async () => {
    const rules = await nextConfig.headers();
    const header = rules[0].headers.find((h) => h.key === 'X-Frame-Options');
    expect(header?.value).toBe('DENY');
  });

  it('sets a strict Referrer-Policy', async () => {
    const rules = await nextConfig.headers();
    const header = rules[0].headers.find((h) => h.key === 'Referrer-Policy');
    expect(header?.value).toBe('strict-origin-when-cross-origin');
  });

  it('sets a Permissions-Policy denying geolocation, camera, and microphone', async () => {
    const rules = await nextConfig.headers();
    const header = rules[0].headers.find((h) => h.key === 'Permissions-Policy');
    expect(header?.value).toBe('geolocation=(), camera=(), microphone=()');
  });
});
