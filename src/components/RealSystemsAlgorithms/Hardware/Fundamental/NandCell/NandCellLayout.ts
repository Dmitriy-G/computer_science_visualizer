import { CpuModel } from '../CpuModel.ts'
import { SsdLessonLayout } from '../Ssd/SsdLessonLayout.ts'
import type { SsdActivity } from '../Ssd/SsdLessonLayout.ts'
import type { NandCellModel } from './NandCellModel.ts'

export class NandCellLayout {
  public static create(model: NandCellModel): CpuModel {
    const top = SsdLessonLayout.detailTop
    const diagram = SsdLessonLayout.create(top + 970, {
      feature: 'nand', activity: this.activity(model),
      location: SsdLessonLayout.address(0, model.operation === 'block erase' ? null : model.selectedPage),
      data: (model.operation === 'sense' || model.operation === 'ECC check' ? model.output ?? model.buffer : model.buffer).join(' '),
      metadata: 'physical page commands',
    })
    diagram.region('ssd-cell-detail', 'NAND flash', 'memory', 20, top, 2360, 950)
      .region('cell', 'Enlarged SLC cell / selected page, bit 1', 'memory', 40, top + 80, 1100, 500, 'component', 'ssd-cell-detail')
      .fixture('gate', 'Control gate', model.operation === 'program' ? 'program voltage' : model.operation === 'block erase' ? 'erase bias' : model.operation === 'sense' ? 'read reference' : 'idle', 590, top + 190, undefined, 900)
      .fixture('charge', 'Insulated charge-storage region', model.pages[model.selectedPage][1] ? 'few stored electrons' : 'trapped electrons', 590, top + 350, undefined, 900)
      .fixture('threshold', 'Threshold relative to read reference', model.pages[model.selectedPage][1] ? 'low / conducts / 1' : 'high / off / 0', 590, top + 510, undefined, 900)
      .connect('injection', 'gate', 'charge', 'change stored charge', model.operation === 'program' || model.operation === 'block erase')
      .connect('threshold-effect', 'charge', 'threshold', 'threshold shift', model.operation === 'sense')
    diagram.region('block', 'One erase block / three conceptual read-program pages', 'memory', 1200, top + 80, 1160, 500, 'component', 'ssd-cell-detail')
    for (let page = 0; page < model.pages.length; page += 1) {
      diagram.fixture(`page-${page}`, `B0 / page ${page}`, model.pages[page].join(' '), 1780, top + 190 + page * 160, model.programmed[page] ? 'programmed' : 'erased / free', 900)
    }
    diagram.region('controller', 'Page access detail / controller ECC stages are identified, not computed bitwise', 'observer', 40, top + 640, 2320, 290, 'component', 'ssd-cell-detail')
      .fixture('buffer', 'DMA / symbolic page buffer', model.buffer.join(' '), 590, top + 750, model.operation, 900)
      .fixture('sense', 'Last reference-sensed page', model.output?.join(' ') ?? 'not sampled', 1780, top + 750, undefined, 900)
      .fixture('erase', 'Whole-block erase count', String(model.erases), 590, top + 870, undefined, 900)
      .fixture('ecc', 'Controller ECC / conceptual stage', model.operation === 'ECC check' ? 'decode/check stage' : model.operation === 'ECC encode' ? 'encoding stage' : 'not modeled bitwise', 1780, top + 870, undefined, 900)
      .connect('ecc-encode', 'buffer', 'ecc', 'controller encoding / conceptual only', model.operation === 'ECC encode')
      .connect('program', 'ecc', `page-${model.selectedPage}`, 'encoded page PROGRAM / ECC not computed', model.operation === 'program', 60)
      .connect('read', `page-${model.selectedPage}`, 'sense', 'reference / current sense', model.operation === 'sense')
      .connect('ecc-check', 'sense', 'ecc', 'controller decode / check', model.operation === 'ECC check')
    for (let page = 0; page < model.pages.length; page += 1) diagram.connect(`erase-${page}`, 'erase', `page-${page}`, 'block ERASE', model.operation === 'block erase', -50 - page * 30)
    const focus = model.operation === 'ECC encode' ? 'ssd-state-ecc-encode' : model.operation === 'ECC check' ? 'ssd-state-ecc-decode' : model.operation === 'block erase' ? 'erase' : model.operation === 'sense' ? 'sense' : 'charge'
    return new CpuModel([], focus, 0, diagram)
  }

  private static activity(model: NandCellModel): SsdActivity {
    switch (model.operation) {
      case 'load page buffer': return 'buffer'
      case 'ECC encode': return 'encode'
      case 'program': return 'program'
      case 'sense': return 'sense'
      case 'ECC check': return 'ecc'
      case 'block erase': return 'erase'
      case 'overwrite rejected': return 'reject'
      default: return 'idle'
    }
  }
}
