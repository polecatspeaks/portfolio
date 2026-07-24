/** @type {import('next').NextConfig} */
module.exports = {
  // Issue #1: baseline security headers (Lighthouse best-practices / OWASP
  // secure-headers checklist). This is a static, no-user-input site - no
  // inline scripts execute untrusted content and there's no third-party
  // embed, so a same-origin CSP with no 'unsafe-inline'/'unsafe-eval' is safe
  // here without nonces. Covered by next.config.test.js.
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value:
              "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none';",
          },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'geolocation=(), camera=(), microphone=()',
          },
        ],
      },
    ];
  },
};
