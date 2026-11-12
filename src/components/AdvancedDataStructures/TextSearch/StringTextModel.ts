import { LinearModel } from '../../../visualization/LinearModel.ts'
import type { LinearInputValues, LinearResult } from '../../../visualization/LinearModel.ts'

export abstract class StringTextModel extends LinearModel {
  public static readonly defaultText = 'bananaband'
  public static readonly defaultWords = 'an,and,ant,at,be,bee,bed,cat,car,dog'

  public static letters(input: LinearInputValues, field: string, maximum = 32): string {
    const value = input[field]
    if (typeof value !== 'string' || !/^[a-z]+$/.test(value) || value.length > maximum) throw new TypeError(`Enter 1 to ${maximum} lowercase letters a-z for ${field}`)
    return value
  }

  public static words(text: string): readonly string[] {
    const parts = text.split(',')
    const words: string[] = []
    let characters = 0
    if (parts.length < 1 || parts.length > 16) throw new RangeError('Enter 1 to 16 comma-separated words')
    for (const part of parts) {
      const word = this.letters({ word: part.trim() }, 'word')
      if (words.includes(word)) throw new TypeError('Use distinct words')
      words.push(word)
      characters += word.length
    }
    if (characters > 128) throw new RangeError('The dictionary supports at most 128 total letters')
    return words
  }

  protected rejected(description: string): LinearResult { return { description, status: 'REJECTED' } }
}
