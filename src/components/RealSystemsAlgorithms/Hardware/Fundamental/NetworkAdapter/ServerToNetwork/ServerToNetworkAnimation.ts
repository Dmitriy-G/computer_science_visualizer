import type { ActionDefinition, ActionPlan } from '../../../../../../visualization/ActionDefinition.ts'
import type { HardwareSnapshot } from '../../HardwareSnapshot.ts'
import { ComponentInformation } from '../../ComponentLesson.ts'
import { NetworkAdapterLessonLayout } from '../NetworkAdapterLessonLayout.ts'
import { ServerToNetworkModel } from './ServerToNetworkModel.ts'
import { ServerToNetworkOverview } from './ServerToNetworkOverview.ts'

export class ServerToNetworkAnimation implements ActionDefinition<HardwareSnapshot> {
  public readonly title = 'Server to network'
  public static describe() { return ComponentInformation.describe(ServerToNetworkOverview.describe()) }

  public create(_source: HardwareSnapshot): ActionPlan<HardwareSnapshot> {
    const model = new ServerToNetworkModel()
    const trace = NetworkAdapterLessonLayout.trace(false)
    trace.start('The server has one DMA-mapped transmit buffer and a ready descriptor. It holds a 14-byte Ethernet header, payload byte A (0x41), and 45 padding bytes: 60 bytes before FCS. Link setup and the application/network stack are already complete; offloads remain idle.')
    trace.transfer('nic-host-link', 'nic-host-interface', 'TX doorbell', 'Notify adapter', 'The server notifies the adapter that a transmit descriptor is ready. This is control traffic, not a CPU payload copy.')
    trace.transfer('nic-host-control', 'nic-control', 'TX descriptor ready', 'Read queue state', 'The controller resolves the descriptor and its DMA buffer address; ring details are abstracted.')
    trace.transfer('nic-control-dma', 'nic-dma', 'Read host buffer', 'Request DMA read', 'The controller asks DMA to read the server transmit buffer.')
    trace.transfer('nic-host-link', 'nic-host-interface', '60 B / A at +14', 'Return host data over PCIe', 'The DMA read response carries the 60-byte frame body from server memory through PCIe.')
    trace.transfer('nic-host-dma', 'nic-dma', '60 B / A at +14', 'Receive DMA data', 'The host interface forwards the data to DMA without CPU copying of the payload.')
    model.stage()
    trace.transfer('nic-dma-tx', 'nic-tx-buffer', `${model.txBuffer!.length} B ready`, 'Fill TX buffer', 'The outgoing frame body arrives in the adapter TX buffer. The RX buffer remains empty.')
    trace.transfer('nic-tx-mac', 'nic-mac', '60 B body', 'Pass body to MAC', 'The MAC receives the buffered frame body, including the example padding.')
    model.frameAtMac()
    trace.local('nic-mac', `${model.frame!.length} B / FCS added`, 'Append frame check sequence', 'Compute Ethernet CRC-32 over the 60-byte body and append the four-byte FCS. The minimum Ethernet frame is now 64 bytes, excluding preamble/SFD and interframe gap.')
    trace.transfer('nic-mac-phy-tx', 'nic-phy', '64 B frame', 'Send frame to PHY', 'The MAC supplies frame data to the PHY. Preamble and physical encoding are summarized, not simulated bit by bit.')
    model.emit()
    trace.transfer('nic-phy-medium-tx', 'nic-network-connection', `${model.network!.length} B emitted`, 'Transmit onto link', 'The PHY drives encoded signals through the Ethernet connection. This indicates local transmission, not remote delivery or a TCP acknowledgement.')
    model.complete()
    trace.local('nic-control', 'TX complete', 'Complete transmit', 'The example finishes local transmit before completing the descriptor. The server may reclaim its buffer when the device no longer needs it.')
    trace.transfer('nic-host-control', 'nic-host-interface', 'TX completion', 'Report completion', 'The controller sends completion information toward the server through the host interface.', true)
    trace.transfer('nic-host-link', 'nic-host-connector', 'TX buffer reclaimable', 'Notify server', 'Completion status reaches the server over PCIe. Interrupt delivery or polling is abstracted.', true)
    trace.finish('One frame transmitted', 'TX payload path: PCIe → Host Interface → DMA → TX Buffer → MAC → PHY → Ethernet Port. Exactly one application byte was carried; Ethernet header, padding, and FCS account for the remaining frame bytes.')
    return { steps: trace.steps, result: trace.result.clone() }
  }
}
