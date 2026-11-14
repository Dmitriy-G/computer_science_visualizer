import type { SystemOverviewInformation } from '../../../../../../visualization/SystemOverviewInformation.ts'

export class ServerToNetworkOverview {
  public static describe(): SystemOverviewInformation {
    const note = 'One local Ethernet transmission carries byte A (0x41) with an experimental EtherType, a 14-byte header, 45 bytes of padding, and a four-byte CRC-32 FCS: 64 frame bytes. Preamble/SFD and interframe gap are outside that size. The server buffer is already mapped and its descriptor ready. Physical coding, DMA ordering details, rings, interrupts, upper layers, and remote receipt are abstracted. Offloads stay idle. Local completion is not a remote acknowledgement.'
    return {
      name: 'Server to network',
      summary: 'Follow one small Ethernet transfer from server memory through DMA and the TX buffer onto the link.',
      problem: 'A server must transmit buffered data without making the CPU copy each payload byte through the network adapter.',
      steps: [
        'Start with a prepared server buffer and transmit descriptor.',
        'Notify the adapter through PCIe and let controller management resolve the descriptor.',
        'DMA reads the frame body through PCIe and the host interface.',
        'Stage outgoing data in the TX buffer.',
        'Pass the body to the MAC and append the computed FCS.',
        'The PHY converts frame data into signals for the Ethernet connection.',
        'Complete the local transmit and report reclaimable buffer ownership to the server.',
      ],
      implementationNote: note,
      realWorldUsage: { technologies: [
        { name: 'Linux network driver TX queues', url: 'https://docs.kernel.org/networking/driver.html', usage: 'Network drivers queue transmit work and reclaim buffers through completion handling.' },
        { name: 'Linux Ethernet frame definitions', url: 'https://github.com/torvalds/linux/blob/master/include/uapi/linux/if_ether.h', usage: 'Defines Ethernet header, minimum frame size, FCS size, and local experimental EtherTypes.' },
      ], products: [], note },
    }
  }
}
