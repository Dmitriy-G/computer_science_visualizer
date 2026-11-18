import { EthernetPortInformation } from '../components/RealSystemsAlgorithms/Hardware/Fundamental/NetworkAdapter/EthernetPortInformation.ts'
import { NetworkAdapterInformation } from '../components/RealSystemsAlgorithms/Hardware/Fundamental/NetworkAdapter/NetworkAdapterInformation.ts'
import type { HardwareElementInformation } from './HardwareElementInformation.ts'

export class HardwareElementCatalog {
  public static get(regionId: string | null): HardwareElementInformation | null {
    if (regionId === 'nic-network-connection') return EthernetPortInformation.information
    return NetworkAdapterInformation.get(regionId)
  }
}
