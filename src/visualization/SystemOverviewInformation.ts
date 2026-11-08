import type { AlgorithmUsage } from './AlgorithmInformation.ts'

export interface SystemOverviewInformation {
  readonly name: string
  readonly summary: string
  readonly problem: string
  readonly steps: readonly string[]
  readonly implementationNote?: string
  readonly realWorldUsage?: AlgorithmUsage
}
