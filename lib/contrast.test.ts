import { contrastRatio } from './contrast';

// These hex literals MUST be kept identical to app/globals.css's --accent, --bg,
// and --surface token values (Task F.1/F.2 cross-reference - see plan §11 round 1
// finding 2: this coupling is not automatically derived, so a human editing either
// file must see this comment).
const ACCENT = '#3b82f6';
const BG = '#0a0a0c';
const SURFACE = '#141417';

describe('contrastRatio', () => {
  it('computes >= 4.5 for --accent on --bg (real color pair used for links/active nav)', () => {
    expect(contrastRatio(ACCENT, BG)).toBeGreaterThanOrEqual(4.5);
  });

  it('computes >= 4.5 for --accent on --surface (real color pair used inside cards)', () => {
    expect(contrastRatio(ACCENT, SURFACE)).toBeGreaterThanOrEqual(4.5);
  });

  it('computes ~21 for white on black (sanity check of the formula itself)', () => {
    expect(contrastRatio('#ffffff', '#000000')).toBeCloseTo(21, 0);
  });
});
