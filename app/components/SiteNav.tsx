'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './SiteNav.module.css';

function linkClass(pathname: string, href: string): string | undefined {
  return pathname === href ? styles.active : undefined;
}

export default function SiteNav() {
  const pathname = usePathname();

  return (
    <nav className={styles.nav}>
      <Link href="/" className={linkClass(pathname, '/')}>
        Home
      </Link>
      <Link href="/experience" className={linkClass(pathname, '/experience')}>
        Experience
      </Link>
      <Link href="/projects" className={linkClass(pathname, '/projects')}>
        Projects
      </Link>
    </nav>
  );
}
