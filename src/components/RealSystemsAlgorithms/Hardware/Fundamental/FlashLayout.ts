import { HardwareDiagram } from '../../../../visualization/HardwareDiagram.ts'
import { CpuModel } from './CpuModel.ts'
import type { FlashStorage } from './FlashStorage.ts'

export class FlashLayout {
  public static create(model: FlashStorage, controllerLabel: string, height = 1010): CpuModel {
    const diagram = new HardwareDiagram(1310, height)
    diagram.region('controller-region', controllerLabel, 'observer', 30, 30, 390, 950)
      .fixture('host', 'Host logical-page request / result', model.output, 225, 150, undefined, 330)
      .fixture('controller', 'Controller operation', model.operation, 225, 310, undefined, 330)
    for (let lba = 0; lba < 3; lba += 1) {
      const physical = model.mapping.get(lba)
      diagram.fixture(`map-${lba}`, `L2P / logical page ${lba}`, physical === undefined ? 'unmapped' : `B${Math.floor(physical / 3)} P${physical % 3}`, 225, 490 + lba * 150, undefined, 270)
      if (physical !== undefined) diagram.connect(`mapping-${lba}`, `map-${lba}`, `page-${physical}`, 'current mapping', false, (lba - 1) * 35)
    }
    const waf = model.hostWrites ? (model.flashWrites / model.hostWrites).toFixed(2) : 'n/a'
    diagram.fixture('writes', 'Completed host writes / flash page programs', `${model.hostWrites} / ${model.flashWrites} ; WAF ${waf}`, 225, 940, undefined, 330)
    for (let block = 0; block < 3; block += 1) {
      const x = 450 + block * 280
      diagram.region(`block-${block}`, `NAND block B${block}${model.selectedBlock === block ? ' / selected' : ''}`, 'memory', x, 30, 250, 950)
      for (let page = 0; page < 3; page += 1) {
        const index = block * 3 + page
        const record = model.pages[index]
        diagram.fixture(`page-${index}`, `B${block} P${page}`, record.lba === null ? record.state === 'free' ? 'erased' : 'unusable' : `L${record.lba}: ${record.data}`, x + 125, 215 + page * 230, record.state, 200)
      }
      diagram.fixture(`erase-${block}`, `B${block} erase count`, String(model.erases[block]), x + 125, 905, undefined, 200)
    }
    if (model.flowFrom && model.flowTo) diagram.connect('transaction', model.flowFrom, model.flowTo, model.operation === 'mapping committed' ? 'publish mapping' : model.operation.startsWith('program') ? 'program attempt' : model.operation, true, -65)
    return new CpuModel([], model.flowTo, 0, diagram)
  }
}
