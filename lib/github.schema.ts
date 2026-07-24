export type GithubRepo = {
  full_name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  topics: string[];
  pushed_at: string | null;
  private: boolean;
  fork: boolean;
  archived: boolean;
};

function fail(path: string): never {
  throw new Error(`github repo response: ${path} is missing or the wrong type`);
}

export function validateGithubRepo(input: unknown): GithubRepo {
  const r = input as Record<string, unknown>;
  if (typeof r?.full_name !== 'string') fail('full_name');
  if (typeof r?.html_url !== 'string') fail('html_url');
  if (r?.description !== null && typeof r?.description !== 'string') fail('description');
  if (r?.language !== null && typeof r?.language !== 'string') fail('language');
  if (!Array.isArray(r?.topics) || !r.topics.every((t) => typeof t === 'string')) fail('topics');
  if (r?.pushed_at !== null && typeof r?.pushed_at !== 'string') fail('pushed_at');
  if (typeof r?.private !== 'boolean') fail('private');
  if (typeof r?.fork !== 'boolean') fail('fork');
  if (typeof r?.archived !== 'boolean') fail('archived');
  return r as GithubRepo;
}
