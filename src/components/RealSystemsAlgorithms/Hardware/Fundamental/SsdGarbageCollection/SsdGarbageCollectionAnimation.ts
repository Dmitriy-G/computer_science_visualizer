import { ComponentInformation, ComponentLesson } from '../ComponentLesson.ts'
import type { HardwareTrace } from '../HardwareTrace.ts'
import { SsdGarbageCollectionModel } from './SsdGarbageCollectionModel.ts'
import { SsdGarbageCollectionOverview } from './SsdGarbageCollectionOverview.ts'

export class SsdGarbageCollectionAnimation extends ComponentLesson {
  public readonly title = SsdGarbageCollectionOverview.describe().name
  public static describe() { return ComponentInformation.describe(SsdGarbageCollectionOverview.describe()) }

  protected build(trace: HardwareTrace): void {
    const model = new SsdGarbageCollectionModel()
    trace.record(model.snapshot(), 'Updates left obsolete copies', 'Three initial host writes plus two replacements left two invalid pages and one live page in B0. Five host writes have caused five flash page programs.', 'write L0=A; write L1=B; write L2=C\nupdate L0=A2; update L2=C2\nhost_writes = flash_programs = 5', 0)
    const victim = model.chooseVictim()
    trace.record(model.snapshot(), 'Select a victim', 'This illustrative policy selects B0 because it contains the most invalid pages. Its live page must survive reclamation.', 'victim = most_invalid_pages(tie = lowest_block_id)\nassert victim == B0')
    const live = model.livePages(victim)
    for (const page of live) {
      const destination = model.destination(victim)
      model.copy(page, destination)
      trace.record(model.snapshot(), 'Copy a live page outside the victim', 'Program a copy of logical page one into erased space. Its old mapping and live original remain intact until the copy succeeds.', 'destination = erased_page_outside(victim)\nprogram(destination, live_page_data)\nkeep_old_mapping_until_success()')
      model.commit()
      trace.record(model.snapshot(), 'Redirect the live mapping', 'After the copy succeeds, logical page one points to the relocated B data. The original page is now invalid.', 'L2P[1] = destination\nmark_invalid(previous_copy)')
    }
    model.erase(victim)
    trace.record(model.snapshot(), 'Erase only after preservation', 'No required live page remains in B0. Whole-block erase makes all three of its pages free and increases its erase count.', 'assert no_live_or_pending_pages(victim)\nERASE(victim)\nreturn_to_free_pool(victim)')
    model.flowFrom = null
    model.flowTo = null
    model.operation = 'GC complete / WAF 6 divided by 5'
    model.output = 'L0=A2; L1=B; L2=C2'
    trace.record(model.snapshot(), 'Reclaimed space has a write cost', 'All logical values survive. Five host writes and one GC relocation produce six flash page programs: WAF = 6/5 = 1.20. Metadata writes are excluded.', 'host_writes = 5\nflash_programs = 6\nWAF = 6 / 5  // 1.20', 2)
  }
}
