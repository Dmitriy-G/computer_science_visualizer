import { ArraySortOperations } from './ArraySortOperations.ts'

export class GnomeArraySort extends ArraySortOperations {
  public sort(): void {
    let position = 1
    while (position < this.entries.length) {
      if (position === 0) {
        this.emit('stage', 'Turn around at the first slot', 'There is no previous entry at index 0. Move forward to compare the first pair again.', 'if position == 0: position = 1', { roles: { 0: 'FRONT' } })
        position = 1
        continue
      }
      if (this.compare(position - 1, position) <= 0) {
        this.emit('stage', 'Step forward', `Indices ${position - 1} and ${position} are in order. Advance one slot; equal keys are never exchanged.`, 'position += 1', { roles: { [position]: 'FORWARD' } }, position)
        position += 1
      } else {
        this.swap(position - 1, position)
        position -= 1
        this.emit('stage', 'Step backward', `The exchanged key may still be smaller than its new predecessor. Step back to index ${position} and check again.`, 'position -= 1', { roles: { [position]: 'BACKTRACK' } }, position)
      }
    }
  }
}
