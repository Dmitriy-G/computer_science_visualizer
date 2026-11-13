import { FlashLayout } from '../FlashLayout.ts'
import type { SsdWearLevelingModel } from './SsdWearLevelingModel.ts'

export class SsdWearLevelingLayout {
  public static create(model: SsdWearLevelingModel) {
    const snapshot = FlashLayout.create(model, 'Wear leveling / allocation and relocation', 'wear-leveling', FlashLayout.height + 270)
    const diagram = snapshot.diagram!
    diagram.region('comparison', 'Separate erase-counter scenario / same six reuse cycles / fixed block versus lowest-count free block', 'observer', 20, FlashLayout.height + 20, 2360, 230)
    for (let block = 0; block < 3; block += 1) {
      diagram.fixture(`comparison-${block}`, `B${block} / fixed versus distributed erases`, `${model.concentrated[block]} versus ${model.distributed[block]}`, 420 + block * 780, FlashLayout.height + 150, undefined, 650)
    }
    return snapshot
  }
}
