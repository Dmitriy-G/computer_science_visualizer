export class EthernetFrame {
  public static readonly payload = 0x41

  public static body(): Uint8Array {
    const bytes = new Uint8Array(60)
    bytes.set([0x02, 0, 0, 0, 0, 2, 0x02, 0, 0, 0, 0, 1, 0x88, 0xb5, this.payload])
    return bytes
  }

  public static encode(body: Uint8Array): Uint8Array {
    if (body.length !== 60) throw new Error('The example uses a 60-byte frame body')
    const bytes = new Uint8Array(64)
    bytes.set(body)
    new DataView(bytes.buffer).setUint32(60, this.crc32(body), true)
    return bytes
  }

  public static decode(frame: Uint8Array): Uint8Array {
    if (frame.length !== 64) throw new Error('The example requires a complete 64-byte Ethernet frame')
    const body = frame.slice(0, 60)
    const supplied = new DataView(frame.buffer, frame.byteOffset, frame.byteLength).getUint32(60, true)
    if (supplied !== this.crc32(body)) throw new Error('Ethernet FCS check failed')
    return body
  }

  public static crc32(bytes: Uint8Array): number {
    let crc = 0xffffffff
    for (const byte of bytes) {
      crc ^= byte
      for (let bit = 0; bit < 8; bit += 1) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0)
    }
    return (crc ^ 0xffffffff) >>> 0
  }
}
