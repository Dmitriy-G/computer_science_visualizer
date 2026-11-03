import { AppliedStructureCatalog } from './AppliedStructureCatalog.ts'
import { AppliedModel } from './AppliedModel.ts'
import { SetUnionStructureCatalog } from './SetUnionStructureCatalog.ts'
import { SetUnionModel } from '../components/DataStructuresOverview/SetUnion/SetUnionModel.ts'
import { StringTextStructureCatalog } from './StringTextStructureCatalog.ts'
import { StringTextModel } from '../components/DataStructuresOverview/StringText/StringTextModel.ts'
import type { LinearModel } from './LinearModel.ts'
import type { LinearFrame } from './LinearModel.ts'
import type { Scene, StructureKind } from './Scene.ts'
import { SkipList } from '../components/DataStructuresOverview/Linear/SkipList/SkipList.ts'
import { SkipListLayout } from '../components/DataStructuresOverview/Linear/SkipList/SkipListLayout.ts'
import { UnrolledLinkedList } from '../components/DataStructuresOverview/Linear/UnrolledLinkedList/UnrolledLinkedList.ts'
import { UnrolledLinkedListLayout } from '../components/DataStructuresOverview/Linear/UnrolledLinkedList/UnrolledLinkedListLayout.ts'
import { XORLinkedList } from '../components/DataStructuresOverview/Linear/XORLinkedList/XORLinkedList.ts'
import { XORLinkedListLayout } from '../components/DataStructuresOverview/Linear/XORLinkedList/XORLinkedListLayout.ts'
import { GapBuffer } from '../components/DataStructuresOverview/StringText/GapBuffer/GapBuffer.ts'
import { GapBufferLayout } from '../components/DataStructuresOverview/StringText/GapBuffer/GapBufferLayout.ts'
import { Rope } from '../components/DataStructuresOverview/StringText/Rope/Rope.ts'
import { RopeLayout } from '../components/DataStructuresOverview/StringText/Rope/RopeLayout.ts'
import { BitSet } from '../components/DataStructuresOverview/SetUnion/BitSet/BitSet.ts'
import { BitSetLayout } from '../components/DataStructuresOverview/SetUnion/BitSet/BitSetLayout.ts'
import { SparseArray } from '../components/DataStructuresOverview/Linear/SparseArray/SparseArray.ts'
import { SparseArrayLayout } from '../components/DataStructuresOverview/Linear/SparseArray/SparseArrayLayout.ts'
import { FreeList } from '../components/DataStructuresOverview/Linear/FreeList/FreeList.ts'
import { FreeListLayout } from '../components/DataStructuresOverview/Linear/FreeList/FreeListLayout.ts'

export class LinearStructureCatalog {
  public static createModels(): Map<StructureKind, LinearModel> {
    const models = new Map<StructureKind, LinearModel>([
      ['skip-list', SkipList.createDefault()],
      ['unrolled-linked-list', UnrolledLinkedList.createDefault()],
      ['xor-linked-list', XORLinkedList.createDefault()],
      ['gap-buffer', GapBuffer.createDefault()],
      ['rope', Rope.createDefault()],
      ['bit-set', BitSet.createDefault()],
      ['sparse-array', SparseArray.createDefault()],
      ['free-list', FreeList.createDefault()],
    ])
    for (const [kind, model] of AppliedStructureCatalog.createModels()) models.set(kind, model)
    for (const [kind, model] of SetUnionStructureCatalog.createModels()) models.set(kind, model)
    for (const [kind, model] of StringTextStructureCatalog.createModels()) models.set(kind, model)
    return models
  }

  public static createDefault(kind: StructureKind): LinearModel | null {
    const applied = AppliedStructureCatalog.createDefault(kind)
    if (applied) return applied
    const setUnion = SetUnionStructureCatalog.createDefault(kind)
    if (setUnion) return setUnion
    const stringText = StringTextStructureCatalog.createDefault(kind)
    if (stringText) return stringText
    switch (kind) {
      case 'skip-list': return SkipList.createDefault()
      case 'unrolled-linked-list': return UnrolledLinkedList.createDefault()
      case 'xor-linked-list': return XORLinkedList.createDefault()
      case 'gap-buffer': return GapBuffer.createDefault()
      case 'rope': return Rope.createDefault()
      case 'bit-set': return BitSet.createDefault()
      case 'sparse-array': return SparseArray.createDefault()
      case 'free-list': return FreeList.createDefault()
      default: return null
    }
  }

  public static createScene(model: LinearModel, frame: LinearFrame = {}): Scene {
    if (model instanceof AppliedModel) return AppliedStructureCatalog.createScene(model, frame)
    if (model instanceof SetUnionModel) return SetUnionStructureCatalog.createScene(model, frame)
    if (model instanceof StringTextModel) return StringTextStructureCatalog.createScene(model, frame)
    switch (model.kind) {
      case 'skip-list': return new SkipListLayout().create(model, frame)
      case 'unrolled-linked-list': return new UnrolledLinkedListLayout().create(model, frame)
      case 'xor-linked-list': return new XORLinkedListLayout().create(model, frame)
      case 'gap-buffer': return new GapBufferLayout().create(model, frame)
      case 'rope': return new RopeLayout().create(model, frame)
      case 'bit-set': return new BitSetLayout().create(model, frame)
      case 'sparse-array': return new SparseArrayLayout().create(model, frame)
      case 'free-list': return new FreeListLayout().create(model, frame)
      default: throw new RangeError('Unknown additional linear structure')
    }
  }
}
