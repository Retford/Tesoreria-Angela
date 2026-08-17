export type TipoMovimiento = "Ingreso" | "Gasto"

export interface Movimiento {
  id: string
  orden: number
  fecha: string // ISO yyyy-mm-dd
  concepto: string
  categoria: string
  tipo: TipoMovimiento
  importe: number
}

export interface NuevoMovimiento {
  fecha: string
  concepto: string
  categoria: string
  tipo: TipoMovimiento
  importe: number
}

export interface LedgerState {
  saldoInicial: number
  movimientos: Movimiento[]
  categorias: string[]
}

export type SyncStatus = "idle" | "syncing" | "saving" | "saved" | "error"
