import { HardwareDiagram } from '../../../../../visualization/HardwareDiagram.ts'
import { CpuModel } from '../CpuModel.ts'
import type { HddSectorModel } from './HddSectorModel.ts'

export class HddSectorLayout {
  public static create(model: HddSectorModel): CpuModel {
    const diagram = new HardwareDiagram(1240, 1210)
    diagram.region('platter', 'Rotating platter / three illustrative tracks', 'memory', 30, 35, 630, 595)
      .region('local-controller', 'Device controller and actuator', 'observer', 700, 35, 510, 595)
    const radii = [220, 155, 90]
    for (let track = 0; track < radii.length; track += 1) {
      const radius = radii[track]
      diagram.paths.push({ id: `track-${track}`, d: `M ${330 - radius} 350 a ${radius} ${radius} 0 1 0 ${radius * 2} 0 a ${radius} ${radius} 0 1 0 ${-radius * 2} 0`, label: `Track ${track}${track === model.targetTrack ? ', requested track' : ''}`, highlighted: track === model.track })
    }
    const angle = (model.targetSector - model.rotation) * Math.PI / 4
    const x1 = 330 + 155 * Math.cos(angle - 0.18)
    const y1 = 350 + 155 * Math.sin(angle - 0.18)
    const x2 = 330 + 155 * Math.cos(angle + 0.18)
    const y2 = 350 + 155 * Math.sin(angle + 0.18)
    diagram.paths.push({ id: 'sector', d: `M ${x1} ${y1} A 155 155 0 0 1 ${x2} ${y2}`, label: 'Requested sector rotating toward the head', highlighted: true })
    diagram.paths.push({ id: 'arm', d: `M 815 385 L ${330 + radii[model.track]} 350`, label: 'Actuator arm and positioned head', highlighted: model.operation === 'seek' })
    diagram.fixture('spindle', 'Spindle / rotation phase', `${model.rotation} / 8`, 330, 350, undefined, 130)
      .fixture('head', 'Read/write head', `track ${model.track}`, 330 + radii[model.track], 350, model.settled ? 'settled' : 'moving', 130)
      .fixture('sector-position', 'Requested sector 3', model.aligned() ? 'under head' : 'rotating toward head', 330, 565, undefined, 270)
      .fixture('request', 'Host logical sector', 'LBA 7', 945, 145, undefined, 230)
      .fixture('translation', 'Internal placement / illustrative', 'track 1 / sector 3', 945, 275, undefined, 290)
      .fixture('servo', 'Servo position feedback', model.settled ? 'on target / settled' : `current track ${model.track}`, 945, 460, undefined, 260)
      .connect('translate', 'request', 'translation', 'device mapping', model.operation === 'idle')
      .connect('seek', 'translation', 'head', 'position command', model.operation === 'seek', 30)
      .connect('feedback', 'head', 'servo', 'position signal', model.operation === 'settled', 80)
    diagram.region('channel', 'Magnetic recording and read channel / illustrative encoding', 'memory', 30, 665, 1180, 315)
      .fixture('write-current', 'Write current / encoded pattern', model.magneticRegions.length ? model.magneticRegions.join(' ') : 'not written', 300, 760, undefined, 450)
      .fixture('read-signal', 'Read signal / transition differences', model.readSignal.length ? model.readSignal.join(' ') : 'not sensed', 900, 760, undefined, 450)
      .fixture('decoded', 'Decoded sector / parity check', model.decoded.length ? `${model.decoded.join('')} / ${model.checked ? 'pass' : 'fail'}` : 'await read', 900, 915, undefined, 450)
      .connect('record', 'write-current', 'head', 'record transitions', model.operation === 'write', -90)
      .connect('signal', 'head', 'read-signal', 'weak magnetic signal', model.operation === 'sense', 100)
      .connect('decode', 'read-signal', 'decoded', 'amplify / decode / check', model.operation === 'decode')
      .connect('transfer', 'decoded', 'request', 'device interface data', model.operation === 'transfer', 95)
    diagram.region('recorded-regions', 'Recorded magnetic regions / two regions per example channel bit, including parity', 'memory', 30, 1015, 1180, 165)
    for (let index = 0; index < 10; index += 1) {
      const polarity = model.magneticRegions[index]
      diagram.fixture(`magnetic-${index}`, `region ${index}`, polarity === undefined ? '?' : polarity > 0 ? 'N > S' : 'S > N', 95 + index * 115, 1100, undefined, 80)
    }
    return new CpuModel([], 'head', 0, diagram)
  }
}
