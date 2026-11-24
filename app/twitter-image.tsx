import { OG_SIZE, renderOgCard } from '../lib/og-card';

// Root-level file convention: Next attaches this image to every route that
// doesn't define its own. Config exports are declared here (not re-exported)
// because Next reads them statically.
export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = 'Christopher Mann - AI-Driven DevOps & MLOps Lead';

export default function Image() {
  return renderOgCard();
}
