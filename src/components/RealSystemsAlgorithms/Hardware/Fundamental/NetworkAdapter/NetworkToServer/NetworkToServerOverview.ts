import type { SystemOverviewInformation } from '../../../../../../visualization/SystemOverviewInformation.ts'

export class NetworkToServerOverview {
  public static describe(): SystemOverviewInformation {
    const note = 'One valid minimum-size Ethernet frame carries A (0x41). Its 64 bytes include the FCS, but exclude preamble/SFD and interframe gap. The configured destination is accepted; bad FCS prevents host delivery. FCS is removed, while padding remains in the 60-byte example host buffer. Receive memory is posted and DMA-mapped before arrival. Physical coding, descriptor rings, exact DMA ordering, interrupts/polling, and upper-layer parsing are abstracted. Offloads and the TX payload path stay idle.'
    return {
      name: 'Network to server',
      summary: 'Follow an incoming Ethernet frame through PHY decoding, MAC checking, the RX buffer, and DMA into server memory.',
      problem: 'An incoming frame must be checked and delivered into a ready server buffer before software receives completion.',
      steps: [
        'Start with a posted host receive buffer and an incoming Ethernet frame.',
        'Receive link signals through the Ethernet connection and decode them in the PHY.',
        'The MAC accepts the destination, verifies FCS, and removes the FCS bytes.',
        'Stage the accepted frame body in the RX buffer.',
        'Use the posted receive descriptor to identify the host DMA destination.',
        'Transfer the body through DMA, Host Interface, and PCIe into server memory.',
        'After data writes are visible, publish receive completion and notify the server.',
      ],
      implementationNote: note,
      realWorldUsage: { technologies: [
        { name: 'Linux receive buffer DMA management', url: 'https://docs.kernel.org/networking/page_pool.html', usage: 'The page pool supports driver-managed receive buffers and their DMA mapping and synchronization.' },
        { name: 'Intel Ethernet driver receive descriptors', url: 'https://docs.kernel.org/networking/device_drivers/ethernet/intel/e1000.html', usage: 'Receive descriptors refer to buffers used for incoming packets; ring sizing controls available receive resources.' },
      ], products: [], note },
    }
  }
}
