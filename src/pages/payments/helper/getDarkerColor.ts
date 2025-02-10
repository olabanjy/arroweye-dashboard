import tinycolor from 'tinycolor2';

export default function getDarkerColor(
  input: string | string[],
  darkenAmount = 20
): string | string[] {
  if (typeof input === 'string') {
    return tinycolor(input).darken(darkenAmount).toHexString();
  } else if (Array.isArray(input)) {
    return input.map((color) =>
      tinycolor(color).darken(darkenAmount).toHexString()
    );
  }
  return input;
}
