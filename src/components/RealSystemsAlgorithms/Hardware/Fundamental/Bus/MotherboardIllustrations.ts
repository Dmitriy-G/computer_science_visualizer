import type { HardwareElementPhoto } from '../../../../../visualization/HardwareElementInformation.ts'

export class MotherboardIllustrations {
  public static readonly chipset: readonly HardwareElementPhoto[] = [{
    src: '/hardware/motherboard/pch-annotated.svg',
    alt: 'Supplied annotated chipset package example with a Chipset / PCH label listing platform I/O interfaces.',
    caption: 'Chipset / PCH / supplied annotated example; supported interfaces vary by platform',
    width: 662, height: 724,
  }]

  public static readonly spiFlash: readonly HardwareElementPhoto[] = [{
    src: '/hardware/motherboard/spi-flash-annotated.svg',
    alt: 'Original Winbond 25Q64-marked package image with the package-lead label corrected; the other supplied annotations are retained.',
    caption: 'SPI flash / UEFI / supplied annotated firmware-flash example',
    width: 574, height: 265,
  }]

  public static readonly resetControl: readonly HardwareElementPhoto[] = [{
    src: '/hardware/motherboard/reset-annotated.svg',
    alt: 'Supplied annotated reset-circuitry example identifying a reset button, supervisor IC, Super I/O or embedded-controller context, RC delay, protection component, and reset signal route.',
    caption: 'Reset circuitry / supplied annotated component and signal-routing example; labels describe the illustration',
    width: 1536, height: 1024,
  }]

  public static readonly rtcBattery: readonly HardwareElementPhoto[] = [{
    src: '/hardware/motherboard/rtc-battery.svg',
    alt: 'Supplied close-up of a CR2032-marked coin-cell battery held in a motherboard battery socket.',
    caption: 'RTC backup battery',
    description: 'CR2032-marked coin-cell battery held in a motherboard battery socket.',
    width: 3648, height: 2736,
  }]

  public static readonly clockGenerator: readonly HardwareElementPhoto[] = [{
    src: '/hardware/motherboard/clock-generator-annotated.svg',
    alt: 'Supplied annotated clock-generator and buffer example with a nearby reference crystal marked 25.000 MHz.',
    caption: 'Clock generator / buffer / supplied annotated clock and reference-crystal example',
    width: 643, height: 724,
  }]

  public static readonly dcRegulation: readonly HardwareElementPhoto[] = [{
    src: '/hardware/motherboard/dc-input-regulation-annotated.svg',
    alt: 'Supplied annotated motherboard power example identifying a CPU DC input connector, MOSFETs, a regulator, an inductor, and capacitors.',
    caption: 'DC input / regulation / supplied annotated power-input and regulator example; voltages refer to the illustration',
    width: 836, height: 724,
  }]

  public static readonly pcbTraces: readonly HardwareElementPhoto[] = [{
    src: '/hardware/motherboard/pcb-traces.svg',
    alt: 'Motherboard photograph with the unlabeled left oval removed and the labeled blue outline highlighting PCB traces near expansion slots retained.',
    caption: 'PCB traces / signal routing / supplied annotated motherboard example',
    width: 1128, height: 850,
  }]
}
