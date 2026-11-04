import type { StructureKind, Scene } from './Scene.ts'
import type { LinearFrame } from './LinearModel.ts'
import type { HashTableModel } from './HashTableModel.ts'
import { HashStructureDefinitions } from './HashStructureDefinitions.ts'
import { OpenAddressingHashTable } from '../components/FundamentalDataStructures/HashBased/OpenAddressingHashTable/OpenAddressingHashTable.ts'
import { OpenAddressingHashTableLayout } from '../components/FundamentalDataStructures/HashBased/OpenAddressingHashTable/OpenAddressingHashTableLayout.ts'
import { SeparateChainingHashTable } from '../components/FundamentalDataStructures/HashBased/SeparateChainingHashTable/SeparateChainingHashTable.ts'
import { SeparateChainingHashTableLayout } from '../components/FundamentalDataStructures/HashBased/SeparateChainingHashTable/SeparateChainingHashTableLayout.ts'
import { RobinHoodHashTable } from '../components/AdvancedDataStructures/Hashing/RobinHoodHashTable/RobinHoodHashTable.ts'
import { RobinHoodHashTableLayout } from '../components/AdvancedDataStructures/Hashing/RobinHoodHashTable/RobinHoodHashTableLayout.ts'
import { CuckooHashTable } from '../components/AdvancedDataStructures/Hashing/CuckooHashTable/CuckooHashTable.ts'
import { CuckooHashTableLayout } from '../components/AdvancedDataStructures/Hashing/CuckooHashTable/CuckooHashTableLayout.ts'
import { HopscotchHashing } from '../components/AdvancedDataStructures/Hashing/HopscotchHashing/HopscotchHashing.ts'
import { HopscotchHashingLayout } from '../components/AdvancedDataStructures/Hashing/HopscotchHashing/HopscotchHashingLayout.ts'
import { ExtendibleHashing } from '../components/AdvancedDataStructures/Hashing/ExtendibleHashing/ExtendibleHashing.ts'
import { ExtendibleHashingLayout } from '../components/AdvancedDataStructures/Hashing/ExtendibleHashing/ExtendibleHashingLayout.ts'
import { LinearHashing } from '../components/AdvancedDataStructures/Hashing/LinearHashing/LinearHashing.ts'
import { LinearHashingLayout } from '../components/AdvancedDataStructures/Hashing/LinearHashing/LinearHashingLayout.ts'
import { PerfectHashTable } from '../components/AdvancedDataStructures/Hashing/PerfectHashTable/PerfectHashTable.ts'
import { PerfectHashTableLayout } from '../components/AdvancedDataStructures/Hashing/PerfectHashTable/PerfectHashTableLayout.ts'
import { ConsistentHashingRing } from '../components/AdvancedDataStructures/Hashing/ConsistentHashingRing/ConsistentHashingRing.ts'
import { ConsistentHashingRingLayout } from '../components/AdvancedDataStructures/Hashing/ConsistentHashingRing/ConsistentHashingRingLayout.ts'

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
