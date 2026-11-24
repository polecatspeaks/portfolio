import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { getResume } from './resume';

// Shared by app/opengraph-image.tsx and app/twitter-image.tsx: the link-preview
// card shown when the site is shared (LinkedIn, Slack, X, ...). Rendered once at
// build time. Colors are the design-direction tokens (docs/design-direction.md);
// the portrait is the same owner-authorized file the home page uses, and every
// word on the card comes from the resume (Law 3).
export const OG_SIZE = { width: 1200, height: 630 };

export async function renderOgCard(): Promise<ImageResponse> {
  const resume = getResume();
  const portrait = await readFile(path.join(process.cwd(), 'public', 'portrait.jpg'));
  const portraitSrc = `data:image/jpeg;base64,${portrait.toString('base64')}`;

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', background: '#121009' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={portraitSrc} width={420} height={630} style={{ objectFit: 'cover' }} alt="" />
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '0 64px',
            borderLeft: '6px solid #f5a623',
          }}
        >
          <div style={{ fontSize: 72, fontWeight: 700, color: '#f0eade', lineHeight: 1.05 }}>
            {resume.name}
          </div>
          <div style={{ fontSize: 36, color: '#f5a623', marginTop: 24 }}>{resume.seo.jobTitle}</div>
          <div style={{ fontSize: 28, color: '#a89e8c', marginTop: 48 }}>star-stack.io</div>
        </div>
      </div>
    ),
    { ...OG_SIZE }
  );
}
