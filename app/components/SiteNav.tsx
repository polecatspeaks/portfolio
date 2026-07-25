'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './SiteNav.module.css';

// aria-current gives assistive tech the active state the color change alone
// cannot (WCAG 1.4.1 - color is not the only visual means); the CSS pairs it
// with an underline for sighted users.
function activeProps(pathname: string, href: string) {
  const isActive = pathname === href;
  return {
    className: isActive ? styles.active : undefined,
    'aria-current': isActive ? ('page' as const) : undefined,
  };
}

export default function SiteNav() {
  const pathname = usePathname();

  return (
    <nav className={styles.nav} aria-label="Main">
      <Link href="/" className={styles.brand}>
        Christopher Mann
      </Link>
      <div className={styles.links}>
        <Link href="/" {...activeProps(pathname, '/')}>
          Home
        </Link>
        <Link href="/experience" {...activeProps(pathname, '/experience')}>
          Experience
        </Link>
        <Link href="/projects" {...activeProps(pathname, '/projects')}>
          Projects
        </Link>
      </div>
    </nav>
  );
}
