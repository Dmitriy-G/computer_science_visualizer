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
    return LinearScene.create(model, nodes, [], frame, {
      title: 'Sorted suffix starts + adjacent LCP array',
      description: 'Every SA cell stores a zero-based suffix start in source + $. LCP stores the common-prefix length with the previous suffix. This lesson merge-sorts suffix ranges with direct character comparisons and computes LCP by adjacent scans; it does not claim linear-time construction. Two binary searches find all matching rows. Results follow suffix order, not source-position order.',
      code: 'SA = sorted suffix starts; LCP[i] = commonPrefix(SA[i - 1], SA[i])',
    }, 'source characters')
  }
}
