import { SuffixArray } from './SuffixArray.ts'
import { LinearScene } from '../../../../visualization/LinearScene.ts'
import { StringTextScene } from '../../../../visualization/StringTextScene.ts'
import type { LinearFrame, LinearModel } from '../../../../visualization/LinearModel.ts'
import type { Scene } from '../../../../visualization/Scene.ts'

export class SuffixArrayLayout {
  public create(source: LinearModel, frame: LinearFrame = {}): Scene {
    const model = source as SuffixArray
    const text = model.indexedText || 'empty'
    const nodes = [StringTextScene.cell('sa-source', text, 'indexed source · $ terminator', 0, 0, StringTextScene.width([text], ['indexed source · $ terminator']))]
    const lcp = model.getLCP()
    model.getSuffixes().forEach((position, rank) => nodes.push(StringTextScene.cell(`sa-${rank}`, String(position), `SA[${rank}] · LCP ${lcp[rank]}`, rank % 4, Math.floor(rank / 4), 180, 285)))
    return LinearScene.create(model, nodes, [], frame, 'source characters')
  }
}
