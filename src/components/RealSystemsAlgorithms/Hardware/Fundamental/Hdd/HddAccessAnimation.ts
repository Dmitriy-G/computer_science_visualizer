import type { ActionDefinition, ActionPlan } from '../../../../../visualization/ActionDefinition.ts'
import type { HardwareSnapshot } from '../HardwareSnapshot.ts'
import { HddAccessModel } from './HddAccessModel.ts'
import type { HddAccessOperation } from './HddAccessModel.ts'
import { HddAccessTrace } from './HddAccessTrace.ts'
import { HddAccessOverview } from './HddAccessOverview.ts'

export class HddAccessAnimation implements ActionDefinition<HardwareSnapshot> {
  public readonly title: string
  private readonly kind: HddAccessOperation

  constructor(kind: HddAccessOperation) {
    this.kind = kind
    this.title = HddAccessOverview.create(kind).name
  }

  public create(_source: HardwareSnapshot): ActionPlan<HardwareSnapshot> {
    const memory = new HddAccessModel(this.kind)
    const trace = new HddAccessTrace(memory)
    const write = this.kind === 'write'
    trace.start(`Access one 512-byte native logical/physical sector in a 512n teaching example. A complete sector is the minimum host-addressable unit here; 512e and 4Kn differ. LBA 7 maps to H0 / T1 / S3. ${write ? 'Replace the old sector with new payload; preserve its neighbor.' : 'Read the pre-recorded sector without changing its magnetization.'} Hamming (8,4), Manchester, and NRZI are teaching formats, not a production HDD format.`)
    trace.transfer('hdd-external-host', 'hdd-data-connector', write ? 'WRITE / LBA 7' : 'READ / LBA 7', 'Submit one-sector request', 'The request arrives through a drive-appropriate SATA or SAS attachment.', true)
    trace.transfer('host-controller', 'hdd-controller', write ? 'WRITE / 512 B' : 'READ / 512 B', 'Accept sector command', 'The HDD controller schedules one complete logical sector.')
    trace.transfer('controller-map', 'hdd-firmware-map', 'LBA 7 / H0 T1 S3', 'Look up physical location', 'Translate the logical address through the teaching map. Production maps can account for zones and defect-remapped spare sectors; those policies are not simulated.')
    trace.signal('controller-map', 'Return mapped location', 'Return the location to the controller. Servo and data processing remain under direct controller control.', true)
    trace.signal('hdd-media-enlargement', 'Select recording media', 'The media enlargement shows this same head 0, track 1, sector 3. Its payload, ECC, writer, reader, and magnetic pattern participate in the access; this leader is an enlargement association, not another data cable.')
    if (write) {
      const payload = HddAccessModel.payload()
      const summary = HddAccessModel.summary(payload)
      trace.transfer('hdd-external-host', 'hdd-data-connector', summary, 'Send sector payload', 'Transfer all 512 payload bytes to the drive interface.', true)
      trace.signal('buffer-control', 'Configure data buffering', 'The controller directly manages the cache and host transfer; mapping is not in this payload route.')
      memory.receive(payload)
      trace.transfer('host-cache', 'hdd-cache', summary, 'Cache write data', 'The DRAM cache receives an independent copy of all sector bytes; the recording surface still contains old data.')
      trace.local('hdd-sector-payload', `Pending / ${summary}`, 'Stage sector payload', 'Show the requested replacement bytes in the sector access view. They are pending; the magnetic intervals below still contain the previous recording.')
      memory.encodeEcc()
      trace.transfer('cache-ecc', 'hdd-ecc', '1024 Hamming words', 'Encode sector ECC', 'Apply the existing Hamming (8,4) teaching code to every nibble: 512 payload bytes produce 1024 eight-bit codewords. This redundancy is not a real HDD sector layout.')
      trace.local('hdd-sector-format', 'ECC / 1024 teaching codewords', 'Prepare sector protection', 'Sector protection belongs to the recording format in addition to the 512-byte user payload. This teaching code is not production format overhead.')
      memory.encodeRecording()
      trace.transfer('ecc-write', 'hdd-write-channel', '16384 symbols', 'Encode recording symbols', 'Encode the full protected sector into Manchester symbols for the teaching NRZI magnetization pipeline.')
    }
    trace.position()
    if (write) this.write(memory, trace)
    else this.read(memory, trace)
    return { steps: trace.steps, result: trace.result.clone() }
  }

  private write(memory: HddAccessModel, trace: HddAccessTrace): void {
    trace.signal('controller-write', 'Enable positioned write', 'Only after seek, settling, and rotational alignment does the controller enable write processing.')
    trace.transfer('write-preamp', 'hdd-preamp', 'head-current symbols', 'Drive write preamp', 'The Write Encoder supplies the protected recording stream to the preamp/head-current driver.')
    trace.signal('preamp-head', 'Energize write pole', 'The preamp supplies current to the same head whose write pole is enlarged in the recording-media view.')
    trace.recordIntervals()
    memory.write()
    trace.endMediaWindow()
    trace.transfer('hdd-storage-write-field', 'hdd-magnetic-grains', 'All 16384 teaching intervals recorded', 'Record the sector', 'Finish the remaining magnetic intervals as a group after stepping through the first 16. All 512 modeled payload bytes are replaced; the neighboring sector is preserved. Each interval is encoded magnetization, not a direct user bit.')
    trace.local('hdd-sector-payload', `Stored / ${HddAccessModel.summary(memory.storedData())}`, 'Retain recorded payload', 'The complete encoded sector is now recorded in the magnetic film.')
    memory.rotate()
    trace.local('hdd-write-channel', 'write gate closed', 'End sector write', 'Close the write gate at the end of the selected sector while the spindle and servo continue running.')
    trace.local('hdd-preamp', 'idle', 'Release write current', 'Stop driving write current after the recording window.')
    trace.local('hdd-write-pole', 'field OFF / data retained', 'Remove write field', 'The plus/minus pattern remains in remanent grain magnetization after the write field is removed; it does not need a DRAM refresh.')
    trace.local('hdd-controller', 'media write done', 'Complete media write', 'This scenario waits for recording before completion; it does not model write-cache flushes, power-loss recovery, or a measured durability guarantee.')
    trace.transfer('host-controller', 'hdd-data-connector', 'WRITE complete', 'Return write status', 'The controller completes the one-sector write through the host interface.', true)
    trace.signal('hdd-external-host', 'Deliver write completion', 'The host receives completion after the modeled media write.')
    trace.finish('One sector written', `${HddAccessModel.summary(memory.storedData())} is stored at LBA 7. The complete neighboring sector is unchanged. No flash-style erase operation is required.`)
  }

  private read(memory: HddAccessModel, trace: HddAccessTrace): void {
    trace.signal('controller-read', 'Enable positioned read', 'After alignment, the controller enables read processing directly.')
    memory.sense()
    trace.signal('hdd-storage-read-field', 'Sense recorded magnetization', 'Stray fields from the moving magnetic pattern affect the separate MR read sensor. Its resistance responds to the field; no data is stored in the reader and the grains are not rewritten. Analog sensor response is abstracted.')
    trace.scanIntervals()
    trace.endMediaWindow()
    trace.local('hdd-magnetic-grains', 'Read complete / magnetization unchanged', 'Preserve recorded pattern', 'The first 16 encoded intervals were scanned individually. The remaining intervals are grouped in the full-sector readback; the entire stored pattern remains unchanged.')
    trace.transfer('head-preamp', 'hdd-preamp', 'signed transitions', 'Sense magnetic readback', 'Recover a symbolic signed transition signal from the stored magnetic intervals. Reading does not change magnetization.')
    trace.transfer('preamp-read', 'hdd-read-channel', 'readback signal', 'Condition read signal', 'The preamp passes the amplified head signal into Read Processing, independently of the write path.')
    memory.rotate()
    memory.detect()
    trace.local('hdd-read-channel', 'symbols detected', 'Detect recording symbols', 'Detect transitions for the full sector in the teaching recording format.')
    memory.decodeRecording()
    trace.local('hdd-read-channel', '8192 protected bits', 'Decode recording format', 'Decode Manchester symbols into the protected Hamming codewords before ECC processing.')
    if (!memory.correct()) throw new Error('HDD example contains an uncorrectable sector')
    trace.transfer('read-ecc', 'hdd-ecc', 'SECDED / clean', 'Check sector ECC', 'Decode all 1024 protected nibbles and recover 512 bytes. The normal read lesson injects no errors; detected uncorrectable codewords block delivery.')
    trace.local('hdd-sector-format', 'ECC / checked clean', 'Validate sector protection', 'The recording-format check passed before any recovered user data can be delivered.')
    memory.bufferRead()
    const summary = HddAccessModel.summary(memory.cacheData())
    trace.transfer('ecc-cache', 'hdd-cache', summary, 'Cache validated sector', 'Only ECC-validated data reaches the host-visible DRAM buffer.')
    trace.local('hdd-sector-payload', `Validated / ${summary}`, 'Recover sector payload', 'The payload view shows the validated 512 bytes recovered from the magnetic intervals and sector protection.')
    trace.transfer('cache-host', 'hdd-data-connector', summary, 'Return sector payload', 'Return all 512 checked payload bytes through the host interface.')
    memory.deliver()
    trace.signal('hdd-external-host', 'Deliver sector data', 'The full recovered sector reaches the host without changing stored data.')
    trace.local('hdd-preamp', 'idle', 'End sector read', 'End the selected read window; the spindle and servo remain active.')
    trace.local('hdd-read-sensor', 'idle / medium unchanged', 'Release read sensor', 'End the symbolic sensing window without changing the recorded grain orientations.')
    trace.transfer('host-controller', 'hdd-data-connector', 'READ complete', 'Complete read command', 'Return command completion after the data response.', true)
    trace.signal('hdd-external-host', 'Deliver read completion', 'Complete the one-sector host request.')
    trace.finish('One sector read', `Returned ${HddAccessModel.summary(memory.returnedData())}. Both stored sectors, magnetization, and the logical-to-physical mapping remain unchanged.`)
  }
}
