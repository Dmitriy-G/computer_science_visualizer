import type { StructureDefinition } from './StructureCatalog.ts'

export class NumericalStructureDefinitions {
  public static readonly structures: readonly StructureDefinition[] = [
    { kind: 'dense-tensor', group: 'linear', name: 'Dense Multidimensional Array / Tensor', description: 'General-purpose multidimensional indexing with shape and strides', symbol: '[]' },
    { kind: 'sparse-coo', group: 'linear', name: 'Sparse COO', description: 'General-purpose sparse matrices stored as coordinate triplets', symbol: 'ijv' },
    { kind: 'sparse-csc', group: 'linear', name: 'Sparse CSC', description: 'General-purpose compressed-column numerical matrices', symbol: 'CSC' },
    { kind: 'numerical-csr', group: 'linear', name: 'Numerical CSR', description: 'General-purpose compressed-row numerical matrices', symbol: 'CSR' },
    { kind: 'grid-2d', group: 'linear', name: '2D Grid', description: 'General-purpose spatial arrays indexed by row and column', symbol: '[]' },
  ]
}
