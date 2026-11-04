import { FMIndex } from './FMIndex.ts'
import { LinearScene } from '../../../../visualization/LinearScene.ts'
import { StringTextScene } from '../../../../visualization/StringTextScene.ts'
import type { LinearFrame, LinearModel } from '../../../../visualization/LinearModel.ts'
import type { Scene, SceneNode } from '../../../../visualization/Scene.ts'

export class FMIndexLayout {
  public create(source: LinearModel, frame: LinearFrame = {}): Scene {
    const model = source as FMIndex
    const nodes: SceneNode[] = []
    if (model.constructionSource) nodes.push(StringTextScene.cell('fm-source', model.constructionSource, 'temporary construction source', 0, 0, StringTextScene.width([model.constructionSource], ['temporary construction source'])))
    const samples = model.getSamples()
    for (let row = 0; row < model.transform.length; row += 1) {
      const sample = samples.get(row)
      nodes.push(StringTextScene.cell(`bwt-${row}`, model.transform[row], `BWT[${row}]${sample === undefined ? '' : ` · SA ${sample}`}`, row % 4, Math.floor(row / 4)))
    }
    const cumulativeTop = 115 + Math.ceil(model.transform.length / 4) * 155 + 40
    let index = 0
    for (const [character, count] of model.getCumulative()) {
      nodes.push(StringTextScene.cell(`c-${character}`, String(count), `C[${character}]`, index % 4, Math.floor(index / 4), 180, cumulativeTop))
      index += 1
    }
    const occurrenceTop = cumulativeTop + Math.ceil(index / 4) * 155 + 40
    const chunks: { id: string, text: string, label: string }[] = []
    for (const [character, counts] of model.getOccurrences()) {
      for (let start = 0; start < counts.length; start += 8) chunks.push({ id: `occ-${character}-${start}`, text: counts.slice(start, start + 8).join(' '), label: `Occ(${character}, ${start}..${Math.min(start + 7, counts.length - 1)})` })
    }
    const width = StringTextScene.width(chunks.map((chunk) => chunk.text), chunks.map((chunk) => chunk.label), 260)
    chunks.forEach((chunk, rank) => nodes.push(StringTextScene.cell(chunk.id, chunk.text, chunk.label, rank % 4, Math.floor(rank / 4), width, occurrenceTop)))
    return LinearScene.create(model, nodes, [], frame, {
      title: 'BWT + C + dense exclusive-prefix Occ + sampled suffix positions',
      description: 'C[c] counts symbols smaller than c; Occ(c, i) counts c in BWT[0..i). Backward search updates a half-open suffix-row interval from right to left. LF steps recover positions from samples whose source position is divisible by four, requiring at most three steps. The full suffix array and source are discarded after construction. Dense Occ exposes every rank counter for teaching and is not a compressed production representation.',
      code: '[l, r) ← [C[c] + Occ(c,l), C[c] + Occ(c,r)); LF(i) = C[BWT[i]] + Occ(BWT[i],i)',
    }, 'source characters')
  }
}
