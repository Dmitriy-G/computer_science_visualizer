import type { SystemOverviewInformation } from '../../../../../../visualization/SystemOverviewInformation.ts'

export class NetworkByteToSsdOverview {
  public static describe(): SystemOverviewInformation {
    const note = 'This toy service uses a three-byte message: SAVE opcode 0x01, block offset 0x07, and data 0x41 (A), carried in a minimum 64-byte Ethernet frame with header, padding, and FCS. It is not a standard network storage protocol. RX memory is posted and DMA-mapped beforehand; the existing 512-byte logical block is already loaded into RAM. Only byte 7 changes. One byte is the application update, not the Ethernet, interconnect, SSD logical-block, or NAND programming unit. CPU caches, filesystem metadata, queue-fetch traffic, CPU read requests, interrupts, PCIe packetization, and SSD internals are abstracted. The 512-byte logical block is illustrative; logical block and NAND page sizes vary. FUA requests nonvolatile commitment before successful completion. One requester operates at a time; the optional PCIe switch and host-coherence detail are unused. The expanded inset is the CPU package itself, containing its root complex and memory controller. Solid endpoint PCIe links are independent direct attachments; violet dashed alternatives use the optional switch instead. Amber power arrows start at PSU DC output and distribute regulated DC to board loads; AC conversion stays in the PSU. GPU and HDD remain idle. Narration stays in this dialog and accessible playback descriptions.'
    return {
      name: 'Network byte to SSD',
      summary: 'Follow a received SAVE instruction through network-adapter DMA, RAM, CPU processing, and an SSD block write that preserves neighboring bytes.',
      problem: 'A received application byte must be delivered safely to software, translated into a block update, and committed to storage before software reports success.',
      steps: [
        'Receive and validate an Ethernet frame carrying SAVE, offset 7, byte 0x41.',
        'The Network Adapter DMA-writes through its PCIe slot and direct CPU root-port link, CPU host I/O, and integrated memory controller, then CPU socket DDR contacts and the DIMM socket into RAM.',
        'Publish receive completion after the frame body has reached RAM.',
        'The CPU reads RAM through its integrated memory controller and the direct DDR socket wiring, bypassing PCIe, then interprets SAVE.',
        'Change byte 7 in a preloaded 512-byte block; preserve the other bytes and publish the RAM write buffer and command.',
        'The CPU rings the SSD doorbell through the interconnect.',
        'The SSD obtains the command and DMA-reads the full write buffer from RAM through CPU host I/O and its direct PCIe link.',
        'Commit the FUA write to nonvolatile storage, abstracting internal FTL, ECC, and NAND operations.',
        'The SSD writes a completion to RAM; the CPU observes it and finishes the request.',
      ],
      implementationNote: note,
      realWorldUsage: { technologies: [
        { name: 'PCIe point-to-point connections and optional switches', url: 'https://www.diodes.com/products/connectivity/pcie-packet-switchbridges/pcie-switch', usage: 'PCIe uses serial point-to-point links between root complexes, switches, and endpoint devices. A switch can fan out links, while devices can also attach directly to available CPU root ports. The diagram shows these as alternative configurations.' },
        { name: 'Motherboard sockets and connectors', url: 'https://dlcdnets.asus.com/pub/ASUS/mb/LGA1200/PRIME_Z590-V/E17748_PRIME_Z590-V_UM_WEB.pdf', usage: 'A concrete board example distinguishes the CPU socket, DIMM sockets, PCIe expansion slots, M.2 sockets, SATA connectors, power inputs, and USB headers. Connector wiring and shared lanes are board-specific; the schematic is not this board floorplan.' },
        { name: 'CPU memory and chipset interfaces', url: 'https://www.intel.com/content/dam/www/public/us/en/documents/white-papers/ia-introduction-basics-paper.pdf', usage: 'An example platform connects memory to the CPU integrated memory controller and platform I/O to a PCH through DMI. Passive sockets carry electrical signals; active controllers terminate protocols. The illustrative PCIe switch is not required on every board.' },
        { name: 'Linux network receive buffer management', url: 'https://docs.kernel.org/networking/page_pool.html', usage: 'Receive buffers use managed memory and DMA mapping/synchronization before software consumes incoming data.' },
        { name: 'Linux block-layer Force Unit Access', url: 'https://docs.kernel.org/block/writeback_cache_control.html', usage: 'FUA requests successful I/O completion only after the data has been committed to nonvolatile storage.' },
      ], products: [], note },
    }
  }
}
