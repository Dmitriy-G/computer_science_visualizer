import { EthernetPortInformation } from '../components/RealSystemsAlgorithms/Hardware/Fundamental/NetworkAdapter/EthernetPortInformation.ts'
import { NetworkAdapterInformation } from '../components/RealSystemsAlgorithms/Hardware/Fundamental/NetworkAdapter/NetworkAdapterInformation.ts'
import { SsdInformation } from '../components/RealSystemsAlgorithms/Hardware/Fundamental/Ssd/SsdInformation.ts'
import { HddInformation } from '../components/RealSystemsAlgorithms/Hardware/Fundamental/Hdd/HddInformation.ts'
import { ServerConnectorInformation } from '../components/RealSystemsAlgorithms/SystemOverview/ServerConnectorInformation.ts'
import { MotherboardInformation } from '../components/RealSystemsAlgorithms/Hardware/Fundamental/Bus/MotherboardInformation.ts'
import { GpuInformation } from '../components/RealSystemsAlgorithms/Hardware/Fundamental/Gpu/GpuInformation.ts'
import { RamInformation } from '../components/RealSystemsAlgorithms/Hardware/Fundamental/Ram/RamInformation.ts'
import type { HardwareElementInformation } from './HardwareElementInformation.ts'

export class HardwareElementCatalog {
  public static get(regionId: string | null): HardwareElementInformation | null {
    if (regionId === 'nic-network-connection') return EthernetPortInformation.information
    return MotherboardInformation.get(regionId) ?? ServerConnectorInformation.get(regionId) ?? HddInformation.get(regionId) ?? SsdInformation.get(regionId) ?? NetworkAdapterInformation.get(regionId) ?? GpuInformation.get(regionId) ?? RamInformation.get(regionId)
  }
}
