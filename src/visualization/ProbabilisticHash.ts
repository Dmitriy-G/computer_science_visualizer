export class ProbabilisticHash {
  private static readonly mask = (1n << 64n) - 1n

  public static mix(value: bigint): bigint {
    let mixed = value & this.mask
    mixed = ((mixed ^ (mixed >> 30n)) * 0xbf58476d1ce4e5b9n) & this.mask
    mixed = ((mixed ^ (mixed >> 27n)) * 0x94d049bb133111ebn) & this.mask
    return (mixed ^ (mixed >> 31n)) & this.mask
  }

  public static hash(value: number, seed = 0): bigint {
    if (!Number.isSafeInteger(value)) throw new TypeError('Expected a whole safe integer')
    return this.mix(BigInt(value) + BigInt(seed + 1) * 0x9e3779b97f4a7c15n)
  }

  public static index(value: number, seed: number, size: number): number {
    return Number(this.hash(value, seed) % BigInt(size))
  }
}
