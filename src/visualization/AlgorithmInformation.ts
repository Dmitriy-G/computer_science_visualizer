export interface ComplexityInformation {
  readonly order: string
  readonly explanation: string
}

export interface AlgorithmTerm {
  readonly symbol: string
  readonly meaning: string
}

export interface AlgorithmInformation {
  readonly name: string
  readonly summary: string
  readonly time: ComplexityInformation
  readonly memory: ComplexityInformation
  readonly terms: readonly AlgorithmTerm[]
}
