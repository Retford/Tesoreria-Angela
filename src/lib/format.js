export function fmtSoles(n) {
  const rounded = Math.round((n + Number.EPSILON) * 100) / 100;
  const abs = Math.abs(rounded).toLocaleString('es-PE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return (rounded < 0 ? '-S/ ' : 'S/ ') + abs;
}

export function fmtFecha(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  if (!y || !m || !d) return iso;
  return `${d}/${m}/${y}`;
}

export function today() {
  return new Date().toISOString().slice(0, 10);
}
