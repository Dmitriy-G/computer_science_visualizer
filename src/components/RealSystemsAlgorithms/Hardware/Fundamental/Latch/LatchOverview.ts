import type { SystemOverviewInformation } from '../../../../../visualization/SystemOverviewInformation.ts'

export class LatchOverview {
  public static describe(): SystemOverviewInformation {
    return {
      name: 'A latch: capturing and holding one bit',
      summary: 'A powered, level-sensitive storage circuit follows D while enabled and keeps one bit while disabled.',
      problem: 'A circuit needs to remember an input after that input changes.',
      steps: [
        'Apply D with latch enable active.',
        'Observe Q follow D during the transparent interval.',
        'Disable the latch while satisfying setup and hold requirements.',
        'Change D and observe Q retain its captured value.',
        'Re-enable the latch to accept a new value.',
        'Disconnect the external output with /OE without changing stored Q.',
      ],
      implementationNote: 'This example assumes valid setup/hold timing and initialized Q. It is a level-sensitive D latch, not an edge-triggered flip-flop, packaged SRAM cell, or DRAM capacitor. Equal sample spacing is symbolic.',
      realWorldUsage: {
        technologies: [
          { name: 'TI SN74LVC373A transparent latches', url: 'https://www.ti.com/lit/ds/symlink/sn74lvc373a.pdf', usage: 'The function table distinguishes transparent enable, retained data, and three-state output control. One channel is illustrated.' },
        ],
        products: [], note: 'This example assumes valid setup/hold timing and initialized Q. It is a level-sensitive D latch, not an edge-triggered flip-flop, packaged SRAM cell, or DRAM capacitor. Equal sample spacing is symbolic.',
      },
    }
  }
}
