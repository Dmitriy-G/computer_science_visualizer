import { NumericalActionCatalog } from './NumericalActionCatalog.ts'
import type { LinearModel, LinearFrame } from './LinearModel.ts'
import type { Scene, StructureKind } from './Scene.ts'
import { DenseTensor } from '../components/FundamentalDataStructures/Linear/DenseTensor/DenseTensor.ts'
import { DenseTensorLayout } from '../components/FundamentalDataStructures/Linear/DenseTensor/DenseTensorLayout.ts'
import { SparseCOO } from '../components/AdvancedDataStructures/SparseArraysMatrices/SparseCOO/SparseCOO.ts'
import { SparseCOOLayout } from '../components/AdvancedDataStructures/SparseArraysMatrices/SparseCOO/SparseCOOLayout.ts'
import { SparseCSC } from '../components/AdvancedDataStructures/SparseArraysMatrices/SparseCSC/SparseCSC.ts'
import { SparseCSCLayout } from '../components/AdvancedDataStructures/SparseArraysMatrices/SparseCSC/SparseCSCLayout.ts'
import { NumericalCSR } from '../components/AdvancedDataStructures/SparseArraysMatrices/NumericalCSR/NumericalCSR.ts'
import { NumericalCSRLayout } from '../components/AdvancedDataStructures/SparseArraysMatrices/NumericalCSR/NumericalCSRLayout.ts'
import { Grid2D } from '../components/FundamentalDataStructures/Linear/Grid2D/Grid2D.ts'
import { Grid2DLayout } from '../components/FundamentalDataStructures/Linear/Grid2D/Grid2DLayout.ts'

export class NumericalStructureCatalog {
  public static supports(kind: StructureKind): boolean { return NumericalActionCatalog.supports(kind) }

  public static createModels(): Map<StructureKind, LinearModel> {
    return new Map<StructureKind, LinearModel>([
      ['dense-tensor', DenseTensor.createDefault()],
      ['sparse-coo', SparseCOO.createDefault()],
      ['sparse-csc', SparseCSC.createDefault()],
      ['numerical-csr', NumericalCSR.createDefault()],
      ['grid-2d', Grid2D.createDefault()],
    ])
  }

  public static createDefault(kind: StructureKind): LinearModel | null {
    switch (kind) {
      case 'dense-tensor': return DenseTensor.createDefault()
      case 'sparse-coo': return SparseCOO.createDefault()
      case 'sparse-csc': return SparseCSC.createDefault()
      case 'numerical-csr': return NumericalCSR.createDefault()
      case 'grid-2d': return Grid2D.createDefault()
      default: return null
    }
  }

  public static createScene(model: LinearModel, frame: LinearFrame = {}): Scene {
    switch (model.kind) {
      case 'dense-tensor': return new DenseTensorLayout().create(model, frame)
      case 'sparse-coo': return new SparseCOOLayout().create(model, frame)
      case 'sparse-csc': return new SparseCSCLayout().create(model, frame)
      case 'numerical-csr': return new NumericalCSRLayout().create(model, frame)
      case 'grid-2d': return new Grid2DLayout().create(model, frame)
      default: throw new RangeError('Unknown numerical structure')
    }
  }
}
