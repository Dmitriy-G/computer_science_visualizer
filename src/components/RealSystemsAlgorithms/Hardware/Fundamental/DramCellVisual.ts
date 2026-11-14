import type { HardwareDiagram } from '../../../../visualization/HardwareDiagram.ts'

export class DramCellVisual {
  public static chargeLabel(charge: number): string {
    return charge === 0 ? '0 / low' : charge === 1 ? '1 / high' : 'shared charge'
  }

  public static bitlineLabel(level: number): string {
    return level === 0.5 ? 'VDD/2' : level === 0 ? 'LOW' : level === 1 ? 'HIGH' : level > 0.5 ? 'VDD/2 + delta' : 'VDD/2 - delta'
  }

  public static addChargeIndicator(diagram: HardwareDiagram, id: string, charge: number, x: number, y: number, width = 130, height = 32): void {
    diagram.paths.push(
      { id: `${id}-outline`, d: `M${x} ${y}h${width}v${height}h-${width}Z`, label: 'Symbolic selected-cell charge indicator', highlighted: false, fill: '#f1f3f6', stroke: '#bfc8d2', strokeWidth: 2 },
      { id: `${id}-level`, d: `M${x} ${y + height}h${width}v-${height * charge}h-${width}Z`, label: `Selected capacitor charge / ${this.chargeLabel(charge)}; not a voltage-accurate analog simulation`, highlighted: false, fill: '#b5d8eb', stroke: '#7eabc6', strokeWidth: 1 },
    )
  }
}
