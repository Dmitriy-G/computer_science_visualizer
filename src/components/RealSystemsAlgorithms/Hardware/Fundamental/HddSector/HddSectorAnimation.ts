import { ComponentInformation, ComponentLesson } from '../ComponentLesson.ts'
import type { CpuTrace } from '../CpuTrace.ts'
import { HddSectorModel } from './HddSectorModel.ts'
import { HddSectorOverview } from './HddSectorOverview.ts'

export class HddSectorAnimation extends ComponentLesson {
  public readonly title = HddSectorOverview.describe().name
  public static describe() { return ComponentInformation.describe(HddSectorOverview.describe()) }

  protected build(trace: CpuTrace): void {
    const model = new HddSectorModel()
    trace.record(model.snapshot(), 'Resolve LBA in firmware', 'The HDD controller accepts LBA 7 and buffers payload 1011. Its firmware table selects head 0, track 1, sector 3. This is an internal mapping, not host-visible CHS geometry.', 'location = firmware_map[LBA]\ncache = host_payload', 0)
    model.encodeEcc()
    trace.record(model.snapshot(), 'Generate error-correcting redundancy', 'Extended Hamming (8,4) adds four check bits to the four-bit payload. This small SECDED example corrects one erroneous codeword bit and detects two; it is not a production HDD ECC.', 'ecc_word = hamming_secded_encode(cache)')
    model.encodeRecording()
    trace.record(model.snapshot(), 'Encode recording symbols', 'Manchester symbols turn the eight-bit ECC word into sixteen channel bits. This illustrative code is separate from both ECC and the head-current stage.', 'recording_symbols = manchester_encode(ecc_word)')
    model.seek()
    trace.record(model.snapshot(), 'Seek while the platter rotates', 'The firmware-selected track goes to servo control, then the motor driver and VCM. The arm pivots to track 1 while the platter keeps turning; the head is not yet settled.', 'servo.seek(location.track)\nplatter.continue_rotation()')
    model.settle()
    trace.record(model.snapshot(), 'Settle and begin track following', 'Embedded servo feedback confirms position. The platter continues rotating during settling, and servo control keeps tracking the requested track during access.', 'servo.settle_and_track()\nplatter.continue_rotation()')
    while (!model.aligned()) {
      model.rotate()
      trace.record(model.snapshot(), 'Wait for rotational latency', 'The requested sector rotates under the settled head. These angular samples illustrate ordering and are not measured hardware latency.', 'wait_until_target_sector_is_under_head()')
    }
    model.write()
    trace.record(model.snapshot(), 'Drive the write head', 'The preamp/write driver supplies head current. In this NRZI teaching convention, a channel 1 reverses the previous magnetization and 0 holds it, starting from a known positive reference. User bits are not direct polarity labels.', 'levels = nrzi(recording_symbols, initial = +1)\nwrite_driver.record(levels)')
    for (let rotation = 0; rotation < 8; rotation += 1) {
      model.rotate()
      trace.record(model.snapshot(), 'Return for a read pass', 'The surface keeps rotating and the servo keeps the head on track. The recorded sector returns after one illustrative revolution.', 'platter.continue_rotation()')
    }
    model.sense()
    trace.record(model.snapshot(), 'Sense and amplify readback', 'The read head and preamp recover a weak transition signal. Signed magnetization differences stand in for analog readback; they are not recovered user bits.', 'signal = preamp.sense_magnetic_transitions()')
    model.detect()
    trace.record(model.snapshot(), 'Detect channel symbols', 'Read processing detects transitions to recover the sixteen channel symbols. A real channel also performs analog conditioning, equalization, timing recovery, and detection.', 'detected_symbols = detect_transitions(signal)')
    model.decodeRecording()
    trace.record(model.snapshot(), 'Decode recording symbols', 'The recording decoder recovers the eight-bit ECC codeword. Error correction still has to validate it before user data can be returned.', 'received_ecc_word = manchester_decode(detected_symbols)')
    model.injectReadError(2)
    trace.record(model.snapshot(), 'Introduce one symbolic read error', 'Flip one-based codeword bit 3 after recording decoding to represent an erroneous channel decision. This deliberate injection demonstrates ECC independently of analog channel behavior.', 'received_ecc_word[2] ^= 1')
    model.decode()
    trace.record(model.snapshot(), 'Correct the read error with ECC', 'The Hamming syndrome identifies bit 3 and overall parity permits single-bit correction. The decoder restores the codeword and recovers payload 1011. Detected double-bit errors would block the return path.', 'result = secded_decode(received_ecc_word)\nrequire(result.valid)')
    model.bufferRead()
    trace.record(model.snapshot(), 'Buffer validated sector data', 'The recovered payload enters the data cache under buffer-controller/DMA management. The servo controller continues holding position on its separate control path.', 'cache = validated_payload')
    model.transfer()
    trace.record(model.snapshot(), 'Return the recovered sector', 'The host receives validated data 1011 through the host interface. Seek, settling, rotational latency, recording, detection, and ECC correction were separate stages.', 'host_interface.transfer(cache)\ncomplete_command()', 2)
  }
}
