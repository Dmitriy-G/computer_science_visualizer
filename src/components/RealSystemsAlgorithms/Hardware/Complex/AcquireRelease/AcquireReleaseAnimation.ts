import { HardwareInformation, HardwareLesson } from '../HardwareLesson.ts'
import type { HardwareTrace } from '../HardwareLesson.ts'
import { AcquireReleaseModel } from './AcquireReleaseModel.ts'

export class AcquireReleaseAnimation extends HardwareLesson {
  public readonly title = 'Acquire/release: LDAR and STLR'
  public static describe() {
    return HardwareInformation.create('Acquire/release: LDAR and STLR',
      'A flag must publish earlier data, and a reader must consume data after observing that flag. STLR release and LDAR acquire provide the required directional ordering.',
      'Armv8-A AArch64', HardwareInformation.arm, 'Arm documents load-acquire and store-release instruction ordering for synchronization.',
      'A single producer/consumer with aligned Normal cacheable memory. The consumer must read the releasing flag store before relying on the data. The illustrative early load is not a claimed speculation algorithm or cache invalidation. Atomicity and ordering remain separate; no persistence claim.')
  }
  protected build(trace: HardwareTrace): void {
    const plain = new AcquireReleaseModel()
    trace.record(plain.view('plain'), 'A ready flag must publish data', 'A plain load/store pair does not establish publication ordering.', 'P: STR data,42; STR flag,1\nC: LDR flag; LDR data', 0)
    plain.speculateData()
    trace.record(plain.view('plain'), 'Consumer loads data too early', 'The arrow takes 0 from shared memory into an early consumer result before the producer publishes 42.', 'C1: early LDR data -> 0')
    plain.publishData()
    trace.record(plain.view('plain'), 'Producer writes the shared data', 'Core 0 writes 42 to the shared data location. The consumer still holds its earlier load result.', 'C0: STR data,42')
    plain.publishFlag(false)
    trace.record(plain.view('plain'), 'Producer publishes a plain flag', 'The flag write travels from core 0 to shared memory.', 'C0: STR flag,1')
    plain.readFlag(false)
    trace.record(plain.view('plain'), 'Consumer reads the flag', 'Core 1 reads 1, but a plain load supplies no acquire ordering for its early data result.', 'C1: LDR flag -> 1')
    plain.readData()
    trace.record(plain.view('plain'), 'An early data read can be stale', `Plain loads can produce flag=${plain.observedFlag}, data=${plain.observedData} because the data load occurred early. Coherence alone does not order these locations.`, 'early LDR data -> 0\nthen LDR flag -> 1')
    const model = new AcquireReleaseModel()
    trace.record(model.view(), 'Restart with acquire/release', 'Reset the same data and flag before using STLR and LDAR.', 'data=0; flag=0; consumer registers unread', 0)
    const published = model.stlr()
    trace.record(model.view(), 'Release constrains earlier accesses', `Release may publish ahead of pending data: ${published}.`, 'STR data,42\nSTLR flag,1')
    model.publishData()
    trace.record(model.view(), 'Write data before releasing the flag', 'The data-write arrow connects the producer CPU to the shared data location containing 42.', 'C0: STR data,42')
    model.stlr()
    trace.record(model.view(), 'Publish with STLR', 'Earlier data writes precede the release flag for the synchronizing observer.', 'STR data,42\nSTLR flag,1')
    model.ldar()
    trace.record(model.view(), 'Acquire reads the release', 'LDAR returns 1 from the release flag store. Subsequent data access must follow this acquire.', 'LDAR wFlag,[flag] -> 1\nif zero: retry')
    model.readData()
    trace.record(model.view(), 'Consume the published data', `The synchronized data load returns ${model.observedData}. Neither instruction is a general cache flush.`, 'LDR wData,[data] -> 42', 2)
  }
}
