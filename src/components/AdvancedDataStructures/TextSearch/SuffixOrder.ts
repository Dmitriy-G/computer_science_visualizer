export class SuffixOrder {
  public static create(text: string, compare?: (left: number, right: number, order: number) => void): number[] {
    let order: number[] = []
    for (let index = 0; index < text.length; index += 1) order.push(index)
    for (let width = 1; width < order.length; width *= 2) {
      const merged: number[] = []
      for (let start = 0; start < order.length; start += width * 2) {
        const middle = Math.min(start + width, order.length)
        const end = Math.min(start + width * 2, order.length)
        let left = start
        let right = middle
        while (left < middle && right < end) {
          const comparison = this.compare(text, order[left], order[right])
          compare?.(order[left], order[right], comparison)
          merged.push(comparison <= 0 ? order[left++] : order[right++])
        }
        while (left < middle) merged.push(order[left++])
        while (right < end) merged.push(order[right++])
      }
      order = merged
    }
    return order
  }

  private static compare(text: string, left: number, right: number): number {
    while (left < text.length && right < text.length) {
      if (text[left] !== text[right]) return text[left] < text[right] ? -1 : 1
      left += 1
      right += 1
    }
    return (text.length - left) - (text.length - right)
  }
}
