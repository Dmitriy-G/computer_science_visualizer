import type { HardwareElementInformation } from '../../../../../visualization/HardwareElementInformation.ts'

export class EthernetPortInformation {
  public static readonly information: HardwareElementInformation = {
    photos: [
      {
        src: '/hardware/network-adapter/ethernet-rj45-cable.svg',
        alt: 'Two metal-housed RJ45 (8P8C) Ethernet cable plugs with transparent tips, eight gold-colored contacts, and black cable jackets.',
        caption: 'Copper Ethernet cable / RJ45 (8P8C) plugs',
        description: 'Transparent plug tips expose the contact positions, with metal shields and black strain-relief boots.',
        width: 700,
        height: 700,
      },
      {
        src: '/hardware/network-adapter/ethernet-gbic-annotated.svg',
        alt: 'Opened Nortel 1000BASE-SX Ethernet GBIC with the optics, circuit ICs, host connector, and small eight-pin ID memory chip circled and labeled.',
        caption: 'Opened Gigabit Ethernet / Nortel AA1419001 GBIC',
        author: 'Mister rf',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:NORTEL_AA1419001_case_and_metal_shields_removed.jpg',
        license: 'CC BY-SA 4.0',
        licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
        changes: 'Annotated (AI-assisted)',
        hideCredit: true,
      },
    ],
    overview: 'This is the adapter’s physical connection to the network. A copper port accepts an RJ45 (8P8C) plug. An optical variant uses a pluggable transceiver and fiber connector; the module converts electrical signals to light and received light back to electrical signals. These are alternative connections in the diagram.',
    problem: 'It connects the adapter to the cable that carries signals to another network device. A pluggable optical module lets a compatible port use the fiber type and transmission distance required for that link.',
    characteristicNote: 'The opened photo shows a Nortel AA1419001 1000BASE-SX Gigabit Ethernet GBIC, an older, larger form factor than SFP. The SFP specifications below describe Cisco GLC-LH-SMD, a separate Ethernet example. Speeds, dimensions, and reach depend on the module.',
    characteristics: [
      { name: 'Pictured ID memory', value: 'The small eight-pin Atmel chip appears to be a serial EEPROM. This non-volatile memory keeps module identification, such as vendor, part number, and serial number, available for the host to read when the module is inserted.' },
      { name: 'Copper connector', value: 'RJ45 / 8P8C jack: eight contact positions for a twisted-pair cable.' },
      { name: 'Copper link example', value: '1000BASE-T: 1 Gb/s over Category 5 or better copper cabling, up to 100 m.' },
      { name: 'Optical module example', value: 'Cisco GLC-LH-SMD: 1000BASE-LX/LH, 1 Gb/s, duplex LC connector, nominal 1310 nm wavelength.' },
      { name: 'Optical reach', value: 'Up to 10 km over supported single-mode fiber for the GLC-LH-SMD example.' },
      { name: 'Module size', value: '8.5 × 13.4 × 56.5 mm (height × width × depth), as specified for Cisco SFP modules.' },
      { name: 'Diagnostics', value: 'GLC-LH-SMD supports Digital Optical Monitoring (DOM) for link and module diagnostics.' },
    ],
    documentation: [
      {
        title: 'Cisco — GBIC serial EEPROM identification: vendor, part number, and serial number',
        url: 'https://www.cisco.com/en/US/docs/switches/lan/catalyst4500/12.1/12.1e/system/message/78_15917.pdf',
      },
      {
        title: 'Cisco — Gigabit Ethernet SFP modules: specifications, cabling, and dimensions',
        url: 'https://www.cisco.com/c/en/us/products/collateral/interfaces-modules/gigabit-ethernet-gbic-sfp-modules/datasheet-c78-366584.html',
      },
      {
        title: 'TE Connectivity — RJ45 jack example, 5558343-1: contacts and mechanical details',
        url: 'https://www.te.com/en/product-5558343-1.html',
      },
    ],
  }
}
