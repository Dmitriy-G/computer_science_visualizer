import type { ReactNode } from 'react'
import type { ActionKind } from '../../visualization/ActionCatalog.ts'
import type { AlgorithmInformation } from '../../visualization/AlgorithmInformation.ts'
import type { LinearModel } from '../../visualization/LinearModel.ts'
import type { StructuredLinearActionProps } from '../ActionPlayback/StructuredLinearAction.tsx'
import CountingBloomFilterAdd from '../AdvancedDataStructures/Probabilistic/CountingBloomFilter/Add/Add.tsx'
import { AddAnimation as CountingBloomFilterAddSequence } from '../AdvancedDataStructures/Probabilistic/CountingBloomFilter/Add/AddAnimation.ts'
import CountingBloomFilterCheckMembership from '../AdvancedDataStructures/Probabilistic/CountingBloomFilter/CheckMembership/CheckMembership.tsx'
import { CheckMembershipAnimation as CountingBloomFilterCheckMembershipSequence } from '../AdvancedDataStructures/Probabilistic/CountingBloomFilter/CheckMembership/CheckMembershipAnimation.ts'
import CountingBloomFilterRemove from '../AdvancedDataStructures/Probabilistic/CountingBloomFilter/Remove/Remove.tsx'
import { RemoveAnimation as CountingBloomFilterRemoveSequence } from '../AdvancedDataStructures/Probabilistic/CountingBloomFilter/Remove/RemoveAnimation.ts'
import CountingBloomFilterClear from '../AdvancedDataStructures/Probabilistic/CountingBloomFilter/Clear/Clear.tsx'
import { ClearAnimation as CountingBloomFilterClearSequence } from '../AdvancedDataStructures/Probabilistic/CountingBloomFilter/Clear/ClearAnimation.ts'
import CuckooFilterAdd from '../AdvancedDataStructures/Probabilistic/CuckooFilter/Add/Add.tsx'
import { AddAnimation as CuckooFilterAddSequence } from '../AdvancedDataStructures/Probabilistic/CuckooFilter/Add/AddAnimation.ts'
import CuckooFilterCheckMembership from '../AdvancedDataStructures/Probabilistic/CuckooFilter/CheckMembership/CheckMembership.tsx'
import { CheckMembershipAnimation as CuckooFilterCheckMembershipSequence } from '../AdvancedDataStructures/Probabilistic/CuckooFilter/CheckMembership/CheckMembershipAnimation.ts'
import CuckooFilterRemove from '../AdvancedDataStructures/Probabilistic/CuckooFilter/Remove/Remove.tsx'
import { RemoveAnimation as CuckooFilterRemoveSequence } from '../AdvancedDataStructures/Probabilistic/CuckooFilter/Remove/RemoveAnimation.ts'
import CuckooFilterClear from '../AdvancedDataStructures/Probabilistic/CuckooFilter/Clear/Clear.tsx'
import { ClearAnimation as CuckooFilterClearSequence } from '../AdvancedDataStructures/Probabilistic/CuckooFilter/Clear/ClearAnimation.ts'
import QuotientFilterAdd from '../AdvancedDataStructures/Probabilistic/QuotientFilter/Add/Add.tsx'
import { AddAnimation as QuotientFilterAddSequence } from '../AdvancedDataStructures/Probabilistic/QuotientFilter/Add/AddAnimation.ts'
import QuotientFilterCheckMembership from '../AdvancedDataStructures/Probabilistic/QuotientFilter/CheckMembership/CheckMembership.tsx'
import { CheckMembershipAnimation as QuotientFilterCheckMembershipSequence } from '../AdvancedDataStructures/Probabilistic/QuotientFilter/CheckMembership/CheckMembershipAnimation.ts'
import QuotientFilterClear from '../AdvancedDataStructures/Probabilistic/QuotientFilter/Clear/Clear.tsx'
import { ClearAnimation as QuotientFilterClearSequence } from '../AdvancedDataStructures/Probabilistic/QuotientFilter/Clear/ClearAnimation.ts'
import CountMinSketchAdd from '../AdvancedDataStructures/Probabilistic/CountMinSketch/Add/Add.tsx'
import { AddAnimation as CountMinSketchAddSequence } from '../AdvancedDataStructures/Probabilistic/CountMinSketch/Add/AddAnimation.ts'
import CountMinSketchEstimateFrequency from '../AdvancedDataStructures/Probabilistic/CountMinSketch/EstimateFrequency/EstimateFrequency.tsx'
import { EstimateFrequencyAnimation as CountMinSketchEstimateFrequencySequence } from '../AdvancedDataStructures/Probabilistic/CountMinSketch/EstimateFrequency/EstimateFrequencyAnimation.ts'
import CountMinSketchClear from '../AdvancedDataStructures/Probabilistic/CountMinSketch/Clear/Clear.tsx'
import { ClearAnimation as CountMinSketchClearSequence } from '../AdvancedDataStructures/Probabilistic/CountMinSketch/Clear/ClearAnimation.ts'
import HyperLogLogAdd from '../AdvancedDataStructures/Probabilistic/HyperLogLog/Add/Add.tsx'
import { AddAnimation as HyperLogLogAddSequence } from '../AdvancedDataStructures/Probabilistic/HyperLogLog/Add/AddAnimation.ts'
import HyperLogLogEstimateCardinality from '../AdvancedDataStructures/Probabilistic/HyperLogLog/EstimateCardinality/EstimateCardinality.tsx'
import { EstimateCardinalityAnimation as HyperLogLogEstimateCardinalitySequence } from '../AdvancedDataStructures/Probabilistic/HyperLogLog/EstimateCardinality/EstimateCardinalityAnimation.ts'
import HyperLogLogClear from '../AdvancedDataStructures/Probabilistic/HyperLogLog/Clear/Clear.tsx'
import { ClearAnimation as HyperLogLogClearSequence } from '../AdvancedDataStructures/Probabilistic/HyperLogLog/Clear/ClearAnimation.ts'
import ReservoirSamplingBufferObserve from '../AdvancedDataStructures/Probabilistic/ReservoirSamplingBuffer/Observe/Observe.tsx'
import { ObserveAnimation as ReservoirSamplingBufferObserveSequence } from '../AdvancedDataStructures/Probabilistic/ReservoirSamplingBuffer/Observe/ObserveAnimation.ts'
import ReservoirSamplingBufferInspectSample from '../AdvancedDataStructures/Probabilistic/ReservoirSamplingBuffer/InspectSample/InspectSample.tsx'
import { InspectSampleAnimation as ReservoirSamplingBufferInspectSampleSequence } from '../AdvancedDataStructures/Probabilistic/ReservoirSamplingBuffer/InspectSample/InspectSampleAnimation.ts'
import ReservoirSamplingBufferClear from '../AdvancedDataStructures/Probabilistic/ReservoirSamplingBuffer/Clear/Clear.tsx'
import { ClearAnimation as ReservoirSamplingBufferClearSequence } from '../AdvancedDataStructures/Probabilistic/ReservoirSamplingBuffer/Clear/ClearAnimation.ts'

export class ProbabilisticFeatures {
  public static render(action: ActionKind, props: StructuredLinearActionProps, session: number): ReactNode {
    switch (props.model.kind) {
      case 'counting-bloom-filter':
        switch (action) {
          case 'insert': return <CountingBloomFilterAdd key={session} {...props} />
          case 'search-value': return <CountingBloomFilterCheckMembership key={session} {...props} />
          case 'delete-value': return <CountingBloomFilterRemove key={session} {...props} />
          case 'clear': return <CountingBloomFilterClear key={session} {...props} />
        }
        break
      case 'cuckoo-filter':
        switch (action) {
          case 'insert': return <CuckooFilterAdd key={session} {...props} />
          case 'search-value': return <CuckooFilterCheckMembership key={session} {...props} />
          case 'delete-value': return <CuckooFilterRemove key={session} {...props} />
          case 'clear': return <CuckooFilterClear key={session} {...props} />
        }
        break
      case 'quotient-filter':
        switch (action) {
          case 'insert': return <QuotientFilterAdd key={session} {...props} />
          case 'search-value': return <QuotientFilterCheckMembership key={session} {...props} />
          case 'clear': return <QuotientFilterClear key={session} {...props} />
        }
        break
      case 'count-min-sketch':
        switch (action) {
          case 'insert': return <CountMinSketchAdd key={session} {...props} />
          case 'search-value': return <CountMinSketchEstimateFrequency key={session} {...props} />
          case 'clear': return <CountMinSketchClear key={session} {...props} />
        }
        break
      case 'hyperloglog':
        switch (action) {
          case 'insert': return <HyperLogLogAdd key={session} {...props} />
          case 'estimate-cardinality': return <HyperLogLogEstimateCardinality key={session} {...props} />
          case 'clear': return <HyperLogLogClear key={session} {...props} />
        }
        break
      case 'reservoir-sampling-buffer':
        switch (action) {
          case 'insert': return <ReservoirSamplingBufferObserve key={session} {...props} />
          case 'inspect-storage': return <ReservoirSamplingBufferInspectSample key={session} {...props} />
          case 'clear': return <ReservoirSamplingBufferClear key={session} {...props} />
        }
        break
    }
    return null
  }

  public static describe(action: ActionKind, model: LinearModel): AlgorithmInformation | null {
    switch (model.kind) {
      case 'counting-bloom-filter':
        switch (action) {
          case 'insert': return CountingBloomFilterAddSequence.describe(model.length)
          case 'search-value': return CountingBloomFilterCheckMembershipSequence.describe(model.length)
          case 'delete-value': return CountingBloomFilterRemoveSequence.describe(model.length)
          case 'clear': return CountingBloomFilterClearSequence.describe(model.length)
        }
        break
      case 'cuckoo-filter':
        switch (action) {
          case 'insert': return CuckooFilterAddSequence.describe(model.length)
          case 'search-value': return CuckooFilterCheckMembershipSequence.describe(model.length)
          case 'delete-value': return CuckooFilterRemoveSequence.describe(model.length)
          case 'clear': return CuckooFilterClearSequence.describe(model.length)
        }
        break
      case 'quotient-filter':
        switch (action) {
          case 'insert': return QuotientFilterAddSequence.describe(model.length)
          case 'search-value': return QuotientFilterCheckMembershipSequence.describe(model.length)
          case 'clear': return QuotientFilterClearSequence.describe(model.length)
        }
        break
      case 'count-min-sketch':
        switch (action) {
          case 'insert': return CountMinSketchAddSequence.describe(model.length)
          case 'search-value': return CountMinSketchEstimateFrequencySequence.describe(model.length)
          case 'clear': return CountMinSketchClearSequence.describe(model.length)
        }
        break
      case 'hyperloglog':
        switch (action) {
          case 'insert': return HyperLogLogAddSequence.describe(model.length)
          case 'estimate-cardinality': return HyperLogLogEstimateCardinalitySequence.describe(model.length)
          case 'clear': return HyperLogLogClearSequence.describe(model.length)
        }
        break
      case 'reservoir-sampling-buffer':
        switch (action) {
          case 'insert': return ReservoirSamplingBufferObserveSequence.describe(model.length)
          case 'inspect-storage': return ReservoirSamplingBufferInspectSampleSequence.describe(model.length)
          case 'clear': return ReservoirSamplingBufferClearSequence.describe(model.length)
        }
        break
    }
    return null
  }
}
