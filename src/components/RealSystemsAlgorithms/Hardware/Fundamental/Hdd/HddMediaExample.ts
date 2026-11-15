export class HddMediaExample {
  // Deliberately chosen uniform 512n geometry, not a manufacturer's specification.
  public static readonly plattersPerDrive = 1
  public static readonly surfacesPerPlatter = 2
  public static readonly tracksPerSurface = 2 ** 18
  public static readonly sectorsPerTrack = 2 ** 12
  public static readonly dataBytesPerSector = 512
  public static readonly payloadBitsPerSector = this.dataBytesPerSector * 8
  public static readonly surfacesPerDrive = this.plattersPerDrive * this.surfacesPerPlatter
  public static readonly sectorsPerSurface = this.tracksPerSurface * this.sectorsPerTrack
  public static readonly sectorsPerDrive = this.surfacesPerDrive * this.sectorsPerSurface
  public static readonly payloadBytes = this.sectorsPerDrive * this.dataBytesPerSector
  public static readonly capacityTiB = this.payloadBytes / 2 ** 40
  public static readonly trackCount = `~${Math.round(this.tracksPerSurface / 1000)}K`
  public static readonly trackSectorCount = `~${Math.round(this.sectorsPerTrack / 1000)}K`
  public static readonly sectorBitCount = `~${Math.round(this.payloadBitsPerSector / 1000)}K`
  public static readonly driveSectorCount = `~${(this.sectorsPerDrive / 1_000_000_000).toFixed(2)}B`
  public static readonly illustratedInterval = 2
  public static readonly previewIntervals = 16
}
