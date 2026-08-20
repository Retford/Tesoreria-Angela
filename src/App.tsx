import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLedger, DEFAULT_CATS } from '@/hooks/useLedger';
import { firebaseConfigured } from '@/lib/firebase';
import LoginScreen from '@/components/LoginScreen';
import SummaryCards from '@/components/SummaryCards';
import MovementForm from '@/components/MovementForm';
import MovementsTable from '@/components/MovementsTable';
import CategoryBreakdown from '@/components/CategoryBreakdown';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Landmark, LogOut } from 'lucide-react';
import type { NuevoMovimiento, SyncStatus } from '@/types';
import { Cuota } from './components/Cuota';

function ConfigMissing() {
  return (
    <div className='min-h-screen flex items-center justify-center px-4'>
      <div className='max-w-md text-center bg-gold-50 border border-gold-600 rounded-xl p-6'>
        <h1 className='font-display text-lg font-semibold text-forest-700 mb-2'>
          Falta configurar Firebase
        </h1>
        <p className='text-sm text-ink-soft'>
          Copia{' '}
          <code className='font-mono bg-white px-1 rounded'>.env.example</code>{' '}
          a <code className='font-mono bg-white px-1 rounded'>.env</code> y
          completa las claves de tu proyecto de Firebase. Revisa el archivo
          README.md para el paso a paso.
        </p>
      </div>
    </div>
  );
}

const STATUS_LABEL: Record<SyncStatus, string> = {
  idle: '',
  syncing: 'Conectando...',
  saving: 'Guardando...',
  saved: 'Sincronizado · visible para toda la junta',
  error: 'No se pudo sincronizar. Revisa tu conexión.',
};

export default function App() {
  const { user, loading, login, register, logout } = useAuth();
  const [boardId, setBoardId] = useState<string>(
    () => localStorage.getItem('lb-board-id') || 'principal',
  );
  const { state, update, status } = useLedger(boardId, Boolean(user));

  useEffect(() => {
    localStorage.setItem('lb-board-id', boardId);
  }, [boardId]);

  if (!firebaseConfigured) return <ConfigMissing />;
  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center text-ink-soft text-sm'>
        Cargando...
      </div>
    );
  }
  if (!user) {
    return <LoginScreen onLogin={login} onRegister={register} />;
  }

  const totalIngresos = state.movimientos
    .filter((m) => m.tipo === 'Ingreso')
    .reduce((s, m) => s + m.importe, 0);
  const totalGastos = state.movimientos
    .filter((m) => m.tipo === 'Gasto')
    .reduce((s, m) => s + m.importe, 0);
  const saldoActual = state.saldoInicial + totalIngresos - totalGastos;

  function addMovimiento(m: NuevoMovimiento) {
    update((prev) => ({
      ...prev,
      movimientos: [
        ...prev.movimientos,
        {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          orden: prev.movimientos.length,
          ...m,
        },
      ],
    }));
  }

  function deleteMovimiento(id: string) {
    update((prev) => ({
      ...prev,
      movimientos: prev.movimientos.filter((m) => m.id !== id),
    }));
  }

  function addCategoria(nombre: string) {
    update((prev) =>
      prev.categorias.includes(nombre)
        ? prev
        : { ...prev, categorias: [...prev.categorias, nombre] },
    );
  }

  function setSaldoInicial(v: number) {
    update((prev) => ({ ...prev, saldoInicial: v }));
  }

  return (
    <div className='min-h-screen pb-16'>
      <header className='bg-forest-600 text-white'>
        <div className='max-w-5xl mx-auto px-4 py-5 flex flex-wrap items-end justify-between gap-4'>
          <div className='flex items-center gap-3'>
            <div className='h-9 w-9 rounded-full bg-white/10 flex items-center justify-center'>
              <Landmark className='h-4.5 w-4.5' />
            </div>
            <div>
              <h1 className='font-display text-xl font-semibold leading-tight'>
                Libro de caja
              </h1>
              <p className='text-xs text-forest-100'>
                Cuentas de la junta · moneda: soles (S/)
              </p>
            </div>
          </div>
          <div className='flex items-end gap-3'>
            <div>
              <label
                className='block text-[11px] text-forest-100 mb-1'
                htmlFor='board-id'
              >
                Código de junta
              </label>
              <Input
                id='board-id'
                value={boardId}
                onChange={(e) =>
                  setBoardId(e.target.value.trim() || 'principal')
                }
                className='h-8 w-36 bg-forest-700 border-forest-400 text-white placeholder:text-forest-100 font-mono text-xs'
              />
            </div>
            <Button
              variant='ghost'
              size='sm'
              onClick={logout}
              className='text-white hover:bg-white/10 hover:text-white'
            >
              <LogOut className='h-4 w-4' /> Salir
            </Button>
          </div>
        </div>
      </header>

      <main className='max-w-5xl mx-auto px-4 mt-6 flex flex-col gap-6'>
        <SummaryCards
          saldoInicial={state.saldoInicial}
          totalIngresos={totalIngresos}
          totalGastos={totalGastos}
          saldoActual={saldoActual}
          onChangeSaldoInicial={setSaldoInicial}
        />

        <MovementForm
          categorias={state.categorias.length ? state.categorias : DEFAULT_CATS}
          onAdd={addMovimiento}
          onAddCategoria={addCategoria}
        />

        <div className='flex justify-between'>
          <Cuota cuota={50} profession='Abogado' />
          <Cuota cuota={100} profession='Arquitecto' />
        </div>

        <MovementsTable
          movimientos={state.movimientos}
          saldoInicial={state.saldoInicial}
          onDelete={deleteMovimiento}
        />

        <CategoryBreakdown
          movimientos={state.movimientos}
          categorias={state.categorias}
        />

        <div className='flex items-center gap-2 text-xs text-ink-soft'>
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              status === 'error'
                ? 'bg-red-600'
                : status === 'saving' || status === 'syncing'
                  ? 'bg-gold-600'
                  : 'bg-green-600'
            }`}
          />
          <span>{STATUS_LABEL[status]}</span>
        </div>
      </main>
    </div>
  );
}
