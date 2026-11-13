import type { Bit } from '../Latch/LatchModel.ts'

// Manchester symbols followed by NRZI magnetization make the stages visible.
// These are an illustrative combination, not a modern HDD recording format.
export class HddRecordingCode {
  public static encode(codeword: readonly Bit[]): Bit[] {
    const symbols: Bit[] = []
    for (const bit of codeword) symbols.push(bit, bit === 0 ? 1 : 0)
    return symbols
  }

  public static magnetize(symbols: readonly Bit[]): number[] {
    const regions: number[] = []
    let polarity = 1
    for (const symbol of symbols) {
      if (symbol === 1) polarity = -polarity
      regions.push(polarity)
    }
    return regions
  }

  public static sense(regions: readonly number[]): number[] {
    const signal: number[] = []
    let previous = 1
    for (const polarity of regions) {
      signal.push(polarity - previous)
      previous = polarity
    }
    return signal
  }

  public static detect(signal: readonly number[]): Bit[] {
    const symbols: Bit[] = []
    for (const transition of signal) {
      if (transition !== -2 && transition !== 0 && transition !== 2) throw new Error('Invalid symbolic transition')
      symbols.push(transition === 0 ? 0 : 1)
    }
    return symbols
  }

  public static decode(symbols: readonly Bit[]): Bit[] {
    if (symbols.length % 2 !== 0) throw new Error('Incomplete recording symbol')
    const codeword: Bit[] = []
    for (let index = 0; index < symbols.length; index += 2) {
      if (symbols[index] === symbols[index + 1]) throw new Error('Invalid recording symbol')
      codeword.push(symbols[index])
    }
    return codeword
  }
}
