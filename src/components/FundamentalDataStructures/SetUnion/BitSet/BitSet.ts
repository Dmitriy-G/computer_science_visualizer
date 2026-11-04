import { LinearModel } from '../../../../visualization/LinearModel.ts'
import type { LinearInputValues, LinearObserver, LinearResult } from '../../../../visualization/LinearModel.ts'
import type { ActionKind } from '../../../../visualization/ActionCatalog.ts'

export class BitSet extends LinearModel {
  public readonly kind = 'bit-set'
  private readonly words: Uint32Array
  public readonly length: number

  constructor(length = 10) {
    super()
    if (!Number.isSafeInteger(length) || length < 0 || length > 256) throw new RangeError('Bit count must be between 0 and 256')
    this.length = length
    this.words = new Uint32Array(Math.ceil(length / 32))
  }

  public static createDefault(): BitSet {
    const model = new BitSet()
    for (const index of [0, 2, 3, 6, 9]) model.execute('set-bit', { index })
    return model
  }

  public clone(): BitSet {
    const model = new BitSet(this.length)
    model.words.set(this.words)
    return model
  }

  public getWords(): readonly number[] { return Array.from(this.words) }

  public test(index: number): boolean {
    LinearModel.index(index, this.length)
    return (this.words[Math.floor(index / 32)] & (1 << (index % 32))) !== 0
  }

  public execute(action: ActionKind, input: LinearInputValues, observer?: LinearObserver): LinearResult {
    if (action === 'clear') {
      for (let word = 0; word < this.words.length; word += 1) {
        this.words[word] = 0
        LinearModel.emit(observer, `bit-word-${word}`, `Zero packed word ${word}; logical bit count stays ${this.length}.`, 'words[word] = 0')
      }
      return { description: `All ${this.length} bits are zero; the fixed bit count is preserved.` }
    }
    const index = LinearModel.integer(input, 'index')
    LinearModel.index(index, this.length)
    const word = Math.floor(index / 32)
    const bit = index % 32
    const mask = (1 << bit) >>> 0
    LinearModel.emit(observer, `bit-word-${word}`, `Index ${index} uses word ${word}, bit ${bit}, unsigned mask ${mask}.`, 'word = floor(index / 32)\nmask = (1 << (index % 32)) >>> 0')
    if (action === 'search-index') {
      const value = this.test(index)
      return { description: `Bit ${index} is ${value ? 1 : 0} (${value ? 'set' : 'clear'}).`, activeId: `bit-${index}`, status: value ? 'SET' : 'CLEAR', value }
    }
    if (action === 'set-bit') this.words[word] |= mask
    else if (action === 'clear-bit') this.words[word] &= ~mask
    else if (action === 'toggle-bit') this.words[word] ^= mask
    else throw new RangeError('Unsupported bit-set action')
    LinearModel.emit(observer, `bit-${index}`, `Bit ${index} is now ${this.test(index) ? 1 : 0}; other bits are unchanged.`, action === 'set-bit' ? 'words[word] |= mask' : action === 'clear-bit' ? 'words[word] &= ~mask' : 'words[word] ^= mask')
    return { description: `Bit ${index} is ${this.test(index) ? 1 : 0}.`, activeId: `bit-${index}` }
  }
}
