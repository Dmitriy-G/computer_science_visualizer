export type AdvancedAlgorithmGroupKind =
  | 'hardware'
  | 'network'
  | 'disks'
  | 'memory'
  | 'cpu'
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
}

export class AdvancedAlgorithmCatalog {
  public static readonly groups: readonly AdvancedAlgorithmGroup[] = [
    { kind: 'hardware', parent: null, name: 'Hardware', description: 'Explore algorithms for disks, memory, and CPUs.' },
    { kind: 'network', parent: null, name: 'Network', description: 'Explore network topics organized by the seven OSI layers.' },
    { kind: 'disks', parent: 'hardware', name: 'Disks', description: 'Disk scheduling, storage access, and data placement.' },
    { kind: 'memory', parent: 'hardware', name: 'Memory', description: 'Memory allocation, paging, and replacement policies.' },
    { kind: 'cpu', parent: 'hardware', name: 'CPU', description: 'Processor scheduling and execution.' },
    { kind: 'physical', parent: 'network', name: 'Physical', description: 'Layer 1: transmit bits as physical signals.' },
    { kind: 'data-link', parent: 'network', name: 'Data Link', description: 'Layer 2: frames, link access, and error detection.' },
    { kind: 'network-layer', parent: 'network', name: 'Network', description: 'Layer 3: packet addressing, routing, and forwarding.' },
    { kind: 'transport', parent: 'network', name: 'Transport', description: 'Layer 4: end-to-end delivery and flow control.' },
    { kind: 'session', parent: 'network', name: 'Session', description: 'Layer 5: establish and manage communication sessions.' },
    { kind: 'presentation', parent: 'network', name: 'Presentation', description: 'Layer 6: data representation, encoding, and conversion.' },
    { kind: 'application', parent: 'network', name: 'Application', description: 'Layer 7: network services used by applications.' },
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
}
