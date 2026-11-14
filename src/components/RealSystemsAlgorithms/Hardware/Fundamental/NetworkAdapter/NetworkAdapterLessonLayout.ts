import { ComponentFlowTrace } from '../ComponentFlowTrace.ts'
import { NetworkAdapterLayout } from './NetworkAdapterLayout.ts'

export class NetworkAdapterLessonLayout {
  public static trace(receive: boolean): ComponentFlowTrace {
    return new ComponentFlowTrace(NetworkAdapterLayout.diagram(), [
      ['nic-host-connector', receive ? 'RX buffer posted' : '60 B / A at +14'],
      ['nic-host-interface', 'idle'], ['nic-control', receive ? 'RX descriptor ready' : 'TX descriptor ready'],
      ['nic-dma', 'idle'], ['nic-tx-buffer', 'empty'], ['nic-rx-buffer', 'empty'],
      ['nic-mac', 'idle'], ['nic-phy', 'link up'],
      ['nic-network-connection', receive ? '64 B incoming' : 'idle'],
      ['nic-firmware', 'configured'], ['nic-offload', 'idle'],
    ])
  }
}
