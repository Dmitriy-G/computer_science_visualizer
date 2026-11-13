import type { HardwareDiagram } from '../../../../../visualization/HardwareDiagram.ts'
import { HardwareSnapshot } from '../HardwareSnapshot.ts'
import { RamLayout } from './RamLayout.ts'
import type { RamBitModel } from './RamBitModel.ts'

export interface RamBitActivity {
  readonly path: string | null
  readonly status: string
  readonly reverse?: boolean
}

export class RamBitLayout {
  public static create(model: RamBitModel, activity: RamBitActivity): HardwareSnapshot {
    const diagram = RamLayout.diagram()
    for (let index = 0; index < diagram.regions.length; index += 1) {
      const region = diagram.regions[index]
      if (region.shortLabel) diagram.regions[index] = { ...region, shortLabel: region.shortLabel.replace(/\s*\(~[^)]*\)/g, '') }
    }
    this.state(diagram, 'controller', model.controllerData === null ? 'waiting' : String(model.controllerData), 200, 355, 260)
    this.state(diagram, 'socket-command', model.socketCommand ?? 'idle', 550, 355, 220)
    this.state(diagram, 'socket-data', model.socketData === null ? 'no data' : String(model.socketData), 550, 780, 220)
    this.state(diagram, 'control', model.controlCommand ?? 'idle', 1270, 355, 250)
    this.state(diagram, 'row', model.activeRow === null ? 'no open row' : `row ${model.row}`, 1705, 650, 210)
    this.state(diagram, 'refresh', 'idle', 1270, 710, 240)
    this.state(diagram, 'io', model.ioData === null ? 'idle' : String(model.ioData), 1270, 1100, 250)
    this.state(diagram, 'column', model.columnSelected ? `column ${model.column}: ${model.columnData ?? 'selected'}` : 'not selected', 2200, 1190, 490, 34)
    this.state(diagram, 'sense', model.buffer ? `[${model.buffer.join(' ')}]` : 'equalized', 2200, 985, 490, 38)
    this.state(diagram, 'transistor', model.wordline ? 'ON' : 'OFF', 2070, 692, 180, 24)
    this.state(diagram, 'capacitor', this.charge(model), 2330, 692, 180, 24)
    this.state(diagram, 'bitline', this.bitline(model), 2200, 835, 300, 40)
    this.addCellState(diagram, model)
    for (let index = 0; index < diagram.paths.length; index += 1) {
      const path = diagram.paths[index]
      if (path.id === 'ram-bit-line-0') diagram.paths[index] = { ...path, caption: undefined }
      if (path.id !== activity.path) continue
      diagram.paths[index] = { ...diagram.paths[index], d: activity.reverse ? this.reverse(path.id) : path.d, highlighted: true, directed: true, bidirectional: false, label: `${path.label}. ${activity.status}` }
    }
    return new HardwareSnapshot([], this.focus(activity), 0, diagram)
  }

  private static addCellState(diagram: HardwareDiagram, model: RamBitModel): void {
    diagram.fixture('ram-detail-row-0', '', `Row 0: [${model.rows[0].join(' ')}]`, 2200, 475, '', 450, 28)
      .fixture('ram-detail-row-1', '', `Row 1: [${model.rows[1].join(' ')}]`, 2200, 760, '', 450, 24)
      .fixture('ram-detail-wordline', 'Wordline', model.wordline ? 'HIGH' : 'LOW', 1705, 545, '', 200, 40)
    diagram.paths.push(
      { id: 'ram-detail-charge-outline', d: 'M2260 625h130v32h-130Z', label: 'Symbolic selected-cell charge indicator', highlighted: false, fill: '#f1f3f6', stroke: '#bfc8d2', strokeWidth: 2 },
      { id: 'ram-detail-charge-level', d: `M2260 657h130v-${32 * model.capacitorCharge}h-130Z`, label: `Selected capacitor charge / ${this.charge(model)}; not a voltage-accurate analog simulation`, highlighted: false, fill: '#b5d8eb', stroke: '#7eabc6', strokeWidth: 1 },
    )
  }

  private static state(diagram: HardwareDiagram, id: string, value: string, x: number, y: number, width: number, height = 50): void {
    diagram.fixture(`ram-state-${id}`, '', value, x, y, '', width, height)
  }

  private static focus(activity: RamBitActivity): string | null {
    let id: string | null = null
    switch (activity.path) {
      case 'ram-controller-command': id = 'socket-command'; break
      case 'ram-socket-control': id = 'control'; break
      case 'ram-control-row': id = 'row'; break
      case 'ram-word-line-0': id = 'transistor'; break
      case 'ram-bit-line-0': id = activity.reverse ? 'bitline' : 'sense'; break
      case 'ram-storage-node': id = 'capacitor'; break
      case 'ram-control-column': id = 'column'; break
      case 'ram-controller-data': id = activity.reverse ? 'socket-data' : 'controller'; break
      case 'ram-io-socket': id = activity.reverse ? 'io' : 'socket-data'; break
      case 'ram-column-io': id = activity.reverse ? 'column' : 'io'; break
      case 'ram-sense-column': id = activity.reverse ? 'sense' : 'column'; break
    }
    return id === null ? null : `ram-state-${id}`
  }

  private static bitline(model: RamBitModel): string {
    return model.bitlineLevel === 0.5 ? 'VDD/2' : model.bitlineLevel === 0 ? 'LOW' : model.bitlineLevel === 1 ? 'HIGH' : model.bitlineLevel > 0.5 ? 'VDD/2 + delta' : 'VDD/2 - delta'
  }

  private static charge(model: RamBitModel): string {
    return model.capacitorCharge === 0 ? '0 / low' : model.capacitorCharge === 1 ? '1 / high' : 'shared charge'
  }

  private static reverse(id: string): string {
    switch (id) {
      case 'ram-controller-data': return 'M360 430H390V750H420'
      case 'ram-io-socket': return 'M680 750H1040V1100H1120'
      case 'ram-column-io': return 'M1420 1100H1460V1175H1900'
      case 'ram-sense-column': return 'M2200 1130V1030'
      case 'ram-bit-line-0': return 'M2070 900V850H1948V660H1960'
      default: throw new Error(`No reverse RAM path: ${id}`)
    }
  }
}
