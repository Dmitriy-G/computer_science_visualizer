import { ComponentInformation, ComponentLesson } from '../ComponentLesson.ts'
import type { CpuTrace } from '../CpuTrace.ts'
import { SsdWearLevelingModel } from './SsdWearLevelingModel.ts'
import { SsdWearLevelingOverview } from './SsdWearLevelingOverview.ts'

export class SsdWearLevelingAnimation extends ComponentLesson {
  public readonly title = SsdWearLevelingOverview.describe().name
  public static describe() { return ComponentInformation.describe(SsdWearLevelingOverview.describe()) }

  protected build(trace: CpuTrace): void {
    const model = new SsdWearLevelingModel()
    trace.record(model.snapshot(), 'Separate data validity from wear', 'B0 holds cold data and has zero erases; B1 and B2 are free with counts four and six. Free does not mean unworn.', 'erase_counts = [0, 4, 6]\nL2P[0] = B0.P0  // cold data', 0)
    model.compareAllocations()
    trace.record(model.snapshot(), 'Compare equal erase workloads', 'A separate counter-only scenario starts at 4/4/0 and adds six reuse cycles. Always choosing B0 gives 10/4/0 (spread 10); lowest-count free allocation gives 5/5/4 (spread 1). These are not erases of the displayed cold-data blocks.', 'comparison_start = [4, 4, 0]\nfixed_block_after_6 = [10, 4, 0]\nlowest_count_after_6 = [5, 5, 4]')
    const dynamic = model.chooseLowWearFreeBlock()
    trace.record(model.snapshot(), 'Dynamic choice considers free blocks', 'B1 is the lower-wear free block. B0 has a lower count, but cold data keeps it outside the free-block candidate set.', 'candidates = fully_erased_blocks()\nchoose min(erase_count, block_id)  // B1')
    model.program(1, 'hot', dynamic * 3)
    trace.record(model.snapshot(), 'Write hot data to the chosen block', 'The new host write programs an erased page in B1. Programming alone does not increment the erase counter.', 'program(B1.P0, hot)\nassert erase_counts == [0, 4, 6]')
    model.commit()
    trace.record(model.snapshot(), 'Publish the hot-data mapping', 'Logical page one now maps to B1. Cold data still pins low-wear B0.', 'L2P[1] = B1.P0\nL2P[0] remains B0.P0')
    const coldDestination = model.coldDestination()
    model.copy(0, coldDestination)
    trace.record(model.snapshot(), 'Static leveling moves cold data', 'Copy cold data to an erased page of higher-wear B2. This frees low-wear capacity for future hot updates after mapping and erase.', 'program(B2.P0, copy_of_cold_data)\nkeep L2P[0] = B0.P0 until success')
    model.commit()
    trace.record(model.snapshot(), 'Publish the relocated cold mapping', 'The cold data now maps to B2. Its old B0 page becomes invalid; the relocation added a flash program without a host write.', 'L2P[0] = B2.P0\nmark_invalid(B0.P0)\nrelocation_flash_programs += 1')
    model.erase(0)
    trace.record(model.snapshot(), 'Release the lightly worn block', 'Erasing B0 raises its count from zero to one and makes it fully free. Counts are now 1/4/6, with spread five instead of six.', 'assert B0 has no live pages\nERASE(B0)\nerase_counts = [1, 4, 6]')
    model.chooseLowWearFreeBlock()
    model.output = 'cold in B2; hot in B1'
    trace.record(model.snapshot(), 'Low-wear space can serve future hot writes', 'Dynamic allocation can now choose free B0. Static relocation cost one extra flash program and one erase; it did not make all blocks equally worn or promise a fixed lifetime gain.', 'next_hot_block = B0\nextra_relocation_programs = 1\nspread = max(erase_counts) - min(erase_counts)  // 5', 2)
  }
}
