export interface ComplexityInformation {
  readonly best: string
  readonly average: string
  readonly worst: string
  readonly explanation: string
}

export interface AlgorithmTerm {
  readonly symbol: string
  readonly meaning: string
}

export interface AlgorithmTechnology {
  readonly name: string
  readonly url: string
  readonly usage: string
}

export interface AlgorithmUsage {
  readonly technologies: readonly AlgorithmTechnology[]
  readonly products: readonly AlgorithmTechnology[]
  readonly note: string | null
}

export interface AlgorithmInformation {
  readonly name: string
  readonly summary: string
  readonly modelNotes?: string
  readonly time: ComplexityInformation
  readonly memory: ComplexityInformation
  readonly terms: readonly AlgorithmTerm[]
  readonly realWorldUsage?: AlgorithmUsage
}
