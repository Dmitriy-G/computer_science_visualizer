import { AppliedModel } from '../../../../visualization/AppliedModel.ts'
import { AppliedGraphModel } from '../../../../visualization/AppliedGraphModel.ts'
import type { AppliedDiagram } from '../../../../visualization/AppliedModel.ts'
import { LinearModel } from '../../../../visualization/LinearModel.ts'
import type { LinearInputValues, LinearObserver, LinearResult } from '../../../../visualization/LinearModel.ts'
import type { ActionKind } from '../../../../visualization/ActionCatalog.ts'

interface AddressNode {
  readonly id: number
  readonly key: number
  readonly nodeType: number
}

interface AddressReference {
  readonly id: number
  readonly source: number
  readonly target: number
  readonly referenceType: number
}

export class AddressSpaceGraph extends AppliedGraphModel {
  public readonly kind = 'address-space-graph'
  public readonly representation = 'Typed Object, Variable, and Method nodes connected by Organizes or HasComponent references. References are unique by source/type/target and may have different types for the same endpoints. This local graph subset is not an OPC UA server: no namespaces, remote targets, protocol, or type-model conformance is implemented.'
  public readonly countLabel = 'nodes'
  private nodes = new Map<number, AddressNode>()
  private references: AddressReference[] = []
  private nextNode = 1
  private nextReference = 1
  public get length(): number { return this.nodes.size }
  public static createDefault(): AddressSpaceGraph {
    const model = new AddressSpaceGraph()
    for (let key = 1; key <= 10; key += 1) model.execute('add-vertex', { value: key, nodeType: key <= 3 ? 0 : key % 2 + 1 })
    for (let target = 2; target <= 10; target += 1) model.execute('add-edge', { source: Math.floor(target / 2), target, referenceType: target <= 3 ? 0 : 1 })
    return model
  }
  public clone(): AddressSpaceGraph {
    const copy = new AddressSpaceGraph()
    for (const [key, node] of this.nodes) copy.nodes.set(key, { ...node })
    copy.references = this.references.map((reference) => ({ ...reference }))
    copy.nextNode = this.nextNode
    copy.nextReference = this.nextReference
    return copy
  }
  public getVertexIds(): number[] { return [...this.nodes.keys()] }
  public getNeighborIds(key: number): number[] {
    return [...new Set(this.references.filter((reference) => reference.source === key).map((reference) => reference.target))].sort((a, b) => a - b)
  }
  public vertexSceneId(key: number): string { return `address-${this.nodes.get(key)!.id}` }
  public getDiagram(): AppliedDiagram {
    return { rows: [[...this.nodes.values()].map((node) => ({ id: `address-${node.id}`, text: String(node.key), label: `${['Object', 'Variable', 'Method'][node.nodeType]} / key ${node.key}` }))], links: this.references.map((reference) => ({ from: this.vertexSceneId(reference.source), to: this.vertexSceneId(reference.target), label: `${reference.referenceType ? 'HasComponent' : 'Organizes'} / r${reference.id}` })) }
  }
  public execute(action: ActionKind, input: LinearInputValues, observer?: LinearObserver): LinearResult {
    if (action === 'breadth-first' || action === 'depth-first') return this.traverse(action, input, observer)
    if (action === 'inspect-storage') return this.inspect(observer)
    if (action === 'clear') {
      this.references = []
      this.nodes.clear()
      return { description: 'Released typed references and nodes; internal IDs remain monotone.' }
    }
    if (action === 'add-vertex') {
      const key = AppliedModel.bounded(input, 'value', 0, 4095)
      const nodeType = AppliedModel.bounded(input, 'nodeType', 0, 2)
      if (this.nodes.has(key)) return this.reject('This node key already exists.')
      if (this.length === 64) return this.reject('At most 64 nodes are supported.')
      const node = { key, nodeType, id: this.nextNode++ }
      this.nodes.set(key, node)
      LinearModel.emit(observer, this.vertexSceneId(key), `Create ${['Object', 'Variable', 'Method'][nodeType]} node ${key}.`, 'store node class and unique node key', 'NEW')
      return { description: `Added node ${key}.`, activeId: this.vertexSceneId(key) }
    }
    if (action === 'add-edge') {
      const source = AppliedModel.bounded(input, 'source', 0, 4095)
      const target = AppliedModel.bounded(input, 'target', 0, 4095)
      const referenceType = AppliedModel.bounded(input, 'referenceType', 0, 1)
      if (!this.nodes.has(source) || !this.nodes.has(target)) return this.reject('Both endpoints must exist.')
      if (this.references.length === 128) return this.reject('At most 128 references are supported.')
      if (this.references.some((reference) => reference.source === source && reference.target === target && reference.referenceType === referenceType)) return this.reject('That source/type/target reference already exists.')
      const id = this.nextReference++
      this.references.push({ id, source, target, referenceType })
      LinearModel.emit(observer, this.vertexSceneId(source), `Connect ${source} to ${target} with ${referenceType ? 'HasComponent' : 'Organizes'} reference r${id}.`, 'insert unique typed source-to-target reference')
      return { description: `Added reference r${id}.`, activeId: this.vertexSceneId(target) }
    }
    if (action === 'remove-edge') {
      const id = AppliedModel.bounded(input, 'index', 1, Number.MAX_SAFE_INTEGER)
      const found = this.references.some((reference) => reference.id === id)
      this.references = this.references.filter((reference) => reference.id !== id)
      return { description: found ? `Removed reference r${id}.` : `Reference r${id} was absent.` }
    }
    const key = AppliedModel.bounded(input, 'value', 0, 4095)
    const node = this.nodes.get(key)
    if (action === 'delete-value') {
      this.references = this.references.filter((reference) => reference.source !== key && reference.target !== key)
      this.nodes.delete(key)
      return { description: `Node ${key} and all its incident references are absent.` }
    }
    if (action !== 'search-value' && action !== 'browse-node') throw new RangeError('Unsupported AddressSpace action')
    if (!node) return { description: `Node ${key} is absent.`, value: null, status: 'ABSENT' }
    LinearModel.emit(observer, this.vertexSceneId(key), `Inspect typed node ${key}.`, 'lookup node by key')
    if (action === 'search-value') return { description: `Node ${key} has class ${['Object', 'Variable', 'Method'][node.nodeType]}.`, value: key, activeId: this.vertexSceneId(key), status: 'FOUND' }
    const results: string[] = []
    for (const reference of this.references) if (reference.source === key) {
      LinearModel.emit(observer, this.vertexSceneId(reference.target), `Follow ${reference.referenceType ? 'HasComponent' : 'Organizes'} to ${reference.target}.`, 'browse outgoing typed references')
      results.push(`r${reference.id}: ${reference.referenceType ? 'HasComponent' : 'Organizes'} -> ${reference.target}`)
    }
    return { description: `References from ${key}: ${results.join('; ') || 'none'}.`, value: results.join('; '), activeId: this.vertexSceneId(key), status: 'BROWSED' }
  }
}
