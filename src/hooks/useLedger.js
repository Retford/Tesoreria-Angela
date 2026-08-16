import { useEffect, useRef, useState } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const DEFAULT_CATS = [
  'Cuotas de socios',
  'Donativos',
  'Eventos / actividades',
  'Subvenciones',
  'Mantenimiento',
  'Suministros',
  'Material y compras',
  'Seguros',
  'Gestoría / administración',
  'Otros',
];

const EMPTY_STATE = {
  saldoInicial: 0,
  movimientos: [],
  categorias: DEFAULT_CATS,
};

export function useLedger(boardId, enabled) {
  const [state, setState] = useState(EMPTY_STATE);
  const [status, setStatus] = useState('idle'); // idle | syncing | saved | saving | error
  const applyingRemote = useRef(false);
  const saveTimer = useRef(null);

  useEffect(() => {
    if (!enabled || !boardId) return;
    setStatus('syncing');
    const ref = doc(db, 'juntas', boardId);
    const unsub = onSnapshot(
      ref,
      (snap) => {
        applyingRemote.current = true;
        if (snap.exists()) {
          const data = snap.data();
          setState({
            saldoInicial:
              typeof data.saldoInicial === 'number' ? data.saldoInicial : 0,
            movimientos: Array.isArray(data.movimientos)
              ? data.movimientos
              : [],
            categorias:
              Array.isArray(data.categorias) && data.categorias.length
                ? data.categorias
                : DEFAULT_CATS,
          });
        } else {
          setState(EMPTY_STATE);
        }
        setStatus('saved');
        applyingRemote.current = false;
      },
      () => setStatus('error'),
    );
    return unsub;
  }, [boardId, enabled]);

  function update(updater) {
    setState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      scheduleSave(next);
      return next;
    });
  }

  function scheduleSave(next) {
    if (applyingRemote.current || !boardId) return;
    clearTimeout(saveTimer.current);
    setStatus('saving');
    saveTimer.current = setTimeout(async () => {
      try {
        await setDoc(doc(db, 'juntas', boardId), next);
        setStatus('saved');
      } catch (e) {
        setStatus('error');
      }
    }, 400);
  }

  return { state, update, status };
}
