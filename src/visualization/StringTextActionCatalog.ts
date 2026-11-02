import type { ActionChoice } from './ActionCatalog.ts'
import type { StructureKind } from './Scene.ts'

export class StringTextActionCatalog {
  public static getActions(kind: StructureKind): readonly ActionChoice[] | null {
    switch (kind) {
      case 'suffix-array': return [
        { kind: 'build-text', title: 'Build from text', description: 'Merge-sort suffix positions and compute adjacent common-prefix lengths.' },
        { kind: 'search-value', title: 'Find substring positions', description: 'Use lower and upper suffix bounds and report every matching source position.' },
        { kind: 'clear', title: 'Clear', description: 'Release source text, suffix positions, and LCP values.' },
      ]
      case 'suffix-automaton': return [
        { kind: 'build-text', title: 'Build from text', description: 'Extend the automaton character by character, cloning states when needed.' },
        { kind: 'append-text', title: 'Append text', description: 'Extend existing end-position classes without rebuilding the source index.' },
        { kind: 'search-value', title: 'Contains substring', description: 'Follow character transitions; every reachable state accepts substring queries.' },
        { kind: 'clear', title: 'Clear', description: 'Keep an empty root and release all other states and source characters.' },
      ]
      case 'aho-corasick-automaton': return [
        { kind: 'build-words', title: 'Build pattern dictionary', description: 'Build a trie and assign failure and terminal output links breadth first.' },
        { kind: 'search-text', title: 'Scan text for all patterns', description: 'Follow transitions and failure/output links, reporting all overlapping matches.' },
        { kind: 'clear', title: 'Clear', description: 'Release patterns and links, preserving an empty initial state.' },
      ]
      case 'dawg': return [
        { kind: 'build-words', title: 'Build word dictionary', description: 'Construct a trie, then intern equivalent states from leaves to the initial state.' },
        { kind: 'search-value', title: 'Contains complete word', description: 'Follow the complete word and require its final state to be accepting.' },
        { kind: 'clear', title: 'Clear', description: 'Release the shared dictionary graph and reset its word count.' },
      ]
      case 'fm-index': return [
        { kind: 'build-text', title: 'Build text index', description: 'Construct BWT, cumulative counts, dense Occ, and sampled suffix positions.' },
        { kind: 'search-value', title: 'Find substring positions', description: 'Narrow the suffix interval backward and locate each row using LF and samples.' },
        { kind: 'clear', title: 'Clear', description: 'Release the transform, rank tables, cumulative counts, and suffix samples.' },
      ]
      default: return null
    }
  }
}
