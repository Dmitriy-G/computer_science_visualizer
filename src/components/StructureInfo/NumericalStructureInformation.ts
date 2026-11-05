import type { StructureOverview } from './StructureInformation.ts'

export class NumericalStructureInformation {
  public static readonly overviews = {
    'dense-tensor': {
      summary: 'A dense multidimensional array is a fundamental linear storage representation with shape and strides mapping coordinates into contiguous values. This integer teaching model uses row-major Float64Array storage, rank 1 to 4, and metadata-only reshape; arbitrary-stride views, slicing, and broadcasting are outside this lesson.',
      useCases: [
        { area: 'Numerical computing', description: 'Index vectors, matrices, and higher-rank datasets with one coordinate per axis.' },
        { area: 'Machine learning', description: 'Organize batches, channels, and feature axes in tensor-shaped storage.' },
        { area: 'Scientific simulation', description: 'Associate values with positions along multiple discrete dimensions.' },
        { area: 'Image processing', description: 'Represent spatial and channel dimensions with explicit strides.' },
      ],
      technologies: [
        { name: 'NumPy ndarray', url: 'https://numpy.org/doc/stable/reference/arrays.ndarray.html', usage: 'NumPy represents multidimensional arrays using shape, dtype, storage, and byte strides. This example uses contiguous integer-valued Float64 storage and element strides; NumPy also supports noncontiguous views and many dtypes.' },
        { name: 'PyTorch dense tensors', url: 'https://docs.pytorch.org/docs/stable/tensors.html', usage: 'Stores numerical tensors for machine learning with shape, dtype, device, and strides. Views can share storage and be noncontiguous, unlike the contiguous row-major tensor shown here.' },
      ],
    },
    'sparse-coo': {
      summary: 'COO is a fundamental sparse matrix representation storing parallel row, column, and value arrays. This model permits duplicate triplets and explicit zeros on append; reads sum duplicates, Set replaces a coordinate, and Coalesce uses insertion sort to merge duplicates and remove zeros.',
      useCases: [
        { area: 'Matrix assembly', description: 'Append contributions independently before combining repeated coordinates.' },
        { area: 'Sparse data exchange', description: 'Express nonzero matrix positions as explicit coordinate/value records.' },
        { area: 'Finite element assembly', description: 'Accumulate overlapping local contributions to the same global matrix coordinate.' },
        { area: 'Sparse numerical products', description: 'Multiply stored contributions by a vector without traversing implicit zeros.' },
      ],
      technologies: [
        { name: 'SciPy COO arrays', url: 'https://docs.scipy.org/doc/scipy/reference/generated/scipy.sparse.coo_array.html', usage: 'SciPy exposes coordinate-format sparse arrays and supports duplicate-coordinate summation. Its production algorithms and numeric dtypes differ from this bounded two-dimensional integer lesson and insertion-sort coalescing.' },
        { name: 'PyTorch sparse COO tensors', url: 'https://docs.pytorch.org/docs/stable/sparse.html#sparse-coo-tensors', usage: 'Represents sparse tensors with coordinate indices and values. Duplicate coordinates add together and coalesce combines them; PyTorch also supports more dimensions and tensor-valued entries.' },
      ],
    },
    'sparse-csc': {
      summary: 'CSC is a fundamental sparse matrix representation grouping numeric nonzeros by column. Column pointers delimit packed row-index and value arrays; this model keeps row indices sorted, removes zero assignments, and repairs later pointers after structural edits.',
      useCases: [
        { area: 'Column-oriented queries', description: 'Access one column through its two pointer boundaries.' },
        { area: 'Sparse linear algebra', description: 'Store numerical matrices without allocating implicit zeros.' },
        { area: 'Column feature storage', description: 'Group observed row values for each feature column.' },
        { area: 'Matrix-vector products', description: 'Accumulate each stored column contribution into output rows.' },
      ],
      technologies: [
        { name: 'SciPy CSC arrays', url: 'https://docs.scipy.org/doc/scipy/reference/generated/scipy.sparse.csc_array.html', usage: 'SciPy CSC stores a column pointer array, packed row indices, and corresponding numerical data. This lesson shows a sorted, zero-free integer variant and direct structural edits, rather than all SciPy conversion and arithmetic facilities.' },
        { name: 'PyTorch sparse CSC tensors', url: 'https://docs.pytorch.org/docs/stable/sparse.html#sparse-csc-tensor', usage: 'Stores column pointers, row indices, and values for sparse tensor operations. Its CSC format also supports batches and dense value dimensions beyond this two-dimensional scalar model.' },
      ],
    },
    'numerical-csr': {
      summary: 'Numerical CSR is a fundamental sparse matrix representation grouping explicit numeric values by row. It is separate from the existing binary graph CSR: row pointers bound sorted column indices and aligned data, supporting coordinate edits and exact integer matrix-vector multiplication.',
      useCases: [
        { area: 'Row-oriented queries', description: 'Restrict a coordinate lookup to one packed row.' },
        { area: 'Sparse numerical products', description: 'Compute each output row from its stored column/value pairs.' },
        { area: 'Sparse feature matrices', description: 'Group observed feature values by sample row.' },
        { area: 'Scientific computing', description: 'Store a sparse numerical operator with explicit signed coefficients.' },
      ],
      technologies: [
        { name: 'SciPy numerical CSR arrays', url: 'https://docs.scipy.org/doc/scipy/reference/generated/scipy.sparse.csr_array.html', usage: 'SciPy CSR stores row pointers, column indices, and numerical values for sparse array operations. This bounded sorted integer variant omits the wider dtype, solver, and format-conversion APIs.' },
        { name: 'PyTorch numerical CSR tensors', url: 'https://docs.pytorch.org/docs/stable/sparse.html#sparse-csr-tensor', usage: 'Uses compressed row pointers, column indices, and values for sparse numerical tensors and matrix products. Supported dtypes, devices, and batched layouts extend beyond this integer matrix lesson.' },
      ],
    },
    'grid-2d': {
      summary: 'A 2D grid is a fundamental spatial array representation with fixed rows and columns, backed here by contiguous row-major numeric storage. Read and Set use offset = row * columns + column; the diagram shows discrete cells without navigation layers or world-coordinate transforms.',
      useCases: [
        { area: 'Image pixels', description: 'Associate a numeric value with a discrete row and column.' },
        { area: 'Tile maps', description: 'Represent local cell data at regular spatial positions.' },
        { area: 'Cellular simulations', description: 'Store state on a rectangular lattice for subsequent simulation algorithms.' },
        { area: 'Spatial measurements', description: 'Index samples taken on a regular two-dimensional grid.' },
      ],
      technologies: [
        { name: 'OpenCV Mat grids', url: 'https://docs.opencv.org/4.x/d3/d63/classcv_1_1Mat.html', usage: 'OpenCV Mat supports row/column access to dense image and matrix data. OpenCV also permits channels, row padding, and shared regions; this lesson uses one contiguous numeric channel with fixed discrete coordinates.' },
        { name: 'Nav2 Costmap2D navigation grids', url: 'https://api.nav2.org/nav2-jazzy/html/classnav2__costmap__2d_1_1Costmap2D.html', usage: 'Stores robot-navigation costs in a two-dimensional byte grid with conversions between cells and world coordinates. Layer updates and physical coordinates extend beyond this fixed numeric grid.' },
      ],
    },
  } satisfies Record<string, StructureOverview>
}
