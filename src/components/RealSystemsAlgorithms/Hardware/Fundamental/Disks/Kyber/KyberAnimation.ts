import type { ActionDefinition, ActionPlan } from '../../../../../../visualization/ActionDefinition.ts'
import type { AlgorithmInformation } from '../../../../../../visualization/AlgorithmInformation.ts'
import { DiskWorkload } from '../DiskWorkload.ts'
import type { DiskDirection, DiskRequest } from '../DiskWorkload.ts'
import { DiskTrace } from '../DiskTrace.ts'
import { DiskAlgorithmInformation } from '../DiskAlgorithmInformation.ts'

interface Domain {
  readonly direction: DiskDirection
  readonly target: number
  readonly maximum: number
  readonly batchSize: number
  depth: number
  inFlight: number
  cachedP99: number
  ioSamples: number[]
  totalSamples: number[]
}

interface DeviceRequest {
  readonly request: DiskRequest
  readonly finish: number
  readonly start: number
}

export class KyberAnimation implements ActionDefinition<DiskWorkload> {
  public readonly title = 'Kyber'
  public readonly context = 'Disk I/O scheduling'
  public readonly summary = 'Read/write token pools with percentile-based depth feedback.'
  public readonly phases = ['Queue', 'Dispatch', 'Complete']
  public readonly timelineHint = 'Tokens, completion latency, and feedback'

  public static describe(): AlgorithmInformation {
    return DiskAlgorithmInformation.create('Kyber',
      'Read and synchronous-write domains acquire tokens before dispatch and release them at completion. Eight latency buckets estimate p90 device latency and p99 total latency; congestion and p99 guide depth scaling. The bounded device has three slots, targets 4/8 ticks, depth caps 4/3, and batches 2/1. Feedback runs every three completions. Per-CPU queues, discard/other domains, merging, real timers, and hardware latency prediction are omitted.',
      'https://github.com/torvalds/linux/blob/v6.12/block/kyber-iosched.c',
      'Linux Kyber controls block-I/O concurrency with domain tokens and latency feedback. The lesson uses scaled limits and a deterministic device model.')
  }

  public create(source: DiskWorkload): ActionPlan<DiskWorkload> {
    const model = new DiskWorkload(source.requests)
    const trace = new DiskTrace()
    const domains: Domain[] = [
      { direction: 'read', target: 4, maximum: 4, batchSize: 2, depth: 2, inFlight: 0, cachedP99: -1, ioSamples: [], totalSamples: [] },
      { direction: 'write', target: 8, maximum: 3, batchSize: 1, depth: 2, inFlight: 0, cachedP99: -1, ioSamples: [], totalSamples: [] },
    ]
    let active: DeviceRequest[] = []
    let currentDomain = 0
    let batch = 0
    let samples = 0
    trace.record(model, 'Initialize domain tokens', 'Reads and synchronous writes each start with two tokens.',
      'read_depth = 2; write_depth = 2; device_slots = 3', this.details(domains))
    while (model.completed.length < model.requests.length) {
      let blocked = 0
      while (active.length < 3 && blocked < domains.length) {
        const domain = domains[currentDomain]
        const next = model.pending(domain.direction)[0]
        if (next && domain.inFlight < domain.depth && batch < domain.batchSize) {
          model.dispatch(next)
          // Abstract contention cost, not a benchmark or a storage-device model.
          active.push({ request: next, start: model.time, finish: model.time + next.serviceTicks + active.length * 2 })
          domain.inFlight += 1
          batch += 1
          blocked = 0
          trace.record(model, `Acquire token for ${next.id}`, `${next.id} acquires a ${domain.direction} token and enters the device.`,
            'if domain.in_flight < domain.depth: acquire_token(); dispatch()', this.details(domains), next.id)
          if (batch >= domain.batchSize) {
            currentDomain = (currentDomain + 1) % domains.length
            batch = 0
          }
        } else {
          blocked += 1
          currentDomain = (currentDomain + 1) % domains.length
          batch = 0
        }
      }
      if (!active.length) throw new Error('Queued requests must be able to acquire a token')
      let earliest = Infinity
      for (const entry of active) earliest = Math.min(earliest, entry.finish)
      model.time = earliest
      const remaining: DeviceRequest[] = []
      for (const entry of active) {
        if (entry.finish !== earliest) {
          remaining.push(entry)
          continue
        }
        const domain = domains[entry.request.direction === 'read' ? 0 : 1]
        domain.inFlight -= 1
        domain.ioSamples.push(model.time - entry.start)
        domain.totalSamples.push(model.time) // Every request entered the scheduler at tick 0.
        model.complete(entry.request)
        samples += 1
        trace.record(model, `Release token for ${entry.request.id}`, `${entry.request.id} completes; device latency ${model.time - entry.start}, total latency ${model.time} ticks.`,
          'complete(request); release_token(); record_latency()', this.details(domains), entry.request.id)
      }
      active = remaining
      if (samples >= 3 || model.completed.length === model.requests.length) {
        this.feedback(domains, model, trace)
        samples = 0
      }
    }
    trace.finish(model)
    return { steps: trace.steps, result: model }
  }

  private bucket(samples: readonly number[], target: number, percentile: number): number {
    if (!samples.length) return -1
    const buckets = [0, 0, 0, 0, 0, 0, 0, 0]
    const bucketWidth = Math.max(1, Math.floor(target / 4))
    for (const latency of samples) buckets[Math.min(7, Math.floor(Math.max(0, latency - 1) / bucketWidth))] += 1
    let rank = Math.ceil(samples.length * percentile / 100)
    for (let index = 0; index < buckets.length; index += 1) {
      rank -= buckets[index]
      if (rank <= 0) return index
    }
    return 7
  }

  private feedback(domains: readonly Domain[], model: DiskWorkload, trace: DiskTrace): void {
    let congested = false
    for (const domain of domains) {
      if (this.bucket(domain.ioSamples, domain.target, 90) >= 4) congested = true
    }
    const observations: string[] = []
    for (const domain of domains) {
      let p99 = this.bucket(domain.totalSamples, domain.target, 99)
      if (congested) {
        if (p99 < 0) p99 = domain.cachedP99
        domain.cachedP99 = -1
      } else if (p99 >= 0) domain.cachedP99 = p99
      if (p99 >= 0 && (congested || p99 >= 4)) {
        const before = domain.depth
        domain.depth = Math.max(1, Math.min(domain.maximum, Math.floor(before * (p99 + 1) / 4)))
        observations.push(`${domain.direction}: p99 bucket ${p99}, depth ${before} → ${domain.depth}`)
      }
      domain.ioSamples = []
      domain.totalSamples = []
    }
    trace.record(model, 'Adjust domain depths', `${congested ? 'Device congestion detected' : 'No device congestion detected'}. ${observations.join('; ') || 'Keep current depths.'}`,
      'if congestion or p99 >= target_bucket:\n  depth = clamp(floor(depth * (p99_bucket + 1) / 4), 1, cap)',
      `${this.details(domains)} Existing requests retain their tokens if a depth shrinks.`)
  }

  private details(domains: readonly Domain[]): string {
    const parts: string[] = []
    for (const domain of domains) parts.push(`${domain.direction.toUpperCase()}: tokens used ${domain.inFlight}, depth ${domain.depth}/${domain.maximum}, latency target ${domain.target} ticks`)
    return parts.join(' · ')
  }
}
