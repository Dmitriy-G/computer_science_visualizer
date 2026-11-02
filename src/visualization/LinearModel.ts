import type { ActionKind } from './ActionCatalog.ts'
import type { Scene } from './Scene.ts'

export type LinearInputValues = Readonly<Record<string, string | number>>

export interface LinearTraceEvent {
  readonly activeId: string | null
  readonly description: string
  readonly code: string
  readonly status?: string
}

export interface LinearObserver {
  onLinearChange(event: LinearTraceEvent): void
}

export interface LinearResult {
  readonly description: string
  readonly activeId?: string | null
  readonly status?: string
  readonly value?: number | string | boolean | null
}

export interface LinearFrame {
  readonly count?: number
  readonly activeId?: string | null
  readonly status?: string
  readonly visited?: ReadonlySet<string>
}

export interface LinearSceneFactory {
  create(model: LinearModel, frame?: LinearFrame): Scene
}

export abstract class LinearModel {
  public static readonly maximumElements = 64
  public static readonly maximumTextLength = 256
  public abstract readonly kind: Scene['kind']
  public abstract get length(): number
  public abstract clone(): LinearModel
  public abstract execute(action: ActionKind, input: LinearInputValues, observer?: LinearObserver): LinearResult

  public static integer(input: LinearInputValues, name: string): number {
    const value = input[name]
    if (typeof value !== 'number' || !Number.isSafeInteger(value)) throw new TypeError(`${name} must be a safe integer`)
    return value
  }

  public static index(index: number, length: number, insertion = false): void {
    if (!Number.isSafeInteger(index) || index < 0 || index > length - (insertion ? 0 : 1)) throw new RangeError('Index is outside the structure')
  }

  public static text(input: LinearInputValues): string {
    const text = input.text
    if (typeof text !== 'string' || !/^[\x20-\x7e]{1,32}$/.test(text)) throw new TypeError('Enter 1 to 32 printable ASCII characters')
    return text
  }

  public static emit(observer: LinearObserver | undefined, activeId: string | null, description: string, code: string, status?: string): void {
    observer?.onLinearChange({ activeId, description, code, status })
  }
}
