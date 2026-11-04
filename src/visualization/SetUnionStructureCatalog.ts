import type { StructureKind, Scene } from './Scene.ts'
import type { LinearFrame } from './LinearModel.ts'
import { SetUnionModel } from './SetUnionModel.ts'
import { SetUnionStructureDefinitions } from './SetUnionStructureDefinitions.ts'
import { DisjointSet } from '../components/FundamentalDataStructures/SetUnion/DisjointSet/DisjointSet.ts'
import { DisjointSetLayout } from '../components/FundamentalDataStructures/SetUnion/DisjointSet/DisjointSetLayout.ts'
import { OrderedSet } from '../components/FundamentalDataStructures/SetUnion/OrderedSet/OrderedSet.ts'
import { OrderedSetLayout } from '../components/FundamentalDataStructures/SetUnion/OrderedSet/OrderedSetLayout.ts'
import { Multiset } from '../components/FundamentalDataStructures/SetUnion/Multiset/Multiset.ts'
import { MultisetLayout } from '../components/FundamentalDataStructures/SetUnion/Multiset/MultisetLayout.ts'
import { IntervalSet } from '../components/AdvancedDataStructures/RangeQueries/IntervalSet/IntervalSet.ts'
import { IntervalSetLayout } from '../components/AdvancedDataStructures/RangeQueries/IntervalSet/IntervalSetLayout.ts'

export class SetUnionStructureCatalog {
  public static supports(kind: StructureKind): boolean {
    for (const definition of SetUnionStructureDefinitions.structures) if (definition.kind === kind) return true
    return false
  }

  public static createModels(): Map<StructureKind, SetUnionModel> {
    const models = new Map<StructureKind, SetUnionModel>()
    for (const definition of SetUnionStructureDefinitions.structures) models.set(definition.kind, this.createDefault(definition.kind)!)
    return models
  }

  public static createDefault(kind: StructureKind): SetUnionModel | null {
    switch (kind) {
      case 'disjoint-set': return DisjointSet.createDefault()
      case 'ordered-set': return OrderedSet.createDefault()
      case 'multiset': return Multiset.createDefault()
      case 'interval-set': return IntervalSet.createDefault()
      default: return null
    }
  }

  public static createScene(model: SetUnionModel, frame: LinearFrame = {}): Scene {
    switch (model.kind) {
      case 'disjoint-set': return new DisjointSetLayout().create(model, frame)
      case 'ordered-set': return new OrderedSetLayout().create(model, frame)
      case 'multiset': return new MultisetLayout().create(model, frame)
      case 'interval-set': return new IntervalSetLayout().create(model, frame)
      default: throw new RangeError('Unknown set/union structure')
    }
  }
}
