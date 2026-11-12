import { LinearModel } from '../../../../visualization/LinearModel.ts'
import type { LinearInputValues, LinearObserver, LinearResult } from '../../../../visualization/LinearModel.ts'
import type { ActionKind } from '../../../../visualization/ActionCatalog.ts'

export interface GapCharacter {
  readonly id: string
  readonly character: string
}

export class GapBuffer extends LinearModel {
  public readonly kind = 'gap-buffer'
  private slots: (GapCharacter | null)[] = new Array<null>(8).fill(null)
  private start = 0
  private end = 8
  private nextId = 1
  public get length(): number { return this.slots.length - (this.end - this.start) }
  public get gapStart(): number { return this.start }
  public get gapEnd(): number { return this.end }
  public getSlots(): readonly (GapCharacter | null)[] { return this.slots }

  public static createDefault(): GapBuffer {
    const model = new GapBuffer()
    model.execute('insert', { index: 0, text: 'structures' })
    model.moveGap(5)
    return model
  }

  public getText(): string {
    let text = ''
    for (const slot of this.slots) if (slot) text += slot.character
    return text
  }

  public clone(): GapBuffer {
    const model = new GapBuffer()
    model.slots = []
    for (const slot of this.slots) model.slots.push(slot ? { ...slot } : null)
    model.start = this.start
    model.end = this.end
    model.nextId = this.nextId
    return model
  }

  public moveGap(index: number, observer?: LinearObserver): void {
    LinearModel.index(index, this.length, true)
    while (this.start > index) {
      this.start -= 1
      this.end -= 1
      const character = this.slots[this.start]!
      this.slots[this.end] = character
      this.slots[this.start] = null
      LinearModel.emit(observer, character.id, `Move ${JSON.stringify(character.character)} across the gap to shift the cursor left.`, '--gapStart; --gapEnd\nslots[gapEnd] = slots[gapStart]; slots[gapStart] = empty')
    }
    while (this.start < index) {
      const character = this.slots[this.end]!
      this.slots[this.start] = character
      this.slots[this.end] = null
      this.start += 1
      this.end += 1
      LinearModel.emit(observer, character.id, `Move ${JSON.stringify(character.character)} across the gap to shift the cursor right.`, 'slots[gapStart] = slots[gapEnd]; slots[gapEnd] = empty\n++gapStart; ++gapEnd')
    }
  }

  private ensureGap(required: number, observer?: LinearObserver): void {
    if (this.end - this.start >= required) return
    const added = Math.max(8, required)
    this.slots.splice(this.end, 0, ...new Array<null>(added).fill(null))
    this.end += added
    LinearModel.emit(observer, null, `Grow the backing buffer by ${added} empty cells at the gap. Existing text order is preserved.`, 'allocate larger buffer; copy prefix and suffix around a larger gap')
  }

  public execute(action: ActionKind, input: LinearInputValues, observer?: LinearObserver): LinearResult {
    if (action === 'clear') {
      this.moveGap(0, observer)
      while (this.end < this.slots.length) {
        const character = this.slots[this.end]!
        this.slots[this.end++] = null
        LinearModel.emit(observer, null, `Release ${JSON.stringify(character.character)} into the gap.`, 'slots[gapEnd++] = empty')
      }
      return { description: 'The text is empty; all backing cells belong to the gap.' }
    }
    if (action === 'search-value') {
      const text = LinearModel.text(input)
      for (let index = 0; index + text.length <= this.length; index += 1) {
        let offset = 0
        while (offset < text.length) {
          const logical = index + offset
          const physical = logical < this.start ? logical : logical + this.end - this.start
          const character = this.slots[physical]!
          LinearModel.emit(observer, character.id, `Compare logical index ${index + offset} with search character ${JSON.stringify(text[offset])}.`, 'physical = logical < gapStart ? logical : logical + gapSize')
          if (character.character !== text[offset]) break
          offset += 1
        }
        if (offset === text.length) {
          const physical = index < this.start ? index : index + this.end - this.start
          return { description: `Found ${JSON.stringify(text)} at logical index ${index}.`, activeId: this.slots[physical]!.id, status: 'FOUND', value: index }
        }
      }
      return { description: `${JSON.stringify(text)} was not found.`, status: 'NOT FOUND', value: -1 }
    }
    const index = LinearModel.integer(input, 'index')
    if (action === 'move-gap') {
      this.moveGap(index, observer)
      return { description: `Gap moved to logical index ${index}; text is unchanged.` }
    }
    if (action === 'insert') {
      LinearModel.index(index, this.length, true)
      const text = LinearModel.text(input)
      if (this.length + text.length > LinearModel.maximumTextLength) return { description: 'Insertion rejected: this teaching example allows 256 characters.' }
      this.moveGap(index, observer)
      this.ensureGap(text.length + 1, observer)
      for (const character of text) {
        const entry = { id: `gap-char-${this.nextId++}`, character }
        this.slots[this.start++] = entry
        LinearModel.emit(observer, entry.id, `Write ${JSON.stringify(character)} into the gap and advance gapStart.`, 'slots[gapStart++] = character', 'NEW')
      }
      return { description: `Inserted ${JSON.stringify(text)} at index ${index}.`, activeId: this.slots[this.start - 1]!.id }
    }
    if (action !== 'delete-index') throw new RangeError('Unsupported gap-buffer action')
    const count = LinearModel.integer(input, 'count')
    LinearModel.index(index, this.length)
    if (count < 1 || count > this.length - index) throw new RangeError('Deletion extends past the text')
    this.moveGap(index, observer)
    for (let removed = 0; removed < count; removed += 1) {
      const character = this.slots[this.end]!
      this.slots[this.end++] = null
      LinearModel.emit(observer, null, `Delete ${JSON.stringify(character.character)} by extending the gap.`, 'slots[gapEnd++] = empty')
    }
    return { description: `Deleted ${count} characters at index ${index}.` }
  }
}
