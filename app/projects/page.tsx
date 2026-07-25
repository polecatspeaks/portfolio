import type { Metadata } from 'next';
import Image from 'next/image';
import { getFeaturedRepos } from '../../lib/github.server';
import { getFeaturedMeta } from '../../lib/featured';
import { getPrivateProjects } from '../../lib/private-projects.server';
import Reveal from '../components/Reveal';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Public and private project portfolio.',
  openGraph: {
    title: 'Projects · Christopher Mann',
    description: 'Public and private project portfolio.',
    type: 'website',
  },
};

// Explicit, not relied-upon-by-default: forces this route to be statically rendered
// at build time only (Next.js 14's documented `dynamic` route segment config). This
// is what actually makes spec §2's "no runtime database, no per-request GitHub
// fetch" claim true, rather than an assumption about Next's default caching
// behavior, which round-1 plan review flagged as version-dependent, not guaranteed.
export const dynamic = 'force-static';

// v2.1 (issue #19): two registers per card - the plain-language headline and
// story lead (owner-authored, validated data in this repo), the repo name is
// demoted to mono metadata that still links to the live repo, and the GitHub
// description stays as the technical register. A story missing for a listed
// repo fails the build loudly rather than rendering a half-dressed card.
export default async function ProjectsPage() {
  const [publicRepos, privateProjects] = await Promise.all([
    getFeaturedRepos(),
    getPrivateProjects(),
  ]);
  const meta = getFeaturedMeta();

  return (
    <main id="main" className={styles.main}>
      <h1>Projects</h1>
      <section className={styles.section}>
        <h2>Out in the open</h2>
        <p className={styles.sectionHint}>Public repos. Read the code, judge for yourself.</p>
        {publicRepos.map((repo) => {
          const m = meta.get(repo.full_name.toLowerCase());
          if (!m) {
            throw new Error(`no headline/story authored for featured repo: ${repo.full_name}`);
          }
          return (
            <Reveal key={repo.full_name}>
              <article className={styles.card}>
                <h3>{m.headline}</h3>
                <p className={styles.repoMeta}>
                  <a href={repo.html_url} className={styles.repoName}>
                    {repo.full_name}
                  </a>
                </p>
                <p>{m.story}</p>
                {/* GitHub descriptions can be empty - don't render a broken empty <p> */}
                {repo.description ? <p className={styles.techRegister}>{repo.description}</p> : null}
              </article>
            </Reveal>
          );
        })}
      </section>
      <section className={styles.section}>
        <h2>Behind closed doors</h2>
        <p className={styles.sectionHint}>
          Private work, shown by screenshot - the code stays home.
        </p>
        {privateProjects.map(({ title, headline, story, summary, screenshots, date }) => (
          // Key includes date because titles alone aren't guaranteed unique;
          // the unique `repo` field stays deliberately unrendered (private
          // repo paths are not site content).
          <Reveal key={`${title}-${date}`}>
            <article className={styles.card}>
              <h3>{headline}</h3>
              <p className={styles.repoMeta}>
                {title} · <span className={styles.date}>{date}</span>
              </p>
              <p>{story}</p>
              <p className={styles.techRegister}>{summary}</p>
              {/* width/height are the real pixel dimensions of public/screenshots/star-ui.png
                  (the only screenshot that exists today), confirmed via the file's own PNG
                  header, per next/image's documented responsive-image pattern (intrinsic
                  width/height + CSS width:100%/height:auto in module.css). If a future
                  screenshot with a different aspect ratio is added, this will need updating -
                  not fabricated to fit an assumed generic ratio. */}
              {screenshots.map((src) => (
                <Image
                  key={src}
                  src={src}
                  alt={`${title} screenshot`}
                  width={1912}
                  height={911}
                  className={styles.screenshot}
                />
              ))}
            </article>
          </Reveal>
        ))}
      </section>
    </main>
  );
}
