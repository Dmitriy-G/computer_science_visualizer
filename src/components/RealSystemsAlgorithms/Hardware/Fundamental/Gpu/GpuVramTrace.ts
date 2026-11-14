import type { HardwareDiagram } from '../../../../../visualization/HardwareDiagram.ts'
import { ComponentFlowTrace } from '../ComponentFlowTrace.ts'
import { DramCellVisual } from '../DramCellVisual.ts'
import { GpuVramModel } from './GpuVramModel.ts'
import type { GpuVramBuffer } from './GpuVramModel.ts'

export class GpuVramTrace extends ComponentFlowTrace {
  private readonly memory: GpuVramModel

  constructor(diagram: HardwareDiagram, states: readonly (readonly [string, string])[], buffers: readonly GpuVramBuffer[] = []) {
    super(diagram, states)
    this.memory = new GpuVramModel(buffers)
  }

  protected decorateDiagram(diagram: HardwareDiagram): void {
    for (let index = 0; index < diagram.regions.length; index += 1) {
      const region = diagram.regions[index]
      if (region.id.startsWith('gpu-vram') && region.shortLabel) diagram.regions[index] = { ...region, shortLabel: region.shortLabel.replace(/\s*\(~[^)]*\)/g, '') }
    }
    for (let index = 0; index < diagram.fixtures.length; index += 1) {
      const fixture = diagram.fixtures[index]
      if (fixture.id === 'gpu-vram-capacitor-state') diagram.fixtures[index] = { ...fixture, value: DramCellVisual.chargeLabel(this.memory.capacitorCharge) }
    }
    for (let index = 0; index < diagram.positions.length; index += 1) {
      const position = diagram.positions[index]
      if (position.id === 'gpu-vram-transistor-state' || position.id === 'gpu-vram-capacitor-state') diagram.positions[index] = { ...position, height: 24 }
    }
    diagram.fixture('gpu-vram-bitline-state', '', DramCellVisual.bitlineLabel(this.memory.bitlineLevel), 2930, 815, '', 380, 34)
    DramCellVisual.addChargeIndicator(diagram, 'gpu-vram-charge', this.memory.capacitorCharge, 2975, 620)
  }

  public read(id: string): GpuVramBuffer {
    this.open(id)
    this.command('READ', id)
    this.transfer('gpu-vram-control-column', 'gpu-vram-column-decoder', 'column 0', 'Select read columns', 'Select the requested data from the open row buffer.')
    const buffer = this.memory.read()
    this.transfer('gpu-vram-sense-column', 'gpu-vram-column-decoder', buffer.label, 'Read row buffer', 'The selected column data leaves the sense-amplifier row buffer; storage cell charge remains restored.')
    this.transfer('gpu-vram-column-io', 'gpu-vram-io', buffer.label, 'Read GDDR I/O', 'The selected data reaches the GDDR prefetch and output circuitry.')
    this.transfer('gpu-memory-vram', 'gpu-memory-controllers', buffer.label, 'Return VRAM data', 'The GDDR data channel returns the buffer to the GPU memory controllers.', true)
    this.close(id)
    return buffer
  }

  public write(buffer: GpuVramBuffer): void {
    this.open(buffer.id)
    this.command('WRITE', buffer.id)
    this.transfer('gpu-vram-control-column', 'gpu-vram-column-decoder', 'column 0', 'Select write columns', 'Select the destination within the open row buffer.')
    this.transfer('gpu-memory-vram', 'gpu-vram-io', buffer.label, 'Send GDDR write data', 'Payload data travels from the GPU memory controllers into the GDDR input circuitry.')
    this.transfer('gpu-vram-column-io', 'gpu-vram-column-decoder', buffer.label, 'Route write data', 'The I/O and prefetch circuitry routes the write to the selected columns.', true)
    const bit = this.memory.driveWrite(buffer)
    this.transfer('gpu-vram-sense-column', 'gpu-vram-sense', `bit ${bit} / write`, 'Drive row buffer', 'Update the selected row-buffer data. The enlarged cell follows bit 0 of the first payload byte; the full buffer transfer is grouped.', true)
    this.memory.driveBitline()
    this.transfer('gpu-vram-bitline', 'gpu-vram-transistor', 'ON', 'Drive write bitline', 'The sense amplifier drives the new bit through the enabled access transistor.', true)
    this.memory.commit()
    this.transfer('gpu-vram-storage-node', 'gpu-vram-capacitor', String(bit), 'Store capacitor bit', 'The storage capacitor receives the new symbolic charge level. The grouped payload is now committed; neighboring buffers remain unchanged.')
    this.local('gpu-vram', buffer.label, 'VRAM write complete', 'The new buffer value is stored in VRAM after the write and symbolic recovery interval.')
    this.close(buffer.id)
  }

  private open(id: string): void {
    this.command('ACTIVATE', id)
    this.transfer('gpu-vram-control-row', 'gpu-vram-row-decoder', id, 'Select VRAM row', 'A named teaching buffer selects one representative row; actual GPU address mapping is abstracted.')
    this.memory.activate(id)
    this.local('gpu-vram-capacitor', String(this.memory.capacitorBit), 'Inspect selected cell', 'The enlarged cell now represents bit 0 of the selected buffer. Changing the selection does not write data.')
    this.memory.shareCharge()
    this.transfer('gpu-vram-wordline', 'gpu-vram-transistor', 'ON', 'Open access transistor', 'The wordline connects the selected row cells to their bitlines.')
    const bit = this.memory.sense()
    this.transfer('gpu-vram-bitline', 'gpu-vram-sense', `bit ${bit} / open`, 'Sense VRAM row', 'Amplify the selected bit into the row buffer. The example tracks the first-byte low bit of the grouped memory payload.')
    this.memory.driveBitline()
    this.transfer('gpu-vram-bitline', 'gpu-vram-transistor', 'ON', 'Restore through bitline', 'The sense amplifier drives the sensed value back through the enabled transistor.', true)
    this.memory.restore()
    this.transfer('gpu-vram-storage-node', 'gpu-vram-capacitor', String(bit), 'Restore capacitor charge', 'Restore the symbolic stored bit before column access. This is access restoration, not a separately scheduled refresh operation.')
  }

  private close(id: string): void {
    this.command('PRECHARGE', id)
    this.transfer('gpu-vram-control-row', 'gpu-vram-row-decoder', 'close row', 'Close VRAM row', 'After the required logical recovery interval, ask the row decoder to close the wordline.')
    this.memory.disconnect()
    this.transfer('gpu-vram-wordline', 'gpu-vram-transistor', 'OFF', 'Isolate storage cells', 'Lower the wordline and isolate the capacitors; the stored buffer data is retained.')
    this.memory.precharge()
    this.local('gpu-vram-sense', 'precharged', 'Equalize VRAM bitlines', 'Release the active row buffer and equalize the bitlines. Exact analog voltages, timings, and memory bursts are outside this bounded model.')
  }

  private command(command: string, id: string): void {
    this.transfer('gpu-memory-vram-command', 'gpu-vram-control', `${command} ${id}`, `${command} in VRAM`, `The GPU memory controller sends ${command} and the selected address through the GDDR command/address interface, separately from payload data.`)
  }
}
