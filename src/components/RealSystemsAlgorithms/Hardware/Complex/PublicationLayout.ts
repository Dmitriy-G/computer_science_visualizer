import { HardwareDiagram } from '../../../../visualization/HardwareDiagram.ts'

export class PublicationLayout {
  public static create(mode: 'plain' | 'dmb' | 'acquire-release', flow: string, earlyResult: boolean): HardwareDiagram {
    const diagram = new HardwareDiagram(960, 580)
    diagram.region('producer', 'CPU / Core 0 producer', 'cpu', 20, 20, 260, 360)
    diagram.region('shared', 'Shared Normal memory', 'memory', 350, 20, 260, 360)
    diagram.region('consumer', 'CPU / Core 1 consumer', 'cpu', 680, 20, 260, 530)
    diagram.fixture('producer-data', 'producer data store', 'STR data, 42', 150, 135)
    diagram.fixture('producer-flag', 'producer flag store', mode === 'acquire-release' ? 'STLR flag, 1' : 'STR flag, 1', 150, 295, mode === 'dmb' ? 'after DMB ISHST' : mode === 'acquire-release' ? 'release earlier data' : 'no barrier')
    diagram.place('data', 480, 135).place('flag', 480, 295)
    diagram.place('seen-data', 810, 135).place('seen-flag', 810, 295).place('early-data', 810, 465)
    diagram.connect('data-store', 'producer-data', 'data', 'data write', flow === 'data-store')
    diagram.connect('flag-store', 'producer-flag', 'flag', flow === 'blocked' ? 'ordered: wait' : 'flag write', flow === 'flag-store')
    diagram.connect('flag-load', 'flag', 'seen-flag', mode === 'acquire-release' ? 'LDAR flag' : 'LDR flag', flow === 'flag-load')
    diagram.connect('data-load', 'data', 'seen-data', 'LDR data', flow === 'data-load' && !earlyResult)
    diagram.connect('read-order', 'seen-flag', 'seen-data', mode === 'dmb' ? 'DMB ISHLD' : mode === 'acquire-release' ? 'acquire order' : 'may reorder', false, 35)
    diagram.connect('early', 'data', 'early-data', 'early data load', flow === 'early', -45)
    if (earlyResult) diagram.connect('early-result', 'early-data', 'seen-data', 'reuse early result', flow === 'data-load', 100)
    if (mode === 'dmb') {
      diagram.region('outside', 'ISH scope / observer membership', 'observer', 20, 390, 590, 160)
      diagram.place('producer-scope', 130, 485, 150).place('consumer-scope', 315, 485, 150).place('outside-scope', 500, 485, 150)
    }
    return diagram
  }
}
