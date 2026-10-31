import { AnimationSequence } from './AnimationSequence.ts'
import type { HashObserver, HashOperation, HashTrace } from './Hashing.ts'
import type { Scene, SceneNode, StructureKind } from './Scene.ts'
import type { AlgorithmInformation } from './AlgorithmInformation.ts'

export interface HashActionModel<TModel> {
  readonly length: number
  clone(): TModel
  apply(operation: HashOperation, key: number, value: number, trace?: HashObserver): void
}

export interface HashActionLayout<TModel> {
  create(model: TModel, event?: HashTrace): Scene
}

// Shared trace-to-scene playback; each action owns its plan and information.
export class HashAnimation<TModel extends HashActionModel<TModel>> extends AnimationSequence {
  public readonly result: TModel

  constructor(model: TModel, operation: HashOperation, key: number, value: number, layout: HashActionLayout<TModel>) {
    super()
    this.result = model.clone()
    const kind = layout.create(model).kind
    this.add(1, 'Start', operation === 'clear' ? 'Clear the structure without changing the committed model until completion.' : `Start with ${key}. Compute its hash before accessing storage.`, operation === 'clear' ? 'begin clear' : 'read input', layout.create(model))
    let conclusion = operation === 'insert' ? kind === 'bloom-filter' ? `Recorded an add operation for ${key}; distinct membership is not counted.` : `Stored ${key}.` : 'Operation complete.'
    const visited = new Set<string>()
    const checkedBits: number[] = []
    this.result.apply(operation, key, value, (event) => {
      if (kind === 'bloom-filter' && event.type === 'hash' && event.bucket !== undefined) checkedBits.push(event.bucket)
      const description = event.type === 'result'
        ? this.describeResult(event, kind, checkedBits)
        : this.describeEvent(event, kind, operation)
      if (event.type === 'result' || event.type === 'update' || event.type === 'remove' || event.type === 'clear') conclusion = description[1]
      const scene = layout.create(this.result, event)
      const nodes: SceneNode[] = []
      for (const node of scene.nodes) {
        nodes.push(node.tone === 'default' && visited.has(node.id) ? { ...node, tone: 'visited', status: 'VISITED' } : node)
      }
      this.add(event.type === 'result' && operation === 'search-value' ? 4 : event.type === 'hash' ? 2 : 3, description[0], description[1], description[2], { ...scene, nodes, count: model.length })
      if (event.type === 'compare' && event.id) visited.add(event.id)
    })
    if (operation !== 'search-value') this.add(4, 'Finish', conclusion, 'commit completed result', layout.create(this.result))
  }

  private describeResult(event: HashTrace, kind: StructureKind, checkedBits: readonly number[]): readonly [string, string, string] {
    if (kind === 'bloom-filter') {
      if (event.found) {
        return [
          'Possibly present',
          `${event.key} is possibly present: checked bit indices ${checkedBits.join(', ')} are all one. This can be a false positive; verify against the original data.`,
          `return possiblyPresent // bits ${checkedBits.join(', ')} are all 1`,
        ]
      }
      return [
        'Definitely absent',
        `${event.key} is definitely absent: bit ${event.bucket} is zero. Checked bit indices: ${checkedBits.join(', ')}.`,
        `return definitelyAbsent // bit ${event.bucket} is 0`,
      ]
    }
    if (event.found) {
      const target = kind === 'hash-map' ? `key ${event.key}` : `value ${event.key}`
      const storedValue = kind === 'hash-map' ? ` Stored value: ${event.value}.` : ''
      return [
        'Element found',
        `Found ${target} in bucket ${event.bucket}, chain position ${event.chainIndex} (zero-based).${storedValue}`,
        `return matchingEntry // bucket ${event.bucket}, chain position ${event.chainIndex}`,
      ]
    }
    return [
      'Element not found',
      `${kind === 'hash-map' ? 'Key' : 'Value'} ${event.key} was not found in bucket ${event.bucket}.`,
      `return notFound // bucket ${event.bucket} has no match`,
    ]
  }

  private describeEvent(event: HashTrace, kind: StructureKind, operation: HashOperation): readonly [string, string, string] {
    const bloom = kind === 'bloom-filter'
    switch (event.type) {
      case 'hash': return ['Compute hash', bloom ? `Hash ${event.hashIndex! + 1} maps ${event.key} to bit ${event.bucket}.` : `Normalize ${event.key} modulo the bucket count to select bucket ${event.bucket}.`, bloom ? 'index = hash(value, seed) % bitCount' : 'bucket = normalizedModulo(key, bucketCount)']
      case 'compare': return ['Check collision chain', `Compare ${event.key} with this stored key. Different keys can share a bucket.`, 'if node.key == key: match\nelse: node = node.next']
      case 'insert': return ['Insert entry', `Store ${event.key}${kind === 'hash-map' ? ` with value ${event.value}` : ''} at the front of bucket ${event.bucket}.`, 'node.next = buckets[bucket]\nbuckets[bucket] = node\ncount += 1']
      case 'update': return ['Existing key', kind === 'hash-set' ? `${event.key} is already present. Reject the duplicate without changing the size or node ID.` : `Update the value for key ${event.key} to ${event.value}; its node ID and the size stay unchanged.`, kind === 'hash-set' ? 'if value exists: leave set unchanged' : 'node.value = value']
      case 'remove': return ['Release entry', operation === 'clear' ? `Release key ${event.key} from bucket ${event.bucket}.` : `Removed key ${event.key} from bucket ${event.bucket} and reconnected its neighbors.`, 'unlink node\nrelease node\ncount -= 1']
      case 'resize': return ['Grow and rehash', 'The next insertion would exceed a 0.75 load factor. Double the bucket count and redistribute existing nodes; their IDs stay unchanged.', 'allocate twice as many buckets\nrehash and reconnect existing nodes']
      case 'rehash': return ['Verify new bucket', `Key ${event.key} now belongs to bucket ${event.bucket} under the new bucket count.`, 'bucket = normalizedModulo(node.key, newBucketCount)']
      case 'bit': return ['Access bit', operation === 'clear' ? `Reset bit ${event.bucket} to zero.` : operation === 'insert' ? `Set bit ${event.bucket} to one; a previously set bit stays one.` : `Read bit ${event.bucket}: ${event.value}.`, operation === 'search-value' ? 'if bits[index] == 0: return definitelyAbsent' : `bits[index] = ${operation === 'clear' ? 0 : 1}`]
      case 'clear': return ['Cleared', bloom ? 'All bits are zero and the add-operation count is reset. Previously added values are no longer represented.' : 'Every entry is released. Keep the bucket allocation so the structure can be reused.', bloom ? 'addCount = 0' : 'count = 0']
      case 'result': return this.describeResult(event, kind, [])
    }
  }

  public static informationFor(kind: 'hash-map' | 'hash-set' | 'bloom-filter', operation: HashOperation, size: number): AlgorithmInformation {
    const bloom = kind === 'bloom-filter'
    const clear = operation === 'clear'
    const insert = operation === 'insert'
    const name = clear ? 'Clear' : insert ? kind === 'hash-map' ? 'Insert / update' : 'Add a value' : operation === 'delete-value' ? kind === 'hash-map' ? 'Delete a key' : 'Remove a value' : bloom ? 'Check membership' : kind === 'hash-map' ? 'Look up a key' : 'Contains value'
    const time = bloom ? clear ? ['O(m)', 'O(m)', 'O(m)'] : insert ? ['O(k)', 'O(k)', 'O(k)'] : ['O(1)', 'O(k)', 'O(k)'] : clear ? ['O(n + b)', 'O(n + b)', 'O(n + b)'] : ['O(1)', 'O(1)', 'O(n)']
    const memory = !bloom && insert ? ['O(1)', 'O(1)', 'O(b)'] : ['O(1)', 'O(1)', 'O(1)']
    return {
      name,
      summary: bloom ? clear ? 'Reset every bit. Individual items cannot be safely deleted from this standard Bloom filter.' : 'Three deterministic hashes access a 32-bit filter. Zero proves absence; all ones only suggest presence.' : clear ? 'Release collision-chain nodes and retain the bucket storage.' : insert ? 'Hash the input and inspect its collision chain. Grow automatically before a new key would exceed a 0.75 load factor.' : operation === 'delete-value' ? 'Hash the input, find its chain entry, and unlink it. A missing key leaves the structure unchanged.' : 'Hash the input and inspect only its collision chain. Return an exact match or report absence without changing the structure.',
      time: {
        best: time[0], average: time[1], worst: time[2],
        explanation: bloom ? clear ? 'Reset all m bits, even for an empty filter.' : insert ? 'Always compute k hashes and set k bits, including repeated values.' : 'Stop at the first zero bit in the best case; otherwise inspect up to k bits. Average O(k) assumes queries often reach late probes; empty filters stop at the first zero.' : clear ? 'Visit all b buckets and release all n entries, including when empty.' : insert ? 'A head match or an empty bucket costs O(1). Expected amortized O(1) assumes uniformly distributed hashes and bounded load; a long collision chain or rehash costs O(n). Existing keys do not trigger growth.' : 'A head match or empty bucket costs O(1); expected O(1) assumes uniform hashing and bounded load. A collision chain of n entries costs O(n), including misses. Empty inputs check one bucket.',
      },
      memory: {
        best: memory[0], average: memory[1], worst: memory[2],
        explanation: !bloom && insert ? 'Normally one new node or an in-place value update. A resize allocates O(b) bucket references; expected amortized allocation is O(1) over insertion-only unique-key sequences. Existing storage and animation snapshots are excluded.' : 'Only a fixed number of references, counters, or hash accumulators are used. Existing storage and animation snapshots are excluded.',
      },
      terms: bloom ? [
        { symbol: clear ? 'm' : 'k', meaning: clear ? 'Number of bits: m = 32.' : 'Number of hashes: k = 3.' },
        { symbol: clear ? 'O(m)' : 'O(k)', meaning: clear ? 'Work proportional to the bit-array length.' : 'Work proportional to the number of hash probes.' },
        { symbol: 'O(1)', meaning: 'Constant work or additional storage.' },
      ] : [
        { symbol: 'n', meaning: `Original entry count for this run: n = ${size}.` },
        ...(clear || insert ? [{ symbol: 'b', meaning: 'Number of allocated buckets; growth keeps the load factor at most 0.75.' }] : []),
        { symbol: 'O(1)', meaning: 'Constant expected work or additional storage under the stated assumptions.' },
        { symbol: clear ? 'O(n + b)' : 'O(n)', meaning: clear ? 'Work proportional to entries plus all allocated buckets.' : 'Work proportional to the number of entries.' },
        ...(insert ? [{ symbol: 'O(b)', meaning: 'Additional bucket storage proportional to the current bucket count during resizing.' }] : []),
      ],
    }
  }
}
