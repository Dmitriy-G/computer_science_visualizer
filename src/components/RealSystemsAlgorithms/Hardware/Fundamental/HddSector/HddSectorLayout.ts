import { HardwareSnapshot } from '../HardwareSnapshot.ts'
import { HddLayout } from '../Hdd/HddLayout.ts'
import type { HddSectorModel } from './HddSectorModel.ts'

export class HddSectorLayout {
  private static levels(values: readonly number[]): string {
    const symbols: string[] = []
    for (const value of values) symbols.push(value === 0 ? '0' : value > 0 ? '+' : '-')
    return symbols.length ? symbols.join(' ') : 'pending'
  }

  public static create(model: HddSectorModel): HardwareSnapshot {
    const diagram = HddLayout.diagram(model, 2180)
    const phase = model.operation
    const location = `H${model.location.head} / T${model.targetTrack} / S${model.targetSector}`
    const status = model.eccStatus === 'corrected' ? `bit ${model.correctedBit} corrected` : model.eccStatus
    for (let index = 0; index < diagram.fixtures.length; index += 1) {
      const cell = diagram.fixtures[index]
      let value = ''
      switch (cell.id) {
        case 'controller':
          value = phase === 'transfer' ? 'complete' : `LBA ${model.logicalAddress}`
          break
        case 'firmware-map':
          value = location
          break
        case 'servo-controller':
          value = model.settled ? `hold track ${model.track}` : phase === 'seek' ? `seek track ${model.targetTrack}` : 'idle'
          break
        case 'cache':
          value = model.buffer.join('')
          break
        case 'ecc':
          value = phase === 'ecc-encode' ? 'encode 4 -> 8' : status
          break
        case 'write-channel':
          value = phase === 'recording-encode' ? 'encode' : phase === 'write' ? 'write' : 'idle'
          break
        case 'read-channel':
          value = phase === 'sense' ? 'amplify' : phase === 'detect' ? 'detect' : phase === 'recording-decode' ? 'decode' : 'idle'
          break
        case 'motor-driver':
          value = phase === 'seek' ? 'seek + spin' : 'spin / hold'
          break
        case 'actuator':
          value = model.settled ? `hold T${model.track}` : `track ${model.track}`
          break
        case 'preamp':
          value = phase === 'write' ? 'head current' : phase === 'sense' ? 'read gain' : 'idle'
          break
        case 'data-connector':
          value = model.transferred.length ? model.transferred.join('') : `LBA ${model.logicalAddress}`
          break
        case 'power-connector':
          value = 'on'
          break
      }
      diagram.fixtures[index] = { ...cell, value }
    }
    diagram.region('access-state', 'Media access / symbolic state', 'device', 20, 1040, 1960, 330)
      .fixture('request', 'Host logical sector', `LBA ${model.logicalAddress}`, 260, 1140, undefined, 420)
      .fixture('translation', 'Firmware-selected head / track / sector', location, 750, 1140, undefined, 420)
      .fixture('servo', 'Servo / settling state', model.settled ? 'settled / tracking' : phase === 'seek' ? 'seeking / not settled' : 'idle', 1240, 1140, undefined, 420)
      .fixture('sector-position', 'Rotational latency / target sector', model.aligned() ? 'under head' : 'waiting for sector', 1730, 1140, undefined, 420)
      .fixture('spindle-state', 'Rotation phase / 8 samples', `${model.rotation} / 8`, 260, 1290, undefined, 420)
      .fixture('head-state', 'Read/write head', `surface ${model.location.head} / track ${model.track}`, 750, 1290, undefined, 420)
      .fixture('ecc-status', 'ECC result / one-based error location', status, 1240, 1290, undefined, 420)
      .fixture('host-result', 'Returned sector', model.transferred.length ? model.transferred.join('') : 'not returned', 1730, 1290, undefined, 420)
      .connect('translate', 'controller', 'firmware-map', 'firmware LBA lookup', phase === 'idle')
      .connect('seek', 'firmware-map', 'servo-controller', 'track target', phase === 'seek')
      .connect('feedback', 'read-channel', 'servo-controller', 'embedded servo feedback', phase === 'settled', 80)
    diagram.region('channel', 'Teaching pipeline / Hamming (8,4) SECDED + Manchester / NRZI', 'device', 20, 1420, 1960, 480)
      .fixture('source-data', 'Host payload / 4 bits', model.data.join(''), 260, 1510, undefined, 420)
      .fixture('ecc-codeword', 'ECC codeword / 8 bits', model.eccCodeword.length ? model.eccCodeword.join('') : 'pending', 750, 1510, undefined, 420)
      .fixture('recording-bits', 'Recording symbols / 16 bits', model.recordingBits.length ? model.recordingBits.join('') : 'pending', 1240, 1510, undefined, 420)
      .fixture('write-current', 'Magnetization / + and - reference levels', this.levels(model.magneticRegions), 1730, 1510, undefined, 420)
      .fixture('read-signal', 'Read signal / signed transitions', this.levels(model.readSignal), 260, 1660, undefined, 420)
      .fixture('detected-bits', 'Detected recording symbols', model.detectedBits.length ? model.detectedBits.join('') : 'pending', 750, 1660, undefined, 420)
      .fixture('received-codeword', 'Recording-decoded ECC word', model.receivedCodeword.length ? model.receivedCodeword.join('') : 'pending', 1240, 1660, undefined, 420)
      .fixture('corrected-codeword', 'ECC output codeword', model.correctedCodeword.length ? model.correctedCodeword.join('') : 'pending', 1730, 1660, undefined, 420)
      .fixture('syndrome', 'Hamming syndrome / overall parity', model.syndrome === null ? 'pending' : `${model.syndrome} / ${model.overallParity}`, 600, 1810, undefined, 1000)
      .fixture('decoded', 'Validated payload', model.checked ? model.decoded.join('') : model.eccStatus === 'uncorrectable' ? 'blocked / uncorrectable' : 'pending', 1600, 1810, undefined, 600)
      .connect('receive', 'data-connector', 'cache', 'host payload to data buffer', phase === 'idle')
      .connect('ecc-encode', 'source-data', 'ecc-codeword', 'add SECDED redundancy', phase === 'ecc-encode')
      .connect('recording-encode', 'ecc-codeword', 'recording-bits', 'encode recording symbols', phase === 'recording-encode')
      .connect('record', 'recording-bits', 'write-current', 'NRZI current / magnetization', phase === 'write')
      .connect('signal', 'read-channel', 'read-signal', 'condition readback signal', phase === 'sense', 100)
      .connect('detect', 'read-signal', 'detected-bits', 'detect transitions', phase === 'detect')
      .connect('recording-decode', 'detected-bits', 'received-codeword', 'decode recording symbols', phase === 'recording-decode')
      .connect('correct', 'received-codeword', 'corrected-codeword', 'ECC decode / correction', phase === 'ecc-decode')
      .connect('decode', 'corrected-codeword', 'decoded', 'validated user bits', phase === 'ecc-decode' && model.checked)
      .connect('buffer-sector', 'decoded', 'cache', 'buffer validated payload', phase === 'buffer-read', 100)
      .connect('transfer', 'cache', 'data-connector', 'return validated sector to host', phase === 'transfer')
      .connect('complete-request', 'controller', 'data-connector', 'command completion', phase === 'transfer')
    diagram.region('recorded-regions', 'Illustrative magnetization intervals / one NRZI interval per recording symbol', 'device', 20, 1980, 1960, 180)
    for (let index = 0; index < 16; index += 1) {
      const polarity = model.magneticRegions[index]
      diagram.fixture(`magnetic-${index}`, `interval ${index}`, polarity === undefined ? '?' : polarity > 0 ? '+' : '-', 90 + index * 120, 2070, undefined, 90)
    }
    const focus = phase === 'read-error' ? 'received-codeword' : phase === 'ecc-decode' ? 'decoded' : 'head'
    return new HardwareSnapshot([], focus, 0, diagram)
  }
}
