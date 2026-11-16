import type { ScenePath } from './Scene.ts'

type WirePoint = readonly [number, number]
type WireSegment = readonly [WirePoint, WirePoint]

export class HardwareWireCrossings {
  private static readonly radius = 6

  public static create(paths: readonly ScenePath[]): ScenePath[] {
    const routes: WireSegment[][] = []
    const priorities: number[] = []
    for (const path of paths) {
      routes.push(this.segments(path))
      priorities.push(this.priority(path))
    }
    const result: ScenePath[] = []
    for (let index = 0; index < paths.length; index += 1) {
      const path = paths[index]
      const gaps: { x: number, y: number, radius: number }[] = []
      const seen = new Set<string>()
      for (const [start, end] of routes[index]) {
        const horizontal = start[1] === end[1]
        for (let other = 0; other < paths.length; other += 1) {
          if (other === index || priorities[other] < priorities[index] ||
            priorities[other] === priorities[index] && other < index) continue
          for (const [otherStart, otherEnd] of routes[other]) {
            if (horizontal === (otherStart[1] === otherEnd[1])) continue
            const x = horizontal ? otherStart[0] : start[0]
            const y = horizontal ? start[1] : otherStart[1]
            const routeAxis = horizontal ? 0 : 1
            const otherAxis = horizontal ? 1 : 0
            const point: WirePoint = [x, y]
            if (point[routeAxis] <= Math.min(start[routeAxis], end[routeAxis]) + this.radius ||
              point[routeAxis] >= Math.max(start[routeAxis], end[routeAxis]) - this.radius ||
              point[otherAxis] <= Math.min(otherStart[otherAxis], otherEnd[otherAxis]) + this.radius ||
              point[otherAxis] >= Math.max(otherStart[otherAxis], otherEnd[otherAxis]) - this.radius) continue
            const key = `${x}:${y}`
            if (seen.has(key)) continue
            seen.add(key)
            gaps.push({ x: x - (path.translateX ?? 0), y: y - (path.translateY ?? 0), radius: this.radius })
          }
        }
      }
      if (gaps.length) result.push({ ...path, crossingGaps: gaps })
      else if (path.crossingGaps) result.push({ ...path, crossingGaps: undefined })
      else result.push(path)
    }
    return result
  }

  private static priority(path: ScenePath): number {
    if (path.highlighted) return 4
    if (path.id.includes('power') || path.id.includes('dc-input') || path.stroke === '#b58a45') return 0
    if (path.id.includes('clock')) return 1
    if (path.id.includes('reset')) return 2
    return 3
  }

  private static segments(path: ScenePath): WireSegment[] {
    if (path.fill && path.fill !== 'none') return []
    const tokens = path.d.match(/[a-zA-Z]|[-+]?(?:\d*\.?\d+)(?:[eE][-+]?\d+)?/g) ?? []
    const segments: WireSegment[] = []
    const offsetX = path.translateX ?? 0
    const offsetY = path.translateY ?? 0
    let x = 0
    let y = 0
    for (let index = 0; index < tokens.length;) {
      const command = tokens[index++]
      if (!['M', 'm', 'H', 'h', 'V', 'v', 'L', 'l'].includes(command)) return []
      const relative = command === command.toLowerCase()
      const kind = command.toUpperCase()
      const start: WirePoint = [x + offsetX, y + offsetY]
      const first = Number(tokens[index++])
      if (!Number.isFinite(first)) return []
      if (kind === 'H') x = relative ? x + first : first
      else if (kind === 'V') y = relative ? y + first : first
      else {
        const second = Number(tokens[index++])
        if (!Number.isFinite(second)) return []
        x = relative ? x + first : first
        y = relative ? y + second : second
      }
      if (kind === 'M') continue
      const end: WirePoint = [x + offsetX, y + offsetY]
      if (start[0] !== end[0] && start[1] !== end[1]) return []
      if (start[0] !== end[0] || start[1] !== end[1]) segments.push([start, end])
    }
    return segments
  }
}
