const fs = require('fs');

describe('SiteNav', () => {
  const source = fs.readFileSync(require.resolve('./SiteNav.tsx'), 'utf8');

  it("is a Client Component ('use client')", () => {
    expect(source).toContain("'use client'");
  });

  it('links to /', () => {
    expect(source).toContain('href="/"');
  });

  it('links to /experience', () => {
    expect(source).toContain('href="/experience"');
  });

  it('links to /projects', () => {
    expect(source).toContain('href="/projects"');
  });

  it('reads the current route via usePathname for active-link highlighting', () => {
    expect(source).toContain('usePathname');
  });
});
