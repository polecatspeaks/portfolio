# Christopher Mann - portfolio

Status: Current

The source of Christopher Mann's personal portfolio site, live at
<https://star-stack.io>. It has home (`/`), experience (`/experience`), projects
(`/projects`) and a blog (`/blog`, one page per post, RSS at `/blog/feed.xml`), plus a
generated `robots.txt` and `sitemap.xml`.

## Stack and hosting

- Next.js (App Router), React and TypeScript. Every route is statically generated at
  build time; there is no database and no per-request GitHub fetch (`/projects` sets
  `dynamic = 'force-static'`).
- Hosted on Vercel (project `portfolio`) through Vercel's Git integration. Every merge to
  `main` deploys to production; pushes to other branches get their own preview URL.
- Vercel Web Analytics (`@vercel/analytics`, mounted in `app/layout.tsx`) is the only
  visitor-data collector, as Law 5 allows. Nothing else may be added without amending
  that law.
- Security headers, including a Content-Security-Policy, are set in `next.config.js`.

## Where the content comes from

The site renders two sources of truth (Law 3): the resume and the GitHub repos. The one
exception is the blog: dated first-person posts in `content/blog/`, written per
[docs/blog-authoring.md](docs/blog-authoring.md).

| What | File | Notes |
|---|---|---|
| Resume (home and experience pages) | `data/resume.json` | Validated by `lib/resume.schema.ts` at build time. |
| Public projects | `data/featured-repos.json` | An allow-list of `owner/name` repos with an owner-written headline and story. Description, language and URL come live from the GitHub API at build time (`lib/github.server.ts`). The build fails if a listed repo is private, a fork, archived, or does not match its name. |
| Private projects | `data/private-projects.json` | A summary and screenshots instead of a link (Law 2). Screenshots live in `public/screenshots/` and must exist on disk. Each entry carries `lastVerifiedSha`; the build fails if the repo's default-branch HEAD no longer matches it. |

To change content, edit the JSON file and open a PR. When a private project's repo gets
new commits, re-check the summary and screenshots against the current work, then set
`lastVerifiedSha` to the new HEAD commit, or the build stops.

## Local development

Requires Node.js and npm.

```sh
npm ci          # install exact dependencies from package-lock.json
npm run dev     # start the Next.js dev server
npm test        # Jest test suite
npm run build   # production build, then scripts/check-no-secret-leak.mjs
```

`GITHUB_TOKEN` must be set for `npm run build`, and for the `/projects` page under
`npm run dev`. The GitHub loaders use it to fetch repo data, and `lib/env.ts` fails the
build closed without it. It needs read access to the featured repos and to each private
repo in `data/private-projects.json`. Never name it `NEXT_PUBLIC_GITHUB_TOKEN`: that
prefix would inline it into the client bundle, and `lib/env.ts` refuses to build if it is
set. After `next build`, `scripts/check-no-secret-leak.mjs` scans all of `.next/` for the
token's value and fails the build if it finds it. In production the token is set in the
Vercel project's environment variables. `npm test` does not need it.

## How changes land

No direct commits to `main`. Work happens on a short-lived feature branch and merges by
pull request. Each PR gets a Copilot code review; every comment is fixed or rejected with
a cited reason, with at most two review rounds. Only the owner merges, and only at a
stable state. Branch protection on `main` (PR required, conversations resolved, no admin
bypass) enforces this. The full rules are in [AGENTS.md](AGENTS.md).

## The laws

Every change is bound by the six laws in
[process/constitution.md](process/constitution.md).

## Process kit

This repo also carries a copy of a project-bootstrapping kit, used as its operating
process:

| Path | What it is |
|---|---|
| [process/](process/) | The operating rules: the ladder, the constitution, the doctrine. |
| [templates/](templates/) | Templates and worked examples for each rung: design, spec, plan, briefs, ops. |
| [agents/](agents/) | Agent-type definitions. |
| [hooks/](hooks/) | Session hooks for standing checks. |
| [scripts/](scripts/) | Verdict landing and verification, doc-policy checks, and the site's secret-leak check. |
| [LESSONS.md](LESSONS.md) | The lessons behind the rules. |
| [ADOPTION.md](ADOPTION.md) | The staged adoption path. |

Adoption is staged by trigger per [ADOPTION.md](ADOPTION.md); [AGENTS.md](AGENTS.md)
lists which parts are active for this site and which are still waiting for their
trigger.

## License

MIT; see [LICENSE](LICENSE).
