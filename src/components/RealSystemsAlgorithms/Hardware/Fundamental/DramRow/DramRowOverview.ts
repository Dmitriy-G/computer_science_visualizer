import type { SystemOverviewInformation } from '../../../../../visualization/SystemOverviewInformation.ts'

export class DramRowOverview {
  public static describe(): SystemOverviewInformation {
    return {
      name: 'DRAM cell and row access: activate, sense, restore, precharge',
      summary: 'A DRAM bank senses small capacitor signals into a row buffer, restores the open row, and selects columns for data transfer.',
      problem: 'Dense capacitor cells produce weak, disturbed signals that need amplification and restoration before reuse.',
      steps: [
        'Start with all word lines low and bit lines equalized near half supply.',
        'ACTIVATE a row so its cells share charge with their bit lines.',
        'Sense and amplify the small differences into row-buffer values.',
        'Restore the open row through the sense amplifiers.',
        'READ selected columns, including another column as a row hit; WRITE a new column value.',
        'Wait for restoration and write recovery before closing the row.',
        'PRECHARGE by disconnecting the row and equalizing bit lines.',
        'Activate a different row, sense and restore it, then read a selected column.',
      ],
      implementationNote: 'Conventional 1T1C cells and symbolic signal/timing intervals. Sensing/restoration affects the entire open row. Precharge prepares bit lines; it does not restore cell charge. No nanosecond values, refresh schedule, or vendor-specific controller policy is simulated.',
      realWorldUsage: {
        technologies: [
          { name: 'DRAM row-access characterization', url: 'https://users.ece.cmu.edu/~omutlu/pub/understanding-latency-variation-in-DRAM-chips_sigmetrics16.pdf', usage: 'Original measurements and section 2.3 explain activation, restoration, and precharge in commodity DRAM.' },
        ],
        products: [], note: 'Conventional 1T1C cells and symbolic signal/timing intervals. Sensing/restoration affects the entire open row. Precharge prepares bit lines; it does not restore cell charge. No nanosecond values, refresh schedule, or vendor-specific controller policy is simulated.',
      },
    }
  }
}
