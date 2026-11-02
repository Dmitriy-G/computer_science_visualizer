import type { ReactNode } from 'react'
import type { ActionKind } from '../../../visualization/ActionCatalog.ts'
import type { AlgorithmInformation } from '../../../visualization/AlgorithmInformation.ts'
import type { StructuredLinearActionProps } from '../../ActionPlayback/StructuredLinearAction.tsx'
import OpenAddressingHashTableInsert from './OpenAddressingHashTable/Insert/Insert.tsx'
import { InsertAnimation as OpenAddressingHashTableInsertSequence } from './OpenAddressingHashTable/Insert/InsertAnimation.ts'
import OpenAddressingHashTableSearchByKey from './OpenAddressingHashTable/SearchByKey/SearchByKey.tsx'
import { SearchByKeyAnimation as OpenAddressingHashTableSearchByKeySequence } from './OpenAddressingHashTable/SearchByKey/SearchByKeyAnimation.ts'
import OpenAddressingHashTableDeleteByKey from './OpenAddressingHashTable/DeleteByKey/DeleteByKey.tsx'
import { DeleteByKeyAnimation as OpenAddressingHashTableDeleteByKeySequence } from './OpenAddressingHashTable/DeleteByKey/DeleteByKeyAnimation.ts'
import OpenAddressingHashTableClear from './OpenAddressingHashTable/Clear/Clear.tsx'
import { ClearAnimation as OpenAddressingHashTableClearSequence } from './OpenAddressingHashTable/Clear/ClearAnimation.ts'
import SeparateChainingHashTableInsert from './SeparateChainingHashTable/Insert/Insert.tsx'
import { InsertAnimation as SeparateChainingHashTableInsertSequence } from './SeparateChainingHashTable/Insert/InsertAnimation.ts'
import SeparateChainingHashTableSearchByKey from './SeparateChainingHashTable/SearchByKey/SearchByKey.tsx'
import { SearchByKeyAnimation as SeparateChainingHashTableSearchByKeySequence } from './SeparateChainingHashTable/SearchByKey/SearchByKeyAnimation.ts'
import SeparateChainingHashTableDeleteByKey from './SeparateChainingHashTable/DeleteByKey/DeleteByKey.tsx'
import { DeleteByKeyAnimation as SeparateChainingHashTableDeleteByKeySequence } from './SeparateChainingHashTable/DeleteByKey/DeleteByKeyAnimation.ts'
import SeparateChainingHashTableClear from './SeparateChainingHashTable/Clear/Clear.tsx'
import { ClearAnimation as SeparateChainingHashTableClearSequence } from './SeparateChainingHashTable/Clear/ClearAnimation.ts'
import RobinHoodHashTableInsert from './RobinHoodHashTable/Insert/Insert.tsx'
import { InsertAnimation as RobinHoodHashTableInsertSequence } from './RobinHoodHashTable/Insert/InsertAnimation.ts'
import RobinHoodHashTableSearchByKey from './RobinHoodHashTable/SearchByKey/SearchByKey.tsx'
import { SearchByKeyAnimation as RobinHoodHashTableSearchByKeySequence } from './RobinHoodHashTable/SearchByKey/SearchByKeyAnimation.ts'
import RobinHoodHashTableDeleteByKey from './RobinHoodHashTable/DeleteByKey/DeleteByKey.tsx'
import { DeleteByKeyAnimation as RobinHoodHashTableDeleteByKeySequence } from './RobinHoodHashTable/DeleteByKey/DeleteByKeyAnimation.ts'
import RobinHoodHashTableClear from './RobinHoodHashTable/Clear/Clear.tsx'
import { ClearAnimation as RobinHoodHashTableClearSequence } from './RobinHoodHashTable/Clear/ClearAnimation.ts'
import CuckooHashTableInsert from './CuckooHashTable/Insert/Insert.tsx'
import { InsertAnimation as CuckooHashTableInsertSequence } from './CuckooHashTable/Insert/InsertAnimation.ts'
import CuckooHashTableSearchByKey from './CuckooHashTable/SearchByKey/SearchByKey.tsx'
import { SearchByKeyAnimation as CuckooHashTableSearchByKeySequence } from './CuckooHashTable/SearchByKey/SearchByKeyAnimation.ts'
import CuckooHashTableDeleteByKey from './CuckooHashTable/DeleteByKey/DeleteByKey.tsx'
import { DeleteByKeyAnimation as CuckooHashTableDeleteByKeySequence } from './CuckooHashTable/DeleteByKey/DeleteByKeyAnimation.ts'
import CuckooHashTableClear from './CuckooHashTable/Clear/Clear.tsx'
import { ClearAnimation as CuckooHashTableClearSequence } from './CuckooHashTable/Clear/ClearAnimation.ts'
import HopscotchHashingInsert from './HopscotchHashing/Insert/Insert.tsx'
import { InsertAnimation as HopscotchHashingInsertSequence } from './HopscotchHashing/Insert/InsertAnimation.ts'
import HopscotchHashingSearchByKey from './HopscotchHashing/SearchByKey/SearchByKey.tsx'
import { SearchByKeyAnimation as HopscotchHashingSearchByKeySequence } from './HopscotchHashing/SearchByKey/SearchByKeyAnimation.ts'
import HopscotchHashingDeleteByKey from './HopscotchHashing/DeleteByKey/DeleteByKey.tsx'
import { DeleteByKeyAnimation as HopscotchHashingDeleteByKeySequence } from './HopscotchHashing/DeleteByKey/DeleteByKeyAnimation.ts'
import HopscotchHashingClear from './HopscotchHashing/Clear/Clear.tsx'
import { ClearAnimation as HopscotchHashingClearSequence } from './HopscotchHashing/Clear/ClearAnimation.ts'
import ExtendibleHashingInsert from './ExtendibleHashing/Insert/Insert.tsx'
import { InsertAnimation as ExtendibleHashingInsertSequence } from './ExtendibleHashing/Insert/InsertAnimation.ts'
import ExtendibleHashingSearchByKey from './ExtendibleHashing/SearchByKey/SearchByKey.tsx'
import { SearchByKeyAnimation as ExtendibleHashingSearchByKeySequence } from './ExtendibleHashing/SearchByKey/SearchByKeyAnimation.ts'
import ExtendibleHashingDeleteByKey from './ExtendibleHashing/DeleteByKey/DeleteByKey.tsx'
import { DeleteByKeyAnimation as ExtendibleHashingDeleteByKeySequence } from './ExtendibleHashing/DeleteByKey/DeleteByKeyAnimation.ts'
import ExtendibleHashingClear from './ExtendibleHashing/Clear/Clear.tsx'
import { ClearAnimation as ExtendibleHashingClearSequence } from './ExtendibleHashing/Clear/ClearAnimation.ts'
import LinearHashingInsert from './LinearHashing/Insert/Insert.tsx'
import { InsertAnimation as LinearHashingInsertSequence } from './LinearHashing/Insert/InsertAnimation.ts'
import LinearHashingSearchByKey from './LinearHashing/SearchByKey/SearchByKey.tsx'
import { SearchByKeyAnimation as LinearHashingSearchByKeySequence } from './LinearHashing/SearchByKey/SearchByKeyAnimation.ts'
import LinearHashingDeleteByKey from './LinearHashing/DeleteByKey/DeleteByKey.tsx'
import { DeleteByKeyAnimation as LinearHashingDeleteByKeySequence } from './LinearHashing/DeleteByKey/DeleteByKeyAnimation.ts'
import LinearHashingClear from './LinearHashing/Clear/Clear.tsx'
import { ClearAnimation as LinearHashingClearSequence } from './LinearHashing/Clear/ClearAnimation.ts'
import PerfectHashTableBuild from './PerfectHashTable/Build/Build.tsx'
import { BuildAnimation as PerfectHashTableBuildSequence } from './PerfectHashTable/Build/BuildAnimation.ts'
import PerfectHashTableSearchByKey from './PerfectHashTable/SearchByKey/SearchByKey.tsx'
import { SearchByKeyAnimation as PerfectHashTableSearchByKeySequence } from './PerfectHashTable/SearchByKey/SearchByKeyAnimation.ts'
import PerfectHashTableClear from './PerfectHashTable/Clear/Clear.tsx'
import { ClearAnimation as PerfectHashTableClearSequence } from './PerfectHashTable/Clear/ClearAnimation.ts'
import ConsistentHashingRingAddServer from './ConsistentHashingRing/AddServer/AddServer.tsx'
import { AddServerAnimation as ConsistentHashingRingAddServerSequence } from './ConsistentHashingRing/AddServer/AddServerAnimation.ts'
import ConsistentHashingRingLocateOwner from './ConsistentHashingRing/LocateOwner/LocateOwner.tsx'
import { LocateOwnerAnimation as ConsistentHashingRingLocateOwnerSequence } from './ConsistentHashingRing/LocateOwner/LocateOwnerAnimation.ts'
import ConsistentHashingRingRemoveServer from './ConsistentHashingRing/RemoveServer/RemoveServer.tsx'
import { RemoveServerAnimation as ConsistentHashingRingRemoveServerSequence } from './ConsistentHashingRing/RemoveServer/RemoveServerAnimation.ts'
import ConsistentHashingRingInspectOwnership from './ConsistentHashingRing/InspectOwnership/InspectOwnership.tsx'
import { InspectOwnershipAnimation as ConsistentHashingRingInspectOwnershipSequence } from './ConsistentHashingRing/InspectOwnership/InspectOwnershipAnimation.ts'
import ConsistentHashingRingClear from './ConsistentHashingRing/Clear/Clear.tsx'
import { ClearAnimation as ConsistentHashingRingClearSequence } from './ConsistentHashingRing/Clear/ClearAnimation.ts'

export class HashFeatures {
  public static render(action: ActionKind, props: StructuredLinearActionProps, session: number): ReactNode {
    switch (props.model.kind) {
      case 'open-addressing-hash-table':
        switch (action) {
          case 'insert': return <OpenAddressingHashTableInsert key={session} {...props} />
          case 'search-value': return <OpenAddressingHashTableSearchByKey key={session} {...props} />
          case 'delete-value': return <OpenAddressingHashTableDeleteByKey key={session} {...props} />
          case 'clear': return <OpenAddressingHashTableClear key={session} {...props} />
        }
        break
      case 'separate-chaining-hash-table':
        switch (action) {
          case 'insert': return <SeparateChainingHashTableInsert key={session} {...props} />
          case 'search-value': return <SeparateChainingHashTableSearchByKey key={session} {...props} />
          case 'delete-value': return <SeparateChainingHashTableDeleteByKey key={session} {...props} />
          case 'clear': return <SeparateChainingHashTableClear key={session} {...props} />
        }
        break
      case 'robin-hood-hash-table':
        switch (action) {
          case 'insert': return <RobinHoodHashTableInsert key={session} {...props} />
          case 'search-value': return <RobinHoodHashTableSearchByKey key={session} {...props} />
          case 'delete-value': return <RobinHoodHashTableDeleteByKey key={session} {...props} />
          case 'clear': return <RobinHoodHashTableClear key={session} {...props} />
        }
        break
      case 'cuckoo-hash-table':
        switch (action) {
          case 'insert': return <CuckooHashTableInsert key={session} {...props} />
          case 'search-value': return <CuckooHashTableSearchByKey key={session} {...props} />
          case 'delete-value': return <CuckooHashTableDeleteByKey key={session} {...props} />
          case 'clear': return <CuckooHashTableClear key={session} {...props} />
        }
        break
      case 'hopscotch-hashing':
        switch (action) {
          case 'insert': return <HopscotchHashingInsert key={session} {...props} />
          case 'search-value': return <HopscotchHashingSearchByKey key={session} {...props} />
          case 'delete-value': return <HopscotchHashingDeleteByKey key={session} {...props} />
          case 'clear': return <HopscotchHashingClear key={session} {...props} />
        }
        break
      case 'extendible-hashing':
        switch (action) {
          case 'insert': return <ExtendibleHashingInsert key={session} {...props} />
          case 'search-value': return <ExtendibleHashingSearchByKey key={session} {...props} />
          case 'delete-value': return <ExtendibleHashingDeleteByKey key={session} {...props} />
          case 'clear': return <ExtendibleHashingClear key={session} {...props} />
        }
        break
      case 'linear-hashing':
        switch (action) {
          case 'insert': return <LinearHashingInsert key={session} {...props} />
          case 'search-value': return <LinearHashingSearchByKey key={session} {...props} />
          case 'delete-value': return <LinearHashingDeleteByKey key={session} {...props} />
          case 'clear': return <LinearHashingClear key={session} {...props} />
        }
        break
      case 'perfect-hash-table':
        switch (action) {
          case 'build-values': return <PerfectHashTableBuild key={session} {...props} />
          case 'search-value': return <PerfectHashTableSearchByKey key={session} {...props} />
          case 'clear': return <PerfectHashTableClear key={session} {...props} />
        }
        break
      case 'consistent-hashing-ring':
        switch (action) {
          case 'insert': return <ConsistentHashingRingAddServer key={session} {...props} />
          case 'search-value': return <ConsistentHashingRingLocateOwner key={session} {...props} />
          case 'delete-value': return <ConsistentHashingRingRemoveServer key={session} {...props} />
          case 'inspect-storage': return <ConsistentHashingRingInspectOwnership key={session} {...props} />
          case 'clear': return <ConsistentHashingRingClear key={session} {...props} />
        }
        break
    }
    return null
  }
  public static describe(action: ActionKind, model: StructuredLinearActionProps['model']): AlgorithmInformation | null {
    switch (model.kind) {
      case 'open-addressing-hash-table':
        switch (action) {
          case 'insert': return OpenAddressingHashTableInsertSequence.describe(model.length)
          case 'search-value': return OpenAddressingHashTableSearchByKeySequence.describe(model.length)
          case 'delete-value': return OpenAddressingHashTableDeleteByKeySequence.describe(model.length)
          case 'clear': return OpenAddressingHashTableClearSequence.describe(model.length)
        }
        break
      case 'separate-chaining-hash-table':
        switch (action) {
          case 'insert': return SeparateChainingHashTableInsertSequence.describe(model.length)
          case 'search-value': return SeparateChainingHashTableSearchByKeySequence.describe(model.length)
          case 'delete-value': return SeparateChainingHashTableDeleteByKeySequence.describe(model.length)
          case 'clear': return SeparateChainingHashTableClearSequence.describe(model.length)
        }
        break
      case 'robin-hood-hash-table':
        switch (action) {
          case 'insert': return RobinHoodHashTableInsertSequence.describe(model.length)
          case 'search-value': return RobinHoodHashTableSearchByKeySequence.describe(model.length)
          case 'delete-value': return RobinHoodHashTableDeleteByKeySequence.describe(model.length)
          case 'clear': return RobinHoodHashTableClearSequence.describe(model.length)
        }
        break
      case 'cuckoo-hash-table':
        switch (action) {
          case 'insert': return CuckooHashTableInsertSequence.describe(model.length)
          case 'search-value': return CuckooHashTableSearchByKeySequence.describe(model.length)
          case 'delete-value': return CuckooHashTableDeleteByKeySequence.describe(model.length)
          case 'clear': return CuckooHashTableClearSequence.describe(model.length)
        }
        break
      case 'hopscotch-hashing':
        switch (action) {
          case 'insert': return HopscotchHashingInsertSequence.describe(model.length)
          case 'search-value': return HopscotchHashingSearchByKeySequence.describe(model.length)
          case 'delete-value': return HopscotchHashingDeleteByKeySequence.describe(model.length)
          case 'clear': return HopscotchHashingClearSequence.describe(model.length)
        }
        break
      case 'extendible-hashing':
        switch (action) {
          case 'insert': return ExtendibleHashingInsertSequence.describe(model.length)
          case 'search-value': return ExtendibleHashingSearchByKeySequence.describe(model.length)
          case 'delete-value': return ExtendibleHashingDeleteByKeySequence.describe(model.length)
          case 'clear': return ExtendibleHashingClearSequence.describe(model.length)
        }
        break
      case 'linear-hashing':
        switch (action) {
          case 'insert': return LinearHashingInsertSequence.describe(model.length)
          case 'search-value': return LinearHashingSearchByKeySequence.describe(model.length)
          case 'delete-value': return LinearHashingDeleteByKeySequence.describe(model.length)
          case 'clear': return LinearHashingClearSequence.describe(model.length)
        }
        break
      case 'perfect-hash-table':
        switch (action) {
          case 'build-values': return PerfectHashTableBuildSequence.describe(model.length)
          case 'search-value': return PerfectHashTableSearchByKeySequence.describe(model.length)
          case 'clear': return PerfectHashTableClearSequence.describe(model.length)
        }
        break
      case 'consistent-hashing-ring':
        switch (action) {
          case 'insert': return ConsistentHashingRingAddServerSequence.describe(model.length)
          case 'search-value': return ConsistentHashingRingLocateOwnerSequence.describe(model.length)
          case 'delete-value': return ConsistentHashingRingRemoveServerSequence.describe(model.length)
          case 'inspect-storage': return ConsistentHashingRingInspectOwnershipSequence.describe(model.length)
          case 'clear': return ConsistentHashingRingClearSequence.describe(model.length)
        }
        break
    }
    return null
  }
}
