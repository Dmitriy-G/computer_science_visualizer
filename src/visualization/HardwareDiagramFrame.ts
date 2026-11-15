import { HardwareDiagram } from './HardwareDiagram.ts'

export class HardwareDiagramFrame {
  public static addMotherboardNavigation(diagram: HardwareDiagram, prefix: string, top: number, bottom: number): void {
    diagram.regions.push({
      id: `${prefix}-motherboard`, role: 'memory', level: 'system', color: 'green',
      x: 20, y: top, width: 260, height: bottom - top,
      shortLabel: '← Back\nMotherboard', titleFontSize: 32, titleFirstLineFontSize: 22,
      label: 'Motherboard / abstract host-platform reference for the connected external interfaces and DC supply. These connections are outside the selected component. Open the motherboard diagram to return to its physical sockets, connectors, and traces',
      navigationTarget: 'hardware-bus', navigationLabel: 'Back to Motherboard',
    })
  }

  public static create(source: HardwareDiagram, left: number, right: number): HardwareDiagram {
    const diagram = new HardwareDiagram(source.width + left + right, source.height)
    for (const region of source.regions) diagram.regions.push({ ...region, x: region.x + left })
    for (const position of source.positions) diagram.positions.push({ ...position, x: position.x + left })
    for (const fixture of source.fixtures) diagram.fixtures.push({ ...fixture })
    for (const edge of source.edges) diagram.edges.push({ ...edge })
    // Shift whole SVG paths so reversed transfers and relative charge-fill commands retain their geometry.
    for (const path of source.paths) diagram.paths.push({
      ...path, translateX: (path.translateX ?? 0) + left,
      caption: path.caption ? { ...path.caption, x: path.caption.x + left } : undefined,
    })
    return diagram
  }
}
