import type { ReactNode } from 'react'
import type { ActionKind } from '../../../visualization/ActionCatalog.ts'
import type { AlgorithmInformation } from '../../../visualization/AlgorithmInformation.ts'
import type { LinearModel } from '../../../visualization/LinearModel.ts'
import type { StructuredLinearActionProps } from '../../ActionPlayback/StructuredLinearAction.tsx'
import { Multiset } from './Multiset/Multiset.ts'
import DisjointSetMakeSet from './DisjointSet/MakeSet/MakeSet.tsx'
import { MakeSetAnimation as DisjointSetMakeSetSequence } from './DisjointSet/MakeSet/MakeSetAnimation.ts'
import DisjointSetFindRepresentative from './DisjointSet/FindRepresentative/FindRepresentative.tsx'
import { FindRepresentativeAnimation as DisjointSetFindRepresentativeSequence } from './DisjointSet/FindRepresentative/FindRepresentativeAnimation.ts'
import DisjointSetUnion from './DisjointSet/Union/Union.tsx'
import { UnionAnimation as DisjointSetUnionSequence } from './DisjointSet/Union/UnionAnimation.ts'
import DisjointSetConnected from './DisjointSet/Connected/Connected.tsx'
import { ConnectedAnimation as DisjointSetConnectedSequence } from './DisjointSet/Connected/ConnectedAnimation.ts'
import DisjointSetClear from './DisjointSet/Clear/Clear.tsx'
import { ClearAnimation as DisjointSetClearSequence } from './DisjointSet/Clear/ClearAnimation.ts'
import OrderedSetAdd from './OrderedSet/Add/Add.tsx'
import { AddAnimation as OrderedSetAddSequence } from './OrderedSet/Add/AddAnimation.ts'
import OrderedSetContains from './OrderedSet/Contains/Contains.tsx'
import { ContainsAnimation as OrderedSetContainsSequence } from './OrderedSet/Contains/ContainsAnimation.ts'
import OrderedSetLowerBound from './OrderedSet/LowerBound/LowerBound.tsx'
import { LowerBoundAnimation as OrderedSetLowerBoundSequence } from './OrderedSet/LowerBound/LowerBoundAnimation.ts'
import OrderedSetRemove from './OrderedSet/Remove/Remove.tsx'
import { RemoveAnimation as OrderedSetRemoveSequence } from './OrderedSet/Remove/RemoveAnimation.ts'
import OrderedSetClear from './OrderedSet/Clear/Clear.tsx'
import { ClearAnimation as OrderedSetClearSequence } from './OrderedSet/Clear/ClearAnimation.ts'
import MultisetAdd from './Multiset/Add/Add.tsx'
import { AddAnimation as MultisetAddSequence } from './Multiset/Add/AddAnimation.ts'
import MultisetCount from './Multiset/Count/Count.tsx'
import { CountAnimation as MultisetCountSequence } from './Multiset/Count/CountAnimation.ts'
import MultisetRemoveOne from './Multiset/RemoveOne/RemoveOne.tsx'
import { RemoveOneAnimation as MultisetRemoveOneSequence } from './Multiset/RemoveOne/RemoveOneAnimation.ts'
import MultisetClear from './Multiset/Clear/Clear.tsx'
import { ClearAnimation as MultisetClearSequence } from './Multiset/Clear/ClearAnimation.ts'
import IntervalSetAddInterval from './IntervalSet/AddInterval/AddInterval.tsx'
import { AddIntervalAnimation as IntervalSetAddIntervalSequence } from './IntervalSet/AddInterval/AddIntervalAnimation.ts'
import IntervalSetSubtractInterval from './IntervalSet/SubtractInterval/SubtractInterval.tsx'
import { SubtractIntervalAnimation as IntervalSetSubtractIntervalSequence } from './IntervalSet/SubtractInterval/SubtractIntervalAnimation.ts'
import IntervalSetContains from './IntervalSet/Contains/Contains.tsx'
import { ContainsAnimation as IntervalSetContainsSequence } from './IntervalSet/Contains/ContainsAnimation.ts'
import IntervalSetIntersection from './IntervalSet/Intersection/Intersection.tsx'
import { IntersectionAnimation as IntervalSetIntersectionSequence } from './IntervalSet/Intersection/IntersectionAnimation.ts'
import IntervalSetClear from './IntervalSet/Clear/Clear.tsx'
import { ClearAnimation as IntervalSetClearSequence } from './IntervalSet/Clear/ClearAnimation.ts'

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
