import type { ActionDefinition, ActionPlan } from '../../../../../visualization/ActionDefinition.ts'
import type { HardwareSnapshot } from '../HardwareSnapshot.ts'
import { SsdPageModel } from './SsdPageModel.ts'
import type { SsdPageOperation } from './SsdPageModel.ts'
import { SsdPageOverview } from './SsdPageOverview.ts'
import { SsdPageTrace } from './SsdPageTrace.ts'

export class SsdPageAnimation implements ActionDefinition<HardwareSnapshot> {
  public readonly title: string
  private readonly operation: SsdPageOperation

  constructor(operation: SsdPageOperation) {
    this.operation = operation
    this.title = SsdPageOverview.create(operation).name
  }

  public create(_source: HardwareSnapshot): ActionPlan<HardwareSnapshot> {
    const memory = new SsdPageModel(this.operation)
    const trace = new SsdPageTrace(memory)
    const write = this.operation === 'write'
    trace.start(`Follow one complete 2 KiB NAND data page plus its conceptual spare/ECC area. This is the minimum normal page access used by this teaching model, not a universal host-sector minimum. Four aligned 512-byte logical sectors map to one page. Bit 0 of its first byte is enlarged; ${write ? 'the destination is erased (bit 1)' : 'the stored first byte is A4 (bit 0)'}.`)
    trace.transfer('ssd-external-host', 'ssd-data', write ? 'WRITE / 2048 B' : 'READ / 2048 B', 'Submit host request', 'The host requests one aligned page-sized range over PCIe with NVMe protocol, or SATA.', true)
    trace.transfer('ssd-data-interface', 'ssd-host-interface', write ? 'WRITE LBA 0..3' : 'READ LBA 0..3', 'Receive logical command', 'The host interface accepts four 512-byte sectors in this illustrative configuration.')
    trace.transfer('ssd-host-ftl', 'ssd-physical-address', write ? 'CH0 / B0 / P0 reserved' : 'CH0 / B0 / P0 mapped', write ? 'Reserve erased page' : 'Look up page', write ? 'Choose known-erased P0. This is allocation metadata; the new mapping is not published yet.' : 'Look up the existing mapping in volatile metadata; no program or erase is issued.')
    if (write) {
      memory.receive(SsdPageModel.payload())
      trace.transfer('ssd-interface-dma', 'ssd-dma', '2048 B / A4 B5 ...', 'Receive write payload', 'The DMA/data buffer receives all 2048 payload bytes, copied independently from the host source.')
      memory.encode()
      trace.transfer('ssd-buffer-encode', 'ssd-ecc-encode', 'encode / concept', 'Encode page redundancy', 'The controller adds error-control redundancy in a separate stage. ECC bits and spare placement are identified but not computed in this model.')
      trace.transfer('ssd-encode-nand', 'ssd-nand-command-io', 'page + ECC / concept', 'Stage encoded page', 'The encoded page is ready for the selected NAND channel.')
    }
    trace.command(write)
    if (write) this.write(memory, trace)
    else this.read(memory, trace)
    return { steps: trace.steps, result: trace.result.clone() }
  }

  private write(memory: SsdPageModel, trace: SsdPageTrace): void {
    trace.payload(true)
    memory.latchProgramData()
    trace.transfer('ssd-nand-buffer-io', 'ssd-nand-page-buffer', '2048 B / program latches', 'Load NAND page buffer', 'The die page-buffer latches receive a complete data page; the persistent array is still erased.', true)
    trace.transfer('ssd-nand-sequencer', 'ssd-nand-voltage', 'program pulses', 'Confirm page program', 'After loading page data, confirm programming and start its internal program/verify sequence. No block erase occurs; command bytes and pulse timings are abstracted.')
    trace.signal('ssd-nand-bias', 'Apply program biases', 'Supply program and pass biases through row circuitry; exact voltages and pulse counts are abstracted.')
    trace.transfer('ssd-nand-wordline', 'ssd-nand-gate', 'program / WL0', 'Drive selected wordline', 'The common wordline controls selected cells across counted strings. Other wordlines receive pass biases.')
    trace.transfer('ssd-nand-bitline', 'ssd-nand-conduction', 'program 0 / inhibit 1', 'Drive program bitlines', 'Page-buffer data selects cells to program and inhibits positions that must remain erased 1.', true)
    memory.program()
    trace.transfer('ssd-nand-tunneling', 'ssd-nand-charge', 'stored electrons / bit 0', 'Store page charge', 'Under program bias, selected floating gates gain electrons. The complete model page now holds A4 B5 ...; the enlarged first-byte bit changes from 1 to 0.', true)
    trace.local('ssd-page-data', '2048 B / A4 B5 ...', 'Page stored', 'The page view shows the same cells on WL0, not a second storage structure. The neighboring page is unchanged.')
    memory.verify()
    trace.local('ssd-nand-voltage', 'verify passed', 'Verify programmed page', 'Compare all modeled page bytes against the buffered payload. Real NAND verifies target thresholds during its internal programming loop; that analog loop is grouped here.')
    trace.close()
    trace.programStatus()
    memory.publishMapping()
    trace.local('ssd-physical-address', 'CH0 / B0 / P0 mapped', 'Publish mapping', 'The new logical-to-physical mapping becomes available after successful programming. Crash-safe metadata journaling and flush guarantees are outside this lesson.')
    trace.local('ssd-sram', 'runtime / L2P updated', 'Update runtime metadata', 'The controller updates volatile mapping metadata; SRAM is not persistent firmware storage.')
    trace.local('ssd-host-interface', 'WRITE complete', 'Complete host write', 'The example completes after data programming and runtime mapping publication, without claiming a particular durability protocol.')
    trace.transfer('ssd-data-interface', 'ssd-data', 'WRITE complete', 'Return completion', 'The interface sends command completion rather than returning the write payload.', true)
    trace.signal('ssd-external-host', 'Deliver write completion', 'Completion returns over the same host attachment used for the request.')
    trace.finish('One page written', 'All 2048 payload bytes are stored; the selected SLC bit is 0, the adjacent page is preserved, and no block erase was needed because the destination was already erased.')
  }

  private read(memory: SsdPageModel, trace: SsdPageTrace): void {
    trace.transfer('ssd-nand-sequencer', 'ssd-nand-voltage', 'read reference', 'Set read references', 'Prepare the reference used to distinguish the two threshold ranges in this floating-gate SLC example.')
    trace.signal('ssd-nand-bias', 'Apply read biases', 'Bias the selected wordline for sensing and other series cells for pass-through.')
    trace.transfer('ssd-nand-wordline', 'ssd-nand-gate', 'Vread / WL0', 'Select read cells', 'The page is read from cells across strings sharing this wordline; no stored charge is intentionally added or removed.')
    trace.local('ssd-nand-conduction', 'OFF / bit 0', 'Inspect selected cell', 'Stored electrons raise the selected cell threshold above the chosen read reference. It remains off, representing 0 in this SLC convention.')
    trace.signal('ssd-nand-source-line', 'Connect source return', 'The selected string has a named source connection. The selected high-threshold cell suppresses its read current; this is not an extra data-storage element.')
    memory.sense()
    trace.transfer('ssd-nand-bitline', 'ssd-nand-page-buffer', '2048 B / sensed', 'Sense page into latches', 'Sense string currents for the selected page and latch all 2048 modeled bytes. Flash cell charge remains unchanged.')
    trace.close()
    trace.transfer('ssd-nand-buffer-io', 'ssd-nand-io', '2048 B / A4 B5 ...', 'Select output columns', 'NAND column selection moves the sensed page bytes through die I/O. Internal page sensing and subsequent byte output are distinct stages.')
    trace.payload(false)
    memory.decode()
    trace.transfer('ssd-nand-decode', 'ssd-ecc-decode', 'ECC pass / concept', 'Decode read redundancy', 'The separate controller ECC stage checks/corrects readback before delivery. This error-free example preserves bytes; ECC arithmetic and injected errors are not simulated.')
    trace.transfer('ssd-decode-buffer', 'ssd-dma', '2048 B / A4 B5 ...', 'Buffer checked data', 'The controller buffer receives the checked page data before it can be returned to the host.')
    trace.transfer('ssd-interface-dma', 'ssd-host-interface', '2048 B / ready', 'Return host payload', 'Move the complete checked data page back through the host interface.', true)
    trace.transfer('ssd-data-interface', 'ssd-data', '2048 B / A4 B5 ...', 'Transmit read data', 'The response carries the same full payload that was sensed from the NAND model.', true)
    memory.deliver()
    trace.signal('ssd-external-host', 'Deliver read response', 'All 2048 checked payload bytes reach the host through the selected interface.')
    trace.finish('One page read', `Delivered ${memory.returnedData()!.length} bytes beginning A4 B5. Both modeled pages, cell charge, and the mapping remain unchanged; no program or block erase occurs.`)
  }
}
