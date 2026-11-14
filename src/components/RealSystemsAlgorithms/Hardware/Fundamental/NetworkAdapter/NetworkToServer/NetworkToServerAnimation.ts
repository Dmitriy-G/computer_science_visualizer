import type { ActionDefinition, ActionPlan } from '../../../../../../visualization/ActionDefinition.ts'
import type { HardwareSnapshot } from '../../HardwareSnapshot.ts'
import { ComponentInformation } from '../../ComponentLesson.ts'
import { NetworkAdapterLessonLayout } from '../NetworkAdapterLessonLayout.ts'
import { NetworkToServerModel } from './NetworkToServerModel.ts'
import { NetworkToServerOverview } from './NetworkToServerOverview.ts'

export class NetworkToServerAnimation implements ActionDefinition<HardwareSnapshot> {
  public readonly title = 'Network to server'
  public static describe() { return ComponentInformation.describe(NetworkToServerOverview.describe()) }

  public create(_source: HardwareSnapshot): ActionPlan<HardwareSnapshot> {
    const model = new NetworkToServerModel()
    const trace = NetworkAdapterLessonLayout.trace(true)
    trace.start('The server has already posted a DMA-mapped RX buffer. One valid 64-byte Ethernet frame arrives for the configured MAC address, carrying payload A (0x41), header, padding, and FCS. Link setup and upper-layer parsing are outside this minimal transfer; offloads remain idle.')
    trace.transfer('nic-medium-phy-rx', 'nic-phy', '64 B frame signals', 'Receive link signals', 'Signals enter through the Ethernet connection and reach the PHY.')
    trace.local('nic-phy', '64 B decoded', 'Decode physical signals', 'Recover the frame data from the link signaling; line coding and preamble handling are abstracted.')
    trace.transfer('nic-phy-mac-rx', 'nic-mac', '64 B to check', 'Pass frame to MAC', 'The PHY supplies decoded frame data to the MAC.')
    model.validate()
    trace.local('nic-mac', 'FCS valid / 60 B', 'Accept frame', 'The example destination is accepted and Ethernet CRC-32 is verified. Strip the four FCS bytes; invalid FCS would reject the frame before host delivery.')
    model.buffer()
    trace.transfer('nic-mac-rx', 'nic-rx-buffer', `${model.rxBuffer!.length} B ready`, 'Fill RX buffer', 'Place the accepted 60-byte body in the RX buffer. Padding remains in this teaching buffer; the TX buffer stays empty.')
    trace.transfer('nic-control-dma', 'nic-dma', 'RX destination ready', 'Use posted RX buffer', 'Controller management supplies the preposted host buffer for DMA. This is a separate control path.')
    trace.transfer('nic-rx-dma', 'nic-dma', '60 B / A at +14', 'Read receive buffer', 'DMA receives the frame body from the adapter RX buffer.')
    trace.transfer('nic-host-dma', 'nic-host-interface', '60 B / DMA write', 'Issue host write', 'DMA forwards the frame body toward the server through the host interface.', true)
    model.writeHost()
    trace.transfer('nic-host-link', 'nic-host-connector', `${model.serverMemory!.length} B / A at +14`, 'Deliver data to server memory', 'The PCIe DMA write reaches the posted server buffer. Payload byte 0x41 is at offset 14, after the Ethernet header.', true)
    model.complete()
    trace.local('nic-control', 'RX complete / 60 B', 'Complete receive', 'Publish receive completion only after the payload writes are visible according to the device/driver DMA contract.')
    trace.transfer('nic-host-control', 'nic-host-interface', 'RX completion', 'Report receive completion', 'The controller reports the completed receive descriptor. Polling or interrupt delivery is abstracted.', true)
    trace.transfer('nic-host-link', 'nic-host-connector', 'RX ready / A at +14', 'Notify server', 'The server may now consume the received frame body from its DMA buffer. Application parsing is a later step.', true)
    trace.finish('One frame delivered', 'RX payload path: Ethernet Port → PHY → MAC → RX Buffer → DMA → Host Interface → PCIe. One payload byte arrived intact; no TX payload path or packet offload was used.')
    return { steps: trace.steps, result: trace.result.clone() }
  }
}
