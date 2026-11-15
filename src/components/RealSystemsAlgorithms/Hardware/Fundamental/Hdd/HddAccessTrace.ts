import type { HardwareDiagram } from '../../../../../visualization/HardwareDiagram.ts'
import { ComponentFlowTrace } from '../ComponentFlowTrace.ts'
import { HddLayout } from './HddLayout.ts'
import { HddAccessModel } from './HddAccessModel.ts'
import { HddStorageLayout } from './HddStorageLayout.ts'

export class HddAccessTrace extends ComponentFlowTrace {
  private readonly memory: HddAccessModel
  private activeInterval: number | null = null

  constructor(memory: HddAccessModel) {
    const diagram = HddLayout.diagram(memory)
    diagram.fixtures.splice(0)
    diagram.positions.splice(0)
    super(diagram, [
      ['hdd-data-connector', 'idle'], ['hdd-controller', 'ready'], ['hdd-firmware-map', 'LBA 7 / H0 T1 S3'],
      ['hdd-cache', 'empty'], ['hdd-ecc', 'idle'], ['hdd-write-channel', 'idle'],
      ['hdd-read-channel', 'idle'], ['hdd-servo-controller', 'not settled'], ['hdd-preamp', 'idle'],
      ['hdd-sector-payload', `Stored / ${HddAccessModel.summary(memory.storedData())}`],
      ['hdd-sector-format', 'ECC / not checked'], ['hdd-write-pole', 'field OFF'],
      ['hdd-read-sensor', 'idle'], ['hdd-magnetic-grains', 'Retained magnetization / no field'],
    ])
    this.memory = memory
  }

  protected decorateDiagram(diagram: HardwareDiagram): void {
    const mechanism = HddLayout.diagram(this.memory)
    const moving = new Set(['platter', 'sector', 'spindle', 'arm', 'pivot', 'head-shape', 'preamp-head', 'head-preamp'])
    for (let index = 0; index < diagram.paths.length; index += 1) {
      const path = diagram.paths[index]
      if (!moving.has(path.id)) continue
      const current = mechanism.paths.find((candidate) => candidate.id === path.id)!
      diagram.paths[index] = { ...path, d: current.d, caption: current.caption ? { ...current.caption } : undefined }
    }
    HddStorageLayout.showPattern(diagram, this.memory.recordedPattern(), this.activeInterval, this.memory.kind)
    const partial = this.memory.phase === 'ready' && this.memory.writtenPreviewIntervals > 0
    diagram.fixture('hdd-media-state', 'LBA 7 / 512 B sector', partial ? 'recording sector...' : HddAccessModel.summary(this.memory.storedData()), HddLayout.spindle.x + HddLayout.mechanicalOffset + HddLayout.externalLeft, 670, undefined, 340, 30)
    for (let index = 0; index < diagram.positions.length; index += 1) {
      const position = diagram.positions[index]
      if (position.id === 'hdd-write-channel-state' || position.id === 'hdd-read-channel-state') diagram.positions[index] = { ...position, y: 805 }
      else if (position.id === 'hdd-write-pole-state' || position.id === 'hdd-read-sensor-state') diagram.positions[index] = { ...position, y: 745, height: 24 }
    }
  }

  public recordIntervals(): void {
    const target = this.memory.pendingPattern()
    for (let index = 0; index < target.length; index += 1) {
      this.activeInterval = index
      const polarity = target[index] > 0 ? '+ / up' : '- / down'
      this.local('hdd-write-pole', `field ${polarity}`, `Set write field ${index + 1}/${target.length}`, `The protected recording stream drives the write pole for encoded interval ${index}. Plus and minus denote opposite field orientations, not electric charge.`)
      this.memory.writeNextInterval()
      this.transfer('hdd-storage-write-field', 'hdd-magnetic-grains', `Written ${index + 1}/${target.length} shown / ${polarity}`, `Magnetize interval ${index + 1}/${target.length}`, `The write field sets this interval's grain collection to ${polarity}. Earlier intervals retain their new orientation; later ones retain the old pattern until reached. This window shows the first 16 of 16384 teaching intervals, not 16 user bits. Substeps are within one aligned sector pass, not full platter rotations.`)
    }
  }

  public scanIntervals(): void {
    const pattern = this.memory.recordedPattern()
    for (let index = 0; index < pattern.length; index += 1) {
      this.activeInterval = index
      const polarity = pattern[index] > 0 ? '+ / up' : '- / down'
      this.local('hdd-magnetic-grains', `Read ${index + 1}/${pattern.length} shown / unchanged`, `Pass recorded interval ${index + 1}/${pattern.length}`, `The moving recorded pattern passes the reader. Interval ${index} retains ${polarity}; sensing applies no write field.`)
      this.transfer('hdd-storage-read-field', 'hdd-read-sensor', `sense ${polarity}`, `Sense interval ${index + 1}/${pattern.length}`, 'The recorded field affects MR sensor resistance. The plus/minus display identifies the sensed magnetization; analog resistance and voltage are abstracted. The grain pattern stays unchanged.')
    }
  }

  public endMediaWindow(): void { this.activeInterval = null }

  public position(): void {
    this.signal('controller-spindle', 'Request spindle rotation', 'The HDD controller commands the spindle driver separately from VCM head positioning.')
    this.memory.startSpindle()
    this.signal('driver-spindle', 'Maintain platter rotation', 'The spindle motor runs during seeking, settling, and data access.')
    this.transfer('controller-servo', 'hdd-servo-controller', 'target / T1', 'Command head positioning', 'The controller sends the resolved track directly to the servo controller; the mapping lookup is not a mandatory control hop.')
    this.signal('servo-driver', 'Drive VCM control', 'The servo requests head-positioning coil current from the VCM driver.')
    this.memory.seek()
    this.signal('driver-actuator', 'Seek while rotating', 'VCM current moves the rigid arm to track 1. The platter also advances one symbolic angular sample.')
    this.signal('actuator-pivot', 'Move pivoting arm', 'The arm retains its fixed length; the head follows an arc around the actuator pivot.')
    this.memory.settle()
    this.transfer('servo-feedback', 'hdd-servo-controller', 'settled / tracking', 'Settle and track', 'Feedback from the read path establishes track following. Rotation continues during this symbolic settling interval.')
    while (!this.memory.aligned()) {
      this.memory.rotate()
      this.signal('driver-spindle', 'Wait for rotational alignment', 'The requested sector rotates to the actual head position. Access remains gated until alignment.')
    }
    this.local('hdd-servo-controller', 'T1 / sector aligned', 'Sector under head', 'Head 0 is settled over track 1 and sector 3 is now under it. Logical stages do not represent measured timing.')
  }
}
