import type { OverviewArchitectureKind, OverviewComponentKind, OverviewDeviceKind } from '../../../../visualization/OverviewComponent.ts'
import type { HardwareOverviewKind } from './HardwareOverviewKind.ts'

export interface HardwareOverviewChoice<Kind extends string = HardwareOverviewKind> {
  readonly kind: Kind
  readonly name: string
  readonly description: string
  readonly components: readonly OverviewComponentKind[]
  readonly architectures: readonly OverviewArchitectureKind[]
  readonly devices?: readonly OverviewDeviceKind[]
}
