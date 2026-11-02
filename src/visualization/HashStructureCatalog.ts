import type { StructureKind, Scene } from './Scene.ts'
import type { LinearFrame } from './LinearModel.ts'
import type { HashTableModel } from '../components/DataStructuresOverview/HashBased/HashTableModel.ts'
import { HashStructureDefinitions } from './HashStructureDefinitions.ts'
import { OpenAddressingHashTable } from '../components/DataStructuresOverview/HashBased/OpenAddressingHashTable/OpenAddressingHashTable.ts'
import { OpenAddressingHashTableLayout } from '../components/DataStructuresOverview/HashBased/OpenAddressingHashTable/OpenAddressingHashTableLayout.ts'
import { SeparateChainingHashTable } from '../components/DataStructuresOverview/HashBased/SeparateChainingHashTable/SeparateChainingHashTable.ts'
import { SeparateChainingHashTableLayout } from '../components/DataStructuresOverview/HashBased/SeparateChainingHashTable/SeparateChainingHashTableLayout.ts'
import { RobinHoodHashTable } from '../components/DataStructuresOverview/HashBased/RobinHoodHashTable/RobinHoodHashTable.ts'
import { RobinHoodHashTableLayout } from '../components/DataStructuresOverview/HashBased/RobinHoodHashTable/RobinHoodHashTableLayout.ts'
import { CuckooHashTable } from '../components/DataStructuresOverview/HashBased/CuckooHashTable/CuckooHashTable.ts'
import { CuckooHashTableLayout } from '../components/DataStructuresOverview/HashBased/CuckooHashTable/CuckooHashTableLayout.ts'
import { HopscotchHashing } from '../components/DataStructuresOverview/HashBased/HopscotchHashing/HopscotchHashing.ts'
import { HopscotchHashingLayout } from '../components/DataStructuresOverview/HashBased/HopscotchHashing/HopscotchHashingLayout.ts'
import { ExtendibleHashing } from '../components/DataStructuresOverview/HashBased/ExtendibleHashing/ExtendibleHashing.ts'
import { ExtendibleHashingLayout } from '../components/DataStructuresOverview/HashBased/ExtendibleHashing/ExtendibleHashingLayout.ts'
import { LinearHashing } from '../components/DataStructuresOverview/HashBased/LinearHashing/LinearHashing.ts'
import { LinearHashingLayout } from '../components/DataStructuresOverview/HashBased/LinearHashing/LinearHashingLayout.ts'
import { PerfectHashTable } from '../components/DataStructuresOverview/HashBased/PerfectHashTable/PerfectHashTable.ts'
import { PerfectHashTableLayout } from '../components/DataStructuresOverview/HashBased/PerfectHashTable/PerfectHashTableLayout.ts'
import { ConsistentHashingRing } from '../components/DataStructuresOverview/HashBased/ConsistentHashingRing/ConsistentHashingRing.ts'
import { ConsistentHashingRingLayout } from '../components/DataStructuresOverview/HashBased/ConsistentHashingRing/ConsistentHashingRingLayout.ts'

export class HashStructureCatalog {
  public static createModels(): Map<StructureKind, HashTableModel> {
    const models = new Map<StructureKind, HashTableModel>()
    for (const definition of HashStructureDefinitions.structures) models.set(definition.kind, this.createDefault(definition.kind)!)
    return models
  }
  public static createDefault(kind: StructureKind): HashTableModel | null {
    switch (kind) {
      case 'open-addressing-hash-table': return OpenAddressingHashTable.createDefault()
      case 'separate-chaining-hash-table': return SeparateChainingHashTable.createDefault()
      case 'robin-hood-hash-table': return RobinHoodHashTable.createDefault()
      case 'cuckoo-hash-table': return CuckooHashTable.createDefault()
      case 'hopscotch-hashing': return HopscotchHashing.createDefault()
      case 'extendible-hashing': return ExtendibleHashing.createDefault()
      case 'linear-hashing': return LinearHashing.createDefault()
      case 'perfect-hash-table': return PerfectHashTable.createDefault()
      case 'consistent-hashing-ring': return ConsistentHashingRing.createDefault()
      default: return null
    }
  }
  public static createScene(model: HashTableModel, frame: LinearFrame = {}): Scene {
    switch (model.kind) {
      case 'open-addressing-hash-table': return new OpenAddressingHashTableLayout().create(model, frame)
      case 'separate-chaining-hash-table': return new SeparateChainingHashTableLayout().create(model, frame)
      case 'robin-hood-hash-table': return new RobinHoodHashTableLayout().create(model, frame)
      case 'cuckoo-hash-table': return new CuckooHashTableLayout().create(model, frame)
      case 'hopscotch-hashing': return new HopscotchHashingLayout().create(model, frame)
      case 'extendible-hashing': return new ExtendibleHashingLayout().create(model, frame)
      case 'linear-hashing': return new LinearHashingLayout().create(model, frame)
      case 'perfect-hash-table': return new PerfectHashTableLayout().create(model, frame)
      case 'consistent-hashing-ring': return new ConsistentHashingRingLayout().create(model, frame)
      default: throw new RangeError('Unknown hash structure')
    }
  }
}
