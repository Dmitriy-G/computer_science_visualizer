import { ArraySortOperations } from './ArraySortOperations.ts'

export class SmoothArraySort extends ArraySortOperations {
  private sortedFrom = this.entries.length

  public sort(): void {
    const length = this.entries.length
    if (length < 2) return
    let count = 1
    let root = 0
    let shape = 1
    let size = 1
    let companion = 1
    while (count < length) {
      this.emit('heap', 'Grow the Leonardo forest', `The unsorted prefix has ${count} entries. Its rightmost Leonardo heap has size ${size}.`, `forest = ${shape}; heapSize = ${size}`, { roles: { [root]: 'ROOT' } }, root)
      if (shape % 8 === 3) {
        this.sift(root, size, companion)
        shape = (shape + 1) / 4
        const next = size + companion + 1
        companion = size
        size = next
        const larger = size + companion + 1
        companion = size
        size = larger
      } else {
        if (count + companion < length) this.sift(root, size, companion)
        else this.trinkle(root, shape, size, companion)
        const smaller = size - companion - 1
        size = companion
        companion = smaller
        shape *= 2
        while (size !== 1) {
          const next = size - companion - 1
          size = companion
          companion = next
          shape *= 2
        }
        shape += 1
      }
      count += 1
      root += 1
    }
    this.trinkle(root, shape, size, companion)
    while (count > 1) {
      this.sortedFrom = --count
      this.emit('extract', 'Finalize the largest remaining value', `Key ${this.entries[root].value} at index ${root} is now in its final slot. Split its Leonardo heap and repair the remaining roots.`, `sortedSuffix = [${root}, ${length})`, { sortedFrom: count, roles: { [root]: 'MAX' } }, root)
      if (size === 1) {
        root -= 1
        shape -= 1
        while (shape % 2 === 0) {
          shape /= 2
          const next = size + companion + 1
          companion = size
          size = next
        }
      } else {
        shape -= 1
        root = root - size + companion
        if (shape > 0) this.semitrinkle(root, shape, size, companion)
        const next = size - companion - 1
        size = companion
        companion = next
        shape = 2 * shape + 1
        root += companion
        this.semitrinkle(root, shape, size, companion)
        const smaller = size - companion - 1
        size = companion
        companion = smaller
        shape = 2 * shape + 1
      }
    }
  }

  private sift(root: number, size: number, companion: number): void {
    while (size >= 3) {
      let child = root - size + companion
      if (this.compare(child, root - 1, { sortedFrom: this.sortedFrom }) < 0) {
        child = root - 1
        const next = size - companion - 1
        size = companion
        companion = next
      }
      if (this.compare(root, child, { sortedFrom: this.sortedFrom }) >= 0) break
      this.swap(root, child, { sortedFrom: this.sortedFrom })
      root = child
      const next = size - companion - 1
      size = companion
      companion = next
    }
  }

  private semitrinkle(root: number, shape: number, size: number, companion: number): void {
    const previous = root - companion
    if (this.compare(previous, root, { sortedFrom: this.sortedFrom }) <= 0) return
    this.swap(root, previous, { sortedFrom: this.sortedFrom })
    this.trinkle(previous, shape, size, companion)
  }

  private trinkle(root: number, shape: number, size: number, companion: number): void {
    this.emit('stage', 'Trinkle across Leonardo roots', 'Compare a heap root with the preceding root, then sift when a child is larger. This preserves the forest order while exploiting already ordered values.', 'trinkle(root, forest)', { sortedFrom: this.sortedFrom, roles: { [root]: 'TRINKLE' } }, root)
    while (shape > 0) {
      while (shape % 2 === 0) {
        shape /= 2
        const next = size + companion + 1
        companion = size
        size = next
      }
      const previous = root - size
      if (shape === 1 || this.compare(previous, root, { sortedFrom: this.sortedFrom }) <= 0) break
      shape -= 1
      if (size === 1) {
        this.swap(root, previous, { sortedFrom: this.sortedFrom })
        root = previous
      } else {
        let child = root - size + companion
        if (this.compare(child, root - 1, { sortedFrom: this.sortedFrom }) < 0) {
          child = root - 1
          const next = size - companion - 1
          size = companion
          companion = next
          shape *= 2
        }
        if (this.compare(previous, child, { sortedFrom: this.sortedFrom }) >= 0) {
          this.swap(root, previous, { sortedFrom: this.sortedFrom })
          root = previous
        } else {
          this.swap(root, child, { sortedFrom: this.sortedFrom })
          root = child
          const next = size - companion - 1
          size = companion
          companion = next
          break
        }
      }
    }
    this.sift(root, size, companion)
  }
}
