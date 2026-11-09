import { FlashLayout } from '../FlashLayout.ts'
import type { SsdFtlModel } from './SsdFtlModel.ts'

export class SsdFtlLayout {
  public static create(model: SsdFtlModel) {
    return FlashLayout.create(model, 'FTL / logical-to-physical mapping')
  }
}
