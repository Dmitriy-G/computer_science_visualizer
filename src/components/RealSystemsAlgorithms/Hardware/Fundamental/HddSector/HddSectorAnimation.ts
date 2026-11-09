import { ComponentInformation, ComponentLesson } from '../ComponentLesson.ts'
import type { CpuTrace } from '../CpuTrace.ts'
import { HddSectorModel } from './HddSectorModel.ts'
import { HddSectorOverview } from './HddSectorOverview.ts'

export class HddSectorAnimation extends ComponentLesson {
  public readonly title = HddSectorOverview.describe().name
  public static describe() { return ComponentInformation.describe(HddSectorOverview.describe()) }

  protected build(trace: CpuTrace): void {
    const model = new HddSectorModel()
    trace.record(model.snapshot(), 'Resolve a logical-sector request', 'The device maps example LBA 7 to an internal track/sector location. Host addresses do not imply universal CHS geometry.', 'request(LBA = 7)\ninternal_target = example_location(track = 1, sector = 3)', 0)
    model.seek()
    trace.record(model.snapshot(), 'Seek toward the track', 'The actuator positions the head radially over the requested track; access must wait for settling.', 'actuator.seek(track = 1)\nhead_settled = false')
    model.settle()
    trace.record(model.snapshot(), 'Settle with servo feedback', 'Position feedback confirms the head is on track. The requested sector still needs to rotate under it.', 'servo.confirm_position()\nhead_settled = true')
    while (!model.aligned()) {
      model.rotate()
      trace.record(model.snapshot(), 'Wait for rotation', 'The highlighted recording region rotates toward the fixed head position. These angular samples are not measured latency.', 'rotate_one_symbolic_sector_interval()\nwait_until_target_is_under_head()')
    }
    model.write()
    trace.record(model.snapshot(), 'Record an encoded pattern', 'The example data 1011 plus an even-parity bit is encoded into pairs of magnetic regions. Write current sets this pattern; regions are not uncoded user bits.', 'channel_bits = data + even_parity(data)\nrecord(example_two_region_code(channel_bits))')
    for (let rotation = 0; rotation < 8; rotation += 1) {
      model.rotate()
      trace.record(model.snapshot(), 'Return for a read pass', 'The platter continues rotating; the requested sector returns to the head after one illustrated revolution.', 'rotate_one_symbolic_sector_interval()')
    }
    model.sense()
    trace.record(model.snapshot(), 'Sense the magnetic read signal', 'Passing magnetic transitions generate a weak readback signal. Signed transition differences are symbolic, not an analog head model.', 'read_signal = sense_magnetic_transitions()')
    model.decode()
    trace.record(model.snapshot(), 'Amplify, decode, and check', 'The illustrative decoder recovers 1011 and verifies even parity. Production HDD channels use their own encoding, detection, and stronger error-control mechanisms.', 'bits = decode(example_channel(read_signal))\ncheck_even_parity(bits)\nsector_data = bits_without_parity')
    model.operation = 'transfer'
    trace.record(model.snapshot(), 'Return the recovered sector', 'The host receives the checked example data 1011. Seek, servo, rotation, recording, and readback are separate parts of access.', 'device_interface.transfer(1011)', 2)
  }
}
