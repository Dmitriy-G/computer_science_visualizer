import type { Scene, SceneNode } from '../../../../visualization/Scene.ts'
import type { HashTrace } from '../../../../visualization/Hashing.ts'
import type { BloomFilter } from './BloomFilter.ts'

export class BloomFilterLayout {
  public create(model: BloomFilter, event?: HashTrace): Scene {
    const bits = model.getBits()
    const nodes: SceneNode[] = []
    for (let index = 0; index < bits.length; index += 1) {
      nodes.push({
        id: `bloom-bit-${index}`, value: bits[index],
        x: 60 + index % 8 * 90, y: 80 + Math.floor(index / 8) * 116,
        width: 50, height: 50, label: `BIT ${index}`, opacity: 1,
        tone: event?.bucket === index ? 'active' : bits[index] === 1 ? 'visited' : 'default',
        status: event?.bucket === index ? event.type === 'bit' ? bits[index] === 1 ? 'SET' : 'ZERO' : 'HASH' : 'SET',
      })
    }
    return {
      kind: 'bloom-filter', nodes, edges: [], width: 760, height: 540,
      count: model.length, countLabel: 'add operations recorded',
      focusId: event?.bucket === undefined ? null : `bloom-bit-${event.bucket}`,
    }
  }
}
