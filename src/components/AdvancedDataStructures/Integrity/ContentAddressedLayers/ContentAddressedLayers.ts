import { AppliedModel } from '../../../../visualization/AppliedModel.ts'
import type { AppliedDiagram } from '../../../../visualization/AppliedModel.ts'
import { LinearModel } from '../../../../visualization/LinearModel.ts'
import type { LinearInputValues, LinearObserver, LinearResult } from '../../../../visualization/LinearModel.ts'
import type { ActionKind } from '../../../../visualization/ActionCatalog.ts'
import { SHA256 } from '../MerkleTree/SHA256.ts'

interface LayerReference { readonly id: number, readonly parent: string | null, readonly diff: string, readonly chain: string }

export class ContentAddressedLayers extends AppliedModel {
  public readonly kind = 'content-addressed-layers'
  public readonly countLabel = 'layer references'
  public readonly representation = 'SHA-256 of a decimal UTF-8 integer payload is its DiffID. A root ChainID equals its DiffID; a child ChainID hashes the full parent ChainID, one space, and the full DiffID, including sha256: prefixes. Equal payloads share one blob; equal parent/content pairs share one reference. This numeric-payload Moby variant excludes tar archives, filesystem layers, mounts, and image manifests. Diagram digests are abbreviated; comparisons use full digests.'
  private blobs = new Map<string, number>()
  private layers = new Map<string, LayerReference>()
  private ids = new Map<number, string>()
  private nextId = 1
  public get length(): number { return this.layers.size }
  public static createDefault(): ContentAddressedLayers {
    const model = new ContentAddressedLayers()
    for (let index = 0; index < 10; index += 1) model.execute('insert', { parent: index, value: index % 4 + 1 })
    return model
  }
  private digest(text: string): string { return `sha256:${SHA256.digest(new TextEncoder().encode(text))}` }
  private chain(parent: string | null, diff: string): string { return parent === null ? diff : this.digest(`${parent} ${diff}`) }
  public clone(): ContentAddressedLayers {
    const copy = new ContentAddressedLayers()
    copy.blobs = new Map(this.blobs)
    for (const [chain, layer] of this.layers) copy.layers.set(chain, { ...layer })
    copy.ids = new Map(this.ids)
    copy.nextId = this.nextId
    return copy
  }
  public getDiagram(): AppliedDiagram {
    const layers = []
    const links = []
    for (const layer of this.layers.values()) {
      layers.push({ id: `layer-${layer.id}`, text: layer.chain.slice(7, 19), label: `layer ${layer.id} / ChainID` })
      links.push({ from: `layer-${layer.id}`, to: `blob-${layer.diff}`, label: 'DiffID' })
      if (layer.parent) links.push({ from: `layer-${layer.id}`, to: `layer-${this.layers.get(layer.parent)!.id}`, label: 'parent' })
    }
    const blobs = []
    for (const [diff, value] of this.blobs) blobs.push({ id: `blob-${diff}`, text: String(value), label: `DiffID ${diff.slice(7, 19)}` })
    return { rows: [layers, blobs], links }
  }
  public execute(action: ActionKind, input: LinearInputValues, observer?: LinearObserver): LinearResult {
    if (action === 'inspect-storage') return this.inspect(observer)
    if (action === 'insert') {
      const value = LinearModel.integer(input, 'value')
      const parentId = LinearModel.integer(input, 'parent')
      if (parentId < 0) throw new RangeError('Use 0 for no parent or an existing positive layer ID')
      const parent = parentId === 0 ? null : this.ids.get(parentId)
      if (parent === undefined) return this.reject('The parent layer does not exist.')
      const diff = this.digest(String(value))
      const chain = this.chain(parent, diff)
      const existing = this.layers.get(chain)
      if (existing) return { description: `Reused existing layer ${existing.id}. DiffID ${diff}; ChainID ${chain}.`, value: existing.id, activeId: `layer-${existing.id}` }
      if (this.length === 64) return this.reject('At most 64 distinct layer references are supported.')
      const shared = this.blobs.has(diff)
      if (shared && this.blobs.get(diff) !== value) return this.reject('A digest collision was detected; existing bytes are preserved.')
      this.blobs.set(diff, value)
      const layer = { id: this.nextId++, parent, diff, chain }
      this.layers.set(chain, layer)
      this.ids.set(layer.id, chain)
      LinearModel.emit(observer, `blob-${diff}`, `${shared ? 'Share existing' : 'Store new'} content blob for value ${value}.`, 'DiffID = SHA256(payload); deduplicate by full DiffID')
      LinearModel.emit(observer, `layer-${layer.id}`, `Publish layer ${layer.id} with its parent and full ChainID.`, 'ChainID = parent ? SHA256(parent + space + DiffID) : DiffID')
      return { description: `Layer ${layer.id}: ${shared ? 'shared' : 'new'} blob. DiffID ${diff}; ChainID ${chain}.`, value: layer.id }
    }
    if (action === 'search-value') {
      const value = LinearModel.integer(input, 'value')
      const diff = this.digest(String(value))
      const found = this.blobs.get(diff) === value
      if (found) LinearModel.emit(observer, `blob-${diff}`, 'Look up the payload by its full DiffID and compare its stored value.', 'lookup SHA256(payload) in content-addressed blob map')
      return { description: found ? `Found shared blob ${diff} containing ${value}.` : `No blob contains ${value}.`, value: found ? diff : null, activeId: found ? `blob-${diff}` : null, status: found ? 'FOUND' : 'ABSENT' }
    }
    if (action === 'browse-node') {
      const id = LinearModel.integer(input, 'index')
      const chain = this.ids.get(id)
      if (!chain) return { description: `Layer ${id} does not exist.`, value: null, status: 'ABSENT' }
      const path: number[] = []
      let current: string | null = chain
      while (current !== null) {
        const layer: LayerReference = this.layers.get(current)!
        path.push(layer.id)
        LinearModel.emit(observer, `layer-${layer.id}`, `Visit layer ${layer.id} and its parent reference.`, 'follow immutable parent ChainIDs to root')
        current = layer.parent
      }
      return { description: `Layer-to-root path: ${path.join(' -> ')}. Full ChainID ${chain}.`, value: path, activeId: `layer-${id}`, status: 'FOUND' }
    }
    if (action === 'verify-proof') {
      let valid = true
      for (const layer of this.layers.values()) {
        const value = this.blobs.get(layer.diff)
        const match = value !== undefined && this.digest(String(value)) === layer.diff && this.chain(layer.parent, layer.diff) === layer.chain && (layer.parent === null || this.layers.has(layer.parent))
        valid = valid && match
        LinearModel.emit(observer, `layer-${layer.id}`, `Layer ${layer.id}: ${match ? 'content and chain hashes match' : 'identity mismatch'}.`, 'recompute DiffID and ChainID; verify parent exists', match ? 'VERIFIED' : 'CORRUPT')
      }
      return { description: valid ? `Verified ${this.length} layer references and their content identities.` : 'A content or parent-chain mismatch was detected.', value: valid, status: valid ? 'VERIFIED' : 'CORRUPT' }
    }
    if (action === 'clear') {
      const reverse = [...this.layers.values()].reverse()
      for (const layer of reverse) {
        this.layers.delete(layer.chain)
        this.ids.delete(layer.id)
        let referenced = false
        for (const remaining of this.layers.values()) if (remaining.diff === layer.diff) referenced = true
        if (!referenced) this.blobs.delete(layer.diff)
        LinearModel.emit(observer, null, `Release layer ${layer.id} and its blob only when no references remain.`, 'remove descendants before parents; reclaim unreferenced content')
      }
      return { description: 'Released all layer references and content blobs; stable layer IDs are not reused.' }
    }
    throw new RangeError('Unsupported content-addressed layer action')
  }
}
