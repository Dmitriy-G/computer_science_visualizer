import { PublicationModel } from '../PublicationModel.ts'

export class AcquireReleaseModel extends PublicationModel {
  public speculateData(): void {
    this.earlyData = this.data
    this.flow = 'early'
  }
  public stlr(): boolean { return this.publishFlag(true) }
  public ldar(): number { return this.readFlag(true) }
  public view(mode: 'plain' | 'acquire-release' = 'acquire-release') {
    return this.snapshot('Armv8-A AArch64: aligned flag and data in shared Normal cacheable memory. STLR flag releases earlier data writes; LDAR flag acquires before the following data read, when it reads that release. No full barrier around every access. Early data is a reordered load result, not an incoherent cache copy.', mode)
  }
}
