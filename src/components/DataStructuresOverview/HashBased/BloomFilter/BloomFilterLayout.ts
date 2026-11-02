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
        status: event?.bucket === index ? event.type === 'bit' || event.type === 'result' ? bits[index] === 1 ? 'SET' : 'ZERO' : 'HASH' : 'SET',
      })
    }
    return {
      kind: 'bloom-filter', nodes, edges: [], width: 760, height: 540,
      count: model.length, countLabel: 'add operations recorded',
      hint: {
        title: 'Hash function',
        code: `h_i(value) = mix32(FNV1a32(String(value), seed_i)) % ${model.bitCount}`,
        description: `Custom seeded FNV-1a-style hashing with unsigned 32-bit mixing. Use ${model.hashCount} different seeds (i = 0 to ${model.hashCount - 1}) to select positions in the ${model.bitCount}-bit array.`,
      },
      focusId: event?.bucket === undefined ? null : `bloom-bit-${event.bucket}`,
    }
  }
}
