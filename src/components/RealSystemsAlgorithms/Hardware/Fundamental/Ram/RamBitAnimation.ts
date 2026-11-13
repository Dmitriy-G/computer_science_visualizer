import { ComponentLesson } from '../ComponentLesson.ts'
import type { HardwareTrace } from '../HardwareTrace.ts'
import { RamBitLayout } from './RamBitLayout.ts'
import { RamBitModel } from './RamBitModel.ts'
import type { RamBitCommand, RamBitOperation } from './RamBitModel.ts'

export abstract class RamBitAnimation extends ComponentLesson {
  protected abstract readonly operation: RamBitOperation

  protected build(trace: HardwareTrace): void {
    const model = new RamBitModel(this.operation)
    this.record(trace, model, 'Precharged bank', 'The selected cell is row 0, column 1, lane 0. Bitlines are equalized near half supply, wordlines are low, and the row buffer is empty. Only one bit of a wider DDR transfer is followed.', null, false, 0)
    this.command(trace, model, 'ACTIVATE')
    this.record(trace, model, 'Select row 0', 'The row decoder receives row 0. Column 1 will be selected later; activation concerns the whole row.', 'ram-control-row')
    model.activate()
    this.record(trace, model, 'Connect the row', 'The wordline enables the access transistors for the entire row. Cell charge shares with each bitline, producing a small signal; the selected capacitor is now shown with shared charge.', 'ram-word-line-0')
    model.sense()
    this.record(trace, model, 'Sense the row', 'Bank-local sense amplifiers resolve the small signals and hold the whole row. The selected bit is one entry in that row buffer.', 'ram-bit-line-0')
    model.driveBitline()
    this.record(trace, model, 'Drive the bitline', 'The active sense amplifier drives the selected bitline to a full logical level while the wordline remains high.', 'ram-bit-line-0', true)
    model.restore()
    this.record(trace, model, 'Restore the cells', 'The sense amplifiers restore charge in all cells of the open row. This completes restoration before the column access; precharge is a separate later operation.', 'ram-storage-node')
    if (this.operation === 'write') this.write(trace, model)
    else this.read(trace, model)
    this.command(trace, model, 'PRECHARGE')
    this.record(trace, model, 'Close the wordline', 'After the required active and recovery intervals, control asks the row decoder to close the row.', 'ram-control-row')
    model.disconnect()
    this.record(trace, model, 'Isolate the capacitors', 'The wordline goes low and access transistors turn off. Restored capacitor charge is now isolated from the bitlines.', 'ram-word-line-0')
    model.precharge()
    this.record(trace, model, 'Equalize the bitlines', 'PRECHARGE equalizes the bitlines near half supply and releases the active row buffer. Stored cell values remain intact.', null)
    const description = this.operation === 'write'
      ? `The selected cell now stores ${model.bit}; its neighbors and the other row retain their initial values. The write followed one payload bit within a wider transfer, not a physical one-bit DDR command.`
      : `The controller received ${model.controllerData}. Reading and restoration preserved every stored bit, including the selected cell. The returned bit is one part of a wider DDR burst.`
    this.record(trace, model, this.operation === 'write' ? 'Bit stored' : 'Bit read', description, null, false, 2)
  }

  private write(trace: HardwareTrace, model: RamBitModel): void {
    this.command(trace, model, 'WRITE')
    model.selectColumn()
    this.record(trace, model, 'Select column 1', 'The column decoder selects column 1 in the already active row. This illustrates one lane of a wider write transfer.', 'ram-control-column')
    model.socketData = model.bit
    this.record(trace, model, 'Send the write bit', `The controller sends the selected payload bit ${model.bit} through the DIMM socket.`, 'ram-controller-data', true)
    model.ioData = model.socketData
    this.record(trace, model, 'Buffer input data', 'The write bit arrives in the chip input buffer. The capacitor still holds its previous value.', 'ram-io-socket', true)
    model.columnData = model.ioData
    this.record(trace, model, 'Route the selected data', 'Chip I/O routes this payload bit to the selected column path.', 'ram-column-io', true)
    model.driveWriteBuffer()
    this.record(trace, model, 'Drive the row-buffer bit', 'The write driver changes the selected row-buffer entry. Neighboring entries retain their values; the capacitor changes when the driven signal reaches it.', 'ram-sense-column', true)
    model.driveBitline()
    this.record(trace, model, 'Drive the write bitline', 'The selected bitline carries the new logical level through the enabled access transistor.', 'ram-bit-line-0', true)
    model.storeWrite()
    this.record(trace, model, 'Store capacitor charge', `The capacitor is driven to the symbolic level for ${model.bit}. Only the selected data cell changes in this bounded example.`, 'ram-storage-node')
    model.recoverWrite()
    this.record(trace, model, 'Complete write recovery', 'Keep the row open until write recovery and restoration requirements have completed. These are symbolic waits, not measured DRAM timings.', null)
  }

  private read(trace: HardwareTrace, model: RamBitModel): void {
    this.command(trace, model, 'READ')
    model.selectColumn()
    this.record(trace, model, 'Select column 1', 'The column decoder selects the target bit from the active row buffer. The capacitor is not read directly onto the external data bus.', 'ram-control-column')
    model.readColumn()
    this.record(trace, model, 'Read the row-buffer bit', 'The selected row-buffer value enters the column data path. Other columns remain stored in the open row buffer.', 'ram-sense-column')
    model.ioData = model.columnData
    this.record(trace, model, 'Buffer output data', 'The selected bit reaches the chip output buffer as part of a wider DDR read burst.', 'ram-column-io')
    model.socketData = model.ioData
    this.record(trace, model, 'Return through the socket', 'The chip output buffer drives the selected read bit toward the DIMM socket and controller.', 'ram-io-socket')
    model.receiveRead()
    this.record(trace, model, 'Receive the read bit', `The memory controller receives ${model.controllerData}. Stored cell data has been restored and remains unchanged.`, 'ram-controller-data')
  }

  private command(trace: HardwareTrace, model: RamBitModel, command: RamBitCommand): void {
    model.socketCommand = command
    this.record(trace, model, `${command} at socket`, `The controller issues ${command} and the relevant address fields through the socket command interface.`, 'ram-controller-command')
    model.controlCommand = command
    this.record(trace, model, `Decode ${command}`, `The DRAM control logic receives and decodes ${command}. Data uses a separate bidirectional path.`, 'ram-socket-control')
  }

  private record(trace: HardwareTrace, model: RamBitModel, title: string, description: string, path: string | null, reverse = false, phase = 1): void {
    trace.record(RamBitLayout.create(model, { path, reverse, status: title }), title, description, '', phase)
  }
}
