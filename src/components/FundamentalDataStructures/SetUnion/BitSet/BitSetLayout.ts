import { BitSet } from './BitSet.ts'
import { LinearScene } from '../../../../visualization/LinearScene.ts'
import type { LinearFrame, LinearModel } from '../../../../visualization/LinearModel.ts'
import type { Scene, SceneNode } from '../../../../visualization/Scene.ts'

export class BitSetLayout {
  public create(model: LinearModel, frame: LinearFrame = {}): Scene {
    if (!(model instanceof BitSet)) throw new TypeError('Expected BitSet')
    const nodes: SceneNode[] = []
    const words = model.getWords()
    for (let word = 0; word < words.length; word += 1) {
      nodes.push(LinearScene.node(`bit-word-${word}`, `0x${words[word].toString(16).padStart(8, '0')}`, `word ${word} · uint32`, 210, 100 + word * 290, 220))
    }
    for (let index = 0; index < model.length; index += 1) {
      nodes.push(LinearScene.node(`bit-${index}`, model.test(index) ? '1' : '0', `bit ${index}`, 80 + index % 32 * 100, 235 + Math.floor(index / 32) * 290, 62))
    }
    return LinearScene.create(model, nodes, [], frame, 'bits')
  }
}
