import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { fmtSoles } from '@/lib/format';

export default function SummaryCards({
  saldoInicial,
  totalIngresos,
  totalGastos,
  saldoActual,
  onChangeSaldoInicial,
}) {
  return (
    <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
      <Card className='p-4'>
        <Label htmlFor='saldo-inicial' className='mb-1'>
          Saldo inicial
        </Label>
        <Input
          id='saldo-inicial'
          type='number'
          step='0.01'
          value={saldoInicial}
          onChange={(e) =>
            onChangeSaldoInicial(parseFloat(e.target.value) || 0)
          }
          className='border-0 shadow-none px-0 h-auto text-lg font-mono font-semibold text-forest-600 focus-visible:ring-0'
        />
      </Card>
      <Card className='p-4'>
        <p className='text-xs uppercase tracking-wide text-ink-soft mb-1'>
          Total ingresos
        </p>
        <p className='font-mono text-lg font-semibold text-green-600'>
          {fmtSoles(totalIngresos)}
        </p>
      </Card>
      <Card className='p-4'>
        <p className='text-xs uppercase tracking-wide text-ink-soft mb-1'>
          Total gastos
        </p>
        <p className='font-mono text-lg font-semibold text-red-600'>
          {fmtSoles(totalGastos)}
        </p>
      </Card>
      <Card className='p-4'>
        <p className='text-xs uppercase tracking-wide text-ink-soft mb-1'>
          Saldo actual
        </p>
        <p className='font-mono text-lg font-semibold text-forest-600'>
          {fmtSoles(saldoActual)}
        </p>
        <Badge
          variant={saldoActual >= 0 ? 'success' : 'destructive'}
          className='mt-1'
        >
          {saldoActual >= 0 ? 'en orden' : 'en negativo'}
        </Badge>
      </Card>
    </div>
  );
}
