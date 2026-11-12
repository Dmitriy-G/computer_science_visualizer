export interface StoredRecord {
  readonly key: number
  readonly value: number
  readonly position: number
  readonly bytes: number
}

export class SortedRecords {
  public static parse(text: unknown): StoredRecord[] {
    if (typeof text !== 'string') throw new TypeError('Enter key:value pairs separated by commas')
    const parts = text.split(',')
    if (parts.length < 1 || parts.length > 64) throw new RangeError('Enter 1 to 64 records')
    const pairs: { key: number, value: number }[] = []
    for (const part of parts) {
      const match = /^\s*(-?\d+)\s*:\s*(-?\d+)\s*$/.exec(part)
      if (!match) throw new TypeError('Use key:value pairs separated by commas')
      const key = Number(match[1])
      const value = Number(match[2])
      if (!Number.isSafeInteger(key) || !Number.isSafeInteger(value)) throw new RangeError('Keys and values must be safe integers')
      pairs.push({ key, value })
    }
    let ordered = pairs
    for (let width = 1; width < ordered.length; width *= 2) {
      const merged: { key: number, value: number }[] = []
      for (let start = 0; start < ordered.length; start += width * 2) {
        let left = start
        const middle = Math.min(start + width, ordered.length)
        let right = middle
        const end = Math.min(start + width * 2, ordered.length)
        while (left < middle || right < end) {
          if (right === end || (left < middle && ordered[left].key <= ordered[right].key)) merged.push(ordered[left++])
          else merged.push(ordered[right++])
        }
      }
      ordered = merged
    }
    const records: StoredRecord[] = []
    let position = 0
    for (const pair of ordered) {
      if (records.length && records[records.length - 1].key === pair.key) throw new RangeError('Keys must be distinct')
      const bytes = new TextEncoder().encode(`${pair.key}:${pair.value}\n`).length
      records.push({ ...pair, position, bytes })
      position += bytes
    }
    return records
  }

  public static defaults(): string { return '2:20,5:50,9:90,14:140,20:200,27:270,35:350,44:440,54:540,65:650' }
}
