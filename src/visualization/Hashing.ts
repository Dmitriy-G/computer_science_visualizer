export type HashOperation = 'insert' | 'search-value' | 'delete-value' | 'clear'

export interface HashTrace {
  readonly type: 'hash' | 'compare' | 'insert' | 'update' | 'remove' | 'resize' | 'rehash' | 'bit' | 'clear' | 'result'
  readonly key?: number
  readonly value?: number
  readonly bucket?: number
  readonly id?: string
  readonly found?: boolean
  readonly hashIndex?: number
}

export type HashObserver = (event: HashTrace) => void

export class Hashing {
  public static validate(value: number): void {
    if (!Number.isSafeInteger(value)) throw new TypeError('Keys and values must be safe integers')
  }

  public static bucket(key: number, capacity: number): number {
    this.validate(key)
    const remainder = key % capacity
    return remainder < 0 ? remainder + capacity : remainder === 0 ? 0 : remainder
  }

  public static bit(key: number, index: number, capacity: number): number {
    this.validate(key)
    const text = String(key)
    let hash = (2166136261 ^ Math.imul(index + 1, 0x9e3779b9)) >>> 0
    for (let offset = 0; offset < text.length; offset += 1) {
      hash = Math.imul(hash ^ text.charCodeAt(offset), 16777619) >>> 0
    }
    hash ^= hash >>> 16
    hash = Math.imul(hash, 0x85ebca6b) >>> 0
    hash ^= hash >>> 13
    return (hash >>> 0) % capacity
  }
}
