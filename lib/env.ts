export function assertGithubTokenConfigured(): void {
  if (!process.env.GITHUB_TOKEN) {
    throw new Error('GITHUB_TOKEN is required at build time and was not set');
  }
  if (process.env.NEXT_PUBLIC_GITHUB_TOKEN !== undefined) {
    throw new Error(
      'NEXT_PUBLIC_GITHUB_TOKEN must not be set - the NEXT_PUBLIC_ prefix inlines it into the client bundle',
    );
  }
}
