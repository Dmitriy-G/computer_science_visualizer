export type DiskAlgorithmKind = 'mq-deadline' | 'bfq' | 'kyber'
export type DiskDirection = 'read' | 'write'
export type DiskRequestStatus = 'queued' | 'in-flight' | 'completed'

export interface DiskRequest {
  readonly id: string
  readonly process: number
  readonly direction: DiskDirection
  readonly sector: number
  readonly sectors: number
  readonly serviceTicks: number
}

export interface DiskProcess {
  readonly id: number
  readonly weight: number
}

// Virtual device time and immutable request data are independent of playback time.
export class DiskWorkload {
  public static readonly maximumRequests = 16
  public static readonly processes: readonly DiskProcess[] = [
    { id: 1, weight: 1 }, { id: 2, weight: 2 }, { id: 3, weight: 1 },
  ]
  public readonly requests: readonly DiskRequest[]
  public time = 0
  public readonly dispatched: string[] = []
  public readonly completed: string[] = []
  public readonly startedAt = new Map<string, number>()
  public readonly finishedAt = new Map<string, number>()

  constructor(requests: readonly DiskRequest[]) {
    if (requests.length > DiskWorkload.maximumRequests) throw new RangeError('Use at most 16 disk requests')
    const ids = new Set<string>()
    const copy: DiskRequest[] = []
    for (const request of requests) {
      if (!request.id || ids.has(request.id)) throw new Error('Request IDs must be unique')
      if (request.direction !== 'read' && request.direction !== 'write') throw new Error('Choose read or write')
      if (!Number.isInteger(request.process) || request.process < 1 || request.process > 3) throw new RangeError('Choose process 1, 2, or 3')
      if (!Number.isInteger(request.sector) || request.sector < 0 || request.sector > 255) throw new RangeError('Sector must be 0 through 255')
      if (!Number.isInteger(request.sectors) || request.sectors < 1 || request.sectors > 4) throw new RangeError('Request length must be 1 through 4 sectors')
      if (!Number.isInteger(request.serviceTicks) || request.serviceTicks < 1 || request.serviceTicks > 20) throw new RangeError('Service time must be 1 through 20 ticks')
      ids.add(request.id)
      copy.push({ ...request })
    }
    this.requests = copy
  }

  public static createDefault(): DiskWorkload {
    const sectors = [80, 20, 150, 35, 190, 50, 120, 10, 165, 60]
    const requests: DiskRequest[] = []
    for (let index = 0; index < sectors.length; index += 1) {
      requests.push({
        id: `R${index + 1}`, process: index % 3 + 1,
        direction: index % 3 === 0 ? 'write' : 'read',
        sector: sectors[index], sectors: index % 2 === 0 ? 2 : 1,
        serviceTicks: index % 4 + 1,
      })
    }
    return new DiskWorkload(requests)
  }

  public clone(): DiskWorkload {
    const copy = new DiskWorkload(this.requests)
    copy.time = this.time
    copy.dispatched.push(...this.dispatched)
    copy.completed.push(...this.completed)
    for (const [id, time] of this.startedAt) copy.startedAt.set(id, time)
    for (const [id, time] of this.finishedAt) copy.finishedAt.set(id, time)
    return copy
  }

  public status(id: string): DiskRequestStatus {
    if (this.finishedAt.has(id)) return 'completed'
    return this.startedAt.has(id) ? 'in-flight' : 'queued'
  }

  public pending(direction?: DiskDirection, process?: number): DiskRequest[] {
    const pending: DiskRequest[] = []
    for (const request of this.requests) {
      if (this.status(request.id) !== 'queued') continue
      if (direction && request.direction !== direction) continue
      if (process !== undefined && request.process !== process) continue
      pending.push(request)
    }
    return pending
  }

  public dispatch(request: DiskRequest): void {
    if (!this.requests.some((entry) => entry.id === request.id) || this.status(request.id) !== 'queued') throw new Error('Dispatch a queued request once')
    this.dispatched.push(request.id)
    this.startedAt.set(request.id, this.time)
  }

  public complete(request: DiskRequest): void {
    if (this.status(request.id) !== 'in-flight') throw new Error('Complete an in-flight request once')
    this.completed.push(request.id)
    this.finishedAt.set(request.id, this.time)
  }
}
