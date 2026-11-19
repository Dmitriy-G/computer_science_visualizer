import type { HardwareElementInformation } from '../../../../../visualization/HardwareElementInformation.ts'
import { HddMediaExample } from './HddMediaExample.ts'
import { HddIllustrations } from './HddIllustrations.ts'

export class HddMediaInformation {
  public static readonly recordingDocumentation = {
    title: 'Western Digital / Recording technologies: magnetic media, heads, and sector formats',
    url: 'https://documents.westerndigital.com/content/dam/doc-library/en_us/assets/public/western-digital/collateral/tech-brief/tech-brief-recording-technologies.pdf',
  }

  public static readonly formatDocumentation = {
    title: 'Microsoft / Logical and physical sector sizes: 512n, 512e, and 4Kn',
    url: 'https://learn.microsoft.com/en-us/troubleshoot/windows-server/backup-and-storage/support-policy-4k-sector-hard-drives',
  }

  private static readonly geometryNote = 'The uniform 1 TiB geometry is a deliberately chosen teaching example, not a manufacturer specification. Real sectors per track vary by recording zone. Payload capacity excludes servo, ECC, formatting, and spare-sector overhead.'

  private static readonly entries: Readonly<Record<string, HardwareElementInformation>> = {
    'hdd-storage-detail': {
      photos: [],
      overview: 'The media enlargement follows the same platter surface and head from tracks and sectors down to magnetic recording material.',
      problem: 'It connects host sector payloads to the physical magnetization that retains them.',
      characteristicNote: this.geometryNote,
      characteristics: [
        { name: 'Modeled geometry', value: `${HddMediaExample.plattersPerDrive} platter, ${HddMediaExample.surfacesPerPlatter} surfaces per platter, ${HddMediaExample.tracksPerSurface.toLocaleString('en-US')} tracks per surface, and ${HddMediaExample.sectorsPerTrack.toLocaleString('en-US')} sectors per track.` },
        { name: 'Payload capacity', value: `${HddMediaExample.sectorsPerDrive.toLocaleString('en-US')} sectors of ${HddMediaExample.dataBytesPerSector} bytes give ${HddMediaExample.payloadBytes.toLocaleString('en-US')} bytes, or ${HddMediaExample.capacityTiB} TiB.` },
        { name: 'Same mechanism', value: 'This is an enlargement, rather than another device or duplicate copy of the sector.' },
      ],
      documentation: [this.recordingDocumentation, this.formatDocumentation],
    },
    'hdd-recording-surfaces': {
      photos: [],
      overview: 'A recording surface is one used side of a platter with a magnetic storage layer.',
      problem: 'It supplies the area where a head reads and writes concentric tracks.',
      characteristicNote: 'The model uses two recording surfaces per platter and one representative head per surface. Physical head and platter arrangements vary.',
      characteristics: [
        { name: 'Count scope', value: `${HddMediaExample.surfacesPerPlatter} surfaces per platter and ${HddMediaExample.surfacesPerDrive} surfaces in the modeled drive.` },
        { name: 'Organization', value: 'Each surface contains tracks, which contain addressable sector payloads and physical overhead.' },
        { name: 'Enlargement', value: 'Only one representative surface is expanded here.' },
      ],
      documentation: [this.recordingDocumentation],
    },
    'hdd-media-tracks': {
      photos: [],
      overview: 'Tracks are concentric recording paths on a platter surface.',
      problem: 'They organize magnetic recordings into paths that a positioned head can follow during rotation.',
      characteristicNote: this.geometryNote,
      characteristics: [
        { name: 'Modeled count', value: `${HddMediaExample.tracksPerSurface.toLocaleString('en-US')} tracks per surface.` },
        { name: 'Mechanical preview', value: 'The three drawn circles are geometric samples, rather than the total number of tracks.' },
        { name: 'Positioning', value: 'The servo seeks to a selected track and follows it while sectors rotate past the head.' },
      ],
      documentation: [this.recordingDocumentation],
    },
    'hdd-media-sectors': {
      photos: [],
      overview: 'A sector is the addressable unit used for the illustrated block read or write.',
      problem: 'It lets the host request a bounded portion of data without addressing individual magnetic grains.',
      characteristicNote: this.geometryNote,
      characteristics: [
        { name: 'Uniform model', value: `${HddMediaExample.sectorsPerTrack.toLocaleString('en-US')} sectors per track; actual zone geometry differs.` },
        { name: 'Selected format', value: '512n: one 512-byte logical sector corresponds to one physical data sector.' },
        { name: 'Other formats', value: '512e exposes 512-byte logical sectors over 4096-byte physical sectors; 4Kn exposes 4096-byte logical and physical sectors.' },
      ],
      documentation: [this.formatDocumentation, this.recordingDocumentation],
    },
    'hdd-sector-payload': {
      photos: [],
      overview: 'The payload is the user data carried by one sector, before physical recording overhead is counted.',
      problem: 'It distinguishes host-visible data capacity from the additional information required to store and recover it.',
      characteristicNote: 'The payload bit count does not determine the number of physical magnetic grains or recorded intervals.',
      characteristics: [
        { name: 'Per sector', value: `${HddMediaExample.dataBytesPerSector} payload bytes, or ${HddMediaExample.payloadBitsPerSector.toLocaleString('en-US')} payload bits, in the selected 512n example.` },
        { name: 'Write', value: 'All payload bytes receive teaching ECC and recording encoding before media recording.' },
        { name: 'Read', value: 'The full payload is reconstructed and checked before host delivery.' },
      ],
      documentation: [this.formatDocumentation, this.recordingDocumentation],
    },
    'hdd-sector-format': {
      photos: [],
      overview: 'Sector formatting adds error-control redundancy, synchronization, and other physical fields around the payload.',
      problem: 'The drive must find and decode recorded data and handle supported errors.',
      characteristicNote: 'Overhead depends on the recording format. The diagram does not infer production overhead sizes from the 512-byte payload.',
      characteristics: [
        { name: 'Additional information', value: 'ECC, synchronization, format fields, and gaps occupy recording space beyond user data.' },
        { name: 'Servo', value: 'Position information also consumes surface area and is excluded from modeled payload capacity.' },
        { name: 'Lesson code', value: 'Hamming (8,4) SECDED and the teaching recording stream are educational choices, rather than a production sector format.' },
      ],
      documentation: [this.recordingDocumentation, this.formatDocumentation],
    },
    'hdd-storage-head': {
      photos: HddIllustrations.head,
      overview: 'This is an enlarged view of the same head carried by the mechanical arm, with separate write and read elements.',
      problem: 'It shows how one head assembly performs two different conversions at the recording surface.',
      characteristicNote: 'The illustrated head has one writer and one MR reader. Multi-reader and assisted-recording designs can differ.',
      characteristics: [
        { name: 'Write element', value: 'The pole applies a magnetic field that sets the medium magnetization.' },
        { name: 'Read element', value: 'The sensor responds to recorded fields; readback is processed electronically.' },
        { name: 'Storage location', value: 'The magnetic film retains the sector. The head elements do not store the disk payload.' },
      ],
      documentation: [this.recordingDocumentation],
    },
    'hdd-write-pole': {
      photos: HddIllustrations.writePole,
      overview: 'The write pole concentrates a magnetic field at the recording layer under the head.',
      problem: 'It turns the driven write signal into a persistent magnetic recording.',
      characteristicNote: 'Conventional perpendicular recording is illustrated. The field path represents magnetic coupling, rather than a conductive wire into the grains.',
      characteristics: [
        { name: 'Input', value: 'Head-driver current follows the encoded recording stream.' },
        { name: 'Effect', value: 'The field sets collections of grains to the desired magnetization orientation.' },
        { name: 'Lesson window', value: `Writes the first ${HddMediaExample.previewIntervals} displayed encoded intervals in order, then groups the remaining recording work.` },
      ],
      documentation: [this.recordingDocumentation],
    },
    'hdd-read-sensor': {
      photos: HddIllustrations.readSensorContext,
      overview: 'A magnetoresistive reader converts changes in recorded magnetic field into changes in electrical resistance.',
      problem: 'It produces the electrical readback signal needed to recover a sector without applying the write field.',
      characteristicNote: 'The diagram abstracts MR sensing; it does not simulate analog resistance or specify a particular commercial reader construction.',
      characteristics: [
        { name: 'Signal path', value: 'Under electrical bias, the sensor response reaches the preamp and read processing.' },
        { name: 'Separate element', value: 'The reader and writer share a head assembly but perform different functions.' },
        { name: 'Read lesson', value: 'Scans the displayed intervals without changing their recorded orientation.' },
      ],
      documentation: [{
        title: 'Seagate / Magnetic tunnel junction reader and resistance-based readback',
        url: 'https://www.seagate.com/resources/what-is-mozaic-3plus-how-does-it-work-and-what-can-it-do-for-my-data-center/',
      }, this.recordingDocumentation],
    },
    'hdd-recording-film': {
      photos: HddIllustrations.magneticFilm,
      overview: 'The platter magnetic film retains the recorded pattern as remanent magnetization.',
      problem: 'It provides persistent storage after the write field and electrical power are removed.',
      characteristicNote: 'The enlarged film is a conventional perpendicular-recording illustration. Media materials, retention, and assisted-recording methods vary.',
      characteristics: [
        { name: 'Persistent state', value: 'Collections of magnetic grains retain orientation between writes.' },
        { name: 'Write coupling', value: 'The writer changes the recording through a magnetic field.' },
        { name: 'Read coupling', value: 'Stray fields from the moving pattern affect the separate MR reader.' },
      ],
      documentation: [this.recordingDocumentation],
    },
    'hdd-recorded-bit-area': {
      photos: HddIllustrations.recordedPattern,
      overview: 'A conventional recorded bit area uses the collective magnetization of many grains to contribute to the recording stream.',
      problem: 'It makes physical magnetic states distinguishable by the read head.',
      characteristicNote: 'The plus/minus strip shows encoded magnetization intervals. It is not a direct display of the user payload bits.',
      characteristics: [
        { name: 'Encoding', value: 'Payloads pass through ECC and recording coding before the magnetic pattern is written.' },
        { name: 'Orientation key', value: 'Plus and minus denote opposite perpendicular magnetization orientations, rather than electric charge.' },
        { name: 'Bit interpretation', value: 'There is no universal up-equals-1 assignment for the host payload.' },
      ],
      documentation: [this.recordingDocumentation],
    },
    'hdd-magnetic-grains': {
      photos: HddIllustrations.magneticGrains,
      overview: 'Magnetic grains are the small magnetic regions whose collective orientation forms a conventional recording bit area.',
      problem: 'They provide the physical material that retains the magnetic pattern between accesses.',
      characteristicNote: 'Each displayed interval represents many grains. No numerical grain count is derived from payload capacity, and plus/minus is not electric charge.',
      characteristics: [
        { name: 'Visible window', value: `The first ${HddMediaExample.previewIntervals} consecutive encoded intervals of the lesson sector are shown; the rest are grouped.` },
        { name: 'Write behavior', value: 'The current interval changes when the write field is applied. Other intervals retain their state until written.' },
        { name: 'Read behavior', value: 'The current interval is scanned through the reader while its magnetization remains unchanged.' },
      ],
      documentation: [this.recordingDocumentation],
    },
  }

  public static get(regionId: string): HardwareElementInformation | null {
    return this.entries[regionId] ?? null
  }
}
