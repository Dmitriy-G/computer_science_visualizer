import type { StructureKind, Scene } from './Scene.ts'
import type { LinearFrame } from './LinearModel.ts'
import type { ProbabilisticModel } from '../components/AdvancedDataStructures/Probabilistic/ProbabilisticModel.ts'
import { ProbabilisticStructureDefinitions } from './ProbabilisticStructureDefinitions.ts'
import { CountingBloomFilter } from '../components/AdvancedDataStructures/Probabilistic/CountingBloomFilter/CountingBloomFilter.ts'
import { CountingBloomFilterLayout } from '../components/AdvancedDataStructures/Probabilistic/CountingBloomFilter/CountingBloomFilterLayout.ts'
import { CuckooFilter } from '../components/AdvancedDataStructures/Probabilistic/CuckooFilter/CuckooFilter.ts'
import { CuckooFilterLayout } from '../components/AdvancedDataStructures/Probabilistic/CuckooFilter/CuckooFilterLayout.ts'
import { QuotientFilter } from '../components/AdvancedDataStructures/Probabilistic/QuotientFilter/QuotientFilter.ts'
import { QuotientFilterLayout } from '../components/AdvancedDataStructures/Probabilistic/QuotientFilter/QuotientFilterLayout.ts'
import { CountMinSketch } from '../components/AdvancedDataStructures/Probabilistic/CountMinSketch/CountMinSketch.ts'
import { CountMinSketchLayout } from '../components/AdvancedDataStructures/Probabilistic/CountMinSketch/CountMinSketchLayout.ts'
import { HyperLogLog } from '../components/AdvancedDataStructures/Probabilistic/HyperLogLog/HyperLogLog.ts'
import { HyperLogLogLayout } from '../components/AdvancedDataStructures/Probabilistic/HyperLogLog/HyperLogLogLayout.ts'
import { ReservoirSamplingBuffer } from '../components/AdvancedDataStructures/Probabilistic/ReservoirSamplingBuffer/ReservoirSamplingBuffer.ts'
import { ReservoirSamplingBufferLayout } from '../components/AdvancedDataStructures/Probabilistic/ReservoirSamplingBuffer/ReservoirSamplingBufferLayout.ts'

export class ProbabilisticStructureCatalog {
  public static createModels(): Map<StructureKind, ProbabilisticModel> {
    const models = new Map<StructureKind, ProbabilisticModel>()
    for (const definition of ProbabilisticStructureDefinitions.structures) models.set(definition.kind, this.createDefault(definition.kind)!)
    return models
  }

  public static createDefault(kind: StructureKind): ProbabilisticModel | null {
    switch (kind) {
      case 'counting-bloom-filter': return CountingBloomFilter.createDefault()
      case 'cuckoo-filter': return CuckooFilter.createDefault()
      case 'quotient-filter': return QuotientFilter.createDefault()
      case 'count-min-sketch': return CountMinSketch.createDefault()
      case 'hyperloglog': return HyperLogLog.createDefault()
      case 'reservoir-sampling-buffer': return ReservoirSamplingBuffer.createDefault()
      default: return null
    }
  }

  public static createScene(model: ProbabilisticModel, frame: LinearFrame = {}): Scene {
    switch (model.kind) {
      case 'counting-bloom-filter': return new CountingBloomFilterLayout().create(model, frame)
      case 'cuckoo-filter': return new CuckooFilterLayout().create(model, frame)
      case 'quotient-filter': return new QuotientFilterLayout().create(model, frame)
      case 'count-min-sketch': return new CountMinSketchLayout().create(model, frame)
      case 'hyperloglog': return new HyperLogLogLayout().create(model, frame)
      case 'reservoir-sampling-buffer': return new ReservoirSamplingBufferLayout().create(model, frame)
      default: throw new RangeError('Unknown probabilistic structure')
    }
  }
}
