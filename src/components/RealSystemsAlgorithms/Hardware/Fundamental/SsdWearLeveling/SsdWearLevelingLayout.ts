import { FlashLayout } from '../FlashLayout.ts'
import type { SsdWearLevelingModel } from './SsdWearLevelingModel.ts'

export class SsdWearLevelingLayout {
  public static create(model: SsdWearLevelingModel) {
    const snapshot = FlashLayout.create(model, 'Wear leveling / allocation and relocation', 1290)
    const diagram = snapshot.diagram!
    diagram.region('comparison', 'Separate erase-counter scenario / same six reuse cycles / fixed block versus lowest-count free block', 'observer', 30, 1030, 1220, 230)
    for (let block = 0; block < 3; block += 1) {
      diagram.fixture(`comparison-${block}`, `B${block} / fixed versus distributed erases`, `${model.concentrated[block]} versus ${model.distributed[block]}`, 230 + block * 410, 1165, undefined, 330)
    }
    return snapshot
  }
}
