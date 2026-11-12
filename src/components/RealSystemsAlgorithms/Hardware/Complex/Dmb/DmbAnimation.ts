import { HardwareInformation, HardwareLesson } from '../HardwareLesson.ts'
import type { HardwareTrace } from '../HardwareLesson.ts'
import { DmbModel } from './DmbModel.ts'

export class DmbAnimation extends HardwareLesson {
  public readonly title = 'Data Memory Barrier: DMB'
  public static describe() {
    return HardwareInformation.create('Data Memory Barrier: DMB',
      'A consumer can observe a ready flag before its associated data. DMB orders selected memory accesses within the selected shareability domain.',
      'Armv8-A AArch64', 'https://support.arm.com/documentation/102336/0100/Limiting-the-scope-of-memory-barriers?lang=en',
      'Arm defines access-type and domain options, including ISHST for stores in the Inner Shareable domain.',
      'Two cores in one Inner Shareable domain; aligned shared Normal cacheable memory. Both producer and consumer ordering are shown. The excluded observer is a scope marker, not a simulated device. DMB does not generally wait for cache maintenance to complete or make data persistent.')
  }
  protected build(trace: HardwareTrace): void {
    const plain = new DmbModel(false)
    trace.record(plain.view(), 'Publish data and a flag', 'Program order alone does not supply the required cross-address publication ordering.', 'P: STR data,42; STR flag,1\nC: LDR flag; LDR data', 0)
    plain.publish()
    trace.record(plain.view(), 'Flag becomes visible first', 'Without ordering, the flag store can be observed before the data store.', 'observe flag=1 before data=42')
    plain.readFlag(false)
    trace.record(plain.view(), 'Consumer reads the ready flag', 'The flag-load arrow returns 1 from shared memory to core 1.', 'C1: LDR flag -> 1')
    plain.readData()
    trace.record(plain.view(), 'Unordered observation', `The consumer got flag=${plain.observedFlag}, data=${plain.observedData}.`, 'LDR flag -> 1\nLDR data -> 0')
    const ordered = new DmbModel(true)
    trace.record(ordered.view(), 'Restart with DMB ordering', 'Reset the same data and flag for a producer and consumer using DMB.', 'data=0; flag=0; consumer registers unread', 0)
    const allowed = ordered.publish()
    trace.record(ordered.view(), 'DMB ISHST constrains publication', `Flag may pass pending data: ${allowed}. DMB supplies an ordering constraint; this is not a cache flush.`, 'STR data,42\nDMB ISHST\nSTR flag,1')
    ordered.publishData()
    trace.record(ordered.view(), 'Data observed in the selected domain', 'The prior data store is observed before flag publication. The scope is Inner Shareable, not every system observer.', 'inside ISH: observe data=42\noutside ISH: no guarantee from this option')
    ordered.publish()
    trace.record(ordered.view(), 'Publish flag after the data', 'After producer-side DMB ordering, the flag-store arrow publishes 1 after data 42.', 'C0: DMB ISHST\nSTR flag,1')
    ordered.readFlag(false)
    trace.record(ordered.view(), 'Consumer reads the published flag', 'Core 1 observes flag 1. Its data load has not executed yet.', 'C1: LDR flag -> 1')
    ordered.orderRead()
    trace.record(ordered.view(), 'Consumer orders its next load', 'DMB ISHLD orders the flag load before the following data load. Both CPUs are inside the selected scope.', 'C1: DMB ISHLD')
    ordered.readData()
    trace.record(ordered.view(), 'Ordered producer and consumer', `Flag=${ordered.observedFlag}, data=${ordered.observedData}. Reader DMB ISHLD orders flag-load before data-load.`, 'LDR flag -> 1\nDMB ISHLD\nLDR data -> 42', 2)
  }
}
