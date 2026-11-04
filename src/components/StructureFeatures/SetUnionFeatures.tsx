import type { ReactNode } from 'react'
import type { ActionKind } from '../../visualization/ActionCatalog.ts'
import type { AlgorithmInformation } from '../../visualization/AlgorithmInformation.ts'
import type { LinearModel } from '../../visualization/LinearModel.ts'
import type { StructuredLinearActionProps } from '../ActionPlayback/StructuredLinearAction.tsx'
import { Multiset } from '../FundamentalDataStructures/SetUnion/Multiset/Multiset.ts'
import DisjointSetMakeSet from '../FundamentalDataStructures/SetUnion/DisjointSet/MakeSet/MakeSet.tsx'
import { MakeSetAnimation as DisjointSetMakeSetSequence } from '../FundamentalDataStructures/SetUnion/DisjointSet/MakeSet/MakeSetAnimation.ts'
import DisjointSetFindRepresentative from '../FundamentalDataStructures/SetUnion/DisjointSet/FindRepresentative/FindRepresentative.tsx'
import { FindRepresentativeAnimation as DisjointSetFindRepresentativeSequence } from '../FundamentalDataStructures/SetUnion/DisjointSet/FindRepresentative/FindRepresentativeAnimation.ts'
import DisjointSetUnion from '../FundamentalDataStructures/SetUnion/DisjointSet/Union/Union.tsx'
import { UnionAnimation as DisjointSetUnionSequence } from '../FundamentalDataStructures/SetUnion/DisjointSet/Union/UnionAnimation.ts'
import DisjointSetConnected from '../FundamentalDataStructures/SetUnion/DisjointSet/Connected/Connected.tsx'
import { ConnectedAnimation as DisjointSetConnectedSequence } from '../FundamentalDataStructures/SetUnion/DisjointSet/Connected/ConnectedAnimation.ts'
import DisjointSetClear from '../FundamentalDataStructures/SetUnion/DisjointSet/Clear/Clear.tsx'
import { ClearAnimation as DisjointSetClearSequence } from '../FundamentalDataStructures/SetUnion/DisjointSet/Clear/ClearAnimation.ts'
import OrderedSetAdd from '../FundamentalDataStructures/SetUnion/OrderedSet/Add/Add.tsx'
import { AddAnimation as OrderedSetAddSequence } from '../FundamentalDataStructures/SetUnion/OrderedSet/Add/AddAnimation.ts'
import OrderedSetContains from '../FundamentalDataStructures/SetUnion/OrderedSet/Contains/Contains.tsx'
import { ContainsAnimation as OrderedSetContainsSequence } from '../FundamentalDataStructures/SetUnion/OrderedSet/Contains/ContainsAnimation.ts'
import OrderedSetLowerBound from '../FundamentalDataStructures/SetUnion/OrderedSet/LowerBound/LowerBound.tsx'
import { LowerBoundAnimation as OrderedSetLowerBoundSequence } from '../FundamentalDataStructures/SetUnion/OrderedSet/LowerBound/LowerBoundAnimation.ts'
import OrderedSetRemove from '../FundamentalDataStructures/SetUnion/OrderedSet/Remove/Remove.tsx'
import { RemoveAnimation as OrderedSetRemoveSequence } from '../FundamentalDataStructures/SetUnion/OrderedSet/Remove/RemoveAnimation.ts'
import OrderedSetClear from '../FundamentalDataStructures/SetUnion/OrderedSet/Clear/Clear.tsx'
import { ClearAnimation as OrderedSetClearSequence } from '../FundamentalDataStructures/SetUnion/OrderedSet/Clear/ClearAnimation.ts'
import MultisetAdd from '../FundamentalDataStructures/SetUnion/Multiset/Add/Add.tsx'
import { AddAnimation as MultisetAddSequence } from '../FundamentalDataStructures/SetUnion/Multiset/Add/AddAnimation.ts'
import MultisetCount from '../FundamentalDataStructures/SetUnion/Multiset/Count/Count.tsx'
import { CountAnimation as MultisetCountSequence } from '../FundamentalDataStructures/SetUnion/Multiset/Count/CountAnimation.ts'
import MultisetRemoveOne from '../FundamentalDataStructures/SetUnion/Multiset/RemoveOne/RemoveOne.tsx'
import { RemoveOneAnimation as MultisetRemoveOneSequence } from '../FundamentalDataStructures/SetUnion/Multiset/RemoveOne/RemoveOneAnimation.ts'
import MultisetClear from '../FundamentalDataStructures/SetUnion/Multiset/Clear/Clear.tsx'
import { ClearAnimation as MultisetClearSequence } from '../FundamentalDataStructures/SetUnion/Multiset/Clear/ClearAnimation.ts'
import IntervalSetAddInterval from '../AdvancedDataStructures/RangeQueries/IntervalSet/AddInterval/AddInterval.tsx'
import { AddIntervalAnimation as IntervalSetAddIntervalSequence } from '../AdvancedDataStructures/RangeQueries/IntervalSet/AddInterval/AddIntervalAnimation.ts'
import IntervalSetSubtractInterval from '../AdvancedDataStructures/RangeQueries/IntervalSet/SubtractInterval/SubtractInterval.tsx'
import { SubtractIntervalAnimation as IntervalSetSubtractIntervalSequence } from '../AdvancedDataStructures/RangeQueries/IntervalSet/SubtractInterval/SubtractIntervalAnimation.ts'
import IntervalSetContains from '../AdvancedDataStructures/RangeQueries/IntervalSet/Contains/Contains.tsx'
import { ContainsAnimation as IntervalSetContainsSequence } from '../AdvancedDataStructures/RangeQueries/IntervalSet/Contains/ContainsAnimation.ts'
import IntervalSetIntersection from '../AdvancedDataStructures/RangeQueries/IntervalSet/Intersection/Intersection.tsx'
import { IntersectionAnimation as IntervalSetIntersectionSequence } from '../AdvancedDataStructures/RangeQueries/IntervalSet/Intersection/IntersectionAnimation.ts'
import IntervalSetClear from '../AdvancedDataStructures/RangeQueries/IntervalSet/Clear/Clear.tsx'
import { ClearAnimation as IntervalSetClearSequence } from '../AdvancedDataStructures/RangeQueries/IntervalSet/Clear/ClearAnimation.ts'

export class SetUnionFeatures {
  public static render(action: ActionKind, props: StructuredLinearActionProps, session: number): ReactNode {
    switch (props.model.kind) {
      case 'disjoint-set':
        switch (action) {
          case 'insert': return <DisjointSetMakeSet key={session} {...props} />
          case 'find-set': return <DisjointSetFindRepresentative key={session} {...props} />
          case 'union': return <DisjointSetUnion key={session} {...props} />
          case 'connected': return <DisjointSetConnected key={session} {...props} />
          case 'clear': return <DisjointSetClear key={session} {...props} />
        }
        break
      case 'ordered-set':
        switch (action) {
          case 'insert': return <OrderedSetAdd key={session} {...props} />
          case 'search-value': return <OrderedSetContains key={session} {...props} />
          case 'lower-bound': return <OrderedSetLowerBound key={session} {...props} />
          case 'delete-value': return <OrderedSetRemove key={session} {...props} />
          case 'clear': return <OrderedSetClear key={session} {...props} />
        }
        break
      case 'multiset':
        switch (action) {
          case 'insert': return <MultisetAdd key={session} {...props} />
          case 'count-value': return <MultisetCount key={session} {...props} />
          case 'delete-value': return <MultisetRemoveOne key={session} {...props} />
          case 'clear': return <MultisetClear key={session} {...props} />
        }
        break
      case 'interval-set':
        switch (action) {
          case 'insert': return <IntervalSetAddInterval key={session} {...props} />
          case 'delete-value': return <IntervalSetSubtractInterval key={session} {...props} />
          case 'search-value': return <IntervalSetContains key={session} {...props} />
          case 'search-overlap': return <IntervalSetIntersection key={session} {...props} />
          case 'clear': return <IntervalSetClear key={session} {...props} />
        }
        break
    }
    return null
  }

  public static describe(action: ActionKind, model: LinearModel): AlgorithmInformation | null {
    const size = model instanceof Multiset ? model.distinctCount : model.length
    switch (model.kind) {
      case 'disjoint-set':
        switch (action) {
          case 'insert': return DisjointSetMakeSetSequence.describe(size)
          case 'find-set': return DisjointSetFindRepresentativeSequence.describe(size)
          case 'union': return DisjointSetUnionSequence.describe(size)
          case 'connected': return DisjointSetConnectedSequence.describe(size)
          case 'clear': return DisjointSetClearSequence.describe(size)
        }
        break
      case 'ordered-set':
        switch (action) {
          case 'insert': return OrderedSetAddSequence.describe(size)
          case 'search-value': return OrderedSetContainsSequence.describe(size)
          case 'lower-bound': return OrderedSetLowerBoundSequence.describe(size)
          case 'delete-value': return OrderedSetRemoveSequence.describe(size)
          case 'clear': return OrderedSetClearSequence.describe(size)
        }
        break
      case 'multiset':
        switch (action) {
          case 'insert': return MultisetAddSequence.describe(size)
          case 'count-value': return MultisetCountSequence.describe(size)
          case 'delete-value': return MultisetRemoveOneSequence.describe(size)
          case 'clear': return MultisetClearSequence.describe(size)
        }
        break
      case 'interval-set':
        switch (action) {
          case 'insert': return IntervalSetAddIntervalSequence.describe(size)
          case 'delete-value': return IntervalSetSubtractIntervalSequence.describe(size)
          case 'search-value': return IntervalSetContainsSequence.describe(size)
          case 'search-overlap': return IntervalSetIntersectionSequence.describe(size)
          case 'clear': return IntervalSetClearSequence.describe(size)
        }
        break
    }
    return null
  }
}
