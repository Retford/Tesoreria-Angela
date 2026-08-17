import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { fmtSoles } from '@/lib/format';
import type { Movimiento } from '@/types';

interface CategoryBreakdownProps {
  movimientos: Movimiento[];
  categorias: string[];
}

export default function CategoryBreakdown({
  movimientos,
  categorias,
}: CategoryBreakdownProps) {
  const totals: Record<string, { ingreso: number; gasto: number }> = {};
  categorias.forEach((c) => (totals[c] = { ingreso: 0, gasto: 0 }));
  movimientos.forEach((m) => {
    if (!totals[m.categoria]) totals[m.categoria] = { ingreso: 0, gasto: 0 };
    if (m.tipo === 'Ingreso') totals[m.categoria].ingreso += m.importe;
    else totals[m.categoria].gasto += m.importe;
  });

  const entries = Object.entries(totals).filter(
    ([, t]) => t.ingreso || t.gasto,
  );
  const maxVal = Math.max(
    1,
    ...entries.map(([, t]) => Math.max(t.ingreso, t.gasto)),
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Desglose por categoría</CardTitle>
      </CardHeader>
      <CardContent className='flex flex-col gap-2'>
        {entries.length === 0 && (
          <p className='text-sm text-ink-soft'>
            Aún no hay movimientos para desglosar.
          </p>
        )}
        {entries.map(([cat, t]) => {
          const neto = t.ingreso - t.gasto;
          const widthPct = Math.min(
            100,
            Math.round((Math.max(t.ingreso, t.gasto) / maxVal) * 100),
          );
          return (
            <div
              key={cat}
              className='grid grid-cols-[140px_1fr_auto] items-center gap-3 text-sm'
            >
              <span className='truncate'>{cat}</span>
              <div className='h-4 rounded bg-stripe overflow-hidden'>
                <div
                  className={`h-full rounded ${neto >= 0 ? 'bg-green-600' : 'bg-red-600'}`}
                  style={{ width: `${widthPct}%` }}
                />
              </div>
              <span
                className={`font-mono text-xs whitespace-nowrap ${neto >= 0 ? 'text-green-600' : 'text-red-600'}`}
              >
                {fmtSoles(neto)}
              </span>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
