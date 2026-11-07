export type AdvancedAlgorithmGroupKind =
  | 'hardware'
  | 'network'
  | 'hardware-fundamental'
  | 'hardware-complex'
  | 'network-fundamental'
  | 'network-complex'
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
    { kind: 'hardware', parent: null, name: 'Hardware', description: 'Explore individual hardware components and algorithms that combine them into working systems.' },
    { kind: 'network', parent: null, name: 'Network', description: 'Explore individual OSI layers and algorithms that combine layers into working networks.' },
    { kind: 'hardware-fundamental', parent: 'hardware', name: 'Fundamental', description: 'Algorithms focused on one hardware component: disks, memory, or CPU.' },
    { kind: 'hardware-complex', parent: 'hardware', name: 'Complex', description: 'Combine hardware components into systems, such as caching between CPU and memory.' },
    { kind: 'network-fundamental', parent: 'network', name: 'Fundamental', description: 'Algorithms focused on one OSI layer and the tasks it performs.' },
    { kind: 'network-complex', parent: 'network', name: 'Complex', description: 'Combine network layers into working systems, such as secure web communication.' },
    { kind: 'disks', parent: 'hardware-fundamental', name: 'Disks', description: 'Disk scheduling, storage access, and data placement.' },
    { kind: 'memory', parent: 'hardware-fundamental', name: 'Memory', description: 'Memory allocation, paging, and replacement policies.' },
    { kind: 'cpu', parent: 'hardware-fundamental', name: 'CPU', description: 'Processor scheduling and execution.' },
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
}
