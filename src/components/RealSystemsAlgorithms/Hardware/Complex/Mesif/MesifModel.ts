import { CoherenceModel } from '../CoherenceModel.ts'

export class MesifModel extends CoherenceModel {
  protected readonly protocol = 'MESIF' as const
}
