import { HardwareInformation, HardwareLesson } from '../HardwareLesson.ts'
import type { HardwareTrace } from '../HardwareLesson.ts'
import { TranslationModel } from './TranslationModel.ts'

export class TranslationAnimation extends HardwareLesson {
  public readonly title = 'TLB lookup and translation-table walking'
  public static describe() {
    return HardwareInformation.create('TLB lookup and translation-table walking',
      'Repeated page-table reads make address translation expensive. A hardware walker follows translation descriptors on a miss and caches the resulting mapping in the TLB.',
      'Arm Cortex-A710', 'https://support.arm.com/documentation/101800/0201/Memory-management/Translation-table-walks',
      'The Cortex-A710 TRM describes hardware translation-table walks and cached translations.',
      'One illustrative 48-bit stage-1 VA, 4 KiB pages, four levels, one ASID and one cached mapping. General Arm maintenance is configuration-dependent. The displayed break-before-make remap quiesces accesses and explicitly completes TLBI before installing a new valid mapping; no claim to implement a complete OS page-table updater.')
  }
  protected build(trace: HardwareTrace): void {
    const model = new TranslationModel()
    trace.record(model.snapshot(), 'Split a virtual address', 'Use four 9-bit table indices and a 12-bit offset. Table addresses and frame numbers are illustrative.', 'VA[47:39], [38:30], [29:21], [20:12], offset[11:0]', 0)
    model.begin()
    trace.record(model.snapshot(), 'TLB miss', 'No cached translation exists. Start at the root table selected by TTBR0_EL1.', 'lookup (ASID, virtual page) -> miss\nwalker = TTBR0_EL1')
    while (model.walking) {
      const level = model.level
      model.walkNext()
      trace.record(model.snapshot(), `Read level ${level}`, `Read descriptor index ${model.indices[level]}. ${model.walking ? 'Its next-table address selects the following level.' : 'The page descriptor supplies a physical frame; retain the original offset and fill the TLB.'}`, `descriptor = table[L${level} index]\n${model.walking ? 'table = descriptor.next_table' : 'PA = frame * 4096 + offset; fill TLB'}`)
    }
    model.begin()
    trace.record(model.snapshot(), 'Repeat translation: TLB hit', `No more table reads are needed: total remains ${model.reads}.`, 'cached frame + page offset -> PA')
    model.breakMapping()
    trace.record(model.snapshot(), 'Break the old mapping', 'Quiesce accesses and replace the valid PTE with invalid. The TLB still contains the old translation, showing why a table write alone is insufficient.', 'STR invalid,[PTE]\n// no accesses during remapping')
    model.publishBreak()
    trace.record(model.snapshot(), 'Publish the invalid descriptor', 'DSB ISHST ensures the PTE change is visible before translation invalidation.', 'DSB ISHST')
    model.tlbi()
    trace.record(model.snapshot(), 'Invalidate the cached translation', 'Issue the appropriately scoped VA/ASID invalidation. It has not yet completed.', 'TLBI VAE1IS, <ASID,VA>')
    model.completeTlbi()
    trace.record(model.snapshot(), 'Complete translation maintenance', 'DSB ISH waits for completion; ISB synchronizes this core\'s context before reuse.', 'DSB ISH\nISB')
    model.makeMapping(0x90000)
    trace.record(model.snapshot(), 'Make the new mapping', 'Install the replacement page descriptor and publish it before resuming accesses in this simplified sequence.', 'STR new_valid_PTE,[PTE]\nDSB ISHST')
    model.begin()
    trace.record(model.snapshot(), 'Replacement mapping causes a fresh TLB miss', 'The CPU must consult the memory-resident translation tables again after invalidating the old cached mapping.', 'TLB lookup -> miss')
    while (model.walking) {
      const level = model.level
      model.walkNext()
      trace.record(model.snapshot(), `Refill reads level ${level}`, 'Follow the table-walk arrow to the next descriptor. The final descriptor points to the replacement frame.', `read L${level} descriptor`)
    }
    trace.record(model.snapshot(), 'Refill from the new mapping', `The new walk computes PA 0x${model.physical!.toString(16)}. The page offset is unchanged. Four additional descriptor reads were executed.`, 'TLB miss -> L0 -> L1 -> L2 -> L3 -> new PA', 2)
  }
}
