import type { HardwareElementPhoto } from '../../../../../visualization/HardwareElementInformation.ts'

export class HddIllustrations {
  public static readonly arm: readonly HardwareElementPhoto[] = [{
    src: '/hardware/hdd/actuator-arm-annotated.svg',
    alt: 'Supplied annotated HDD actuator assembly identifying the arm and the read/write head with its suspension.',
    caption: 'Actuator arm / supplied annotated head-positioning assembly',
    width: 576, height: 256,
  }]

  public static readonly pivot: readonly HardwareElementPhoto[] = [{
    src: '/hardware/hdd/pivot-annotated.svg',
    alt: 'Supplied annotated actuator close-up identifying the pivot bearing and the arm mount.',
    caption: 'Actuator pivot / supplied annotated bearing and arm mount',
    width: 593, height: 258,
  }]

  public static readonly servoController: readonly HardwareElementPhoto[] = [{
    src: '/hardware/hdd/servo-controller-annotated.svg',
    alt: 'Supplied annotated HDD controller and VCM-driver example, with a callout locating servo logic within the controller SoC.',
    caption: 'Servo control / supplied controller SoC and VCM-driver context',
    width: 579, height: 287,
  }]

  public static readonly cache: readonly HardwareElementPhoto[] = [{
    src: '/hardware/hdd/dram-cache.svg',
    alt: 'Supplied close-up of a Samsung-marked DRAM package soldered to a green drive circuit board.',
    caption: 'DRAM cache',
    description: 'DRAM memory chip and its soldered connections on the HDD circuit board.',
    width: 980, height: 669,
  }]

  public static readonly motorDriver: readonly HardwareElementPhoto[] = [{
    src: '/hardware/hdd/motor-driver.svg',
    alt: 'Supplied motor-driver example showing a square ST-marked integrated circuit and nearby board components.',
    caption: 'Motor-driver circuitry',
    description: 'Motor-driver IC surrounded by resistors, capacitors, and circuit-board traces. The image does not establish model-specific specifications.',
    width: 800, height: 600,
  }]

  public static readonly powerCircuitry: readonly HardwareElementPhoto[] = [{
    src: '/hardware/hdd/power-circuitry.svg',
    alt: 'Supplied power-circuitry close-up showing a regulator package and nearby components on a green circuit board.',
    caption: 'Drive power circuitry',
    description: 'Voltage-regulator package and nearby components on the HDD circuit board.',
    width: 1024, height: 576,
  }]

  public static readonly spindleMotor: readonly HardwareElementPhoto[] = [{
    src: '/hardware/hdd/spindle-motor.svg',
    alt: 'Supplied spindle-motor close-up showing copper windings arranged around a central bearing and shaft opening.',
    caption: 'Spindle motor',
    description: 'Copper stator windings surround the central bearing and shaft opening.',
    width: 2121, height: 1414,
  }]

  public static readonly writePole: readonly HardwareElementPhoto[] = [{
    src: '/hardware/hdd/write-pole.svg',
    alt: 'Supplied grayscale writer image with original yellow labels identifying the writer pole, trailing shield, side shield, and leading shield.',
    caption: 'Write pole / supplied annotated writer example with surrounding shields',
    width: 556, height: 424,
  }]

  public static readonly readSensorContext: readonly HardwareElementPhoto[] = [{
    src: '/hardware/hdd/mr-reader-context.svg',
    alt: 'Supplied read-head assembly close-up showing the slider, suspension, electrical traces, and original 1 mm scale bar.',
    caption: 'Read-head assembly',
    description: 'Head slider, suspension, and fine electrical traces, with a 1 mm scale bar. The individual sensing element is not identified in this photograph.',
    width: 5910, height: 3440,
  }]

  public static readonly magneticFilm: readonly HardwareElementPhoto[] = [{
    src: '/hardware/hdd/magnetic-film.svg',
    alt: 'Supplied grayscale recording-film cross-section labeled wear region, COC, recording layer, and interlayer, with an original 10 nm scale bar.',
    caption: 'Magnetic film / supplied layer cross-section; labels and scale refer to this sample',
    width: 992, height: 579,
  }]

  public static readonly magneticGrains: readonly HardwareElementPhoto[] = [{
    src: '/hardware/hdd/magnetic-grains.svg',
    alt: 'Supplied two-panel magnetic-grain image with original 20 nm and 5 nm scale bars and labels for CoCrPt and SiO2.',
    caption: 'Magnetic grains / supplied material example with original labels and scale bars',
    width: 1491, height: 717,
  }]

  public static readonly recordedPattern: readonly HardwareElementPhoto[] = [{
    src: '/hardware/hdd/stored-magnetic-patterns.svg',
    alt: 'Supplied magnetic-pattern scan with alternating light and dark features, original nanometer axes, and a contrast scale.',
    caption: 'Stored magnetic patterns',
    description: 'Light and dark contrast shows magnetic features in this scan, rather than a direct listing of decoded user bits.',
    width: 635, height: 635,
  }]

  public static readonly controller: readonly HardwareElementPhoto[] = [{
    src: '/hardware/hdd/controller.svg',
    alt: 'Supplied annotated HDD circuit board identifying the controller SoC, DRAM cache, motor driver, power circuitry, SATA connector, and clock oscillator.',
    caption: 'HDD controller / supplied annotated board example; labels describe the supplied illustration',
    width: 1217, height: 1293,
  }]

  public static readonly mechanicalAssembly: readonly HardwareElementPhoto[] = [{
    src: '/hardware/hdd/mechanical-assembly.svg',
    alt: 'Supplied annotated opened hard disk showing the platter, spindle, actuator, pivot axis, arm, and head, with the printed credit Parker Enfield.',
    caption: 'HDD mechanical assembly / supplied annotated example',
    width: 1280, height: 1016,
    author: 'Parker Enfield (credit printed on supplied image)',
  }]

  public static readonly pcb: readonly HardwareElementPhoto[] = [{
    src: '/hardware/hdd/pcb.svg',
    alt: 'Supplied annotated HDD circuit board with callouts for cache, microcontroller, VCM controller, motor and head contacts, power and data connectors, ROM chip, and shock sensor.',
    caption: 'HDD circuit board',
    description: 'Cache, microcontroller, motor and head contacts, VCM controller, ROM, shock sensor, and power/data connectors. Labels follow the supplied example; component layout varies by drive.',
    width: 800, height: 550,
  }]

  public static readonly head: readonly HardwareElementPhoto[] = [{
    src: '/hardware/hdd/read-write-head.svg',
    alt: 'Supplied close-up of a hard disk head slider and suspension with fine electrical traces and a printed 1 mm scale bar.',
    caption: 'Read/write head assembly',
    description: 'Head slider on its suspension, with electrical connections routed along fine traces. The original scale bar is 1 mm.',
    width: 5910, height: 3440,
  }]

  public static readonly preamp: readonly HardwareElementPhoto[] = [{
    src: '/hardware/hdd/head-preamp.svg',
    alt: 'Supplied head preamplifier example showing electronics on an orange flexible circuit beside the actuator pivot and coil.',
    caption: 'Head preamplifier',
    description: 'Electronics on the actuator flexible circuit, beside the pivot and voice coil.',
    width: 1746, height: 1164,
  }]

  public static readonly connectors: readonly HardwareElementPhoto[] = [{
    src: '/hardware/hdd/sata-connector.svg',
    alt: 'Original SATA drive connector photograph with corrected labels: the upper, wider connector is power and the lower, narrower connector is data.',
    caption: 'SATA connector / 15-contact power interface and 7-contact data interface',
    width: 800, height: 800,
  }]

  public static readonly voiceCoil: readonly HardwareElementPhoto[] = [{
    src: '/hardware/hdd/voice-coil.svg',
    alt: 'Supplied close-up of an orange copper voice coil attached to a hard disk actuator assembly beside its pivot.',
    caption: 'Voice-coil actuator',
    description: 'The copper coil is attached to the moving actuator assembly next to its pivot.',
    width: 750, height: 499,
  }]

  public static readonly filter: readonly HardwareElementPhoto[] = [{
    src: '/hardware/hdd/air-filter.svg',
    alt: 'Supplied close-up of white pleated filter media.',
    caption: 'Filter media',
    description: 'Close-up of pleated filter material. The supplied photograph does not identify an HDD recirculation filter.',
    width: 2048, height: 1361,
  }]
}
