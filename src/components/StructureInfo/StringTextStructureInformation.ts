import type { StructureOverview } from './StructureInformation.ts'

export class StringTextStructureInformation {
  public static readonly overviews = {
    'suffix-array': {
      summary: 'A Suffix Array stores suffix starts in lexicographic order so matching substrings occupy a contiguous row interval. This lesson adds an adjacent LCP array, uses comparison merge sort and direct LCP scans for construction, and reports zero-based match positions in suffix order.',
      useCases: [
        { area: 'Substring indexing', description: 'Find all starts of an exact pattern with two suffix-bound searches.' },
        { area: 'Repeated text', description: 'Use adjacent common-prefix lengths to expose shared suffix prefixes.' },
        { area: 'Static search indexes', description: 'Keep suffix positions in arrays rather than allocating a suffix-tree topology.' },
        { area: 'Compressed-index construction', description: 'Derive BWT rows from suffix order when building an FM-Index.' },
      ],
      technologies: [
        { name: 'Go standard library index/suffixarray', url: 'https://pkg.go.dev/index/suffixarray', usage: 'The standard package builds an in-memory suffix array and exposes substring Lookup returning match offsets. Its byte-oriented implementation and construction algorithm differ from this lowercase comparison-sort and LCP lesson.' },
      ],
    },
    'suffix-automaton': {
      summary: 'A Suffix Automaton groups substrings with equivalent end-position behavior and supports online extension through suffix links and clone-state splitting. This lesson uses all reachable states for substring membership and marks the suffix-final chain separately; no production example is verified for this entry.',
      useCases: [
        { area: 'Online text indexing', description: 'Extend substring recognition as new characters arrive.' },
        { area: 'Substring membership', description: 'Check a pattern by following one character transition per letter.' },
        { area: 'State equivalence', description: 'Observe why clone states split an end-position class during extension.' },
        { area: 'Suffix recognition', description: 'Distinguish states accepting complete suffixes from general reachable substring states.' },
      ],
      technologies: [],
    },
    'aho-corasick-automaton': {
      summary: 'An Aho-Corasick Automaton combines a pattern trie with failure and output links to find many patterns in one text scan. This sparse teaching variant reports all overlaps, retains terminal output links rather than copied output sets, and builds failure links by explicit fallback walks.',
      useCases: [
        { area: 'Multiple-pattern search', description: 'Scan one text against an entire supplied pattern dictionary.' },
        { area: 'Overlapping matches', description: 'Report shorter suffix patterns and repeated occurrences without restarting a scan.' },
        { area: 'Keyword screening', description: 'Recognize a fixed collection of exact keywords in a stream.' },
        { area: 'Failure transitions', description: 'Reuse suffix-prefix progress when the next trie transition is missing.' },
      ],
      technologies: [
        { name: '.NET 9 SearchValues<string>', url: 'https://devblogs.microsoft.com/dotnet/performance-improvements-in-net-9/', usage: 'The .NET team documents Aho-Corasick among the strategies used for multiple-string SearchValues searches. Production code selects optimized strategies and match semantics; this lesson uses explicit sparse links and enumerates every overlapping match.' },
        { name: 'Suricata (Aho-Corasick pattern matchers)', url: 'https://github.com/OISF/suricata/blob/main/doc/userguide/performance/tuning-considerations.rst', usage: 'Offers ac and ac-ks multiple-pattern matchers for signature inspection, including the Ken Steele variant. Production matcher choices and packet inspection extend beyond the lowercase dictionary scanner shown here.' },
      ],
    },
    'dawg': {
      summary: 'A dictionary Directed Acyclic Word Graph is a minimal acyclic deterministic automaton that shares equivalent word endings as well as prefixes. This entry builds a trie and minimizes it from leaves upward, accepting complete dictionary words rather than every substring of one source.',
      useCases: [
        { area: 'Compact word dictionaries', description: 'Merge states that accept the same remaining suffix language.' },
        { area: 'Exact word lookup', description: 'Require an accepting final state after following the whole word.' },
        { area: 'Dictionary compression', description: 'Share word endings through multiple incoming edges to one state.' },
        { area: 'Lexicon validation', description: 'Check candidate words against a fixed finite vocabulary.' },
      ],
      technologies: [
        { name: 'Tesseract OCR dictionaries', url: 'https://tesseract-ocr.github.io/docs/MOCRadaptingtesseract2.pdf', usage: 'The Tesseract authors describe DAWG dictionaries used in OCR recognition. Their packed, language-aware dictionary representation differs from this lowercase state graph and trie-then-minimize construction.' },
      ],
    },
    'fm-index': {
      summary: 'An FM-Index narrows matching suffix rows by backward search over the Burrows-Wheeler transform, cumulative symbol counts, and prefix ranks. This lesson uses dense Occ tables and sampled suffix positions for LF-based location, discarding the original source and complete suffix array after construction.',
      useCases: [
        { area: 'Full-text search', description: 'Count and locate exact substrings through a backward suffix-row interval.' },
        { area: 'Genome indexing', description: 'Locate sequence patterns without retaining every suffix position.' },
        { area: 'Sampled location', description: 'Recover unsampled suffix starts by following LF steps to a known position.' },
        { area: 'Rank-based indexes', description: 'Explore the tradeoff between visible dense rank counters and compressed production storage.' },
      ],
      technologies: [
        { name: 'Bowtie 2', url: 'https://bowtie-bio.sourceforge.net/bowtie2/manual.html', usage: 'Bowtie 2 uses an FM-Index to align seed substrings during read alignment. Its DNA-oriented compressed representation and alignment search differ from this exact lowercase search with dense rank arrays and stride-four position samples.' },
      ],
    },
  } satisfies Record<string, StructureOverview>
}
