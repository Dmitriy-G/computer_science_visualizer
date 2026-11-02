import { HashTableModel } from '../HashTableModel.ts'
import type { HashRecord } from '../HashTableModel.ts'
import { HashTableHash } from '../../../../visualization/HashTableHash.ts'
import { LinearModel } from '../../../../visualization/LinearModel.ts'
import type { LinearInputValues, LinearObserver, LinearResult } from '../../../../visualization/LinearModel.ts'
import type { ActionKind } from '../../../../visualization/ActionCatalog.ts'

export interface RingToken {
  readonly id: string
  readonly server: number
  readonly replica: number
  readonly position: number
}

export class ConsistentHashingRing extends HashTableModel {
  public readonly kind = 'consistent-hashing-ring'
  public static readonly virtualNodes = 3
  public static readonly maximumServers = 16
  private servers = new Map<number, HashRecord>()
  private tokens: RingToken[] = []
  public get length(): number { return this.servers.size }
  public getTokens(): readonly RingToken[] { return [...this.tokens] }
  public static createDefault(): ConsistentHashingRing {
    const ring = new ConsistentHashingRing()
    for (let key = 10; key <= 100; key += 10) ring.put(key, 0)
    return ring
  }
  public clone(): ConsistentHashingRing {
    const copy = new ConsistentHashingRing()
    copy.servers = new Map(this.servers)
    copy.tokens = [...this.tokens]
    copy.nextId = this.nextId
    return copy
  }
  public getRecords(): readonly HashRecord[] { return [...this.servers.values()] }
  public hashPosition(key: number): number { return Number(HashTableHash.raw(key, 200) % (1n << 32n)) }
  private owner(key: number, observer?: LinearObserver): RingToken | null {
    const position = this.hashPosition(key)
    let low = 0
    let high = this.tokens.length
    while (low < high) {
      const mid = Math.floor((low + high) / 2)
      const token = this.tokens[mid]
      LinearModel.emit(observer, token.id, `Compare key hash ${position} with token ${token.position}.`, 'lower_bound(tokens, keyHash)', 'COMPARE')
      if (token.position < position) low = mid + 1
      else high = mid
    }
    const token = this.tokens[low === this.tokens.length ? 0 : low] ?? null
    if (token) LinearModel.emit(observer, token.id, `The first clockwise token belongs to server ${token.server}${low === this.tokens.length ? '; wrap through zero' : ''}.`, 'owner = first token at or after hash, wrapping if needed', 'OWNER')
    return token
  }
  public getAssignments(): readonly { key: number, owner: number | null }[] {
    const assignments: { key: number, owner: number | null }[] = []
    for (let key = 10; key <= 100; key += 10) assignments.push({ key, owner: this.owner(key)?.server ?? null })
    return assignments
  }
  protected find(key: number, observer?: LinearObserver): HashRecord | null {
    const token = this.owner(key, observer)
    return token ? this.servers.get(token.server)! : null
  }
  protected put(key: number, _value: number, observer?: LinearObserver): LinearResult {
    if (this.servers.has(key)) return { description: `Server ${key} is already present; tokens are unchanged.`, status: 'DUPLICATE' }
    if (this.length >= ConsistentHashingRing.maximumServers) return { description: 'Rejected: this ring example supports at most sixteen physical servers. The ring is unchanged.', status: 'REJECTED' }
    const before = this.getAssignments()
    const server = this.pending(key, 0)
    this.servers.set(key, server)
    for (let replica = 0; replica < ConsistentHashingRing.virtualNodes; replica += 1) {
      const position = Number(HashTableHash.raw(key, 201 + replica) % (1n << 32n))
      const token: RingToken = { id: `${server.id}-v${replica}`, server: key, replica, position }
      let index = 0
      while (index < this.tokens.length && (this.tokens[index].position < position || (this.tokens[index].position === position && this.tokens[index].server < key))) index += 1
      this.tokens.splice(index, 0, token)
    }
    this.nextId += 1
    LinearModel.emit(observer, `${server.id}-v0`, `Add three virtual tokens for server ${key}, retaining existing token positions.`, 'insert server tokens in clockwise position order', 'NEW SERVER')
    const after = this.getAssignments()
    let moved = 0
    for (let index = 0; index < before.length; index += 1) if (before[index].owner !== after[index].owner) moved += 1
    return { description: `Added server ${key} with three virtual nodes. ${moved} of the ten sample keys changed owner; every changed key now belongs to the new server.`, activeId: `${server.id}-v0` }
  }
  protected remove(key: number, observer?: LinearObserver): LinearResult {
    if (!this.servers.has(key)) return { description: `Server ${key} is absent; the ring is unchanged.` }
    const before = this.getAssignments()
    this.servers.delete(key)
    const retained: RingToken[] = []
    for (const token of this.tokens) if (token.server !== key) retained.push(token)
    this.tokens = retained
    LinearModel.emit(observer, this.tokens[0]?.id ?? null, `Remove all virtual tokens for server ${key}; successors inherit their intervals.`, 'remove server tokens; use next clockwise surviving owner', 'REMOVED')
    const after = this.getAssignments()
    let moved = 0
    for (let index = 0; index < before.length; index += 1) if (before[index].owner !== after[index].owner) moved += 1
    return { description: `Removed server ${key}. ${moved} sample keys changed owner; keys owned by other servers retain their owners.` }
  }
  public execute(action: ActionKind, input: LinearInputValues, observer?: LinearObserver): LinearResult {
    if (action === 'inspect-storage') {
      const owners: number[] = []
      const descriptions: string[] = []
      for (const assignment of this.getAssignments()) {
        LinearModel.emit(observer, `${this.kind}-sample-${assignment.key}`, `Sample key ${assignment.key} routes to ${assignment.owner === null ? 'no server' : `server ${assignment.owner}`}.`, 'route sample key to clockwise successor', 'OWNER')
        if (assignment.owner !== null) owners.push(assignment.owner)
        descriptions.push(`${assignment.key}: ${assignment.owner ?? 'unassigned'}`)
      }
      return { description: `Sample key ownership: ${descriptions.join(', ')}.`, value: owners }
    }
    if (action === 'clear') return super.execute(action, input, observer)
    const key = LinearModel.integer(input, 'key')
    if (action === 'insert') return this.put(key, 0, observer)
    if (action === 'delete-value') return this.remove(key, observer)
    if (action !== 'search-value') throw new RangeError('Unsupported ring operation')
    const token = this.owner(key, observer)
    return { description: token ? `Key ${key}, hash ${this.hashPosition(key)}, belongs to server ${token.server} through virtual token v${token.replica} at ${token.position}.` : `Key ${key} has no owner because the ring is empty.`, value: token?.server ?? null, activeId: token?.id, status: token ? 'OWNER' : 'UNASSIGNED' }
  }
  protected clear(observer?: LinearObserver): void {
    this.servers = new Map<number, HashRecord>()
    this.tokens = []
    LinearModel.emit(observer, null, 'Remove all physical servers and virtual tokens; sample keys become unassigned.', 'servers.clear(); tokens = []', 'CLEARED')
  }
}
