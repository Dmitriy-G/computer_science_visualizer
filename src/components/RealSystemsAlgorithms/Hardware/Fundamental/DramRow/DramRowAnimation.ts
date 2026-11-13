import { ComponentInformation, ComponentLesson } from '../ComponentLesson.ts'
import type { HardwareTrace } from '../HardwareTrace.ts'
import { DramRowModel } from './DramRowModel.ts'
import { DramRowOverview } from './DramRowOverview.ts'

export class DramRowAnimation extends ComponentLesson {
  public readonly title = DramRowOverview.describe().name
  public static describe() { return ComponentInformation.describe(DramRowOverview.describe()) }

  protected build(trace: HardwareTrace): void {
    const model = new DramRowModel()
    trace.record(model.snapshot(), 'Precharged bank', 'Both rows are isolated. Bit lines start equalized near half supply, ready for a small cell signal.', 'all_word_lines = 0\nbit_lines = VDD / 2', 0)
    model.activate(0)
    trace.record(model.snapshot(), 'ACTIVATE row zero', 'The selected word line connects all three row capacitors to their bit lines. Charge sharing perturbs the stored charge and creates small signal differences.', 'ACTIVATE(row = 0)\nshare_cell_charge_with_bit_lines()')
    model.sense()
    trace.record(model.snapshot(), 'Sense into the row buffer', 'Sense amplifiers resolve the differences to 1, 0, 1. These resolved signals also begin driving charge back toward the cells.', 'row_buffer = sense_amplifiers.resolve()\nrow_buffer == [1, 0, 1]')
    model.restore()
    trace.record(model.snapshot(), 'Complete row restoration', 'The active sense amplifiers restore all cells in the open row. Precharge is a later preparation step, not the source of restoration.', 'keep_word_line_high()\nsense_amplifiers.restore_cells()\nwait_symbolic_restoration_interval()')
    model.read(0)
    trace.record(model.snapshot(), 'READ a column', 'The column selection transfers column zero from the open row buffer: one.', 'READ(column = 0)\nreturn row_buffer[0]  // 1')
    model.read(2)
    trace.record(model.snapshot(), 'Another column is a row hit', 'Column two is already in the same active row buffer. No new activation or precharge is needed.', 'READ(column = 2)  // same open row\nreturn row_buffer[2]  // 1')
    model.write(1, 1)
    trace.record(model.snapshot(), 'WRITE into the open row', 'The selected column and its cell become one. The bank must satisfy write recovery before closing.', 'WRITE(column = 1, value = 1)\nrow_buffer[1] = cell[0][1] = 1')
    model.recover()
    trace.record(model.snapshot(), 'Wait before closing', 'Restoration and symbolic write-recovery requirements have completed. No nanosecond timings are invented.', 'wait_until_restoration_and_write_recovery_complete()')
    model.precharge()
    trace.record(model.snapshot(), 'PRECHARGE to change rows', 'Disconnect row zero and equalize bit lines near half supply. The cells retain their restored values 1, 1, 1.', 'word_line[0] = 0\nequalize_bit_lines(VDD / 2)')
    model.activate(1)
    trace.record(model.snapshot(), 'ACTIVATE a different row', 'A row conflict required closing row zero first. Row one now shares its 0, 1, 0 signals with the prepared bit lines.', 'ACTIVATE(row = 1)\nshare_cell_charge_with_bit_lines()')
    model.sense()
    trace.record(model.snapshot(), 'Sense the new row', 'The same peripheral sense amplifiers now hold row one, replacing the previous row-buffer contents.', 'row_buffer = [0, 1, 0]')
    model.restore()
    trace.record(model.snapshot(), 'Restore the new row', 'While row one remains connected, sensing restores its capacitor charge.', 'sense_amplifiers.restore_cells()')
    model.read(0)
    trace.record(model.snapshot(), 'READ the newly opened row', 'Column zero of row one returns zero. Row zero still holds the written one in column one.', 'READ(column = 0)  // row 1\nreturn 0', 2)
  }
}
