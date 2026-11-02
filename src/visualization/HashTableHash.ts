// Exact arithmetic keeps distinct safe integers distinct before range reduction.
// The seeded family is deterministic; theoretical randomized bounds require independent parameters.
export class HashTableHash {
  public static readonly prime = (1n << 61n) - 1n

  public static parameters(seed: number): { a: bigint, b: bigint } {
    let state = BigInt(seed + 1) * 0x9e3779b97f4a7c15n
    const mask = (1n << 64n) - 1n
    state = ((state ^ (state >> 30n)) * 0xbf58476d1ce4e5b9n) & mask
    state = ((state ^ (state >> 27n)) * 0x94d049bb133111ebn) & mask
    const a = 1n + ((state ^ (state >> 31n)) % (this.prime - 1n))
    state = ((state + 0x9e3779b97f4a7c15n) * 0xbf58476d1ce4e5b9n) & mask
    return { a, b: state % this.prime }
  }

  public static raw(key: number, seed: number): bigint {
    if (!Number.isSafeInteger(key)) throw new TypeError('Keys must be safe integers')
    const { a, b } = this.parameters(seed)
    const normalized = ((BigInt(key) % this.prime) + this.prime) % this.prime
    return (a * normalized + b) % this.prime
  }

  public static index(key: number, seed: number, capacity: number): number {
    return Number(this.raw(key, seed) % BigInt(capacity))
  }
}
