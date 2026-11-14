import type { CpuAlgorithmKind } from './Cpu/CpuAlgorithmCatalog.ts'
import type { RamAlgorithmKind } from './Ram/RamAlgorithmCatalog.ts'
import type { HddAlgorithmKind } from './Hdd/HddAlgorithmCatalog.ts'
import type { SsdAlgorithmKind } from './Ssd/SsdAlgorithmCatalog.ts'
import type { GpuAlgorithmKind } from './Gpu/GpuAlgorithmCatalog.ts'
import type { NetworkAdapterAlgorithmKind } from './NetworkAdapter/NetworkAdapterAlgorithmCatalog.ts'
import type { BusAlgorithmKind } from './Bus/BusAlgorithmCatalog.ts'

export type HardwareOverviewKind = CpuAlgorithmKind | RamAlgorithmKind | HddAlgorithmKind | SsdAlgorithmKind | GpuAlgorithmKind | NetworkAdapterAlgorithmKind | BusAlgorithmKind
