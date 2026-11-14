import type { SystemOverviewInformation } from '../../../../../../visualization/SystemOverviewInformation.ts'

export class NetworkByteToSsdOverview {
  public static describe(): SystemOverviewInformation {
    const note = 'This toy service uses a three-byte message: SAVE opcode 0x01, block offset 0x07, and data 0x41 (A), carried in a minimum 64-byte Ethernet frame with header, padding, and FCS. It is not a standard network storage protocol. RX memory is posted and DMA-mapped beforehand; the existing 512-byte logical block is already loaded into RAM. Only byte 7 changes. One byte is the application update, not the Ethernet, interconnect, SSD logical-block, or NAND programming unit. CPU caches, filesystem metadata, queue-fetch traffic, CPU read requests, interrupts, PCIe packetization, and SSD internals are abstracted. The 512-byte logical block is illustrative; logical block and NAND page sizes vary. FUA requests nonvolatile commitment before successful completion. One requester operates at a time; the bridge and coherence logic are unused. GPU and HDD remain idle. Narration stays in this dialog and accessible playback descriptions.'
    return {
      name: 'Network byte to SSD',
      summary: 'Follow a received SAVE instruction through network-adapter DMA, RAM, CPU processing, and an SSD block write that preserves neighboring bytes.',
      problem: 'A received application byte must be delivered safely to software, translated into a block update, and committed to storage before software reports success.',
      steps: [
        'Receive and validate an Ethernet frame carrying SAVE, offset 7, byte 0x41.',
        'The Network Adapter performs a DMA write through its port and the switch into RAM.',
        'Publish receive completion after the frame body has reached RAM.',
        'The CPU reads the received message and interprets the SAVE command.',
        'Change byte 7 in a preloaded 512-byte block; preserve the other bytes and publish the RAM write buffer and command.',
        'The CPU rings the SSD doorbell through the interconnect.',
        'The SSD obtains the command and DMA-reads the full write buffer from RAM through the switch.',
        'Commit the FUA write to nonvolatile storage, abstracting internal FTL, ECC, and NAND operations.',
        'The SSD writes a completion to RAM; the CPU observes it and finishes the request.',
      ],
      implementationNote: note,
      realWorldUsage: { technologies: [
        { name: 'Linux network receive buffer management', url: 'https://docs.kernel.org/networking/page_pool.html', usage: 'Receive buffers use managed memory and DMA mapping/synchronization before software consumes incoming data.' },
        { name: 'Linux block-layer Force Unit Access', url: 'https://docs.kernel.org/block/writeback_cache_control.html', usage: 'FUA requests successful I/O completion only after the data has been committed to nonvolatile storage.' },
      ], products: [], note },
    }
  }
}
