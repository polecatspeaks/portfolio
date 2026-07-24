import { getFeaturedRepos } from '../../lib/github.server';
import { getPrivateProjects } from '../../lib/private-projects.server';

// Explicit, not relied-upon-by-default: forces this route to be statically rendered
// at build time only (Next.js 14's documented `dynamic` route segment config). This
// is what actually makes spec §2's "no runtime database, no per-request GitHub
// fetch" claim true, rather than an assumption about Next's default caching
// behavior, which round-1 plan review flagged as version-dependent, not guaranteed.
export const dynamic = 'force-static';

export default async function ProjectsPage() {
  const [publicRepos, privateProjects] = await Promise.all([
    getFeaturedRepos(),
    getPrivateProjects(),
  ]);

  return (
    <main>
      <h1>Projects</h1>
      <section>
        <h2>Public</h2>
        {publicRepos.map((repo) => (
          <article key={repo.full_name}>
            <h3><a href={repo.html_url}>{repo.full_name}</a></h3>
            <p>{repo.description}</p>
          </article>
        ))}
      </section>
      <section>
        <h2>Selected private work</h2>
        {privateProjects.map(({ title, summary, screenshots, date }) => (
          <article key={title}>
            <h3>{title}</h3>
            <p>{date}</p>
            <p>{summary}</p>
            {screenshots.map((src) => (
              <img key={src} src={src} alt={`${title} screenshot`} />
            ))}
          </article>
        ))}
      </section>
    </main>
  );
}
