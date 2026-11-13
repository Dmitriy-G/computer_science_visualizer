import type { SystemOverviewInformation } from '../../../../../visualization/SystemOverviewInformation.ts'

export class HddSectorOverview {
  public static describe(): SystemOverviewInformation {
    const limits = 'The shared schematic separates logical HDD control, firmware mapping, data buffering, ECC, write encoding, read processing, servo control, and motor/head drivers. These functions can share chips. The PCB is an underside inset, not exact wiring or placement. One firmware-table entry maps LBA 7 to head 0 / track 1 / sector 3; production geometry, zoning, and defect-remapping policy are not simulated. Seek and settling include continuing platter rotation; servo tracking continues during media access. The four-bit payload uses extended Hamming (8,4) SECDED: one codeword-bit error is correctable and two are detectable; larger error patterns are outside its guarantee. Manchester symbols followed by NRZI (1 reverses the previous polarity, initial reference +) are teaching choices, not a production HDD format. A deliberate error after recording decoding represents a channel decision error without modeling analog noise. Signed transitions, three tracks, and eight angular samples are symbolic. Modern HDD ECC/detection, SMR, HAMR, measured timing, and OS scheduling are outside the model.'
    return {
      name: 'HDD: locating a sector and recording magnetic data',
      summary: 'Firmware mapping, a positioning servo, data buffering, and separate write/read processing locate, record, and recover sector data with error correction.',
      problem: 'Sector data must be located on a moving recording surface and recovered despite possible read errors.',
      steps: [
        'Accept the host write payload into the data buffer and resolve its LBA through the HDD firmware map to an internal head, track, and sector.',
        'Generate an ECC codeword, then independently encode its recording symbols; this example expands four payload bits to eight ECC bits and sixteen recording symbols.',
        'Send the track target to servo control, which seeks through the motor driver and VCM while the platter continues rotating.',
        'Settle the head using servo feedback and keep tracking the requested track.',
        'Wait for the requested sector to rotate under the settled head.',
        'Use the preamp/write driver to supply head current and record transitions determined by the encoded symbol stream.',
        'On the read pass, amplify the head signal, detect channel symbols, and decode the recording code back into an ECC word.',
        'Introduce one symbolic codeword-bit error to represent an erroneous channel decision.',
        'Use ECC syndrome and overall parity to correct the single-bit error; detected double-bit errors would prevent data return.',
        'Buffer the validated payload and return it through the host interface, then complete the command.',
      ],
      implementationNote: limits,
      realWorldUsage: {
        technologies: [
          { name: 'Seagate Laptop HDD servo and read/write channel', url: 'https://www.seagate.com/www-content/support-content/samsung/internal-products/spinpoint-m-series/en-us/docs/100772113c.pdf', usage: 'Sections 8.1–8.4 describe the mechanical assembly, buffer/data control, ECC, servo modes, and separate read/write paths including the head-current driver. The small Hamming/Manchester/NRZI example is a teaching choice, not Seagate’s recording implementation.' },
        ],
        products: [], note: limits,
      },
    }
  }
}
