import type { StructureDefinition } from './StructureCatalog.ts'

export class StringTextStructureDefinitions {
  public static readonly structures: readonly StructureDefinition[] = [
    { kind: 'suffix-array', group: 'string-text', name: 'Suffix Array', description: 'Sorted suffix starts, adjacent LCP values, and binary-search substring lookup', symbol: 'SA' },
    { kind: 'suffix-automaton', group: 'string-text', name: 'Suffix Automaton', description: 'Online substring states with suffix links and clone-state splitting', symbol: 'SAM' },
    { kind: 'aho-corasick-automaton', group: 'string-text', name: 'Aho-Corasick Automaton', description: 'Multiple-pattern matching with failure links, output links, and overlapping results', symbol: 'AC' },
    { kind: 'dawg', group: 'string-text', name: 'Directed Acyclic Word Graph (DAWG)', description: 'A minimal acyclic dictionary automaton that merges equivalent word endings', symbol: 'DAWG' },
    { kind: 'fm-index', group: 'string-text', name: 'FM-Index', description: 'BWT backward search, exclusive-prefix occurrence counts, and sampled LF location', symbol: 'FM' },
  ]
}
