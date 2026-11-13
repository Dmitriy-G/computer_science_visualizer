import type { Bit } from '../Latch/LatchModel.ts'

export interface HddEccResult {
  readonly codeword: readonly Bit[]
  readonly data: readonly Bit[]
  readonly syndrome: number
  readonly overallParity: Bit
  readonly correctedBit: number | null
  readonly status: 'clean' | 'corrected' | 'uncorrectable'
}

// Extended Hamming (8,4), for teaching SECDED rather than a production HDD code.
export class HddEcc {
  private static validate(bits: readonly Bit[], length: number): void {
    if (bits.length !== length) throw new RangeError(`Expected ${length} bits`)
    for (const bit of bits) if (bit !== 0 && bit !== 1) throw new RangeError('Expected binary bits')
  }

  public static encode(data: readonly Bit[]): Bit[] {
    this.validate(data, 4)
    const word: Bit[] = [0, 0, data[0], 0, data[1], data[2], data[3], 0]
    word[0] = (word[2] ^ word[4] ^ word[6]) as Bit
    word[1] = (word[2] ^ word[5] ^ word[6]) as Bit
    word[3] = (word[4] ^ word[5] ^ word[6]) as Bit
    let parity = 0
    for (let index = 0; index < 7; index += 1) parity ^= word[index]
    word[7] = parity as Bit
    return word
  }

  public static decode(received: readonly Bit[]): HddEccResult {
    this.validate(received, 8)
    const word = [...received]
    let syndrome = 0
    let parity = 0
    for (let index = 0; index < word.length; index += 1) {
      parity ^= word[index]
      if (index < 7 && word[index]) syndrome ^= index + 1
    }
    if (syndrome !== 0 && parity === 0) return { codeword: word, data: [], syndrome, overallParity: 0, correctedBit: null, status: 'uncorrectable' }
    let correctedBit: number | null = null
    if (parity !== 0) {
      correctedBit = syndrome === 0 ? 8 : syndrome
      word[correctedBit - 1] = (word[correctedBit - 1] ^ 1) as Bit
    }
    return {
      codeword: word, data: [word[2], word[4], word[5], word[6]], syndrome, overallParity: parity as Bit, correctedBit,
      status: correctedBit === null ? 'clean' : 'corrected',
    }
  }
}
