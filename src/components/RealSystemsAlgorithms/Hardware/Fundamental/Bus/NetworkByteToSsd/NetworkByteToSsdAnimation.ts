import type { ActionDefinition, ActionPlan } from '../../../../../../visualization/ActionDefinition.ts'
import type { HardwareSnapshot } from '../../HardwareSnapshot.ts'
import { ComponentInformation } from '../../ComponentLesson.ts'
import { BusLessonTrace } from '../BusLessonTrace.ts'
import { NetworkByteToSsdModel } from './NetworkByteToSsdModel.ts'
import { NetworkByteToSsdOverview } from './NetworkByteToSsdOverview.ts'

export class NetworkByteToSsdAnimation implements ActionDefinition<HardwareSnapshot> {
  public readonly title = 'Network byte to SSD'
  public static describe() { return ComponentInformation.describe(NetworkByteToSsdOverview.describe()) }

  public create(_source: HardwareSnapshot): ActionPlan<HardwareSnapshot> {
    const model = new NetworkByteToSsdModel()
    const trace = new BusLessonTrace()
    trace.start('A toy service accepts SAVE, offset 7, byte 0x41. A minimum 64-byte Ethernet frame carries this three-byte application message plus header, padding, and FCS. RX memory is posted; the existing 512-byte SSD logical block is already loaded in RAM. GPU and HDD stay idle. Only one requester is active at a time, so no arbitration contest or protocol bridge is needed.')
    model.receive()
    trace.local('bus-network-adapter-device', 'SAVE 0x41', 'Receive SAVE message', 'The adapter accepts the valid frame and checks FCS. Its RX buffer holds the 60-byte body; PHY/MAC internals are abstracted by this external device block.')
    trace.deviceToFabric('network-adapter', 'DMA received body', 'The adapter initiates a memory write carrying the frame body toward the posted RAM receive buffer. The bus transports protocol transactions, not a standalone Ethernet byte.')
    trace.signal('bus-route-selection', 'Route receive write to RAM', 'Decode the DMA memory address to select the RAM port. The adapter is a requester despite its placement on the right.')
    model.dmaReceive()
    trace.fabricToDevice('ram', 'RX 60 B', 'Deliver receive data', 'The memory controller writes the accepted frame body into the posted RAM buffer, including SAVE, offset 7, and 0x41 at offsets 14 through 16.')
    model.completeReceive()
    trace.local('bus-network-adapter-device', 'RX complete', 'Publish receive completion', 'Only after receive DMA is visible does the adapter publish its completion. DMA synchronization and device-specific ordering are abstracted.')
    trace.deviceToFabric('network-adapter', 'Write RX completion', 'Send receive status through the same direct fabric path as a separate transaction.')
    trace.fabricToDevice('ram', 'RX ready', 'Expose receive completion', 'Receive completion reaches RAM. Software polling and its read request are abstracted; the following response delivers the message to the CPU.')
    trace.ramToFabric('Read received message', 'The CPU reads the completed RAM receive buffer through the memory controller and switching fabric. The read request is abstracted; these arrows show the returning data.')
    trace.fabricToDevice('cpu', 'RX 60 B', 'Deliver message to CPU', 'Return the received bytes through the CPU queues, protocol controller, and signal interface.')
    model.readMessage()
    trace.local('bus-cpu-device', 'SAVE 0x41', 'Interpret SAVE instruction', 'Software recognizes the toy SAVE opcode and extracts offset 7 and data byte 0x41. This is an application command, not a CPU machine instruction received directly from the network.')
    model.prepareWrite()
    trace.local('bus-cpu-device', '[7] = 0x41', 'Prepare block update', 'Modify byte 7 in the preloaded 512-byte logical block and preserve its other 511 bytes. Prepare a block-write command with Force Unit Access (FUA); filesystem metadata and cache management are abstracted.')
    trace.deviceToFabric('cpu', 'Publish write buffer and command', 'The CPU writes the modified block and submission command into DMA-visible RAM before notifying the SSD. Cache maintenance and ordering follow the driver contract but are abstracted here.')
    trace.fabricToDevice('ram', 'W512 / SQ ready', 'Store SSD submission', 'The 512-byte write buffer and storage submission are ready in RAM. This buffer is separate from the network receive buffer.')
    trace.deviceToFabric('cpu', 'Notify SSD', 'The CPU issues a memory-mapped doorbell write addressed to the SSD controller; this carries control, not the block payload.')
    trace.fabricToDevice('ssd', 'doorbell', 'Deliver SSD doorbell', 'The switch selects the SSD port and its controller receives the notification through the device link.')
    model.fetchCommand()
    trace.local('bus-ssd-device', 'WRITE / FUA', 'Fetch storage command', 'The SSD obtains the published command identifying the RAM buffer and target block. The submission-queue DMA fetch is abstracted as this local step, separate from the block-data transfer shown next.')
    trace.deviceToFabric('ssd', 'Request write data', 'The SSD initiates a DMA read of the 512-byte RAM write buffer. DMA does not require the CPU to carry the block through its registers.')
    trace.fabricToDevice('ram', 'DMA read 512 B', 'Select RAM write buffer', 'Address-based routing selects the RAM controller and the prepared write-buffer range.')
    trace.ramToFabric('Return SSD write data', 'Read the prepared RAM block and return it through the switch toward the requesting SSD port.')
    model.dmaReadBlock()
    trace.fabricToDevice('ssd', '512 B / 0x41', 'Deliver SSD write data', 'The SSD receives the complete logical block containing 0x41 at byte 7; the remaining bytes retain their original values.')
    model.commitFua()
    trace.local('bus-ssd-device', '0x41 durable', 'Persist updated block', 'The SSD commits the FUA write to nonvolatile storage before reporting success. FTL mapping, ECC, NAND programming, and physical page sizes are internal to the SSD and abstracted.')
    model.completeWrite()
    trace.deviceToFabric('ssd', 'Write storage completion', 'After nonvolatile commitment, the SSD writes a successful completion to the host completion queue in RAM.')
    trace.fabricToDevice('ram', 'CQ success', 'Deliver SSD completion', 'The completion entry reaches RAM after the durable write; notification or polling mechanics are abstracted.')
    trace.ramToFabric('Read storage completion', 'The CPU polls the RAM completion entry. Its read request is abstracted; the return data travels through the memory port and switching fabric.')
    trace.fabricToDevice('cpu', 'CQ success', 'Observe storage completion', 'The CPU receives the successful completion through its own interface.')
    model.acknowledge()
    trace.local('bus-cpu-device', 'saved 0x41', 'Finish SAVE request', 'The service can now report success locally: byte 7 of the SSD logical block is 0x41 and neighboring bytes are preserved. A network reply is outside this example.')
    trace.finish('Byte saved to SSD', 'One application byte traveled from the network adapter through RAM and CPU processing into a durable SSD block update. Receive data, software command, doorbell, block DMA, and completion were separate transactions; GPU, HDD, optional bridge, and coherence logic remained idle.')
    return { steps: trace.steps, result: trace.result.clone() }
  }
}
