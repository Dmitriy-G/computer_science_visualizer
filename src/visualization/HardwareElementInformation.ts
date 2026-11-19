export interface HardwareElementPhoto {
  readonly src: string
  readonly alt: string
  readonly caption: string
  readonly description?: string
  readonly fullWidth?: boolean
  readonly width?: number
  readonly height?: number
  readonly hideCredit?: boolean
  readonly author?: string
  readonly sourceUrl?: string
  readonly license?: string
  readonly licenseUrl?: string
  readonly changes?: string
}

export interface HardwareElementInformation {
  readonly photos: readonly HardwareElementPhoto[]
  readonly overview: string
  readonly problem: string
  readonly characteristicNote: string
  readonly characteristics: readonly { readonly name: string, readonly value: string }[]
  readonly documentation: readonly { readonly title: string, readonly url: string }[]
}
