import { ImageResponse } from 'next/og';

// Issue #5: every browser requests /favicon.ico by default; this site had none
// (confirmed 404 live before this fix). Generated in code rather than checked in
// as a binary asset, using the same design-direction tokens (docs/design-direction.md)
// already governing the rest of the site - avoids introducing an un-reviewable,
// un-testable binary file for something this small.
export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0a0a0c',
          color: '#3b82f6',
          fontSize: 18,
          fontWeight: 700,
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        CM
      </div>
    ),
    { ...size }
  );
}
