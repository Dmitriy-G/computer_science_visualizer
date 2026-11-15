import type { HardwareDiagram } from '../../../../../visualization/HardwareDiagram.ts'
import { ComponentFlowTrace } from '../ComponentFlowTrace.ts'
import { SsdLayout } from './SsdLayout.ts'
import { SsdPageModel } from './SsdPageModel.ts'

export class SsdPageTrace extends ComponentFlowTrace {
  private readonly memory: SsdPageModel

  constructor(memory: SsdPageModel) {
    const diagram = SsdLayout.diagram()
    const bus = diagram.paths.findIndex((path) => path.id === 'ssd-channel-0-shared-bus')
    diagram.paths[bus] = { ...diagram.paths[bus], bidirectional: true }
    super(diagram, [
      ['ssd-data', 'idle'], ['ssd-host-interface', 'idle'], ['ssd-dma', 'empty'],
      ['ssd-sram', 'runtime ready'], ['ssd-physical-address', memory.operation === 'read' ? 'CH0 / B0 / P0' : 'unmapped'],
      ['ssd-ecc-encode', 'idle'], ['ssd-ecc-decode', 'idle'], ['ssd-nand-command-io', 'idle'],
      ['ssd-nand-control', 'idle'], ['ssd-nand-voltage', 'idle'], ['ssd-nand-io', 'idle'],
      ['ssd-nand-row-decoder', 'WL closed'], ['ssd-nand-page-buffer', 'empty'],
      ['ssd-nand-gate', 'idle'], ['ssd-nand-charge', ''], ['ssd-nand-conduction', 'idle'],
      ['ssd-page-data', memory.operation === 'read' ? '2048 B / A4 B5 ...' : '2048 B / FF FF ...'],
      ['ssd-page-spare', '128 B / ECC area'],
    ])
    this.memory = memory
  }

  protected decorateDiagram(diagram: HardwareDiagram): void {
    for (let index = 0; index < diagram.regions.length; index += 1) {
      const region = diagram.regions[index]
      let shortLabel = region.shortLabel?.replace(/\s*\(~[^)]*\)/g, '')
      if (region.id === 'ssd-physical-address') shortLabel = 'Physical NAND address'
      if (region.id === 'ssd-page-data') shortLabel = 'Data / 2 KiB'
      diagram.regions[index] = { ...region, shortLabel }
    }
    for (let index = diagram.fixtures.length - 1; index >= 0; index -= 1) {
      const fixture = diagram.fixtures[index]
      if (fixture.id === 'ssd-nand-charge-states' || fixture.id === 'ssd-nand-read-states') diagram.fixtures.splice(index, 1)
      else if (fixture.id === 'ssd-nand-charge-state') diagram.fixtures[index] = { ...fixture, value: this.memory.storedBit ? 'few electrons / bit 1' : 'stored electrons / bit 0' }
    }
    for (let index = diagram.positions.length - 1; index >= 0; index -= 1) {
      const position = diagram.positions[index]
      if (position.id === 'ssd-nand-charge-states' || position.id === 'ssd-nand-read-states') diagram.positions.splice(index, 1)
      else if (position.id === 'ssd-physical-address-state') diagram.positions[index] = { ...position, y: position.y + 5 }
    }
  }

  public command(write: boolean): void {
    this.transfer('ssd-ftl-nand', 'ssd-nand-command-io', write ? 'PROGRAM P0' : 'READ P0', 'Issue physical page command', 'Translate the aligned logical range to CH0 / target 0 / die 0 / plane 0 / block 0 / page 0; command/address traffic is distinct from the payload.')
    this.signal('ssd-channel-0', 'Select NAND channel', 'Use the representative shared NAND channel; counted peers remain idle.')
    this.signal('ssd-channel-0-shared-bus', 'Select target', 'Only one transfer uses this shared bus at a time.', true)
    this.signal('ssd-channel-0-package-0', 'Address selected package', 'Send the physical page address to the selected NAND package.')
    this.transfer('ssd-nand-die-io', 'ssd-nand-io', write ? 'PROGRAM P0' : 'READ P0', 'Receive NAND command', 'Commands and page data share external NAND bus pins at different stages.')
    this.transfer('ssd-nand-io-control', 'ssd-nand-control', write ? 'PROGRAM P0' : 'READ P0', 'Decode NAND command', 'The die sequences access to the selected wordline and page.')
    this.transfer('ssd-nand-command', 'ssd-nand-row-decoder', 'B0 / WL0', 'Select wordline', 'The page consists of cells on the selected wordline across the counted parallel NAND strings.')
  }

  public payload(write: boolean): void {
    if (write) {
      this.signal('ssd-channel-0', 'Send encoded page', 'Transfer the grouped 2 KiB payload and conceptual spare/ECC bytes onto the controller channel.')
      this.signal('ssd-channel-0-shared-bus', 'Transfer shared bus', 'Only the selected package uses this shared bus.', true)
      this.signal('ssd-channel-0-package-0', 'Transfer package pins', 'Send page bytes to the selected package.')
      this.transfer('ssd-nand-die-io', 'ssd-nand-io', '2048 B / A4 B5 ...', 'Receive page at die I/O', 'The selected die I/O receives the complete grouped payload.')
    } else {
      this.signal('ssd-nand-die-io', 'Output die payload', 'Sensed page bytes leave die I/O for package pins.', true)
      this.signal('ssd-channel-0-package-0', 'Return package data', 'Package pins drive read data onto the shared NAND bus.', true)
      this.signal('ssd-channel-0-shared-bus', 'Return shared-bus data', 'The selected page response traverses the shared bus toward its controller.')
      this.transfer('ssd-channel-0', 'ssd-nand-command-io', '2048 B / A4 B5 ...', 'Receive NAND page data', 'The channel controller receives the complete read page before ECC decoding.', true)
    }
  }

  public close(): void {
    this.local('ssd-nand-gate', 'idle', 'Release wordline bias', 'Remove the read/program drive after sensing or verification; stored floating-gate charge is retained.')
    this.local('ssd-nand-conduction', 'idle', 'End active cell access', 'No selected read/program conduction is being driven after array access completes.')
    this.local('ssd-nand-row-decoder', 'WL closed', 'Close row selection', 'End selection of WL0 without erasing or restoring its nonvolatile bits.')
    this.local('ssd-nand-voltage', 'idle', 'Release access biases', 'Return voltage circuitry to idle; NAND page latches can retain the completed data/status.')
  }

  public programStatus(): void {
    this.signal('ssd-nand-die-io', 'Return program status', 'Successful program status leaves the die I/O, separately from a read payload.', true)
    this.signal('ssd-channel-0-package-0', 'Return package status', 'The selected package returns its operation status.', true)
    this.signal('ssd-channel-0-shared-bus', 'Transfer program status', 'Status follows the shared channel back toward the controller.')
    this.transfer('ssd-channel-0', 'ssd-nand-command-io', 'PROGRAM passed', 'Accept NAND status', 'Only successful program status allows runtime mapping publication and host completion.', true)
  }
}
