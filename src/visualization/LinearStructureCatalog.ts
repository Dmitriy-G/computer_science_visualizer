import type { LinearModel } from './LinearModel.ts'
import type { LinearFrame } from './LinearModel.ts'
import type { Scene, StructureKind } from './Scene.ts'
import { SkipList } from '../components/DataStructuresOverview/Linear/SkipList/SkipList.ts'
import { SkipListLayout } from '../components/DataStructuresOverview/Linear/SkipList/SkipListLayout.ts'
import { UnrolledLinkedList } from '../components/DataStructuresOverview/Linear/UnrolledLinkedList/UnrolledLinkedList.ts'
import { UnrolledLinkedListLayout } from '../components/DataStructuresOverview/Linear/UnrolledLinkedList/UnrolledLinkedListLayout.ts'
import { XORLinkedList } from '../components/DataStructuresOverview/Linear/XORLinkedList/XORLinkedList.ts'
import { XORLinkedListLayout } from '../components/DataStructuresOverview/Linear/XORLinkedList/XORLinkedListLayout.ts'
import { GapBuffer } from '../components/DataStructuresOverview/Linear/GapBuffer/GapBuffer.ts'
import { GapBufferLayout } from '../components/DataStructuresOverview/Linear/GapBuffer/GapBufferLayout.ts'
import { Rope } from '../components/DataStructuresOverview/Linear/Rope/Rope.ts'
import { RopeLayout } from '../components/DataStructuresOverview/Linear/Rope/RopeLayout.ts'
import { BitSet } from '../components/DataStructuresOverview/Linear/BitSet/BitSet.ts'
import { BitSetLayout } from '../components/DataStructuresOverview/Linear/BitSet/BitSetLayout.ts'
import { SparseArray } from '../components/DataStructuresOverview/Linear/SparseArray/SparseArray.ts'
import { SparseArrayLayout } from '../components/DataStructuresOverview/Linear/SparseArray/SparseArrayLayout.ts'
import { FreeList } from '../components/DataStructuresOverview/Linear/FreeList/FreeList.ts'
import { FreeListLayout } from '../components/DataStructuresOverview/Linear/FreeList/FreeListLayout.ts'

export class LinearStructureCatalog {
  public static createModels(): Map<StructureKind, LinearModel> {
    return new Map<StructureKind, LinearModel>([
      ['skip-list', SkipList.createDefault()],
      ['unrolled-linked-list', UnrolledLinkedList.createDefault()],
      ['xor-linked-list', XORLinkedList.createDefault()],
      ['gap-buffer', GapBuffer.createDefault()],
      ['rope', Rope.createDefault()],
      ['bit-set', BitSet.createDefault()],
      ['sparse-array', SparseArray.createDefault()],
      ['free-list', FreeList.createDefault()],
    ])
  }

  public static createDefault(kind: StructureKind): LinearModel | null {
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
