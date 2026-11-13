import { ComponentInformation, ComponentLesson } from '../ComponentLesson.ts'
import type { CpuTrace } from '../CpuTrace.ts'
import { NandCellModel } from './NandCellModel.ts'
import { NandCellOverview } from './NandCellOverview.ts'

export class NandCellAnimation extends ComponentLesson {
  public readonly title = NandCellOverview.describe().name
  public static describe() { return ComponentInformation.describe(NandCellOverview.describe()) }

  protected build(trace: CpuTrace): void {
    const model = new NandCellModel()
    trace.record(model.snapshot(), 'Erased SLC cells', 'All pages in this conceptual block contain erased ones. Low threshold permits conduction at the read reference.', 'block.pages = [1111, 1111, 1111]\nall_pages_erased = true', 0)
    model.operation = 'load page buffer'
    trace.record(model.snapshot(), 'Load a page', 'The controller loads 1010 into the page buffer before programming. Page size is symbolic.', 'page_buffer = [1, 0, 1, 0]')
    this.showEncoding(trace, model)
    model.program(0)
    trace.record(model.snapshot(), 'PROGRAM page zero', 'Programming the zero positions adds charge and raises their thresholds. Cells left as one remain in the erased threshold range.', 'PROGRAM(page = 0, data = 1010)\nraise_threshold_for_zero_cells()')
    model.read(0)
    trace.record(model.snapshot(), 'READ by reference sensing', 'Read reference voltage distinguishes conducting low-threshold ones from nonconducting high-threshold zeros, recovering 1010.', 'READ(page = 0)\nsense_current_at_reference()\ndecoded = 1010')
    model.operation = 'ECC check'
    trace.record(model.snapshot(), 'Separate controller ECC', 'Decoded page data reaches a controller error-control stage. The bit-level ECC algorithm is outside this cell-storage lesson.', 'controller_ecc_stage(decoded_page)  // identified, not computed')
    model.buffer = [0, 0, 1, 1]
    model.selectedPage = 1
    this.showEncoding(trace, model)
    model.program(1)
    trace.record(model.snapshot(), 'Program a neighboring page', 'Page one now contains other data in the same erase block. The coming erase affects both pages.', 'PROGRAM(page = 1, data = 0011)')
    model.buffer = [0, 1, 0, 1]
    model.selectedPage = 0
    model.program(0)
    trace.record(model.snapshot(), 'Reject arbitrary overwrite', 'Trying to replace page zero with 0101 is rejected. Its existing 1010 stays intact; this policy requires erased space.', 'if page_is_programmed: reject_overwrite()\nassert page[0] == 1010')
    model.eraseBlock()
    trace.record(model.snapshot(), 'ERASE the whole block', 'All three pages return to erased ones, including page one. There is no independent page erase.', 'ERASE(block = 0)\nall_pages = 1111\nerase_count += 1')
    this.showEncoding(trace, model)
    model.program(0)
    trace.record(model.snapshot(), 'Reuse erased space', 'Page zero can now hold 0101. Page one remains erased; its old data was removed by the whole-block erase.', 'PROGRAM(page = 0, data = 0101)\npage[1] == 1111', 2)
  }

  private showEncoding(trace: CpuTrace, model: NandCellModel): void {
    model.operation = 'ECC encode'
    trace.record(model.snapshot(), 'Controller ECC encoding stage', 'Before page programming, the payload passes through controller ECC encoding. This cell-storage lesson identifies that stage without computing parity bits or a production ECC code.', 'controller_ecc_encode_stage(page_buffer)  // identified, not computed')
  }
}
