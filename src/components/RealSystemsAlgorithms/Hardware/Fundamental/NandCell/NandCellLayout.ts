import { HardwareDiagram } from '../../../../../visualization/HardwareDiagram.ts'
import { CpuModel } from '../CpuModel.ts'
import type { NandCellModel } from './NandCellModel.ts'

export class NandCellLayout {
  public static create(model: NandCellModel): CpuModel {
    const diagram = new HardwareDiagram(1120, 930)
    diagram.region('cell', 'Enlarged SLC cell / selected page, bit 1', 'memory', 30, 35, 510, 535)
      .fixture('gate', 'Control gate', model.operation === 'program' ? 'program voltage' : 'read reference', 285, 140, undefined, 330)
      .fixture('charge', 'Insulated charge-storage region', model.pages[model.selectedPage][1] ? 'few stored electrons' : 'trapped electrons', 285, 300, undefined, 330)
      .fixture('threshold', 'Threshold relative to read reference', model.pages[model.selectedPage][1] ? 'low / conducts / 1' : 'high / off / 0', 285, 465, undefined, 330)
      .connect('injection', 'gate', 'charge', 'change stored charge', model.operation === 'program' || model.operation === 'block erase')
      .connect('threshold-effect', 'charge', 'threshold', 'threshold shift', model.operation === 'sense')
    diagram.region('block', 'One erase block / three conceptual pages', 'memory', 580, 35, 510, 535)
    for (let page = 0; page < model.pages.length; page += 1) {
      diagram.fixture(`page-${page}`, `Page ${page}`, model.pages[page].join(' '), 835, 140 + page * 160, model.programmed[page] ? 'programmed' : 'erased / free', 330)
    }
    diagram.region('controller', 'Page access and separate controller functions', 'observer', 30, 610, 1060, 290)
      .fixture('buffer', 'Page buffer', model.buffer.join(' '), 275, 715, model.operation, 330)
      .fixture('sense', 'Reference sensing / decoded page', model.output?.join(' ') ?? 'not sampled', 835, 715, undefined, 330)
      .fixture('erase', 'Whole-block erase count', String(model.erases), 275, 850, undefined, 330)
      .fixture('ecc', 'Controller ECC', model.operation === 'ECC check' ? 'separate check stage' : 'not modeled bitwise', 835, 850, undefined, 330)
      .connect('program', 'buffer', `page-${model.selectedPage}`, 'page PROGRAM', model.operation === 'program', 60)
      .connect('read', `page-${model.selectedPage}`, 'sense', 'reference / current sense', model.operation === 'sense')
      .connect('ecc-check', 'sense', 'ecc', 'controller decode / check', model.operation === 'ECC check')
    for (let page = 0; page < model.pages.length; page += 1) diagram.connect(`erase-${page}`, 'erase', `page-${page}`, 'block ERASE', model.operation === 'block erase', -50 - page * 30)
    return new CpuModel([], 'charge', 0, diagram)
  }
}
