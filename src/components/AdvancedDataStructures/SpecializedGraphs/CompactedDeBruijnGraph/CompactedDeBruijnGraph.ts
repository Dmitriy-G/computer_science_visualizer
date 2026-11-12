import { AppliedModel } from '../../../../visualization/AppliedModel.ts'
import { AppliedGraphModel } from '../../../../visualization/AppliedGraphModel.ts'
import type { AppliedDiagram, DiagramLink } from '../../../../visualization/AppliedModel.ts'
import { LinearModel } from '../../../../visualization/LinearModel.ts'
import type { LinearInputValues, LinearObserver, LinearResult } from '../../../../visualization/LinearModel.ts'
import type { ActionKind } from '../../../../visualization/ActionCatalog.ts'

interface Unitig {
  readonly id: number
  readonly sequence: string
  readonly kmers: readonly string[]
}

export class CompactedDeBruijnGraph extends AppliedGraphModel {
  public readonly kind = 'compacted-de-bruijn-graph'
  public readonly representation = 'Forward DNA k=3 graph induced by distinct source k-mers and all suffix/prefix overlaps. Maximal nonbranching paths compact into unitigs; isolated cycles retain a closing self-edge. Search checks graph walks, not necessarily substrings of the original source. This omits Bifrost colors, reverse complements, and parallel construction.'
  public readonly countLabel = 'distinct 3-mers'
  private outgoing = new Map<string, string[]>()
  private unitigs: Unitig[] = []
  private owner = new Map<string, number>()
  private nextId = 1
  public get length(): number { return this.outgoing.size }
  public static createDefault(): CompactedDeBruijnGraph {
    const model = new CompactedDeBruijnGraph()
    model.execute('build-text', { text: 'acgttgcagtac' })
    return model
  }
  public clone(): CompactedDeBruijnGraph {
    const copy = new CompactedDeBruijnGraph()
    for (const [kmer, neighbors] of this.outgoing) copy.outgoing.set(kmer, [...neighbors])
    copy.unitigs = this.unitigs.map((unitig) => ({ ...unitig, kmers: [...unitig.kmers] }))
    copy.owner = new Map(this.owner)
    copy.nextId = this.nextId
    return copy
  }
  public getVertexIds(): number[] { return this.unitigs.map((unitig) => unitig.id) }
  public vertexSceneId(id: number): string { return `unitig-${id}` }
  public getNeighborIds(id: number): number[] {
    const unitig = this.unitigs.find((entry) => entry.id === id)
    if (!unitig) return []
    const last = unitig.kmers[unitig.kmers.length - 1]
    const neighbors = new Set<number>()
    for (const target of this.outgoing.get(last) ?? []) neighbors.add(this.owner.get(target)!)
    return [...neighbors].sort((a, b) => a - b)
  }
  public getDiagram(): AppliedDiagram {
    const links: DiagramLink[] = []
    for (const unitig of this.unitigs) for (const target of this.getNeighborIds(unitig.id)) links.push({ from: this.vertexSceneId(unitig.id), to: this.vertexSceneId(target), label: 'overlap 2' })
    return { rows: [this.unitigs.map((unitig) => ({ id: this.vertexSceneId(unitig.id), text: unitig.sequence, label: `unitig ${unitig.id} / ${unitig.kmers.length} k-mers` }))], links }
  }
  private build(text: string): void {
    const kmers = new Set<string>()
    for (let index = 0; index <= text.length - 3; index += 1) kmers.add(text.slice(index, index + 3))
    const ordered = [...kmers].sort()
    this.outgoing = new Map()
    const incoming = new Map<string, string[]>()
    for (const kmer of ordered) incoming.set(kmer, [])
    for (const source of ordered) {
      const targets: string[] = []
      for (const target of ordered) if (source.slice(1) === target.slice(0, 2)) {
        targets.push(target)
        incoming.get(target)!.push(source)
      }
      this.outgoing.set(source, targets)
    }
    this.unitigs = []
    this.owner = new Map()
    const compact = (start: string): void => {
      const path: string[] = []
      let current = start
      while (!this.owner.has(current)) {
        path.push(current)
        this.owner.set(current, this.nextId)
        const targets = this.outgoing.get(current)!
        if (targets.length !== 1 || incoming.get(targets[0])!.length !== 1 || this.owner.has(targets[0])) break
        current = targets[0]
      }
      let sequence = path[0]
      for (const kmer of path.slice(1)) sequence += kmer[2]
      this.unitigs.push({ id: this.nextId++, sequence, kmers: path })
    }
    for (const kmer of ordered) {
      const predecessors = incoming.get(kmer)!
      if (!this.owner.has(kmer) && (predecessors.length !== 1 || this.outgoing.get(predecessors[0])!.length !== 1)) compact(kmer)
    }
    for (const kmer of ordered) if (!this.owner.has(kmer)) compact(kmer)
  }
  public execute(action: ActionKind, input: LinearInputValues, observer?: LinearObserver): LinearResult {
    if (action === 'breadth-first' || action === 'depth-first') return this.traverse(action, input, observer)
    if (action === 'inspect-storage') return this.inspect(observer)
    if (action === 'clear') {
      this.outgoing.clear()
      this.owner.clear()
      this.unitigs = []
      return { description: 'Released all k-mers, unitigs, and overlaps; IDs remain monotone.' }
    }
    if (action === 'search-value') {
      const id = AppliedModel.bounded(input, 'value', 1, Number.MAX_SAFE_INTEGER)
      const unitig = this.unitigs.find((entry) => entry.id === id)
      return { description: unitig ? `Unitig ${id}: ${unitig.sequence}.` : `Unitig ${id} is absent.`, value: unitig ? id : null, activeId: unitig ? this.vertexSceneId(id) : null, status: unitig ? 'FOUND' : 'ABSENT' }
    }
    const text = AppliedModel.dna(input, 3, action === 'build-text' ? 64 : 32)
    if (action === 'build-text') {
      this.build(text)
      this.inspect(observer)
      return { description: `Compacted ${this.length} distinct 3-mers into ${this.unitigs.length} unitigs. All induced overlaps are retained.` }
    }
    if (action !== 'search-text') throw new RangeError('Unsupported compacted graph action')
    let previous: string | null = null
    let finalId: number | null = null
    for (let index = 0; index <= text.length - 3; index += 1) {
      const kmer = text.slice(index, index + 3)
      const id = this.owner.get(kmer)
      if (id === undefined || previous !== null && !this.outgoing.get(previous)!.includes(kmer)) return { description: `${text} does not spell a walk in the graph.`, value: false, status: 'ABSENT' }
      LinearModel.emit(observer, this.vertexSceneId(id), `Follow 3-mer ${kmer} inside unitig ${id}.`, 'check k-mer and previous suffix/prefix edge')
      previous = kmer
      finalId = id
    }
    return { description: `${text} spells a graph walk. This does not prove occurrence in the original input string.`, value: true, activeId: finalId === null ? null : this.vertexSceneId(finalId), status: 'PATH FOUND' }
  }
}
