import { HardwareSnapshot } from './HardwareSnapshot.ts'
import type { FlashStorage } from './FlashStorage.ts'
import { SsdLessonLayout } from './Ssd/SsdLessonLayout.ts'
import type { SsdActivity, SsdFirmwareFeature } from './Ssd/SsdLessonLayout.ts'

export class FlashLayout {
  public static readonly height = SsdLessonLayout.detailTop + 970

  public static create(model: FlashStorage, controllerLabel: string, feature: SsdFirmwareFeature, height: number = this.height): HardwareSnapshot {
    const physical = this.selectedPage(model)
    const activity = this.activity(model)
    const location = physical === null ? model.selectedBlock === null ? 'CH0 / T0 / D0 / PL0' : SsdLessonLayout.address(model.selectedBlock) : SsdLessonLayout.address(Math.floor(physical / 3), physical % 3)
    const diagram = SsdLessonLayout.create(height, {
      feature, activity, location,
      data: physical === null ? 'no payload' : model.pages[physical].data || model.pages[physical].state,
      metadata: `L2P entries: ${model.mapping.size}`,
      failed: model.operation.includes('failed'),
    })
    const top = SsdLessonLayout.detailTop
    diagram.region('ssd-flash-detail', 'NAND flash', 'memory', 20, top, 2360, 950)
      .region('controller-region', controllerLabel, 'observer', 40, top + 80, 500, 860, 'component', 'ssd-flash-detail')
      .fixture('host', 'Logical request / returned value', model.output, 290, top + 200, undefined, 440)
      .fixture('controller', 'Controller operation', model.operation, 290, top + 350, undefined, 440)
    for (let lba = 0; lba < 3; lba += 1) {
      const page = model.mapping.get(lba)
      diagram.fixture(`map-${lba}`, `L2P / logical page ${lba}`, page === undefined ? 'unmapped' : SsdLessonLayout.address(Math.floor(page / 3), page % 3), 290, top + 500 + lba * 130, undefined, 440)
      if (page !== undefined) diagram.connect(`mapping-${lba}`, `map-${lba}`, `page-${page}`, 'L2P mapping', false, (lba - 1) * 35)
    }
    const waf = model.hostWrites ? (model.flashWrites / model.hostWrites).toFixed(2) : 'n/a'
    diagram.fixture('writes', 'Host writes / programs / WAF', `${model.hostWrites} / ${model.flashWrites} / WAF ${waf}`, 290, top + 880, undefined, 440)
    for (let block = 0; block < 3; block += 1) {
      const x = 580 + block * 600
      diagram.region(`block-${block}`, `Block B${block} / whole-block erase${model.selectedBlock === block ? ' / selected' : ''}`, 'memory', x, top + 80, 560, 860, 'component', 'ssd-flash-detail')
      for (let page = 0; page < 3; page += 1) {
        const index = block * 3 + page
        const record = model.pages[index]
        diagram.fixture(`page-${index}`, `B${block} P${page} / read-program page`, record.lba === null ? record.state === 'free' ? 'erased' : 'unusable' : `L${record.lba}: ${record.data}`, x + 280, top + 230 + page * 210, record.state, 460)
      }
      diagram.fixture(`erase-${block}`, `B${block} erase count`, String(model.erases[block]), x + 280, top + 850, undefined, 460)
    }
    if (model.flowFrom && model.flowTo) diagram.connect('transaction', model.flowFrom, model.flowTo, `logical ${model.operation === 'mapping committed' ? 'mapping publication' : model.operation.startsWith('program') ? 'program attempt' : model.operation}`, true, -65)
    return new HardwareSnapshot([], model.flowTo ?? 'ssd-state-controller', 0, diagram)
  }

  private static selectedPage(model: FlashStorage): number | null {
    for (const id of [model.flowTo, model.flowFrom]) {
      if (id?.startsWith('page-')) return Number(id.slice(5))
      if (id?.startsWith('map-')) return model.mapping.get(Number(id.slice(4))) ?? null
    }
    return null
  }

  private static activity(model: FlashStorage): SsdActivity {
    if (model.operation === 'lookup') return 'lookup'
    if (model.operation === 'read') return 'read'
    if (model.operation.startsWith('program')) return model.flowFrom?.startsWith('page-') ? 'relocate' : 'program'
    if (model.operation === 'mapping committed') return 'commit'
    if (model.operation.startsWith('block erased')) return 'erase'
    if (model.operation === 'allocate erased page') return 'allocate'
    if (model.operation.includes('victim') || model.operation.startsWith('dynamic') || model.operation.includes('comparison')) return 'policy'
    return 'idle'
  }
}
