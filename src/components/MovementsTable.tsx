import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { fmtSoles, fmtFecha } from '@/lib/format';
import { X } from 'lucide-react';
import type { Movimiento } from '@/types';

interface MovementsTableProps {
  movimientos: Movimiento[];
  saldoInicial: number;
  onDelete: (id: string) => void;
}

export default function MovementsTable({
  movimientos,
  saldoInicial,
  onDelete,
}: MovementsTableProps) {
  const sorted = [...movimientos].sort((a, b) => {
    if (a.fecha === b.fecha) return (a.orden || 0) - (b.orden || 0);
    return a.fecha < b.fecha ? -1 : 1;
  });

  let running = saldoInicial;
  const rows = sorted.map((m) => {
    const ingreso = m.tipo === 'Ingreso' ? m.importe : 0;
    const gasto = m.tipo === 'Gasto' ? m.importe : 0;
    running += ingreso - gasto;
    return { ...m, ingreso, gasto, saldo: running };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Movimientos</CardTitle>
      </CardHeader>
      <CardContent className='p-0'>
        {rows.length === 0 ? (
          <p className='text-sm text-ink-soft text-center py-10'>
            Todavía no hay movimientos. Añade el primero arriba.
          </p>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full text-sm'>
              <thead>
                <tr className='bg-forest-600 text-white text-xs uppercase tracking-wide'>
                  <th className='text-left font-medium px-3 py-2'>Fecha</th>
                  <th className='text-left font-medium px-3 py-2'>Concepto</th>
                  <th className='text-left font-medium px-3 py-2'>Categoría</th>
                  <th className='text-left font-medium px-3 py-2'>Tipo</th>
                  <th className='text-right font-medium px-3 py-2'>Ingreso</th>
                  <th className='text-right font-medium px-3 py-2'>Gasto</th>
                  <th className='text-right font-medium px-3 py-2'>Saldo</th>
                  <th className='px-3 py-2' />
                </tr>
              </thead>
              <tbody>
                {rows.map((m, i) => (
                  <tr key={m.id} className={i % 2 === 1 ? 'bg-stripe' : ''}>
                    <td className='px-3 py-2 border-b border-line whitespace-nowrap'>
                      {fmtFecha(m.fecha)}
                    </td>
                    <td className='px-3 py-2 border-b border-line'>
                      {m.concepto}
                    </td>
                    <td className='px-3 py-2 border-b border-line'>
                      <Badge>{m.categoria}</Badge>
                    </td>
                    <td className='px-3 py-2 border-b border-line'>{m.tipo}</td>
                    <td className='px-3 py-2 border-b border-line text-right font-mono text-green-600 whitespace-nowrap'>
                      {m.ingreso ? fmtSoles(m.ingreso) : ''}
                    </td>
                    <td className='px-3 py-2 border-b border-line text-right font-mono text-red-600 whitespace-nowrap'>
                      {m.gasto ? fmtSoles(m.gasto) : ''}
                    </td>
                    <td className='px-3 py-2 border-b border-line text-right font-mono font-semibold whitespace-nowrap'>
                      {fmtSoles(m.saldo)}
                    </td>
                    <td className='px-3 py-2 border-b border-line text-right'>
                      <button
                        onClick={() => onDelete(m.id)}
                        aria-label='Eliminar movimiento'
                        className='text-ink-soft hover:text-red-600'
                      >
                        <X className='h-4 w-4' />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
