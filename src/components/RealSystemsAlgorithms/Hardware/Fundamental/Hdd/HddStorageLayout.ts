import type { HardwareDiagram } from '../../../../../visualization/HardwareDiagram.ts'
import type { SceneRegion } from '../../../../../visualization/Scene.ts'
import { HddMediaExample } from './HddMediaExample.ts'
import { HddEcc } from '../HddSector/HddEcc.ts'
import { HddRecordingCode } from '../HddSector/HddRecordingCode.ts'

export class HddStorageLayout {
  public static add(diagram: HardwareDiagram): void {
    const example = HddMediaExample
    diagram.region('hdd-storage-detail', `Recording media enlargement / the same platter and head as the mechanical view. A deliberately modeled ${example.capacityTiB} TiB 512n data capacity: one platter, two recording surfaces, 262,144 tracks per surface, 4,096 sectors per track, 512 payload bytes per sector. This gives ${example.sectorsPerDrive.toLocaleString('en-US')} addressable sectors and ${example.payloadBytes.toLocaleString('en-US')} payload bytes. Uniform track geometry is a teaching choice, not a product specification. Real zone bit recording varies sectors per track; physical spares, servo wedges, synchronization, and ECC overhead are excluded from payload capacity`, 'observer', 20, 20, 1320, 1360, 'system', undefined, `Media / modeled ${example.capacityTiB} TiB (${example.driveSectorCount} sectors per HDD)`)
      .region('hdd-recording-surfaces', 'Recording surfaces / two used sides per platter in this example. One representative surface and access head are enlarged; this is not a second platter or another copy of the stored data', 'memory', 60, 100, 1240, 1240, 'component', 'hdd-storage-detail', `Surfaces (~${example.surfacesPerPlatter} per platter)`)
      .region('hdd-media-tracks', `Tracks / ${example.tracksPerSurface.toLocaleString('en-US')} concentric data tracks per modeled surface. The three circles in the mechanical view are geometric samples, not the total track count`, 'memory', 80, 180, 1200, 1140, 'component', 'hdd-recording-surfaces', `Tracks (${example.trackCount} per surface)`)
      .region('hdd-media-sectors', `Sector access view / ${example.sectorsPerTrack.toLocaleString('en-US')} data sectors per track in the deliberately uniform example. Actual drives usually vary this quantity by zone. One logical sector equals one 512-byte physical data sector in the selected 512n format; 512e and 4Kn differ. The enlarged head is above the same surface, not part of its magnetic material`, 'observer', 100, 260, 1160, 1040, 'component', 'hdd-media-tracks', `Sectors (${example.trackSectorCount} per track; modeled)`)
      .region('hdd-sector-payload', `Payload / ${example.payloadBitsPerSector.toLocaleString('en-US')} user data bits, or ${example.dataBytesPerSector} bytes per sector. These are logical payload bits; channel coding, ECC, and format overhead mean physical magnetic bit areas are not counted one-for-one from this number`, 'observer', 140, 340, 1080, 100, 'component', 'hdd-media-sectors', `Payload bits (${example.sectorBitCount} per sector / 512 B)`)
      .region('hdd-sector-format', 'Sector formatting / ECC redundancy, synchronization, address/format fields, and gaps are additional to the 512-byte payload. Servo information also consumes surface area. Their physical sizes are format dependent and are not invented from payload capacity', 'observer', 140, 460, 1080, 100, 'component', 'hdd-media-sectors', 'ECC / sync / format overhead (varies)')
      .region('hdd-storage-head', 'Enlarged access head / the same head shown on the pivoting arm, approximately one per used recording surface in this example. It has a write element and a separate magnetoresistive read element. The example uses one reader; multi-reader designs and recording technologies vary', 'device', 140, 600, 1080, 180, 'component', 'hdd-media-sectors', 'Same head / writer and reader')
      .region('hdd-write-pole', 'Write pole / one modeled writer per head. Coil current produces a magnetic field that sets the recording-layer grain magnetization. The head controls the write; persistent bits reside in the magnetic film, not the head coil', 'device', 180, 660, 460, 100, 'component', 'hdd-storage-head', 'Write pole (~1 per head) / magnetic field')
      .region('hdd-read-sensor', 'Magnetoresistive read sensor / one in this representative single-reader head. Stray fields from the moving recorded pattern change sensor resistance, producing an electrical readback signal under bias. The sensing element is distinct from the write pole and does not retain the disk data', 'device', 700, 660, 480, 100, 'component', 'hdd-storage-head', 'MR read sensor (~1 per head) / resistance response')
      .region('hdd-recording-film', 'Magnetic recording film / persistent storage material on the platter. Remanent magnetization remains after the write field and electrical power are removed. This is not DRAM capacitor charge or NAND floating-gate charge. Conventional perpendicular magnetic recording is illustrated; media construction and assisted-recording methods vary', 'memory', 140, 820, 1080, 420, 'component', 'hdd-media-sectors', 'Magnetic film / retains data without power')
      .region('hdd-recorded-bit-area', 'Recorded magnetic bit area / a collective orientation of many grains contributes to an encoded recording bit. A user bit is first combined with ECC and channel coding; there is no universal up-equals-1 or down-equals-0 assignment for user payload bits. The plus/minus strip enlarges the first 16 consecutive encoded intervals of the same sector, with opposite perpendicular magnetization orientations', 'memory', 180, 900, 1000, 300, 'component', 'hdd-recording-film', 'Bit storage / remanent magnetization')
      .region('hdd-magnetic-grains', 'Magnetic grains / many grains per conventional recorded bit area. Each displayed interval represents a collection of grains, not one grain per payload bit. Plus and minus denote opposite remanent magnetization orientations, not electric charge. The 16 consecutive intervals come from the teaching ECC/channel code. Grain size, grain count, and thermal retention depend on technology', 'memory', 220, 980, 920, 200, 'component', 'hdd-recorded-bit-area', 'Magnetic grains (many per bit area)')
    diagram.paths.push(
      { id: 'hdd-media-enlargement', d: 'M1340 470H1485', label: 'Enlargement association / this recording-media view refers to the same platter surface shown in the mechanical assembly; not a data-transfer wire or another storage device', highlighted: false, stroke: '#9576ae', strokeWidth: 2 },
      { id: 'hdd-storage-write-field', d: 'M410 760V800H130V1060H220', label: 'Write / the pole applies a magnetic field to set grain magnetization in the recording layer. Magnetic field coupling, not a conductive wire to the grains', highlighted: false, directed: true, bidirectional: false, stroke: '#8c6aaa', strokeWidth: 2 },
      { id: 'hdd-storage-read-field', d: 'M1140 1060H1230V800H940V760', label: 'Read / the recorded pattern produces a stray field sensed by the MR reader, changing its resistance; reading does not intentionally rewrite the medium. Magnetic field coupling, not a conductive wire', highlighted: false, directed: true, bidirectional: false, stroke: '#4c8f7d', strokeWidth: 2 },
      { id: 'hdd-magnetic-pattern-key', d: 'M260 1090H1100', label: 'Magnetization key / plus is up, minus is down in this PMR schematic. These are encoded intervals 0 through 15, not direct user bits or electric charges', highlighted: false, stroke: '#a3bcb6', caption: { text: '+ up / - down | encoded intervals 0-15', x: 260, y: 1122 } },
    )
    // The static map previews the same leading codeword as the old 0x11 sector.
    const pattern = HddRecordingCode.magnetize(HddRecordingCode.encode(HddEcc.encode([0, 0, 0, 1])))
    for (let index = 0; index < example.previewIntervals; index += 1) {
      const x = 260 + index * 52
      diagram.paths.push({ id: `hdd-grain-interval-${index}`, d: `M${x} 1030h44v44h-44Z`, label: '', highlighted: false, stroke: '#729a8e', fill: '#f7fcfa', caption: { text: pattern[index] > 0 ? '+' : '-', x: x + 12, y: 1062 } })
    }
    this.showPattern(diagram, pattern)
    this.applyColors(diagram)
  }

  public static showPattern(diagram: HardwareDiagram, pattern: readonly number[], active: number | null = null, mode: 'read' | 'write' = 'read'): void {
    for (let interval = 0; interval < HddMediaExample.previewIntervals; interval += 1) {
      const index = diagram.paths.findIndex((path) => path.id === `hdd-grain-interval-${interval}`)
      const path = diagram.paths[index]
      const selected = interval === active
      diagram.paths[index] = {
        ...path, stroke: selected ? mode === 'write' ? '#8c6aaa' : '#307d67' : '#729a8e',
        strokeWidth: selected ? 4 : 1, fill: selected ? mode === 'write' ? '#eee1f8' : '#d1eee3' : '#f7fcfa',
        label: `Encoded interval ${interval} / ${pattern[interval] > 0 ? 'plus, up' : 'minus, down'} remanent magnetization${selected ? ` / current ${mode}` : ''}; a collection of grains, not a direct user bit`,
        caption: { ...path.caption!, text: pattern[interval] > 0 ? '+' : '-' },
      }
    }
  }

  private static applyColors(diagram: HardwareDiagram): void {
    const blue = new Set(['hdd-media-sectors', 'hdd-write-pole', 'hdd-read-sensor'])
    const neutral = new Set(['hdd-storage-detail', 'hdd-sector-payload', 'hdd-sector-format', 'hdd-storage-head'])
    const ids = new Set(['hdd-storage-detail', 'hdd-recording-surfaces', 'hdd-media-tracks', 'hdd-media-sectors', 'hdd-sector-payload', 'hdd-sector-format', 'hdd-storage-head', 'hdd-write-pole', 'hdd-read-sensor', 'hdd-recording-film', 'hdd-recorded-bit-area', 'hdd-magnetic-grains'])
    for (let index = 0; index < diagram.regions.length; index += 1) {
      const region = diagram.regions[index]
      if (!ids.has(region.id)) continue
      let color: SceneRegion['color'] = 'green'
      if (blue.has(region.id)) color = 'light-blue'
      else if (neutral.has(region.id)) color = 'neutral'
      else if (region.id === 'hdd-media-tracks') color = 'lavender'
      diagram.regions[index] = { ...region, color }
    }
  }
}
