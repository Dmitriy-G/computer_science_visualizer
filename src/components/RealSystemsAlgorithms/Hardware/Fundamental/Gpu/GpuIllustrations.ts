import type { HardwareElementPhoto } from '../../../../../visualization/HardwareElementInformation.ts'

export class GpuIllustrations {
  public static readonly board: readonly HardwareElementPhoto[] = [{
    src: '/hardware/gpu/graphics-card-annotated.svg',
    alt: 'Original graphics-card PCB with numbered circles identifying the GPU package, a VRAM package, power circuitry, PCIe edge contacts, display connectors, and auxiliary DC connector.',
    caption: 'Discrete graphics card / board components',
    description: 'The cooling assembly has been removed to expose the packages, connectors, and supporting board components.',
  }]

  public static readonly chip: readonly HardwareElementPhoto[] = [{
    src: '/hardware/gpu/gpu-package-annotated.svg',
    alt: 'Original NVIDIA-marked GPU package with separate circles around the exposed GPU die and a sample of the package substrate.',
    caption: 'GPU package / exposed die and substrate',
    description: 'The visible marking reads AD104-250-A1. This separate package photograph does not identify the GPU on the board photograph.',
  }]

  public static readonly memory: readonly HardwareElementPhoto[] = [{
    src: '/hardware/gpu/gddr-package-annotated.svg',
    alt: 'Original SK hynix-marked graphics-memory packages with circles around the marked package top and the underside solder-ball array.',
    caption: 'Graphics-memory package / top and BGA underside',
    description: 'The photograph shows package surfaces and solder-ball connections, rather than the internal memory die or cell array.',
  }]

  public static readonly power: readonly HardwareElementPhoto[] = [{
    src: '/hardware/gpu/vrm-annotated.svg',
    alt: 'Original graphics-card power circuitry with representative capacitor, inductor, and SiC788A-marked power-stage IC circled and numbered.',
    caption: 'Power regulation / capacitor, choke, and power stage',
    description: 'Representative components are highlighted in this separate voltage-regulator example.',
  }, {
    src: '/hardware/gpu/power-header-annotated.svg',
    alt: 'Original board power-header examples with circles identifying the two-by-four housing, straight PCB tails, and right-angle PCB tails.',
    caption: 'PCB power headers / eight-position housing and solder tails',
    description: 'The visible housing has two rows of four positions. The photograph does not establish a specific pinout or compatibility with the separate graphics card.',
  }]

  public static readonly displayPorts: readonly HardwareElementPhoto[] = [{
    src: '/hardware/gpu/hdmi-receptacle-annotated.svg',
    alt: 'Original HDMI board receptacle with its metal shield, contact tongue, and PCB solder tails circled and numbered.',
    caption: 'HDMI receptacle / board-mounted connector',
    description: 'The socket accepts a cable plug; its shell, contact carrier, and board connections are highlighted.',
  }, {
    src: '/hardware/gpu/hdmi-plug-parts-annotated.svg',
    alt: 'Original disassembled HDMI plug with numbered circles identifying the plug insert, both shell halves, strain-relief boot, and assembly screws.',
    caption: 'HDMI plug / disassembled parts',
    description: 'A separate cable-plug example showing its insert and mechanical enclosure parts. It is not a disassembly of the board receptacle.',
  }]
}
