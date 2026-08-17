import { useEffect, useRef, useState } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { LedgerState, SyncStatus } from '@/types';

export const DEFAULT_CATS: string[] = [];

const EMPTY_STATE: LedgerState = {
  saldoInicial: 0,
  movimientos: [],
  categorias: DEFAULT_CATS,
};

type AsyncStatus = 'idle' | 'saving' | 'saved' | 'error';

export function useLedger(boardId: string, enabled: boolean) {
  const [state, setState] = useState<LedgerState>(EMPTY_STATE);
  const [asyncStatus, setAsyncStatus] = useState<AsyncStatus>('idle');
  const applyingRemote = useRef(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [prevBoardId, setPrevBoardId] = useState(boardId);
  if (boardId !== prevBoardId) {
    setPrevBoardId(boardId);
    setAsyncStatus('idle');
  }

  useEffect(() => {
    if (!enabled || !boardId || !db) return;
    const ref = doc(db, 'juntas', boardId);
    const unsub = onSnapshot(
      ref,
      (snap) => {
        applyingRemote.current = true;
        if (snap.exists()) {
          const data = snap.data() as Partial<LedgerState>;
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
        setAsyncStatus('saved');
        applyingRemote.current = false;
      },
      () => {
        setAsyncStatus('error');
      },
    );
    return unsub;
  }, [boardId, enabled]);

  function update(updater: LedgerState | ((prev: LedgerState) => LedgerState)) {
    setState((prev) => {
      const next =
        typeof updater === 'function'
          ? (updater as (p: LedgerState) => LedgerState)(prev)
          : updater;
      scheduleSave(next);
      return next;
    });
  }

  function scheduleSave(next: LedgerState) {
    if (applyingRemote.current || !boardId || !db) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    setAsyncStatus('saving');
    saveTimer.current = setTimeout(async () => {
      try {
        await setDoc(doc(db!, 'juntas', boardId), next);
        setAsyncStatus('saved');
      } catch {
        setAsyncStatus('error');
      }
    }, 400);
  }

  const status: SyncStatus = !enabled
    ? 'idle'
    : asyncStatus === 'idle'
      ? 'syncing'
      : asyncStatus;

  return { state, update, status };
}
