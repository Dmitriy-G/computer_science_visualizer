export class HardwareBlockSizes {
  // Containers fit their children; these presets size blocks without children.
  public static readonly tall = { width: 260, height: 1200 } as const
  public static readonly wide = { width: 600, height: 130 } as const
  public static readonly small = { width: 220, height: 140 } as const
  public static readonly common = { width: 300, height: 240 } as const
}
