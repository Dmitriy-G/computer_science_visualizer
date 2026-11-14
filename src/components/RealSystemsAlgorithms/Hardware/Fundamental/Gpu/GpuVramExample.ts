export class GpuVramExample {
  public static readonly capacityGiB = 16
  public static readonly chipDensityGib = 16
  public static readonly chipsPerVram = this.capacityGiB * 8 / this.chipDensityGib
  public static readonly diesPerChip = 1
  public static readonly channelsPerDie = 2
  public static readonly banksPerChannel = 16
  public static readonly banksPerDie = this.channelsPerDie * this.banksPerChannel
  public static readonly cellsPerBank = this.chipDensityGib * 2 ** 30 / (this.diesPerChip * this.banksPerDie)
  public static readonly bankCellCount = `~${Math.round(this.cellsPerBank / 1_000_000)}M`
}
