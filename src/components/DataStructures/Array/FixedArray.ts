export interface ArrayEntry {
  readonly id: string
  readonly value: number
}

export class FixedArray {
  private items: ArrayEntry[]
  private nextId: number

  constructor(values: readonly number[] = []) {
    this.items = new Array<ArrayEntry>(values.length)
    for (let index = 0; index < values.length; index += 1) {
      FixedArray.validateValue(values[index])
      this.items[index] = { id: `array-element-${index}`, value: values[index] }
    }
    this.nextId = values.length
  }

  public get length(): number {
    return this.items.length
  }

  public static createDefault(): FixedArray {
    const values: number[] = []
    for (let value = 10; value <= 100; value += 10) values.push(value)
    return new FixedArray(values)
  }

  // A fixed array never grows. Insertion produces a separate array of exact length + 1.
  public withInsertedAt(index: number, value: number): FixedArray {
    if (!Number.isInteger(index) || index < 0 || index > this.length) {
      throw new RangeError('Insertion index is outside the array')
    }
    FixedArray.validateValue(value)
    const result = new FixedArray()
    result.items = new Array<ArrayEntry>(this.length + 1)
    for (let position = 0; position < index; position += 1) {
      result.items[position] = { ...this.items[position] }
    }
    result.items[index] = { id: `array-element-${this.nextId}`, value }
    for (let position = index; position < this.length; position += 1) {
      result.items[position + 1] = { ...this.items[position] }
    }
    result.nextId = this.nextId + 1
    return result
  }

  public getAt(index: number): ArrayEntry {
    if (!Number.isInteger(index) || index < 0 || index >= this.length)
      throw new RangeError('Index is outside the array')
    return { ...this.items[index] }
  }

  public findIndex(value: number): number {
    FixedArray.validateValue(value)
    for (let index = 0; index < this.length; index += 1) {
      if (this.items[index].value === value) return index
    }
    return -1
  }

  public withoutAt(index: number): FixedArray {
    this.getAt(index)
    const result = new FixedArray()
    result.items = new Array<ArrayEntry>(this.length - 1)
    let destination = 0
    for (let source = 0; source < this.length; source += 1) {
      if (source === index) continue
      result.items[destination] = { ...this.items[source] }
      destination += 1
    }
    result.nextId = this.nextId
    return result
  }

  public getEntries(): ArrayEntry[] {
    const entries = new Array<ArrayEntry>(this.length)
    for (let index = 0; index < this.length; index += 1) {
      entries[index] = { ...this.items[index] }
    }
    return entries
  }

  public clone(): FixedArray {
    const copy = new FixedArray()
    copy.items = this.getEntries()
    copy.nextId = this.nextId
    return copy
  }

  private static validateValue(value: number): void {
    if (!Number.isSafeInteger(value)) {
      throw new TypeError('Array values must be safe integers')
    }
  }
}
