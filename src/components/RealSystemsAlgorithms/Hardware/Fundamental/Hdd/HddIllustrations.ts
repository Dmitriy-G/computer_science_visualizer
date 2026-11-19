import type { HardwareElementPhoto } from '../../../../../visualization/HardwareElementInformation.ts'

export class HddIllustrations {
  public static readonly arm: readonly HardwareElementPhoto[] = [{
    src: '/hardware/hdd/actuator-arm-annotated.png',
    alt: 'Supplied annotated HDD actuator assembly identifying the arm and the read/write head with its suspension.',
    caption: 'Actuator arm / supplied annotated head-positioning assembly',
    width: 576, height: 256,
  }]

  public static readonly pivot: readonly HardwareElementPhoto[] = [{
    src: '/hardware/hdd/pivot-annotated.png',
    alt: 'Supplied annotated actuator close-up identifying the pivot bearing and the arm mount.',
    caption: 'Actuator pivot / supplied annotated bearing and arm mount',
    width: 593, height: 258,
  }]

  public static readonly servoController: readonly HardwareElementPhoto[] = [{
    src: '/hardware/hdd/servo-controller-annotated.png',
    alt: 'Supplied annotated HDD controller and VCM-driver example, with a callout locating servo logic within the controller SoC.',
    caption: 'Servo control / supplied controller SoC and VCM-driver context',
    width: 579, height: 287,
  }]

  public static readonly cache: readonly HardwareElementPhoto[] = [{
    src: '/hardware/hdd/dram-cache.jpg',
    alt: 'Supplied close-up of a Samsung-marked DRAM package soldered to a green drive circuit board.',
    caption: 'Data cache / supplied DRAM package example',
    width: 980, height: 669,
  }]

  public static readonly motorDriver: readonly HardwareElementPhoto[] = [{
    src: '/hardware/hdd/motor-driver.jpg',
    alt: 'Supplied motor-driver example showing a square ST-marked integrated circuit and nearby board components.',
    caption: 'Motor-driver circuitry / supplied PCB example; no model-specific specifications are inferred',
    width: 800, height: 600,
  }]

  public static readonly powerCircuitry: readonly HardwareElementPhoto[] = [{
    src: '/hardware/hdd/power-circuitry.jpg',
    alt: 'Supplied power-circuitry close-up showing a regulator package and nearby components on a green circuit board.',
    caption: 'Drive power circuitry / supplied board close-up',
    width: 1024, height: 576,
  }]

  public static readonly spindleMotor: readonly HardwareElementPhoto[] = [{
    src: '/hardware/hdd/spindle-motor.jpg',
    alt: 'Supplied spindle-motor close-up showing copper windings arranged around a central bearing and shaft opening.',
    caption: 'Spindle motor / supplied internal motor example',
    width: 2121, height: 1414,
  }]

  public static readonly writePole: readonly HardwareElementPhoto[] = [{
    src: '/hardware/hdd/write-pole.jpg',
    alt: 'Supplied grayscale writer image with original yellow labels identifying the writer pole, trailing shield, side shield, and leading shield.',
    caption: 'Write pole / supplied annotated writer example with surrounding shields',
    width: 556, height: 424,
  }]

  public static readonly readSensorContext: readonly HardwareElementPhoto[] = [{
    src: '/hardware/hdd/mr-reader-context.jpg',
    alt: 'Supplied read-head assembly close-up showing the slider, suspension, electrical traces, and original 1 mm scale bar.',
    caption: 'MR reader assembly context / the individual sensing element is not identified in this photograph',
    width: 5910, height: 3440,
  }]

  public static readonly magneticFilm: readonly HardwareElementPhoto[] = [{
    src: '/hardware/hdd/magnetic-film.jpg',
    alt: 'Supplied grayscale recording-film cross-section labeled wear region, COC, recording layer, and interlayer, with an original 10 nm scale bar.',
    caption: 'Magnetic film / supplied layer cross-section; labels and scale refer to this sample',
    width: 992, height: 579,
  }]

  public static readonly magneticGrains: readonly HardwareElementPhoto[] = [{
    src: '/hardware/hdd/magnetic-grains.jpg',
    alt: 'Supplied two-panel magnetic-grain image with original 20 nm and 5 nm scale bars and labels for CoCrPt and SiO2.',
    caption: 'Magnetic grains / supplied material example with original labels and scale bars',
    width: 1491, height: 717,
  }]

  public static readonly recordedPattern: readonly HardwareElementPhoto[] = [{
    src: '/hardware/hdd/stored-magnetic-patterns.jpg',
    alt: 'Supplied magnetic-pattern scan with alternating light and dark features, original nanometer axes, and a contrast scale.',
    caption: 'Stored magnetic patterns / supplied scan; contrast is not a direct listing of decoded user bits',
    width: 635, height: 635,
  }]

  public static readonly controller: readonly HardwareElementPhoto[] = [{
    src: '/hardware/hdd/controller.png',
    alt: 'Supplied annotated HDD circuit board identifying the controller SoC, DRAM cache, motor driver, power circuitry, SATA connector, and clock oscillator.',
    caption: 'HDD controller / supplied annotated board example; labels describe the supplied illustration',
    width: 1217, height: 1293,
  }]

  public static readonly mechanicalAssembly: readonly HardwareElementPhoto[] = [{
    src: '/hardware/hdd/mechanical-assembly.jpg',
    alt: 'Supplied annotated opened hard disk showing the platter, spindle, actuator, pivot axis, arm, and head, with the printed credit Parker Enfield.',
    caption: 'HDD mechanical assembly / supplied annotated example',
    width: 1280, height: 1016,
    author: 'Parker Enfield (credit printed on supplied image)',
  }]

  public static readonly pcb: readonly HardwareElementPhoto[] = [{
    src: '/hardware/hdd/pcb.jpg',
    alt: 'Supplied annotated HDD circuit board with callouts for cache, microcontroller, VCM controller, motor and head contacts, power and data connectors, ROM chip, and shock sensor.',
    caption: 'HDD PCB / supplied annotated board example; component layout varies by drive',
    width: 800, height: 550,
  }]

  public static readonly head: readonly HardwareElementPhoto[] = [{
    src: '/hardware/hdd/read-write-head.jpg',
    alt: 'Supplied close-up of a hard disk head slider and suspension with fine electrical traces and a printed 1 mm scale bar.',
    caption: 'Read/write head assembly / supplied close-up with original scale bar',
    width: 5910, height: 3440,
  }]

  public static readonly preamp: readonly HardwareElementPhoto[] = [{
    src: '/hardware/hdd/head-preamp.jpg',
    alt: 'Supplied head preamplifier example showing electronics on an orange flexible circuit beside the actuator pivot and coil.',
    caption: 'Head preamp / supplied example on the actuator flexible circuit',
    width: 1746, height: 1164,
  }]

  public static readonly connectors: readonly HardwareElementPhoto[] = [{
    src: '/hardware/hdd/sata-connector.jpg',
    alt: 'Supplied SATA drive connector photograph showing adjacent wide and narrow contact groups with the original Data Interface and Power Interface annotations.',
    caption: 'SATA connector example / the supplied labels are reversed: the wider 15-contact connector is power; the narrower 7-contact connector is data',
    width: 800, height: 800,
  }]

  public static readonly voiceCoil: readonly HardwareElementPhoto[] = [{
    src: '/hardware/hdd/voice-coil.jpg',
    alt: 'Supplied close-up of an orange copper voice coil attached to a hard disk actuator assembly beside its pivot.',
    caption: 'Voice-coil actuator / supplied coil close-up',
    width: 750, height: 499,
  }]

  public static readonly filter: readonly HardwareElementPhoto[] = [{
    src: '/hardware/hdd/air-filter.jpg',
    alt: 'Supplied close-up of white pleated filter media.',
    caption: 'Supplied filter-media close-up / illustrative texture; this photo is not identified as an HDD recirculation filter',
    width: 2048, height: 1361,
  }]
}
