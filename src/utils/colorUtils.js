export function resolveColorCode(colorName) {
  if (!colorName) return '#737373';
  const c = colorName.toLowerCase().trim();
  if (c.includes('vàng') || c.includes('yellow') || c.includes('gold')) return '#FACC15';
  if (c.includes('đỏ') || c.includes('red') || c.includes('burgundy')) return '#EF4444';
  if (c.includes('cam') || c.includes('orange')) return '#F97316';
  if (c.includes('hồng') || c.includes('pink') || c.includes('rose')) return '#F472B6';
  if (c.includes('tím') || c.includes('purple') || c.includes('violet')) return '#A855F7';
  if (c.includes('xanh lá') || c.includes('xanh lục') || c.includes('green') || c.includes('olive')) return '#22C55E';
  if (c.includes('xanh dương') || c.includes('xanh biển') || c.includes('xanh lam') || c.includes('blue') || c.includes('navy')) return '#2563EB';
  if (c.includes('nâu') || c.includes('brown') || c.includes('chocolate')) return '#78350F';
  if (c.includes('be') || c.includes('beige')) return '#F5F5DC';
  if (c.includes('kem') || c.includes('cream') || c.includes('trắng kem')) return '#FFFDD0';
  if (c.includes('trắng') || c.includes('white')) return '#FFFFFF';
  if (c.includes('đen') || c.includes('black')) return '#171717';
  if (c.includes('xám') || c.includes('ghi') || c.includes('grey') || c.includes('gray')) return '#737373';
  if (c.includes('bạc') || c.includes('silver')) return '#C0C0C0';
  return '#737373';
}

export function getEffectiveColorCode(rawColorCode, colorName) {
  if (
    rawColorCode &&
    !(
      rawColorCode.toLowerCase() === '#000000' &&
      colorName &&
      !colorName.toLowerCase().includes('đen') &&
      !colorName.toLowerCase().includes('black')
    )
  ) {
    return rawColorCode;
  }
  return resolveColorCode(colorName);
}

