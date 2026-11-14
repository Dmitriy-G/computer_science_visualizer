import { SHA256 } from '../../../../../AdvancedDataStructures/Integrity/MerkleTree/SHA256.ts'

export class HashcatIterationModel {
  public readonly candidate = 'abc'
  public readonly target = 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad'
  public digest: string | null = null
  public match: boolean | null = null
  public evaluated = 0
  public reported = false

  public inputData(): Uint8Array {
    const candidate = new TextEncoder().encode(this.candidate)
    const data = new Uint8Array(candidate.length + 32)
    data.set(candidate)
    for (let index = 0; index < 32; index += 1) data[candidate.length + index] = Number.parseInt(this.target.slice(index * 2, index * 2 + 2), 16)
    return data
  }

  public hash(candidate: Uint8Array = new TextEncoder().encode(this.candidate)): void {
    if (this.evaluated !== 0) throw new Error('This lesson evaluates exactly one candidate')
    this.digest = SHA256.digest(candidate)
    this.evaluated = 1
  }

  public compare(target: string = this.target): void {
    if (this.digest === null) throw new Error('Compute the full digest before comparison')
    this.match = this.digest === target
  }

  public report(flag = this.match ? 1 : 0): void {
    if (this.match === null) throw new Error('Compare the candidate before reporting')
    if (flag !== (this.match ? 1 : 0)) throw new Error('The VRAM result flag must match the device comparison')
    this.reported = true
  }
}
