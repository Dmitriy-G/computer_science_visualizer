import type { HardwareElementPhoto } from '../../../../../visualization/HardwareElementInformation.ts'

export class NetworkAdapterIllustrations {
  public static board(): readonly HardwareElementPhoto[] {
    return [{
      src: '/hardware/network-adapter/annotated-ethernet-adapter-board.svg',
      alt: 'User-provided annotated Ethernet adapter board with blue outlines and labels pointing to the RJ45 port, link and activity LEDs, controller and heatsink area, support circuitry, and PCIe x1 edge connector.',
      caption: 'Annotated Ethernet network adapter / PCIe x1',
    }]
  }

  public static hostConnector(): readonly HardwareElementPhoto[] {
    return [{
      src: '/hardware/network-adapter/pcie-motherboard-annotated.svg',
      alt: 'User-provided motherboard close-up with blue outlines and labels identifying a PCIe x16 slot and contacts inside a shorter PCIe slot.',
      caption: 'Annotated motherboard / PCIe slots and contacts',
      fullWidth: true,
      width: 1448,
      height: 1086,
    }, {
      src: '/hardware/network-adapter/pcie-connector-contact-groups.svg',
      alt: 'User-provided PCIe connector infographic with supplied labels for contact groups, slot housing, retention and guide hardware, and board solder pins.',
      caption: 'PCIe connector / annotated contact groups and slot housing',
      fullWidth: true,
      width: 1448,
      height: 1086,
    }]
  }

  public static controller(): readonly HardwareElementPhoto[] {
    return [{
      src: '/hardware/network-adapter/microchip-enc424j600-controller.svg',
      alt: 'Microchip ENC424J600 Ethernet controller in a square package with exposed leads on all four sides.',
      caption: 'Microchip ENC424J600 / Ethernet controller',
      description: 'Top of the controller package, with connection leads on all four sides.',
      fullWidth: true,
      width: 700,
      height: 532,
    }, {
      src: '/hardware/network-adapter/microchip-enc424j600-pinout.svg',
      alt: 'ENC424J600 44-pin TQFP and QFN pin diagram showing numbered host-interface, Ethernet transmit and receive, clock, LED, and power connections.',
      caption: 'ENC424J600 / 44-pin TQFP and QFN pinout',
      fullWidth: true,
      width: 756,
      height: 755,
    }]
  }

  public static phy(): readonly HardwareElementPhoto[] {
    return [{
      src: '/hardware/network-adapter/lan8720-phy-board-annotated.svg',
      alt: 'User-provided annotated LAN8720 ETH Board image with blue circles and labels identifying the LAN8720 PHY chip, RJ45 Ethernet port with integrated magnetics, clock or crystal, and RMII and power header.',
      caption: 'Annotated LAN8720 ETH Board / Ethernet PHY module',
      width: 1254,
      height: 1254,
    }]
  }
}
