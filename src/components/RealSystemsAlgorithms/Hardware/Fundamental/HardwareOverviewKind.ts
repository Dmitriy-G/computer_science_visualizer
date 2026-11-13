import type { CpuAlgorithmKind } from './Cpu/CpuAlgorithmCatalog.ts'
import type { RamAlgorithmKind } from './Ram/RamAlgorithmCatalog.ts'
import type { HddAlgorithmKind } from './Hdd/HddAlgorithmCatalog.ts'
import type { SsdAlgorithmKind } from './Ssd/SsdAlgorithmCatalog.ts'

export type HardwareOverviewKind = CpuAlgorithmKind | RamAlgorithmKind | HddAlgorithmKind | SsdAlgorithmKind
