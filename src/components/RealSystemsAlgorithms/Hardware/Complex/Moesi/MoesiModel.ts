import { CoherenceModel } from '../CoherenceModel.ts'

export class MoesiModel extends CoherenceModel {
  protected readonly protocol = 'MOESI' as const
}
