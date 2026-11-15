import type { SystemOverviewInformation } from '../../../../../visualization/SystemOverviewInformation.ts'
import type { HddAccessOperation } from './HddAccessModel.ts'

export class HddAccessOverview {
  public static create(kind: HddAccessOperation): SystemOverviewInformation {
    const write = kind === 'write'
    const note = 'One complete 512-byte logical/physical sector in an explicit 512n example. The minimum host-addressable unit is a logical sector, not a bit or file byte. A 512e drive exposes 512-byte logical sectors over 4096-byte physical sectors and may perform read-modify-write; a 4Kn drive exposes 4096-byte logical sectors. Those variants are not simulated. Each lesson starts independently. All payload bytes traverse real teaching Hamming (8,4) SECDED, Manchester symbols, and NRZI magnetization/transition detection; these are not modern HDD production codes or sector overheads. No error is injected in the normal read lesson; the model rejects uncorrectable codewords. Three tracks, eight angular samples, one fixed LBA mapping, grouped data transfers, and timings are symbolic. Zoning, actual defect remapping, SMR/HAMR, crash recovery, write-cache flush/durability semantics, and OS scheduling are excluded. The write scenario completes after modeled media recording.'
    return {
      name: write ? 'Write one sector (512 B)' : 'Read one sector (512 B)',
      summary: write ? 'Write one minimum host-addressable sector through cache, ECC, encoding, preamp, and the positioned recording head.' : 'Read one minimum host-addressable sector through the positioned head, preamp, read processing, ECC, cache, and host interface.',
      problem: write ? 'A full logical sector must be buffered and encoded, then recorded only when the correct physical sector is under a settled head.' : 'A stored sector must be located and its signal decoded and checked before the full payload can be delivered.',
      steps: [
        'Accept a one-sector host request and look up LBA 7 as head 0, track 1, sector 3.',
        write ? 'Copy all 512 payload bytes into the cache and encode their teaching ECC and recording symbols.' : 'Keep the pre-recorded target sector unchanged while preparing its read.',
        'Control platter rotation separately from VCM head positioning.',
        'Seek directly through controller, servo, and VCM; settle using read-path servo feedback while rotation continues.',
        'Wait until the requested sector rotates under the settled head.',
        write ? 'Drive the enlarged write pole and change the first 16 displayed magnetic intervals one at a time; record the remaining intervals as a group.' : 'Scan the first 16 displayed magnetic intervals through the enlarged MR reader without changing them; group the remaining readback, detect symbols, and decode the recording format.',
        write ? 'End the recording window after the complete sector is stored; preserve its neighbor.' : 'Decode and check sector ECC, then buffer the 512 validated bytes.',
        write ? 'Return completion after the modeled media write.' : 'Return the full sector payload, then completion; preserve both sectors and their mapping.',
      ],
      implementationNote: `${note} The shared media enlargement uses a deliberately chosen 1 TiB geometry: 1 platter, 2 surfaces, 262,144 tracks per surface, 4,096 sectors per track, and 512 payload bytes per sector, giving 2,147,483,648 sectors. Real sectors per track vary by recording zone; these are model quantities, not manufacturer specifications. Payload capacity excludes physical format, servo, ECC, and spare-sector overhead. The perpendicular-recording illustration stores data as remanent magnetization in collections of magnetic grains. The write pole applies a field; the separate magnetoresistive reader senses stray fields through resistance changes. The plus/minus strip follows the first 16 of 16384 encoded intervals in the actual teaching stream, not direct user bits or electric charges. Each interval represents many grains. Write substeps change these intervals in order; read substeps scan them without rewriting. The remaining intervals are grouped. These substeps occur within one aligned sector pass, not full platter revolutions. Payload and ECC states update in the same enlargement. No numerical grain count or analog sensor response is simulated.`,
      realWorldUsage: { technologies: [
        { name: 'Seagate HDD controller, servo, and read/write channel', url: 'https://www.seagate.com/www-content/support-content/samsung/internal-products/spinpoint-m-series/en-us/docs/100772113c.pdf', usage: 'Describes buffering, mechanical positioning, servo tracking, head drivers, and read/write processing. The small-code teaching pipeline does not reproduce its production recording format.' },
        { name: 'Logical and physical sector formats', url: 'https://learn.microsoft.com/en-US/troubleshoot/windows-server/backup-and-storage/support-policy-4k-sector-hard-drives', usage: 'Distinguishes 512n, 512e, and 4Kn logical/physical sector sizes; the lesson explicitly uses 512n.' },
        { name: 'Western Digital recording technologies', url: 'https://documents.westerndigital.com/content/dam/doc-library/en_us/assets/public/western-digital/collateral/tech-brief/tech-brief-recording-technologies.pdf', usage: 'Explains magnetic grains, perpendicular recording, separate readers/writers, and sector-format overhead. The uniform 1 TiB geometry is a teaching choice rather than a product specification.' },
        { name: 'Seagate magnetoresistive reader', url: 'https://www.seagate.com/resources/what-is-mozaic-3plus-how-does-it-work-and-what-can-it-do-for-my-data-center/', usage: 'Describes resistance changes in a magnetic tunnel junction used for magnetic readback. The diagram abstracts MR sensing; it does not simulate this product or its assisted writer.' },
      ], products: [], note },
    }
  }
}
