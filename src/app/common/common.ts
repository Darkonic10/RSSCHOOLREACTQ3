export function generateRadialGradient(palette: number[][]): string {
  if (palette.length < 4) return 'linear-gradient(to bottom, #222, #000)';

  const positions = ['30% 40%', '70% 30%', '40% 70%', '80% 80%'];

  const intensities = ['60%', '60%', '55%', '50%'];

  const gradients = palette.map(([r, g, b], index) => {
    return `radial-gradient(circle at ${positions[index]}, rgba(${r}, ${g}, ${b}, 0.6), transparent ${intensities[index]})`;
  });

  return gradients.join(', ');
}
