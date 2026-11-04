import type { ArrayEntry } from '../../../FundamentalDataStructures/Linear/Array/FixedArray.ts'

export interface ArraySortCounter {
  readonly label: string
  readonly count: number
  readonly active: boolean
  readonly status: string
}

export interface ArraySortTreeNode {
  readonly id: string
  readonly entry: ArrayEntry | null
  readonly left: string | null
  readonly right: string | null
  readonly status: string
  readonly active: boolean
}

export interface ArraySortRun {
  readonly id: string
  readonly label: string
  readonly entries: readonly ArrayEntry[]
  readonly cursor?: number
  readonly activeIndices?: readonly number[]
  readonly dummy?: boolean
  readonly status: string
}

export interface ArraySortStorage {
  readonly id: string
  readonly label: string
  readonly status: string
  readonly runs: readonly ArraySortRun[]
}

export interface ArraySortTask {
  readonly id: string
  readonly parent: string | null
  readonly start: number
  readonly end: number
  readonly kind: string
  readonly status: 'READY' | 'WAIT' | 'RUN' | 'DONE'
  readonly worker?: number
}

export interface ArraySortTrieNode {
  readonly id: string
  readonly parent: string | null
  readonly prefix: string
  readonly count: number
  readonly leaf: boolean
  readonly terminal: boolean
  readonly active: boolean
}

export interface ArraySortFrame {
  readonly activeIndices?: readonly number[]
  readonly roles?: Readonly<Record<number, string>>
  readonly sortedPrefix?: number
  readonly sortedFrom?: number
  readonly sortedIndices?: readonly number[]
  readonly held?: ArrayEntry
  readonly hole?: number
  readonly buffer?: readonly ArrayEntry[]
  readonly bufferStart?: number
  readonly writeIndex?: number
  readonly rangeEnd?: number
  readonly activeBufferIndex?: number
  readonly otherBufferIndex?: number
  readonly distribution?: boolean
  readonly buckets?: readonly (readonly ArrayEntry[])[]
  readonly activeBucket?: number
  readonly activeBucketIndices?: readonly number[]
  readonly bucketStatus?: string
  readonly output?: readonly (ArrayEntry | null)[]
  readonly counters?: readonly ArraySortCounter[]
  readonly counterHint?: string
  readonly tree?: readonly ArraySortTreeNode[]
  readonly treeRoot?: string | null
  readonly piles?: boolean
  readonly activePileTops?: readonly number[]
  readonly unwrittenFrom?: number
  readonly comparator?: { readonly first: number, readonly second: number, readonly ascending: boolean }
  readonly sampleSort?: boolean
  readonly samples?: readonly ArrayEntry[]
  readonly activeSampleIndices?: readonly number[]
  readonly splitters?: readonly ArrayEntry[]
  readonly activeSplitter?: number
  readonly storage?: readonly ArraySortStorage[]
  readonly tasks?: readonly ArraySortTask[]
  readonly trie?: readonly ArraySortTrieNode[]
  readonly trieDepth?: number
  readonly shelf?: readonly (ArrayEntry | null)[]
  readonly shelfActiveIndices?: readonly number[]
}

export interface ArraySortEvent {
  readonly kind: 'compare' | 'select' | 'swap' | 'pass' | 'hold' | 'shift' | 'place' | 'bounds' | 'split' | 'buffer' | 'write' | 'merge' | 'pivot' | 'partition' | 'heap' | 'extract' | 'gap' | 'count' | 'prefix' | 'distribute' | 'gather' | 'digit' | 'reject' | 'bucket-sort' | 'run' | 'reverse' | 'extend' | 'collapse' | 'gallop' | 'fallback' | 'block' | 'stage'
  readonly index: number
  readonly other?: number
  readonly left?: number
  readonly right?: number
  readonly middle?: number
  readonly amount?: number
  readonly label?: string
  readonly detail?: string
  readonly code?: string
  readonly frame: ArraySortFrame
}

export type ArraySortObserver = (event: ArraySortEvent) => void
