import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'

export class DiskAlgorithmInformation {
  public static create(name: string, summary: string, url: string, usage: string): AlgorithmInformation {
    return {
      name, summary,
      time: {
        best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)',
        explanation: 'These costs describe this sequential teaching implementation, not Linux. Each of n requests requires full-array queue scans; all growing nonempty workloads take quadratic work, regardless of request order. Empty input takes constant time. Simulated device time and playback recording are excluded.',
      },
      memory: {
        best: 'O(n)', average: 'O(n)', worst: 'O(n)',
        explanation: 'Request copies, status maps, queues, and the returned dispatch/completion order need linear storage. Three process queues and two read/write domains are fixed. Empty input uses constant space. Scene snapshots are visualization overhead.',
      },
      terms: [
        { symbol: 'n', meaning: 'Number of requests in the chosen workload (at most 16).' },
        { symbol: 'LBA', meaning: 'Logical block address: a position in the storage address space.' },
        { symbol: 'tick', meaning: 'An abstract unit of simulated device time, separate from animation time.' },
        { symbol: 'O(n²)', meaning: 'Work grows at most quadratically with request count.' },
        { symbol: 'O(n)', meaning: 'Additional storage grows linearly with request count.' },
      ],
      realWorldUsage: {
        technologies: [{ name: `Linux ${name}`, url, usage }],
        products: [{ name: 'Linux kernel', url, usage }],
        note: null,
      },
    }
  }
}
