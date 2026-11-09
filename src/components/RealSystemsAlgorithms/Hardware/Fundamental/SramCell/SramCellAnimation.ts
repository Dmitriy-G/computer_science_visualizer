import { ComponentInformation, ComponentLesson } from '../ComponentLesson.ts'
import type { CpuTrace } from '../CpuTrace.ts'
import { SramCellModel } from './SramCellModel.ts'
import { SramCellOverview } from './SramCellOverview.ts'

export class SramCellAnimation extends ComponentLesson {
  public readonly title = SramCellOverview.describe().name
  public static describe() { return ComponentInformation.describe(SramCellOverview.describe()) }

  protected build(trace: CpuTrace): void {
    const model = new SramCellModel()
    trace.record(model.snapshot(), 'Feedback holds a powered bit', 'Two inverters hold Q = 1 and its complement = 0. With the word line low, both access transistors isolate the cell.', 'WL = 0\nQ = 1; Q_bar = 0\nfeedback holds while powered', 0)
    model.precharge()
    trace.record(model.snapshot(), 'Prepare both bit lines', 'Peripheral precharge raises both bit lines before read access; the word line stays low.', 'WL = 0\nBL = high; BL_bar = high\nrelease_precharge()')
    model.selectRead()
    trace.record(model.snapshot(), 'Select the cell for reading', 'The word line opens both access paths. The zero side weakly discharges its bit line, creating a small differential.', 'WL = 1\nBL stays high\nBL_bar falls slightly')
    model.sense()
    trace.record(model.snapshot(), 'Sense without changing the bit', 'A peripheral differential amplifier resolves the read value as one. The selected cell still holds Q = 1.', 'read_value = sense(BL - BL_bar)\nassert Q == 1')
    model.isolate()
    trace.record(model.snapshot(), 'End read access', 'Lowering the word line disconnects the cell from both bit lines.', 'WL = 0\nread_value remains 1')
    model.driveWrite(0)
    trace.record(model.snapshot(), 'Drive a complementary write', 'The write driver drives BL low and BL-complement high while the word line is still low.', 'WL = 0\nBL = 0; BL_bar = 1')
    model.write()
    trace.record(model.snapshot(), 'Access changes the stored state', 'With write drive applied, both access transistors turn on. The cell settles to Q = 0 and its complement = 1.', 'WL = 1\nQ = 0; Q_bar = 1\nwait_symbolic_settling_interval()')
    model.isolate()
    trace.record(model.snapshot(), 'Hold the replacement bit', 'The isolated cell now holds zero while powered. The earlier read result is still one; it is a peripheral sample, not the current stored bit.', 'WL = 0\nfeedback retains Q = 0\nprevious_read_sample = 1', 2)
  }
}
