import { PublicationModel } from '../PublicationModel.ts'

export class AcquireReleaseModel extends PublicationModel {
  public speculateData(): void {
    this.earlyData = this.data
    this.flow = 'early'
  }
  public stlr(): boolean { return this.publishFlag(true) }
  public ldar(): number { return this.readFlag(true) }
  public view(mode: 'plain' | 'acquire-release' = 'acquire-release') {
    return this.snapshot(mode)
  }
}
