import { generateRadialGradient } from '@/common/common.ts';

describe('generateRadialGradient', () => {
  it('returns default gradient if palette has less than 4 colors', () => {
    const palette = [
      [255, 0, 0],
      [0, 255, 0],
    ];
    const result = generateRadialGradient(palette);
    expect(result).toBe('linear-gradient(to bottom, #222, #000)');
  });

  it('generates correct radial gradients from palette', () => {
    const palette = [
      [255, 0, 0],
      [0, 255, 0],
      [0, 0, 255],
      [255, 255, 0],
    ];

    const result = generateRadialGradient(palette);
    const expected =
      'radial-gradient(circle at 30% 40%, rgba(255, 0, 0, 0.6), transparent 60%), ' +
      'radial-gradient(circle at 70% 30%, rgba(0, 255, 0, 0.6), transparent 60%), ' +
      'radial-gradient(circle at 40% 70%, rgba(0, 0, 255, 0.6), transparent 55%), ' +
      'radial-gradient(circle at 80% 80%, rgba(255, 255, 0, 0.6), transparent 50%)';

    expect(result).toBe(expected);
  });
});
