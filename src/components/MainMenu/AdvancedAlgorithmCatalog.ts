import type { OverviewComponentKind, OverviewDeviceKind } from '../../visualization/OverviewComponent.ts'

export type HardwareFundamentalGroupKind = 'hardware-cpu' | 'hardware-hdd' | 'hardware-ssd' | 'hardware-ram'
export type HardwareOverviewGroupKind = HardwareFundamentalGroupKind | 'hardware-complex'

export type AdvancedAlgorithmGroupKind =
  | 'network'
  | 'hardware-fundamental'
  | HardwareOverviewGroupKind
  | 'network-fundamental'
  | 'network-complex'
  | 'physical'
  | 'data-link'
  | 'network-layer'
  | 'transport'
  | 'session'
  | 'presentation'
  | 'application'

export interface AdvancedAlgorithmGroup {
  readonly kind: AdvancedAlgorithmGroupKind
  readonly parent: AdvancedAlgorithmGroupKind | null
  readonly name: string
  readonly description: string
  readonly component?: OverviewComponentKind
  readonly device?: OverviewDeviceKind
}

export class AdvancedAlgorithmCatalog {
  public static readonly groups: readonly AdvancedAlgorithmGroup[] = [
    { kind: 'hardware-fundamental', parent: null, name: 'Hardware Fundamental', description: 'Explore CPU, HDD, SSD, and RAM components and their mechanisms.' },
    { kind: 'hardware-complex', parent: null, name: 'Complex', description: 'Combine hardware components into systems, such as caching between CPU and memory.' },
    { kind: 'network', parent: null, name: 'Network', description: 'Explore individual OSI layers and mechanisms that combine layers into working networks.' },
    { kind: 'hardware-cpu', parent: 'hardware-fundamental', name: 'CPU', description: 'Explore instruction execution, register renaming, and prediction inside a CPU core.', component: 'CPU' },
    { kind: 'hardware-hdd', parent: 'hardware-fundamental', name: 'HDD', description: 'Explore magnetic storage, sector access, and read/write mechanisms.', component: 'Disk', device: 'HDD' },
    { kind: 'hardware-ssd', parent: 'hardware-fundamental', name: 'SSD', description: 'Explore NAND storage, flash translation, garbage collection, and wear leveling.', component: 'Disk', device: 'SSD' },
    { kind: 'hardware-ram', parent: 'hardware-fundamental', name: 'RAM', description: 'Follow writing and reading one selected bit through a DRAM module.', component: 'RAM' },
    { kind: 'network-fundamental', parent: 'network', name: 'Fundamental', description: 'Overviews focused on one OSI layer and the tasks it performs.' },
    { kind: 'network-complex', parent: 'network', name: 'Complex', description: 'Combine network layers into working systems, such as secure web communication.' },
    { kind: 'physical', parent: 'network-fundamental', name: 'Physical', description: 'Layer 1: transmit bits as physical signals.' },
    { kind: 'data-link', parent: 'network-fundamental', name: 'Data Link', description: 'Layer 2: frames, link access, and error detection.' },
    { kind: 'network-layer', parent: 'network-fundamental', name: 'Network', description: 'Layer 3: packet addressing, routing, and forwarding.' },
    { kind: 'transport', parent: 'network-fundamental', name: 'Transport', description: 'Layer 4: end-to-end delivery and flow control.' },
    { kind: 'session', parent: 'network-fundamental', name: 'Session', description: 'Layer 5: establish and manage communication sessions.' },
    { kind: 'presentation', parent: 'network-fundamental', name: 'Presentation', description: 'Layer 6: data representation, encoding, and conversion.' },
    { kind: 'application', parent: 'network-fundamental', name: 'Application', description: 'Layer 7: network services used by applications.' },
  ]

  public static getGroups(parent: AdvancedAlgorithmGroupKind | null): readonly AdvancedAlgorithmGroup[] {
    const groups: AdvancedAlgorithmGroup[] = []
    for (const group of this.groups) {
      if (group.parent === parent) groups.push(group)
    }
    return groups
  }

  public static getGroup(kind: AdvancedAlgorithmGroupKind): AdvancedAlgorithmGroup {
    for (const group of this.groups) {
      if (group.kind === kind) return group
    }
    throw new RangeError('Unknown advanced algorithm group')
  }

  public static isHardwareFundamentalGroup(kind: AdvancedAlgorithmGroupKind | null): kind is HardwareFundamentalGroupKind {
    return kind === 'hardware-cpu' || kind === 'hardware-hdd' || kind === 'hardware-ssd' || kind === 'hardware-ram'
  }

  public static fundamentalGroupFor(components: readonly OverviewComponentKind[], devices: readonly OverviewDeviceKind[] = []): HardwareFundamentalGroupKind {
    for (const group of this.getGroups('hardware-fundamental')) {
      if (this.isHardwareFundamentalGroup(group.kind) && group.component && components.includes(group.component) && (!group.device || devices.includes(group.device))) return group.kind
    }
    throw new RangeError('Fundamental overviews require CPU or RAM coverage, or Disk coverage with an HDD or SSD device tag')
  }
}
