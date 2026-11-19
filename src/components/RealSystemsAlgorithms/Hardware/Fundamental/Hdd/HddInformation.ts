import type { HardwareElementInformation } from '../../../../../visualization/HardwareElementInformation.ts'
import { HddMediaInformation } from './HddMediaInformation.ts'
import { HddIllustrations } from './HddIllustrations.ts'

export class HddInformation {
  public static readonly driveDocumentation = {
    title: 'Seagate / Laptop HDD product manual: mechanical assembly, electronics, and servo system',
    url: 'https://www.seagate.com/www-content/support-content/samsung/internal-products/spinpoint-m-series/en-us/docs/100772113c.pdf',
  }

  private static readonly modelNote = 'This is a logical component map, not a circuit-board floorplan. Several functions can share a controller chip; placement and implementation vary by drive.'

  private static readonly entries: Readonly<Record<string, HardwareElementInformation>> = {
    'hdd-electronics': {
      photos: HddIllustrations.pcb,
      overview: 'The printed circuit board carries the drive electronics that connect the host to the mechanical storage assembly.',
      problem: 'It coordinates requests, buffering, signal processing, head positioning, and motor power.',
      characteristicNote: this.modelNote,
      characteristics: [
        { name: 'Logical groups', value: 'Host interface, controller, cache, read/write channel, servo control, and motor drivers.' },
        { name: 'Persistent storage', value: 'The platter recording film stores the payload. DRAM and active processing state are volatile.' },
        { name: 'View', value: 'The PCB is shown alongside the mechanical assembly for clarity; the diagram does not depict actual chip locations.' },
      ],
      documentation: [this.driveDocumentation],
    },
    'hdd-enclosure': {
      photos: HddIllustrations.mechanicalAssembly,
      overview: 'The head-disk assembly contains rotating platters and the mechanism that positions read/write heads above their surfaces.',
      problem: 'It maintains the mechanical alignment and controlled environment needed to access magnetic recordings.',
      characteristicNote: 'The diagram shows one representative platter and head. The media enlargement refers to this same assembly, rather than another drive.',
      characteristics: [
        { name: 'Rotation', value: 'The spindle motor turns the platters.' },
        { name: 'Positioning', value: 'A voice-coil actuator moves the head arm around its pivot; servo feedback maintains track alignment.' },
        { name: 'Access', value: 'Read/write operations require the selected sector to pass beneath the positioned head.' },
      ],
      documentation: [this.driveDocumentation],
    },
    'hdd-data-connector': {
      photos: HddIllustrations.connectors,
      overview: 'The host interface receives storage commands and exchanges payloads and completion status with the computer.',
      problem: 'It connects host block requests to the drive controller and data buffer.',
      characteristicNote: 'SATA and SAS are alternative drive attachments. SATA can attach to a motherboard SATA port or compatible HBA; SAS needs a compatible SAS controller or HBA.',
      characteristics: [
        { name: 'Commands', value: 'Requests identify logical sectors and the operation to perform.' },
        { name: 'Payloads', value: 'Write bytes enter the cache; validated read bytes return from it through the host interface.' },
        { name: 'Scope', value: 'One drive uses one illustrated attachment. The host connection is separate from the DC power input.' },
      ],
      documentation: [this.driveDocumentation],
    },
    'hdd-cache': {
      photos: HddIllustrations.cache,
      overview: 'The DRAM cache temporarily holds payload data while host transfers and media access proceed at different rates.',
      problem: 'It stages complete transfers without requiring the host and rotating disk to operate in lockstep.',
      characteristicNote: 'DRAM is volatile. A cached write is not automatically durable; flush, completion, and power-loss behavior depend on drive policy. The write lesson completes after modeled recording.',
      characteristics: [
        { name: 'Write path', value: 'Host payloads enter the cache before ECC and recording encoding.' },
        { name: 'Read path', value: 'Checked read data enters the cache before host delivery.' },
        { name: 'Controller', value: 'The controller manages buffer transfers separately from head positioning.' },
      ],
      documentation: [this.driveDocumentation],
    },
    'hdd-ecc': {
      photos: [],
      overview: 'Error-correcting code logic adds redundancy before recording and checks it when reconstructing read data.',
      problem: 'It detects and corrects supported errors before a read payload reaches the host.',
      characteristicNote: 'The lessons use teaching Hamming (8,4) SECDED for every payload byte. This is not a modern HDD production ECC scheme or overhead specification.',
      characteristics: [
        { name: 'Encoding', value: 'Write data and its redundancy pass to the recording encoder.' },
        { name: 'Decoding', value: 'Read processing supplies codewords for checking and supported correction.' },
        { name: 'Failure', value: 'The model blocks host delivery when a codeword is detected as uncorrectable.' },
      ],
      documentation: [this.driveDocumentation],
    },
    'hdd-write-channel': {
      photos: [],
      overview: 'The write encoder converts protected data into a recording stream used to control magnetic transitions.',
      problem: 'It supplies a recording representation that the head driver can write onto the moving medium.',
      characteristicNote: 'The lesson uses Manchester symbols and NRZI magnetization as deterministic teaching codes. Real drives use different, technology-specific recording channels.',
      characteristics: [
        { name: 'Input', value: 'Payload with ECC redundancy from the encoding stage.' },
        { name: 'Output', value: 'A recording stream sent to the preamp/write driver and write pole.' },
        { name: 'Gating', value: 'Recording is permitted only after head settling and sector alignment.' },
      ],
      documentation: [this.driveDocumentation],
    },
    'hdd-read-channel': {
      photos: [],
      overview: 'Read processing reconstructs a digital recording stream from the electrical signal returned by the head and preamplifier.',
      problem: 'The magnetic sensor produces a signal that must be detected and decoded before payload recovery.',
      characteristicNote: 'The diagram groups analog conditioning, detection, and recording decoding. The lesson abstracts analog behavior and reverses its teaching recording code.',
      characteristics: [
        { name: 'Read input', value: 'Receives the amplified head signal rather than direct payload bytes.' },
        { name: 'ECC handoff', value: 'Recovered codewords go to ECC checking before the host can receive data.' },
        { name: 'Servo feedback', value: 'The read path also supplies position information used by servo control.' },
      ],
      documentation: [this.driveDocumentation],
    },
    'hdd-controller': {
      photos: HddIllustrations.controller,
      overview: 'The HDD controller coordinates host requests, internal data movement, media addressing, and access scheduling.',
      problem: 'A logical sector request requires several electronic and mechanical functions to work together in the correct order.',
      characteristicNote: this.modelNote,
      characteristics: [
        { name: 'Direct control', value: 'Coordinates the buffer, read/write channel, servo controller, and spindle driver.' },
        { name: 'Address lookup', value: 'Consults logical-to-physical mapping as a metadata branch.' },
        { name: 'Completion', value: 'Reports completion after the modeled operation; the read lesson delivers checked data first.' },
      ],
      documentation: [this.driveDocumentation],
    },
    'hdd-firmware-map': {
      photos: [],
      overview: 'Logical-to-physical mapping resolves a host logical block address to an internal recording location.',
      problem: 'The host needs stable sector addresses without managing head selection, recording zones, or defect remapping.',
      characteristicNote: 'This is a controller lookup, not a required serial control stage between the controller and every other function. Actual mapping policies vary.',
      characteristics: [
        { name: 'Lesson lookup', value: 'LBA 7 resolves to head 0, illustrative track 1, sector 3.' },
        { name: 'Defects', value: 'Real drives can redirect defective locations to spares; the lessons keep one fixed mapping.' },
        { name: 'Geometry', value: 'The diagram uses uniform teaching geometry rather than exposing a real physical disk layout.' },
      ],
      documentation: [this.driveDocumentation, HddMediaInformation.formatDocumentation],
    },
    'hdd-servo-controller': {
      photos: HddIllustrations.servoController,
      overview: 'Servo control uses position feedback to move the head to a track and keep it aligned while the platter rotates.',
      problem: 'A requested sector cannot be accessed reliably unless the head is settled on the intended track.',
      characteristicNote: 'Position feedback comes through the read path. The lesson models seek and settling symbolically, without analog control-loop timing.',
      characteristics: [
        { name: 'Input', value: 'Receives the target from the HDD controller and position feedback from read processing.' },
        { name: 'Output', value: 'Commands the VCM driver to adjust head-positioning current.' },
        { name: 'Separate rotation', value: 'Spindle rotation is controlled through its own driver and continues during seeking.' },
      ],
      documentation: [this.driveDocumentation],
    },
    'hdd-motor-driver': {
      photos: HddIllustrations.motorDriver,
      overview: 'Motor-driver circuitry supplies controlled electrical power to the spindle motor and voice-coil actuator.',
      problem: 'Low-power controller commands cannot directly provide the currents needed for mechanical movement.',
      characteristicNote: 'The two boxes identify distinct functions. A drive can integrate both into one motor-control device.',
      characteristics: [
        { name: 'VCM driver', value: 'Controls coil current for seeking and track following.' },
        { name: 'Spindle driver', value: 'Commutates the spindle motor to rotate the platters.' },
        { name: 'Supply', value: 'Uses drive DC power, separate from command and feedback signals.' },
      ],
      documentation: [this.driveDocumentation],
    },
    'hdd-vcm-driver': {
      photos: [],
      overview: 'The VCM driver regulates current through the voice-coil actuator.',
      problem: 'It converts servo commands into the force needed to position the read/write head.',
      characteristicNote: 'VCM means voice-coil motor. This driver positions the arm rather than rotating the platter.',
      characteristics: [
        { name: 'Control input', value: 'Receives commands from the servo controller.' },
        { name: 'Power output', value: 'Supplies actuator coil current for seeking and fine track following.' },
      ],
      documentation: [this.driveDocumentation],
    },
    'hdd-spindle-driver': {
      photos: [],
      overview: 'The spindle driver switches motor current to sustain platter rotation.',
      problem: 'It powers the continuous rotation that brings different sectors beneath the head.',
      characteristicNote: 'The spindle motor and voice-coil actuator perform different motions. Symbolic angular samples in the diagram do not specify a real RPM.',
      characteristics: [
        { name: 'Control', value: 'Receives rotation commands from the HDD controller.' },
        { name: 'Motor', value: 'Drives the spindle motor independently of the VCM head-positioning path.' },
      ],
      documentation: [this.driveDocumentation],
    },
    'hdd-power-connector': {
      photos: [...HddIllustrations.connectors, ...HddIllustrations.powerCircuitry],
      overview: 'The power input accepts PSU DC supply; internal regulation distributes the required drive rails.',
      problem: 'It provides power for the electronics, head circuitry, and mechanical motors.',
      characteristicNote: 'Supply rails and connector arrangements depend on drive form factor. AC mains does not enter the HDD.',
      characteristics: [
        { name: 'Loads', value: 'Controller, cache, preamp, spindle driver, and VCM driver use drive power.' },
        { name: 'Persistence', value: 'Recorded magnetization survives power removal; unprotected DRAM contents do not.' },
        { name: 'Drawing', value: 'The diagram groups regulation and omits detailed internal power distribution.' },
      ],
      documentation: [this.driveDocumentation],
    },
    'hdd-actuator': {
      photos: HddIllustrations.voiceCoil,
      overview: 'The voice-coil actuator produces torque that moves the head arm around its pivot.',
      problem: 'It selects the radial track and makes small corrections to maintain alignment.',
      characteristicNote: 'The coil receives controlled current from the VCM driver. The drawn block is a logical mechanism representation.',
      characteristics: [
        { name: 'Motion', value: 'Moves the head along an arc across the platter surface.' },
        { name: 'Feedback', value: 'Servo control adjusts current using position information from the read path.' },
        { name: 'Separate motor', value: 'The spindle motor rotates the platter; the actuator positions the head.' },
      ],
      documentation: [this.driveDocumentation],
    },
    'hdd-preamp': {
      photos: HddIllustrations.preamp,
      overview: 'Head electronics combine read-signal preamplification with write-current driving functions.',
      problem: 'They connect the small sensor signal and the writer current requirements to the board read/write channel.',
      characteristicNote: 'The map groups preamp and driver functions. Their implementation and placement depend on the head and drive.',
      characteristics: [
        { name: 'Write direction', value: 'Drives the head writer according to the encoded recording stream.' },
        { name: 'Read direction', value: 'Amplifies the sensor signal before read processing and ECC checking.' },
        { name: 'Storage', value: 'The persistent recording is in the platter film, rather than this circuitry.' },
      ],
      documentation: [this.driveDocumentation],
    },
    'hdd-filter': {
      photos: HddIllustrations.filter,
      overview: 'A recirculation filter traps particles carried by airflow inside the head-disk assembly.',
      problem: 'It helps maintain the cleanliness required around the head and recording surfaces.',
      characteristicNote: 'The arrow represents airflow, not an electrical connection. This is the illustrated air-filled drive example; enclosure and filter designs vary.',
      characteristics: [
        { name: 'Flow source', value: 'Rotating platters move air through the internal environment.' },
        { name: 'Passive function', value: 'The filter captures particles without receiving a data or motor-control signal.' },
      ],
      documentation: [{
        title: 'Seagate / Spinpoint M9TU manual: head-disk assembly and recirculation filter',
        url: 'https://www.seagate.com/content/dam/seagate/migrated-assets/www-content/support-content/internal-products/spinpoint-m-series/en-us/PMM9TU-USB3.0-100736109b.pdf',
      }],
    },
    'hdd-platter': {
      photos: [],
      overview: 'A platter is a rigid rotating disk whose recording surfaces carry magnetic storage material.',
      problem: 'It provides the physical area on which tracks and sectors can be recorded.',
      characteristicNote: 'The explicit model uses one platter and two recording surfaces. Real platter counts and recording densities vary.',
      characteristics: [
        { name: 'Movement', value: 'The spindle rotates the platter while the actuator positions the head.' },
        { name: 'Recording', value: 'The magnetic film on the used surfaces retains the encoded pattern.' },
        { name: 'Detail view', value: 'The media enlargement describes the same surface, not an additional platter.' },
      ],
      documentation: [this.driveDocumentation, HddMediaInformation.recordingDocumentation],
    },
    'hdd-sector-target': {
      photos: [],
      overview: 'The highlighted sector marks the requested part of a track as it rotates toward the head.',
      problem: 'It shows why reaching the right track still leaves a wait for rotational alignment.',
      characteristicNote: 'The wedge and eight angular samples are symbolic. They do not show the actual number or physical width of sectors on a real track.',
      characteristics: [
        { name: 'Lesson target', value: 'The fixed lookup selects head 0, track 1, sector 3.' },
        { name: 'Access gate', value: 'Read and write work requires a spinning platter, a settled head, and sector alignment.' },
      ],
      documentation: [this.driveDocumentation],
    },
    'hdd-spindle': {
      photos: HddIllustrations.spindleMotor,
      overview: 'The spindle is the central rotating hub and motor assembly carrying the platter stack.',
      problem: 'It turns the recording surfaces so successive sectors pass beneath the head.',
      characteristicNote: 'The drawn hub is schematic; no particular motor construction, RPM, or measured latency is specified.',
      characteristics: [
        { name: 'Drive', value: 'The spindle motor driver supplies controlled motor power.' },
        { name: 'Concurrent motion', value: 'Rotation continues during seeking and settling in the access lessons.' },
      ],
      documentation: [this.driveDocumentation],
    },
    'hdd-arm': {
      photos: HddIllustrations.arm,
      overview: 'The actuator arm carries the head and moves it across the recording surface.',
      problem: 'It allows one head to access different radial tracks.',
      characteristicNote: 'The model uses a rigid fixed-length arm. Actual assemblies also include suspensions and sliders, which are not drawn in detail.',
      characteristics: [
        { name: 'Pivot', value: 'The arm rotates around a fixed actuator pivot.' },
        { name: 'Actuation', value: 'Voice-coil torque moves the arm; the head follows an arc rather than a straight radial line.' },
      ],
      documentation: [this.driveDocumentation],
    },
    'hdd-pivot': {
      photos: HddIllustrations.pivot,
      overview: 'The actuator pivot is the bearing axis about which the head arm turns.',
      problem: 'It constrains head movement to a repeatable mechanical path across the platter.',
      characteristicNote: 'The pivot stays fixed while the arm turns. It is separate from the platter spindle.',
      characteristics: [
        { name: 'Positioning', value: 'VCM torque rotates the actuator assembly around this axis.' },
        { name: 'Geometry', value: 'The fixed pivot and arm length determine the head-position arc in the model.' },
      ],
      documentation: [this.driveDocumentation],
    },
    'hdd-head': {
      photos: HddIllustrations.head,
      overview: 'The read/write head carries a writer and a separate magnetic reader above a recording surface.',
      problem: 'It converts electrical write signals into recorded magnetization and recorded fields back into read signals.',
      characteristicNote: 'This representative head is enlarged in the media view. The model uses one head per used surface and one reader per head; actual designs vary.',
      characteristics: [
        { name: 'Writer', value: 'The write pole applies a magnetic field to the moving recording film.' },
        { name: 'Reader', value: 'A magnetoresistive sensor responds to the recorded pattern without intentionally rewriting it.' },
        { name: 'Position', value: 'The arm and servo keep the head aligned with the selected track.' },
      ],
      documentation: [this.driveDocumentation, HddMediaInformation.recordingDocumentation],
    },
  }

  public static get(regionId: string | null): HardwareElementInformation | null {
    if (regionId === null) return null
    return this.entries[regionId] ?? HddMediaInformation.get(regionId)
  }
}
