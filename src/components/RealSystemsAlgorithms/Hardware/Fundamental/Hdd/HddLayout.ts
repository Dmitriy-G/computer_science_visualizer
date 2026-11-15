import { HardwareDiagramFrame } from '../../../../../visualization/HardwareDiagramFrame.ts'
import { HardwareDiagram } from '../../../../../visualization/HardwareDiagram.ts'
import { HardwareSceneLayout } from '../../../../../visualization/HardwareSceneLayout.ts'
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
  public static readonly externalLeft = 1400
  public static readonly externalRight = 650
  private static readonly mapWidth = 2000
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
    diagram.region('hdd-enclosure', 'HDD / mechanical assembly', 'memory', 20, 20, 1000, 960, 'system')
      .region('hdd-electronics', 'PCB / logical functions, underside view', 'observer', 1040, 20, 940, 960, 'system')
    const units: readonly [string, string, number, number, number, number][] = [
      ['data-connector', 'Host interface', 1080, 100, 420, 120],
      ['cache', 'Data cache / DRAM', 1080, 280, 420, 120],
      ['ecc', 'ECC encode/decode', 1080, 460, 420, 120],
      ['write-channel', 'Write encoder', 1080, 680, 200, 160],
      ['read-channel', 'Read processing', 1300, 680, 200, 160],
      ['controller', 'HDD controller', 1540, 100, 400, 120],
      ['firmware-map', 'LBA / Physical Location Mapping', 1540, 280, 400, 140],
      ['servo-controller', 'Servo controller', 1540, 460, 400, 120],
      ['motor-driver', 'Motor drivers', 1540, 640, 400, 220],
      ['power-connector', 'Power', 1540, 870, 400, 90],
      ['actuator', 'VCM / coil', 780, 620, 220, 110],
      ['preamp', 'Preamp / driver', 650, 770, 300, 110],
      ['filter', 'Air filter', 790, 900, 210, 70],
    ]
    for (const [id, label, x, y, width, unitHeight] of units) {
      diagram.region(`hdd-${id}`, label, id === 'cache' ? 'memory' : 'device', x, y, width, unitHeight, 'component', x >= 1040 ? 'hdd-electronics' : 'hdd-enclosure')
      if (id !== 'filter' && id !== 'motor-driver') diagram.fixture(id, '', '', x + width / 2, y + (id === 'firmware-map' ? 110 : unitHeight >= 150 ? 110 : unitHeight < 100 ? 60 : 76), undefined, width - 40, 34)
    }
    diagram.region('hdd-vcm-driver', 'VCM Driver / controls coil current to position and track the read/write head; distinct from spindle rotation', 'device', 1560, 710, 360, 55, 'component', 'hdd-motor-driver', 'VCM Driver')
      .region('hdd-spindle-driver', 'Spindle Motor Driver / commutates the spindle motor and controls platter rotation; distinct from head positioning', 'device', 1560, 785, 360, 55, 'component', 'hdd-motor-driver', 'Spindle Motor Driver')
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
    const writing = state.operation === 'write'
    const reading = state.operation === 'sense' || state.operation === 'detect' || state.operation === 'recording-decode'
    const routes: readonly [string, string, string, boolean, boolean][] = [
      ['host-cache', 'M1180 220V280', 'Write / host interface to user-data cache', false, false],
      ['cache-host', 'M1400 280V220', 'Read / user-data cache to host interface', state.operation === 'transfer', false],
      ['cache-ecc', 'M1180 400V460', 'Write / Cache to ECC encoding', state.operation === 'ecc-encode', false],
      ['ecc-cache', 'M1400 460V400', 'Read / ECC decoding and correction to Cache', state.operation === 'buffer-read', false],
      ['ecc-write', 'M1140 580V680', 'Write / ECC codeword to Write Encoder', state.operation === 'recording-encode', false],
      ['read-ecc', 'M1400 680V580', 'Read / Read Processing to ECC decoding and correction', state.operation === 'ecc-decode', false],
      ['write-preamp', 'M1080 760H1010V805H950', 'Write / Write Encoder to Preamp and head-current driver', writing, false],
      ['preamp-read', 'M950 845H1035V855H1290V760H1300', 'Read / Preamp to Read Processing', reading, false],
      ['preamp-head', `M840 770V730H755V450L${head.x} ${head.y}`, 'Write / Preamp head-current driver to Head', writing, false],
      ['head-preamp', `M${head.x} ${head.y}L735 460V750H760V770`, 'Read / Head signal to Preamp', reading, false],
      ['host-controller', state.operation === 'transfer' ? 'M1540 160H1500' : 'M1500 160H1540', 'Host commands and completion status', state.operation === 'transfer', true],
      ['controller-map', 'M1740 220V280', 'Controller lookup / LBA translation, physical location, and defect remapping; a metadata side branch', false, true],
      ['controller-servo', 'M1940 180H1955V520H1940', 'Direct HDD controller commands to Servo Controller / target track and access scheduling, independently of the mapping lookup', state.operation === 'seek', false],
      ['buffer-control', 'M1540 180H1520V340H1500', 'Direct HDD controller control of Cache / DRAM buffer and host DMA', false, false],
      ['controller-write', 'M1600 100V75H1070V650H1240V680', 'Direct HDD controller control of Write Encoder / channel setup and write gating', false, false],
      ['controller-read', 'M1540 200H1510V650H1460V680', 'Direct HDD controller control of Read Processing / channel setup and read gating', false, false],
      ['controller-spindle', 'M1940 140H1970V812H1920', 'HDD controller commands to Spindle Motor Driver / platter rotation control', state.operation === 'rotation', false],
      ['servo-driver', 'M1740 580H1520V737H1560', 'Servo Controller commands to VCM Driver / head positioning and track following', state.operation === 'seek' || state.operation === 'settled', false],
      ['servo-feedback', 'M1500 760H1528V520H1540', 'Embedded servo-position feedback from the read path', state.operation === 'settled', false],
      ['driver-actuator', 'M1560 748H1510V965H1025V675H1000', 'VCM Driver supplies coil current to the voice-coil actuator for head positioning', state.operation === 'seek', false],
      ['actuator-pivot', 'M890 620L800 532', 'Actuator rotates the arm about its pivot', state.operation === 'seek', false],
      ['driver-spindle', 'M1560 812H1530V995H45V470H305', 'Spindle Motor Driver powers platter rotation throughout positioning and access', state.operation === 'rotation' || state.operation === 'seek' || state.operation === 'settled', false],
      ['power-controller', 'M1940 925H1990V200H1940', 'DC power distribution to HDD controller and integrated logic', false, false],
      ['power-cache', 'M1540 925H1060V340H1080', 'DC power distribution to Cache / DRAM and its local regulation', false, false],
      ['power-preamp', 'M1540 935H1060V890H630V825H650', 'DC power distribution into the enclosure to the Preamp / head-current driver', false, false],
      ['power-vcm', 'M1940 905H1945V750H1920', 'DC power distribution to VCM Driver / head-positioning power stage', false, false],
      ['power-spindle', 'M1940 925H1960V825H1920', 'DC power distribution to Spindle Motor Driver / platter-rotation power stage', false, false],
    ]
    const writePaths = new Set(['host-cache', 'cache-ecc', 'ecc-write', 'write-preamp', 'preamp-head'])
    const readPaths = new Set(['cache-host', 'ecc-cache', 'read-ecc', 'preamp-read', 'head-preamp'])
    for (const [id, d, label, highlighted, bidirectional] of routes) {
      const power = id.startsWith('power-')
      const path: ScenePath = { id, d, label, highlighted, directed: true, strokeWidth: 2, bidirectional: bidirectional && state.operation === 'idle' }
      if (power) diagram.paths.push({ ...path, dashed: true, stroke: '#b58a45' })
      else if (writePaths.has(id)) diagram.paths.push({ ...path, stroke: '#8c6aaa', caption: id === 'cache-ecc' ? { text: 'Write', x: 1090, y: 440 } : undefined })
      else if (readPaths.has(id)) diagram.paths.push({ ...path, stroke: '#4c8f7d', caption: id === 'ecc-cache' ? { text: 'Read', x: 1420, y: 440 } : undefined })
      else diagram.paths.push(path)
    }
    diagram.paths.push({ id: 'airflow', d: 'M370 755V935H790', label: 'Recirculating airflow carries particles to the passive filter; this is not an electrical connection', highlighted: false, directed: true, dashed: true, caption: { text: 'Airflow', x: 450, y: 920 } })
    diagram.fixture('head', '', '', head.x, head.y, undefined, 22, 14)
    const framed = HardwareDiagramFrame.create(diagram, this.externalLeft, this.externalRight)
    framed.paths.push(
      { id: 'hdd-external-host', d: `M${1500 + this.externalLeft} 130H${1515 + this.externalLeft}V60H${2620 + this.externalLeft}`, label: 'External host attachment / SATA to a motherboard SATA port or compatible HBA, or SAS to a compatible SAS controller/HBA. These are drive/interface variants; one drive has one illustrated attachment. Carries commands, payloads, and completions', highlighted: false, directed: true, bidirectional: true, caption: { text: 'SATA / SAS\nMotherboard / HBA', x: 2040 + this.externalLeft, y: 105 } },
      { id: 'hdd-external-power', d: `M${2620 + this.externalLeft} 915H${1940 + this.externalLeft}`, label: 'PSU DC supply through the drive power connector; internal regulation distributes power to controller, DRAM, preamp, spindle driver, and VCM driver. Supply voltages depend on form factor; AC mains does not enter the drive', highlighted: false, directed: true, dashed: true, stroke: '#b58a45', caption: { text: 'PSU DC power', x: 2040 + this.externalLeft, y: 885 } },
    )
    HddStorageLayout.add(framed)
    return framed
  }
}
