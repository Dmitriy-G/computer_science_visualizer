import { HardwareDiagram } from '../../../../../visualization/HardwareDiagram.ts'
import { HardwareSceneLayout } from '../../../../../visualization/HardwareSceneLayout.ts'
import type { Scene, ScenePath } from '../../../../../visualization/Scene.ts'

export interface HddMechanismState {
  readonly track: number
  readonly targetTrack: number
  readonly rotation: number
  readonly targetSector: number
  readonly operation: string
}

export class HddLayout {
  public static readonly width = 2000
  public static readonly height = 1000
  public static readonly componentCount = 17
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
    const diagram = new HardwareDiagram(this.width, height)
    diagram.region('hdd-enclosure', 'HDD / mechanical assembly', 'memory', 20, 20, 1000, 960, 'system')
      .region('hdd-electronics', 'PCB / logical functions, underside view', 'observer', 1040, 20, 940, 960, 'system')
    const units: readonly [string, string, number, number, number, number][] = [
      ['data-connector', 'Host interface', 1080, 100, 420, 120],
      ['cache', 'Data cache / DRAM', 1080, 280, 420, 120],
      ['ecc', 'ECC encode/decode', 1080, 460, 420, 120],
      ['write-channel', 'Write encoder', 1080, 680, 200, 160],
      ['read-channel', 'Read processing', 1300, 680, 200, 160],
      ['controller', 'HDD controller', 1540, 100, 400, 120],
      ['firmware-map', 'Firmware map', 1540, 280, 400, 120],
      ['servo-controller', 'Servo controller', 1540, 460, 400, 120],
      ['motor-driver', 'Motor driver', 1540, 680, 400, 120],
      ['power-connector', 'Power', 1540, 870, 400, 90],
      ['actuator', 'VCM / coil', 780, 620, 220, 110],
      ['preamp', 'Preamp / driver', 650, 770, 300, 110],
      ['filter', 'Air filter', 790, 900, 210, 70],
    ]
    for (const [id, label, x, y, width, unitHeight] of units) {
      diagram.region(`hdd-${id}`, label, id === 'cache' ? 'memory' : 'device', x, y, width, unitHeight, 'component', x >= 1040 ? 'hdd-electronics' : 'hdd-enclosure')
      if (id !== 'filter') diagram.fixture(id, '', '', x + width / 2, y + (unitHeight >= 150 ? 110 : unitHeight < 100 ? 60 : 76), undefined, width - 40, 34)
    }
    const center = this.spindle
    const pivot = this.pivot
    const head = this.headPosition(state.track)
    diagram.paths.push({
      id: 'platter', d: this.circle(center.x, center.y, 285), label: 'Circular platter / one schematic recording surface',
      highlighted: false, fill: '#eef4fc', strokeWidth: 2, caption: { text: 'Platter', x: 130, y: 150 },
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
      { id: 'head-shape', d: `M${head.x - 12} ${head.y - 9}h24v18h-24Z`, label: 'Read/write head above the selected track', highlighted: state.operation === 'write' || state.operation === 'sense', fill: '#fff', strokeWidth: 2, caption: { text: 'Head', x: head.x - 40, y: head.y - 35 } },
    )
    const writing = state.operation === 'write'
    const reading = state.operation === 'sense' || state.operation === 'detect' || state.operation === 'recording-decode'
    const routes: readonly [string, string, string, boolean, boolean][] = [
      ['host-cache', state.operation === 'transfer' ? 'M1290 280V220' : 'M1290 220V280', 'Host interface / user-data cache', state.operation === 'transfer', true],
      ['cache-ecc', state.operation === 'buffer-read' ? 'M1290 460V400' : 'M1290 400V460', 'Cache / ECC sector data', state.operation === 'ecc-encode' || state.operation === 'buffer-read', true],
      ['ecc-write', 'M1180 580V680', 'ECC codeword to recording encoder', state.operation === 'recording-encode', false],
      ['read-ecc', 'M1400 680V580', 'Detected and recording-decoded codeword to ECC', state.operation === 'ecc-decode', false],
      ['write-preamp', 'M1080 760H1010V825H950', 'Encoded write symbols to the preamp / head-current driver', writing, false],
      ['preamp-read', 'M950 825H1035V855H1290V760H1300', 'Preamplified read signal to read processing', reading, false],
      ['head-preamp', writing ? `M800 770V750H735V460L${head.x} ${head.y}` : `M${head.x} ${head.y}L735 460V750H800V770`, 'Head signal / write current', writing || reading, true],
      ['host-controller', state.operation === 'transfer' ? 'M1540 160H1500' : 'M1500 160H1540', 'Host commands and completion status', state.operation === 'idle' || state.operation === 'transfer', true],
      ['controller-map', 'M1740 220V280', 'Firmware resolves host LBA to internal head / track / sector', state.operation === 'idle', false],
      ['map-servo', 'M1740 400V460', 'Internal track target to servo control', state.operation === 'seek', false],
      ['servo-driver', 'M1740 580V680', 'Servo positioning commands to motor driver', state.operation === 'seek' || state.operation === 'settled', false],
      ['servo-feedback', 'M1500 760H1528V520H1540', 'Embedded servo-position feedback from the read path', state.operation === 'settled', false],
      ['buffer-control', 'M1940 160H1960V420H1520V340H1500', 'HDD controller manages buffer / DMA transfers', false, false],
      ['driver-actuator', 'M1540 740H1510V965H1025V675H1000', 'Motor driver positions the voice-coil actuator', state.operation === 'seek', false],
      ['actuator-pivot', 'M890 620L800 532', 'Actuator rotates the arm about its pivot', state.operation === 'seek', false],
      ['driver-spindle', 'M1740 800V830H1530V995H45V470H305', 'Motor driver spins the spindle and platter throughout positioning and access', state.operation === 'rotation' || state.operation === 'seek' || state.operation === 'settled', false],
      ['power-driver', 'M1740 870V800', 'Power input to motor driver', false, false],
    ]
    for (const [id, d, label, highlighted, bidirectional] of routes) {
      const path: ScenePath = { id, d, label, highlighted, directed: true, strokeWidth: 2, bidirectional: bidirectional && state.operation === 'idle' }
      diagram.paths.push(path)
    }
    diagram.paths.push({ id: 'airflow', d: 'M370 755V935H790', label: 'Recirculating airflow carries particles to the passive filter; this is not an electrical connection', highlighted: false, directed: true, dashed: true, caption: { text: 'Airflow', x: 450, y: 920 } })
    diagram.fixture('head', '', '', head.x, head.y, undefined, 22, 14)
    return diagram
  }
}
