import { HardwareDiagramFrame } from '../../../../../visualization/HardwareDiagramFrame.ts'
import { HardwareDiagram } from '../../../../../visualization/HardwareDiagram.ts'
import { HardwareSceneLayout } from '../../../../../visualization/HardwareSceneLayout.ts'
import { HardwareBlockSizes } from '../../../../../visualization/HardwareBlockSizes.ts'
import { HddMediaExample } from './HddMediaExample.ts'
import { HddStorageLayout } from './HddStorageLayout.ts'
import type { Scene, ScenePath } from '../../../../../visualization/Scene.ts'

export interface HddMechanismState {
  readonly track: number
  readonly targetTrack: number
  readonly rotation: number
  readonly targetSector: number
  readonly operation: string
}

export class HddLayout {
  public static readonly externalLeft = 200
  public static readonly externalRight = 1360
  private static readonly mapWidth = 2480
  public static readonly mechanicalOffset = 1400
  private static readonly electronicsOffset = -1020
  public static readonly width = this.mapWidth + this.externalLeft + this.externalRight
  public static readonly height = 1400
  public static readonly componentCount = 31
  public static readonly spindle = { x: 370, y: 470 }
  public static readonly pivot = { x: 800, y: 500 }
  public static readonly armLength = 400
  public static readonly trackRadii: readonly number[] = [245, 185, 125]
  private static readonly preview: HddMechanismState = { track: 1, targetTrack: 1, rotation: 0, targetSector: 3, operation: 'idle' }

  public static create(): Scene {
    const diagram = this.diagram()
    const scene = HardwareSceneLayout.create({ banks: [], diagram, focusId: null, events: 0 }, 'hardware-component')
    return { ...scene, kind: 'system-overview', nodes: [], count: this.componentCount, countLabel: 'HDD component groups' }
  }

  public static headPosition(track: number): { x: number, y: number } {
    const radius = this.trackRadii[track]
    if (radius === undefined) throw new RangeError('Unknown illustrative HDD track')
    const dx = this.pivot.x - this.spindle.x
    const dy = this.pivot.y - this.spindle.y
    const distance = Math.hypot(dx, dy)
    const along = (radius ** 2 - this.armLength ** 2 + distance ** 2) / (2 * distance)
    const across = Math.sqrt(radius ** 2 - along ** 2)
    return {
      x: this.spindle.x + along * dx / distance + across * dy / distance,
      y: this.spindle.y + along * dy / distance - across * dx / distance,
    }
  }

  private static sectorAngle(state: HddMechanismState): number {
    const target = this.headPosition(state.targetTrack)
    return Math.atan2(target.y - this.spindle.y, target.x - this.spindle.x) + (state.rotation - state.targetSector) * Math.PI / 4
  }

  public static sectorPosition(state: HddMechanismState): { x: number, y: number } {
    const angle = this.sectorAngle(state)
    const radius = this.trackRadii[state.targetTrack]
    return { x: this.spindle.x + radius * Math.cos(angle), y: this.spindle.y + radius * Math.sin(angle) }
  }

  private static circle(x: number, y: number, radius: number): string {
    return `M${x - radius} ${y}a${radius} ${radius} 0 1 0 ${radius * 2} 0a${radius} ${radius} 0 1 0 ${-radius * 2} 0`
  }

  private static point(radius: number, angle: number): string {
    return `${this.spindle.x + radius * Math.cos(angle)} ${this.spindle.y + radius * Math.sin(angle)}`
  }

  public static diagram(state: HddMechanismState = this.preview, height: number = this.height): HardwareDiagram {
    const diagram = new HardwareDiagram(this.mapWidth, height)
    diagram.region('hdd-enclosure', 'HDD / mechanical assembly', 'memory', 20, 20, 1040, 1360, 'system')
      .region('hdd-electronics', 'PCB / logical functions, underside view', 'observer', 1040, 20, 1340, 1360, 'system')
    const wide = HardwareBlockSizes.wide
    const small = HardwareBlockSizes.small
    const units: readonly [string, string, number, number, number, number][] = [
      ['data-connector', 'Host interface', 1080, 100, wide.width, wide.height],
      ['cache', 'Data cache / DRAM', 1080, 350, wide.width, wide.height],
      ['ecc', 'ECC encode/decode', 1080, 600, wide.width, wide.height],
      ['write-channel', 'Write encoder', 1080, 930, small.width, small.height],
      ['read-channel', 'Read processing', 1460, 930, small.width, small.height],
      ['controller', 'HDD controller', 1740, 100, wide.width, wide.height],
      ['firmware-map', 'LBA / Physical Location Mapping', 1740, 350, wide.width, wide.height],
      ['servo-controller', 'Servo controller', 1740, 600, wide.width, wide.height],
      ['motor-driver', 'Motor drivers', 1740, 850, wide.width, 260],
      ['power-connector', 'Power', 1080, 1230, wide.width, wide.height],
      ['actuator', 'VCM / coil', 780, 620, small.width, small.height],
      ['preamp', 'Preamp / driver', 780, 880, small.width, small.height],
      ['filter', 'Air filter', 780, 1140, small.width, small.height],
    ]
    for (const [id, label, x, y, width, unitHeight] of units) {
      const mechanical = id === 'actuator' || id === 'preamp' || id === 'filter'
      diagram.region(`hdd-${id}`, label, id === 'cache' ? 'memory' : 'device', x, y, width, unitHeight, 'component', mechanical ? 'hdd-enclosure' : 'hdd-electronics')
      if (id !== 'filter' && id !== 'motor-driver') diagram.fixture(id, '', '', x + width / 2, y + unitHeight - 30, undefined, width - 40, 34)
    }
    diagram.region('hdd-vcm-driver', 'VCM Driver / controls coil current to position and track the read/write head; distinct from spindle rotation', 'device', 1780, 930, small.width, small.height, 'component', 'hdd-motor-driver', 'VCM Driver')
      .region('hdd-spindle-driver', 'Spindle Motor Driver / commutates the spindle motor and controls platter rotation; distinct from head positioning', 'device', 2080, 930, small.width, small.height, 'component', 'hdd-motor-driver', 'Spindle Motor Driver')
    const mapping = diagram.regions.findIndex((region) => region.id === 'hdd-firmware-map')
    diagram.regions[mapping] = { ...diagram.regions[mapping], shortLabel: 'LBA / Physical Location Mapping', label: 'LBA / Physical Location Mapping / translates host logical block addresses to internal physical locations and supports defect remapping to spare sectors. This controller lookup is not a mandatory intermediate control stage between the controller and servo, cache, or read/write circuitry' }
    const center = this.spindle
    const pivot = this.pivot
    const head = this.headPosition(state.track)
    diagram.paths.push({
      id: 'platter', d: this.circle(center.x, center.y, 285), label: 'Circular platter / one schematic recording surface',
      highlighted: false, fill: '#eef4fc', strokeWidth: 2, caption: { text: `Platters (~${HddMediaExample.plattersPerDrive} per HDD)`, x: 130, y: 150 },
    })
    for (let track = 0; track < this.trackRadii.length; track += 1) diagram.paths.push({
      id: `track-${track}`, d: this.circle(center.x, center.y, this.trackRadii[track]),
      label: `Illustrative track ${track}`, highlighted: state.operation !== 'idle' && track === state.track,
    })
    const angle = this.sectorAngle(state)
    const radius = this.trackRadii[state.targetTrack]
    diagram.paths.push(
      { id: 'sector', d: `M${this.point(radius + 12, angle - 0.12)}A${radius + 12} ${radius + 12} 0 0 1 ${this.point(radius + 12, angle + 0.12)}L${this.point(radius - 12, angle + 0.12)}A${radius - 12} ${radius - 12} 0 0 0 ${this.point(radius - 12, angle - 0.12)}Z`, label: 'Requested sector rotating toward the head', highlighted: false, fill: '#fff0cf', stroke: '#b78e40', strokeWidth: 2 },
      { id: 'spindle', d: this.circle(center.x, center.y, 65), label: 'Spindle and motor at the platter center', highlighted: false, fill: '#dce8f6', strokeWidth: 2, caption: { text: 'Spindle', x: 315, y: 480 } },
      { id: 'arm', d: `M${pivot.x} ${pivot.y}L${head.x} ${head.y}`, label: 'Rigid arm carries the head on an arc around a fixed pivot', highlighted: state.operation === 'seek', strokeWidth: 8, caption: { text: 'Arm', x: (pivot.x + head.x) / 2, y: (pivot.y + head.y) / 2 - 30 } },
      { id: 'pivot', d: this.circle(pivot.x, pivot.y, 32), label: 'Fixed actuator pivot', highlighted: false, fill: '#dce8f6', strokeWidth: 2, caption: { text: 'Pivot', x: 845, y: 490 } },
      { id: 'head-shape', d: `M${head.x - 12} ${head.y - 9}h24v18h-24Z`, label: 'Read/write head above the selected track', highlighted: state.operation === 'write' || state.operation === 'sense', fill: '#fff', strokeWidth: 2, caption: { text: 'Head (~1 per surface)', x: head.x - 40, y: head.y - 35 } },
    )
    diagram.fixture('head', '', '', head.x, head.y, undefined, 22, 14)
    this.placeGroups(diagram)
    const headX = head.x + this.mechanicalOffset
    const writing = state.operation === 'write'
    const reading = state.operation === 'sense' || state.operation === 'detect' || state.operation === 'recording-decode'
    const routes: readonly [string, string, string, boolean, boolean][] = [
      ['host-cache', 'M170 230V350', 'Write / host interface to user-data cache', false, false],
      ['cache-host', 'M550 350V230', 'Read / user-data cache to host interface', state.operation === 'transfer', false],
      ['cache-ecc', 'M170 480V600', 'Write / Cache to ECC encoding', state.operation === 'ecc-encode', false],
      ['ecc-cache', 'M550 600V480', 'Read / ECC decoding and correction to Cache', state.operation === 'buffer-read', false],
      ['ecc-write', 'M170 730V930', 'Write / ECC codeword to Write Encoder', state.operation === 'recording-encode', false],
      ['read-ecc', 'M550 930V730', 'Read / Read Processing to ECC decoding and correction', state.operation === 'ecc-decode', false],
      ['write-preamp', 'M170 1070V1130H2160V935H2180', 'Write / Write Encoder to Preamp and head-current driver', writing, false],
      ['preamp-read', 'M2180 975H2140V1150H550V1070', 'Read / Preamp to Read Processing', reading, false],
      ['preamp-head', `M2180 910H2120V480L${headX} ${head.y}`, 'Write / Preamp head-current driver to Head', writing, false],
      ['head-preamp', `M${headX} ${head.y}L2100 500V950H2180`, 'Read / Head signal to Preamp', reading, false],
      ['host-controller', state.operation === 'transfer' ? 'M720 165H660' : 'M660 165H720', 'Host commands and completion status', state.operation === 'transfer', true],
      ['controller-map', 'M1020 230V350', 'Controller lookup / LBA translation, physical location, and defect remapping; a metadata side branch', false, true],
      ['controller-servo', 'M1320 165H1340V665H1320', 'Direct HDD controller commands to Servo Controller / target track and access scheduling, independently of the mapping lookup', state.operation === 'seek', false],
      ['buffer-control', 'M720 200H690V415H660', 'Direct HDD controller control of Cache / DRAM buffer and host DMA', false, false],
      ['controller-write', 'M720 140H670V810H250V930', 'Direct HDD controller control of Write Encoder / channel setup and write gating', false, false],
      ['controller-read', 'M720 220H710V980H660', 'Direct HDD controller control of Read Processing / channel setup and read gating', false, false],
      ['controller-spindle', 'M1320 140H1400V1000H1280', 'HDD controller commands to Spindle Motor Driver / platter rotation control', state.operation === 'rotation', false],
      ['servo-driver', 'M720 705H700V1000H760', 'Servo Controller commands to VCM Driver / head positioning and track following', state.operation === 'seek' || state.operation === 'settled', false],
      ['servo-feedback', 'M660 950H680V665H720', 'Embedded servo-position feedback from the read path', state.operation === 'settled', false],
      ['driver-actuator', 'M960 930V810H2290V760', 'VCM Driver supplies coil current to the voice-coil actuator for head positioning', state.operation === 'seek', false],
      ['actuator-pivot', 'M2200 620V532', 'Actuator rotates the arm about its pivot', state.operation === 'seek', false],
      ['driver-spindle', 'M1280 1030H1380V470H1705', 'Spindle Motor Driver powers platter rotation throughout positioning and access', state.operation === 'rotation' || state.operation === 'seek' || state.operation === 'settled', false],
    ]
    const writePaths = new Set(['host-cache', 'cache-ecc', 'ecc-write', 'write-preamp', 'preamp-head'])
    const readPaths = new Set(['cache-host', 'ecc-cache', 'read-ecc', 'preamp-read', 'head-preamp'])
    for (const [id, d, label, highlighted, bidirectional] of routes) {
      const path: ScenePath = { id, d, label, highlighted, directed: true, strokeWidth: 2, bidirectional: bidirectional && state.operation === 'idle' }
      if (writePaths.has(id)) diagram.paths.push({ ...path, stroke: '#8c6aaa', caption: id === 'cache-ecc' ? { text: 'Write', x: 80, y: 550 } : undefined })
      else if (readPaths.has(id)) diagram.paths.push({ ...path, stroke: '#4c8f7d', caption: id === 'ecc-cache' ? { text: 'Read', x: 570, y: 550 } : undefined })
      else diagram.paths.push(path)
    }
    diagram.paths.push({ id: 'airflow', d: 'M1770 755V1210H2180', label: 'Recirculating airflow carries particles to the passive filter; this is not an electrical connection', highlighted: false, directed: true, dashed: true, caption: { text: 'Airflow', x: 1900, y: 1190 } })
    const framed = HardwareDiagramFrame.create(diagram, this.externalLeft, this.externalRight)
    framed.paths.push(
      { id: 'hdd-external-host', d: `M${1080 + this.electronicsOffset + this.externalLeft} 165H20`, label: 'External host attachment / SATA to a motherboard SATA port or compatible HBA, or SAS to a compatible SAS controller/HBA. These are drive/interface variants; one drive has one illustrated attachment. Carries commands, payloads, and completions', highlighted: false, directed: true, bidirectional: true, caption: { text: 'SATA / SAS\nHost / HBA', x: 20, y: 197 } },
      { id: 'hdd-external-power', d: `M20 1295H${1080 + this.electronicsOffset + this.externalLeft}`, label: 'PSU DC supply through the drive power connector; internal regulation distributes power to controller, DRAM, preamp, spindle driver, and VCM driver. Supply voltages depend on form factor; AC mains does not enter the drive', highlighted: false, directed: true, dashed: true, stroke: '#b58a45', caption: { text: 'PSU DC power', x: 20, y: 1327 } },
    )
    const media = new HardwareDiagram(this.externalRight, height)
    HddStorageLayout.add(media)
    const mediaOffset = this.externalLeft + this.mapWidth
    const mediaFrame = HardwareDiagramFrame.create(media, mediaOffset, 0)
    for (const region of mediaFrame.regions) framed.regions.push(region)
    for (const path of mediaFrame.paths) framed.paths.push(path.id === 'hdd-media-enlargement'
      ? { ...path, d: `M${mediaOffset - 20} 470H${mediaOffset + 20}`, translateX: undefined }
      : path)
    return framed
  }

  private static placeGroups(diagram: HardwareDiagram): void {
    // Place groups by ownership so resizing a fixture cannot move it into the wrong group.
    const electronics = new Set<string>()
    for (const region of diagram.regions) {
      if (region.id === 'hdd-electronics' || region.parentId === 'hdd-electronics' || region.parentId === 'hdd-motor-driver') electronics.add(region.id)
    }
    for (let index = 0; index < diagram.regions.length; index += 1) {
      const region = diagram.regions[index]
      const offset = electronics.has(region.id) ? this.electronicsOffset : this.mechanicalOffset
      diagram.regions[index] = { ...region, x: region.x + offset }
    }
    for (let index = 0; index < diagram.positions.length; index += 1) {
      const position = diagram.positions[index]
      const offset = electronics.has(`hdd-${position.id}`) ? this.electronicsOffset : this.mechanicalOffset
      diagram.positions[index] = { ...position, x: position.x + offset }
    }
    for (let index = 0; index < diagram.paths.length; index += 1) {
      const path = diagram.paths[index]
      diagram.paths[index] = {
        ...path, translateX: (path.translateX ?? 0) + this.mechanicalOffset,
        caption: path.caption ? { ...path.caption, x: path.caption.x + this.mechanicalOffset } : undefined,
      }
    }
  }
}
