import type { SystemOverviewInformation } from '../../../../../../visualization/SystemOverviewInformation.ts'
import { GpuVramOverview } from '../GpuVramOverview.ts'

export class HashcatIterationOverview {
  public static describe(): SystemOverviewInformation {
    const note = 'One iteration means one fixed candidate evaluation, not a complete search or one SHA-256 round. Candidate abc is compared with its known unsalted SHA-256 target using all 256 digest bits. The model computes the real digest locally; it does not run Hashcat or GPU code. Real Hashcat uses batches, device buffers, and optimized kernels; this illustration groups the full hash computation. Texture, rasterization, render output, ray tracing, AI, and display units stay idle.'
    return {
      name: 'Hashcat: one candidate iteration',
      summary: 'Write and read GPU input buffers through VRAM cells, compute a candidate hash, and store and retrieve the match result.',
      problem: 'Many independent candidate hashes can be evaluated on programmable GPU cores and their matches reported to the host.',
      steps: [
        'Upload candidate abc and its known target through PCIe; write them through VRAM I/O, columns, row buffer, transistor, and capacitor.',
        'Queue a compute kernel and schedule one representative work item.',
        'Open the input row, sense and restore its cells, and read candidate bytes and target through selected columns and GDDR I/O.',
        'Compute the full SHA-256 digest on the programmable integer cores.',
        'Compare the complete digest with the target on the device.',
        'Write a match record through the VRAM circuitry and close the row after recovery.',
        'Complete the dispatch before reading back its result.',
        'Read the result buffer through the VRAM circuitry and return it through the host interface and PCIe.',
      ],
      implementationNote: `${note} ${GpuVramOverview.note}`,
      realWorldUsage: { technologies: [
        { name: 'Hashcat SHA2-256 compute kernel', url: 'https://github.com/hashcat/hashcat/blob/master/OpenCL/m01400_a0-pure.cl', usage: 'The SHA2-256 kernel applies candidate rules, computes SHA-256, and performs digest comparison in GPU work items.' },
        { name: 'Hashcat GPU compute backends', url: 'https://hashcat.net/hashcat/', usage: 'Hashcat supports GPU compute backends for parallel candidate evaluation.' },
        ...GpuVramOverview.technologies,
      ], products: [], note },
    }
  }
}
