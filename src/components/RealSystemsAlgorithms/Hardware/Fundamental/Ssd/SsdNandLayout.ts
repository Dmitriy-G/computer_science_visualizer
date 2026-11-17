import type { HardwareDiagram } from '../../../../../visualization/HardwareDiagram.ts'
import type { SceneRegion } from '../../../../../visualization/Scene.ts'
import { SsdNandExample } from './SsdNandExample.ts'
import { SsdNandCellLayout } from './SsdNandCellLayout.ts'
import { HardwareBlockSizes } from '../../../../../visualization/HardwareBlockSizes.ts'

export class SsdNandLayout {
  public static add(diagram: HardwareDiagram): void {
    const example = SsdNandExample
    const common = HardwareBlockSizes.common
    const small = HardwareBlockSizes.small
    const wide = HardwareBlockSizes.wide
    diagram.region('ssd-nand', `NAND flash / illustrative ${example.rawCapacityGiB} GiB raw SLC organization using S34ML02G2 x8 geometry. Two channels, two packages per channel, and one die per package are modeling choices, not a typical modern SSD specification. Nominal raw data capacity excludes spare bytes; bad blocks and controller reserves further reduce usable capacity. One representative of each repeated element is expanded. Logical organization, not a die floorplan. This expanded cell is a planar floating-gate SLC teaching example. Modern SSDs commonly use TLC or QLC, and modern 3D NAND often uses charge-trap cells. TLC and QLC encode three and four bits per cell using eight and sixteen threshold ranges; their page organization and geometry differ`, 'memory', 1760, 100, 1920, 2140, 'component', 'ssd-pcb', 'NAND / planar floating-gate SLC example (modern SSDs: often 3D charge-trap TLC/QLC)')
      .region('ssd-nand-channel', 'NAND channels / two per modeled SSD. Each channel is a shared command/address/data bus serving two packages through target selection. Bus transfers are serialized; internal operations on different dies can overlap. Only the representative channel and package are drawn', 'interconnect', 1800, 180, 1840, 2040, 'component', 'ssd-nand', `Channels (~${example.channelsPerSsd} per SSD)`)
      .region('ssd-package-0', 'NAND packages / two per channel, four across this modeled SSD. Each package contains one selected die in this example; real packages can stack multiple dies', 'memory', 1820, 260, 1800, 1940, 'component', 'ssd-nand-channel', `Packages (~${example.packagesPerChannel} per channel)`)
      .region('ssd-die-0', 'NAND dies / one per package in this example, four across the SSD. Each SLC die holds 2 Gbit of data and contains command logic, voltage generation, I/O, and two planes', 'memory', 1840, 340, 1760, 1840, 'component', 'ssd-package-0', `NAND dies (~${example.diesPerPackage} per package)`)
      .region('ssd-nand-control', 'Command / address / status logic / decodes physical page and block addresses and sequences read, program, verify, and erase operations', 'device', 1900, 730, common.width, common.height, 'component', 'ssd-die-0', 'Command / address / status')
      .region('ssd-nand-voltage', 'Voltage generation and program/erase control / supplies read references and program/erase biases. Program pulses and verification move selected cells into target threshold ranges. Erase resets the containing block. NAND retains charge without periodic DRAM-style refresh; firmware can still relocate aging or disturbed data', 'device', 1900, 1450, common.width, common.height, 'component', 'ssd-die-0', 'Voltage / program / erase')
      .region('ssd-nand-io', 'Column selection and NAND data I/O / transfers selected page-buffer bytes over the shared external NAND bus. Page-buffer latches are volatile, unlike the persistent flash array', 'interconnect', 1900, 1090, common.width, common.height, 'component', 'ssd-die-0', 'Column selection / data I/O')
      .region('ssd-plane-0', 'NAND planes / two per die for the selected SLC device. Each plane contains erase blocks and page-buffer/sensing circuitry. Peripheral circuit instance counts are not inferred from capacity', 'memory', 2240, 440, 1340, 1700, 'component', 'ssd-die-0', `Planes (~${example.planesPerDie} per die)`)
      .region('ssd-block-0', `Erase blocks / ${example.blocksPerPlane} per plane. Each contains ${example.dataCellsPerBlock.toLocaleString('en-US')} data cells, or 128 KiB of data plus spare storage. Erase resets all pages together; an individual page cannot be erased`, 'memory', 2280, 520, 1240, 1290, 'component', 'ssd-plane-0', `Blocks / erase (~${example.blocksPerPlane.toLocaleString('en-US')} per plane)`)
      .region('ssd-nand-string', 'NAND strings / approximately 16K data strings per block in this simplified planar SLC view, with 64 memory-cell transistors connected in series per string. Each selected wordline contributes one data cell from each data string to a page. Spare-column strings and select transistors are excluded from data counts. Pages and strings are crossing views of the same array, not additional copies of stored data', 'memory', 2320, 620, 680, 980, 'component', 'ssd-block-0', `Data strings (~${example.dataCellsPerPage / 1024}K per block)`)
      .region('ssd-page-0', `Read/program pages / ${example.pagesPerBlock} per erase block in this SLC example. A page groups ${example.dataCellsPerPage.toLocaleString('en-US')} data cells across parallel strings on a selected wordline, plus spare cells. This box is a page view of the same cells in the counted strings, not an independent memory structure. Cells at the selected wordline across those strings collectively form the illustrated SLC page. TLC/QLC can encode multiple logical pages in cells sharing a wordline. Arbitrary overwrite requires relocation or block erase; partial-program and ordering restrictions depend on the device`, 'observer', 3060, 620, 420, 620, 'component', 'ssd-block-0', `Page view / read, program (~${example.pagesPerBlock} per block)`)
      .region('ssd-page-data', `Page data / ${example.dataBytesPerPage} bytes, or 16,384 one-bit SLC data cells per page`, 'memory', 3160, 840, small.width, small.height, 'component', 'ssd-page-0', 'Data / 2 KiB / 16,384 bits')
      .region('ssd-page-spare', `Page spare / ${example.spareBytesPerPage} bytes per page, also stored in NAND cells. Used for ECC redundancy, bad-block markers, and metadata according to the device/controller layout; not all spare bytes are freely available`, 'memory', 3160, 1040, small.width, small.height, 'component', 'ssd-page-0', 'Spare / 128 B')
      .region('ssd-nand-row-decoder', 'Row decoder / selects blocks and wordlines for read/program access and whole-block erase. Physical decoder counts are implementation dependent', 'device', 2280, 1915, wide.width, wide.height, 'component', 'ssd-plane-0', 'Row decoder / wordlines')
      .region('ssd-nand-page-buffer', 'Sense amplifiers and page-buffer latches / sense string current during reads, hold page data temporarily, and drive bitlines for programming and verification. These volatile latches are peripheral circuits, separate from the nonvolatile cells. Controller ECC decoding/correction follows readback over NAND I/O', 'cache', 2940, 1915, wide.width, wide.height, 'component', 'ssd-plane-0', 'Sense amplifiers / page buffer')
    diagram.paths.push({ id: 'ssd-page-wordline-view', d: 'M2960 855H3060', label: 'Page view of the same cell array / one SLC page is formed by cells across the counted NAND strings whose control gates share the selected wordline. This dashed projection identifies the same cells, not a data transfer to separate storage', highlighted: false, dashed: true, stroke: '#9576ae', strokeWidth: 2, caption: { text: 'Cells on same wordline\nAcross ~16K strings', x: 3080, y: 730 } })
    SsdNandCellLayout.add(diagram)
    this.connect(diagram)
    this.applyColors(diagram)
  }

  private static connect(diagram: HardwareDiagram): void {
    const paths: readonly [string, string, string, boolean][] = [
      ['ssd-nand-command', 'M2200 850H2250V1980H2280', 'Command/address logic selects the row decoder and block/wordline address', false],
      ['ssd-nand-bias', 'M2200 1630H2280V1850H2380V1915', 'Voltage generator supplies read, program, and block-erase biases through row circuitry', false],
      ['ssd-nand-wordline', 'M2310 1915V855H2360', 'Wordline / row decoder drives the selected memory-cell control gate; other series cells use pass biases', false],
      ['ssd-nand-bitline', 'M2960 1455H3020V1915', 'Bitline / selected series-string current reaches sense amplifiers on reads; page-buffer circuitry drives or inhibits programming', true],
      ['ssd-nand-buffer-io', 'M3240 2045V2120H2220V1270H2200', 'Selected-column page data / NAND I/O to volatile page-buffer latches, separate from controller DMA buffers', true],
      ['ssd-nand-die-io', 'M1820 1210H1900', 'Representative package contacts to die NAND I/O / commands, addresses, status, and page payloads share bus pins', true],
      ['ssd-nand-io-control', 'M2050 1090V970', 'NAND I/O supplies commands and addresses to the operation sequencer', false],
      ['ssd-nand-sequencer', 'M1900 910H1880V1570H1900', 'Command sequencer starts voltage generation and read/program/erase control', false],
    ]
    for (const [id, d, label, bidirectional] of paths) diagram.paths.push({ id, d, label, directed: true, bidirectional, highlighted: false, strokeWidth: 2, arrowheads: id === 'ssd-nand-die-io' ? false : undefined })
  }

  private static applyColors(diagram: HardwareDiagram): void {
    for (let index = 0; index < diagram.regions.length; index += 1) {
      const region = diagram.regions[index]
      if (region.x < 1760) continue
      let color: SceneRegion['color'] = 'green'
      if (region.id === 'ssd-die-0' || region.id === 'ssd-block-0') color = 'lavender'
      else if (region.id === 'ssd-nand-cell') color = 'light-orange'
      else if (region.id === 'ssd-page-0' || region.id === 'ssd-nand-channel' || region.id === 'ssd-nand-gate' || region.id === 'ssd-nand-gate-insulator' || region.id === 'ssd-nand-tunnel-oxide' || region.id === 'ssd-nand-conduction') color = 'neutral'
      else if (region.id === 'ssd-nand-io' || region.id === 'ssd-nand-row-decoder' || region.id === 'ssd-nand-page-buffer' || region.id === 'ssd-nand-source-terminal') color = 'light-blue'
      diagram.regions[index] = { ...region, color }
    }
  }
}
