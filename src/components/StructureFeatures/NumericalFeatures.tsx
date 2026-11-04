import type { ReactNode } from 'react'
import type { ActionKind } from '../../visualization/ActionCatalog.ts'
import type { AlgorithmInformation } from '../../visualization/AlgorithmInformation.ts'
import type { LinearModel } from '../../visualization/LinearModel.ts'
import type { StructuredLinearActionProps } from '../ActionPlayback/StructuredLinearAction.tsx'
import DenseTensorBuild from '../FundamentalDataStructures/Linear/DenseTensor/Build/Build.tsx'
import { BuildAnimation as DenseTensorBuildSequence } from '../FundamentalDataStructures/Linear/DenseTensor/Build/BuildAnimation.ts'
import DenseTensorRead from '../FundamentalDataStructures/Linear/DenseTensor/Read/Read.tsx'
import { ReadAnimation as DenseTensorReadSequence } from '../FundamentalDataStructures/Linear/DenseTensor/Read/ReadAnimation.ts'
import DenseTensorSet from '../FundamentalDataStructures/Linear/DenseTensor/Set/Set.tsx'
import { SetAnimation as DenseTensorSetSequence } from '../FundamentalDataStructures/Linear/DenseTensor/Set/SetAnimation.ts'
import DenseTensorReshape from '../FundamentalDataStructures/Linear/DenseTensor/Reshape/Reshape.tsx'
import { ReshapeAnimation as DenseTensorReshapeSequence } from '../FundamentalDataStructures/Linear/DenseTensor/Reshape/ReshapeAnimation.ts'
import DenseTensorInspectStorage from '../FundamentalDataStructures/Linear/DenseTensor/InspectStorage/InspectStorage.tsx'
import { InspectStorageAnimation as DenseTensorInspectStorageSequence } from '../FundamentalDataStructures/Linear/DenseTensor/InspectStorage/InspectStorageAnimation.ts'
import DenseTensorClear from '../FundamentalDataStructures/Linear/DenseTensor/Clear/Clear.tsx'
import { ClearAnimation as DenseTensorClearSequence } from '../FundamentalDataStructures/Linear/DenseTensor/Clear/ClearAnimation.ts'
import SparseCOOBuild from '../AdvancedDataStructures/SparseArraysMatrices/SparseCOO/Build/Build.tsx'
import { BuildAnimation as SparseCOOBuildSequence } from '../AdvancedDataStructures/SparseArraysMatrices/SparseCOO/Build/BuildAnimation.ts'
import SparseCOORead from '../AdvancedDataStructures/SparseArraysMatrices/SparseCOO/Read/Read.tsx'
import { ReadAnimation as SparseCOOReadSequence } from '../AdvancedDataStructures/SparseArraysMatrices/SparseCOO/Read/ReadAnimation.ts'
import SparseCOOSet from '../AdvancedDataStructures/SparseArraysMatrices/SparseCOO/Set/Set.tsx'
import { SetAnimation as SparseCOOSetSequence } from '../AdvancedDataStructures/SparseArraysMatrices/SparseCOO/Set/SetAnimation.ts'
import SparseCOOAppendTriplet from '../AdvancedDataStructures/SparseArraysMatrices/SparseCOO/AppendTriplet/AppendTriplet.tsx'
import { AppendTripletAnimation as SparseCOOAppendTripletSequence } from '../AdvancedDataStructures/SparseArraysMatrices/SparseCOO/AppendTriplet/AppendTripletAnimation.ts'
import SparseCOOCoalesce from '../AdvancedDataStructures/SparseArraysMatrices/SparseCOO/Coalesce/Coalesce.tsx'
import { CoalesceAnimation as SparseCOOCoalesceSequence } from '../AdvancedDataStructures/SparseArraysMatrices/SparseCOO/Coalesce/CoalesceAnimation.ts'
import SparseCOOMultiplyVector from '../AdvancedDataStructures/SparseArraysMatrices/SparseCOO/MultiplyVector/MultiplyVector.tsx'
import { MultiplyVectorAnimation as SparseCOOMultiplyVectorSequence } from '../AdvancedDataStructures/SparseArraysMatrices/SparseCOO/MultiplyVector/MultiplyVectorAnimation.ts'
import SparseCOOInspectStorage from '../AdvancedDataStructures/SparseArraysMatrices/SparseCOO/InspectStorage/InspectStorage.tsx'
import { InspectStorageAnimation as SparseCOOInspectStorageSequence } from '../AdvancedDataStructures/SparseArraysMatrices/SparseCOO/InspectStorage/InspectStorageAnimation.ts'
import SparseCOOClear from '../AdvancedDataStructures/SparseArraysMatrices/SparseCOO/Clear/Clear.tsx'
import { ClearAnimation as SparseCOOClearSequence } from '../AdvancedDataStructures/SparseArraysMatrices/SparseCOO/Clear/ClearAnimation.ts'
import SparseCSCBuild from '../AdvancedDataStructures/SparseArraysMatrices/SparseCSC/Build/Build.tsx'
import { BuildAnimation as SparseCSCBuildSequence } from '../AdvancedDataStructures/SparseArraysMatrices/SparseCSC/Build/BuildAnimation.ts'
import SparseCSCRead from '../AdvancedDataStructures/SparseArraysMatrices/SparseCSC/Read/Read.tsx'
import { ReadAnimation as SparseCSCReadSequence } from '../AdvancedDataStructures/SparseArraysMatrices/SparseCSC/Read/ReadAnimation.ts'
import SparseCSCSet from '../AdvancedDataStructures/SparseArraysMatrices/SparseCSC/Set/Set.tsx'
import { SetAnimation as SparseCSCSetSequence } from '../AdvancedDataStructures/SparseArraysMatrices/SparseCSC/Set/SetAnimation.ts'
import SparseCSCMultiplyVector from '../AdvancedDataStructures/SparseArraysMatrices/SparseCSC/MultiplyVector/MultiplyVector.tsx'
import { MultiplyVectorAnimation as SparseCSCMultiplyVectorSequence } from '../AdvancedDataStructures/SparseArraysMatrices/SparseCSC/MultiplyVector/MultiplyVectorAnimation.ts'
import SparseCSCInspectStorage from '../AdvancedDataStructures/SparseArraysMatrices/SparseCSC/InspectStorage/InspectStorage.tsx'
import { InspectStorageAnimation as SparseCSCInspectStorageSequence } from '../AdvancedDataStructures/SparseArraysMatrices/SparseCSC/InspectStorage/InspectStorageAnimation.ts'
import SparseCSCClear from '../AdvancedDataStructures/SparseArraysMatrices/SparseCSC/Clear/Clear.tsx'
import { ClearAnimation as SparseCSCClearSequence } from '../AdvancedDataStructures/SparseArraysMatrices/SparseCSC/Clear/ClearAnimation.ts'
import NumericalCSRBuild from '../AdvancedDataStructures/SparseArraysMatrices/NumericalCSR/Build/Build.tsx'
import { BuildAnimation as NumericalCSRBuildSequence } from '../AdvancedDataStructures/SparseArraysMatrices/NumericalCSR/Build/BuildAnimation.ts'
import NumericalCSRRead from '../AdvancedDataStructures/SparseArraysMatrices/NumericalCSR/Read/Read.tsx'
import { ReadAnimation as NumericalCSRReadSequence } from '../AdvancedDataStructures/SparseArraysMatrices/NumericalCSR/Read/ReadAnimation.ts'
import NumericalCSRSet from '../AdvancedDataStructures/SparseArraysMatrices/NumericalCSR/Set/Set.tsx'
import { SetAnimation as NumericalCSRSetSequence } from '../AdvancedDataStructures/SparseArraysMatrices/NumericalCSR/Set/SetAnimation.ts'
import NumericalCSRMultiplyVector from '../AdvancedDataStructures/SparseArraysMatrices/NumericalCSR/MultiplyVector/MultiplyVector.tsx'
import { MultiplyVectorAnimation as NumericalCSRMultiplyVectorSequence } from '../AdvancedDataStructures/SparseArraysMatrices/NumericalCSR/MultiplyVector/MultiplyVectorAnimation.ts'
import NumericalCSRInspectStorage from '../AdvancedDataStructures/SparseArraysMatrices/NumericalCSR/InspectStorage/InspectStorage.tsx'
import { InspectStorageAnimation as NumericalCSRInspectStorageSequence } from '../AdvancedDataStructures/SparseArraysMatrices/NumericalCSR/InspectStorage/InspectStorageAnimation.ts'
import NumericalCSRClear from '../AdvancedDataStructures/SparseArraysMatrices/NumericalCSR/Clear/Clear.tsx'
import { ClearAnimation as NumericalCSRClearSequence } from '../AdvancedDataStructures/SparseArraysMatrices/NumericalCSR/Clear/ClearAnimation.ts'
import Grid2DBuild from '../FundamentalDataStructures/Linear/Grid2D/Build/Build.tsx'
import { BuildAnimation as Grid2DBuildSequence } from '../FundamentalDataStructures/Linear/Grid2D/Build/BuildAnimation.ts'
import Grid2DRead from '../FundamentalDataStructures/Linear/Grid2D/Read/Read.tsx'
import { ReadAnimation as Grid2DReadSequence } from '../FundamentalDataStructures/Linear/Grid2D/Read/ReadAnimation.ts'
import Grid2DSet from '../FundamentalDataStructures/Linear/Grid2D/Set/Set.tsx'
import { SetAnimation as Grid2DSetSequence } from '../FundamentalDataStructures/Linear/Grid2D/Set/SetAnimation.ts'
import Grid2DInspectStorage from '../FundamentalDataStructures/Linear/Grid2D/InspectStorage/InspectStorage.tsx'
import { InspectStorageAnimation as Grid2DInspectStorageSequence } from '../FundamentalDataStructures/Linear/Grid2D/InspectStorage/InspectStorageAnimation.ts'
import Grid2DClear from '../FundamentalDataStructures/Linear/Grid2D/Clear/Clear.tsx'
import { ClearAnimation as Grid2DClearSequence } from '../FundamentalDataStructures/Linear/Grid2D/Clear/ClearAnimation.ts'

export class NumericalFeatures {
  public static render(action: ActionKind, props: StructuredLinearActionProps, session: number): ReactNode {
    switch (props.model.kind) {
      case 'dense-tensor':
        switch (action) {
          case 'build-values': return <DenseTensorBuild key={session} {...props} />
          case 'search-index': return <DenseTensorRead key={session} {...props} />
          case 'update-index': return <DenseTensorSet key={session} {...props} />
          case 'reshape': return <DenseTensorReshape key={session} {...props} />
          case 'inspect-storage': return <DenseTensorInspectStorage key={session} {...props} />
          case 'clear': return <DenseTensorClear key={session} {...props} />
        }
        break
      case 'sparse-coo':
        switch (action) {
          case 'build-values': return <SparseCOOBuild key={session} {...props} />
          case 'search-index': return <SparseCOORead key={session} {...props} />
          case 'update-index': return <SparseCOOSet key={session} {...props} />
          case 'insert': return <SparseCOOAppendTriplet key={session} {...props} />
          case 'coalesce': return <SparseCOOCoalesce key={session} {...props} />
          case 'multiply-vector': return <SparseCOOMultiplyVector key={session} {...props} />
          case 'inspect-storage': return <SparseCOOInspectStorage key={session} {...props} />
          case 'clear': return <SparseCOOClear key={session} {...props} />
        }
        break
      case 'sparse-csc':
        switch (action) {
          case 'build-values': return <SparseCSCBuild key={session} {...props} />
          case 'search-index': return <SparseCSCRead key={session} {...props} />
          case 'update-index': return <SparseCSCSet key={session} {...props} />
          case 'multiply-vector': return <SparseCSCMultiplyVector key={session} {...props} />
          case 'inspect-storage': return <SparseCSCInspectStorage key={session} {...props} />
          case 'clear': return <SparseCSCClear key={session} {...props} />
        }
        break
      case 'numerical-csr':
        switch (action) {
          case 'build-values': return <NumericalCSRBuild key={session} {...props} />
          case 'search-index': return <NumericalCSRRead key={session} {...props} />
          case 'update-index': return <NumericalCSRSet key={session} {...props} />
          case 'multiply-vector': return <NumericalCSRMultiplyVector key={session} {...props} />
          case 'inspect-storage': return <NumericalCSRInspectStorage key={session} {...props} />
          case 'clear': return <NumericalCSRClear key={session} {...props} />
        }
        break
      case 'grid-2d':
        switch (action) {
          case 'build-values': return <Grid2DBuild key={session} {...props} />
          case 'search-index': return <Grid2DRead key={session} {...props} />
          case 'update-index': return <Grid2DSet key={session} {...props} />
          case 'inspect-storage': return <Grid2DInspectStorage key={session} {...props} />
          case 'clear': return <Grid2DClear key={session} {...props} />
        }
        break
    }
    return null
  }

  public static describe(action: ActionKind, model: LinearModel): AlgorithmInformation | null {
    switch (model.kind) {
      case 'dense-tensor':
        switch (action) {
          case 'build-values': return DenseTensorBuildSequence.describe(model.length)
          case 'search-index': return DenseTensorReadSequence.describe(model.length)
          case 'update-index': return DenseTensorSetSequence.describe(model.length)
          case 'reshape': return DenseTensorReshapeSequence.describe(model.length)
          case 'inspect-storage': return DenseTensorInspectStorageSequence.describe(model.length)
          case 'clear': return DenseTensorClearSequence.describe(model.length)
        }
        break
      case 'sparse-coo':
        switch (action) {
          case 'build-values': return SparseCOOBuildSequence.describe(model.length)
          case 'search-index': return SparseCOOReadSequence.describe(model.length)
          case 'update-index': return SparseCOOSetSequence.describe(model.length)
          case 'insert': return SparseCOOAppendTripletSequence.describe(model.length)
          case 'coalesce': return SparseCOOCoalesceSequence.describe(model.length)
          case 'multiply-vector': return SparseCOOMultiplyVectorSequence.describe(model.length)
          case 'inspect-storage': return SparseCOOInspectStorageSequence.describe(model.length)
          case 'clear': return SparseCOOClearSequence.describe(model.length)
        }
        break
      case 'sparse-csc':
        switch (action) {
          case 'build-values': return SparseCSCBuildSequence.describe(model.length)
          case 'search-index': return SparseCSCReadSequence.describe(model.length)
          case 'update-index': return SparseCSCSetSequence.describe(model.length)
          case 'multiply-vector': return SparseCSCMultiplyVectorSequence.describe(model.length)
          case 'inspect-storage': return SparseCSCInspectStorageSequence.describe(model.length)
          case 'clear': return SparseCSCClearSequence.describe(model.length)
        }
        break
      case 'numerical-csr':
        switch (action) {
          case 'build-values': return NumericalCSRBuildSequence.describe(model.length)
          case 'search-index': return NumericalCSRReadSequence.describe(model.length)
          case 'update-index': return NumericalCSRSetSequence.describe(model.length)
          case 'multiply-vector': return NumericalCSRMultiplyVectorSequence.describe(model.length)
          case 'inspect-storage': return NumericalCSRInspectStorageSequence.describe(model.length)
          case 'clear': return NumericalCSRClearSequence.describe(model.length)
        }
        break
      case 'grid-2d':
        switch (action) {
          case 'build-values': return Grid2DBuildSequence.describe(model.length)
          case 'search-index': return Grid2DReadSequence.describe(model.length)
          case 'update-index': return Grid2DSetSequence.describe(model.length)
          case 'inspect-storage': return Grid2DInspectStorageSequence.describe(model.length)
          case 'clear': return Grid2DClearSequence.describe(model.length)
        }
        break
    }
    return null
  }
}
