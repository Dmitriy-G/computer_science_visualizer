import type { ReactNode } from 'react'
import type { ActionKind } from '../../../visualization/ActionCatalog.ts'
import type { AlgorithmInformation } from '../../../visualization/AlgorithmInformation.ts'
import type { LinearModel } from '../../../visualization/LinearModel.ts'
import type { StructuredLinearActionProps } from '../../ActionPlayback/StructuredLinearAction.tsx'
import SuffixArrayBuild from './SuffixArray/Build/Build.tsx'
import { BuildAnimation as SuffixArrayBuildSequence } from './SuffixArray/Build/BuildAnimation.ts'
import SuffixArraySearchSubstring from './SuffixArray/SearchSubstring/SearchSubstring.tsx'
import { SearchSubstringAnimation as SuffixArraySearchSubstringSequence } from './SuffixArray/SearchSubstring/SearchSubstringAnimation.ts'
import SuffixArrayClear from './SuffixArray/Clear/Clear.tsx'
import { ClearAnimation as SuffixArrayClearSequence } from './SuffixArray/Clear/ClearAnimation.ts'
import SuffixAutomatonBuild from './SuffixAutomaton/Build/Build.tsx'
import { BuildAnimation as SuffixAutomatonBuildSequence } from './SuffixAutomaton/Build/BuildAnimation.ts'
import SuffixAutomatonAppend from './SuffixAutomaton/Append/Append.tsx'
import { AppendAnimation as SuffixAutomatonAppendSequence } from './SuffixAutomaton/Append/AppendAnimation.ts'
import SuffixAutomatonSearchSubstring from './SuffixAutomaton/SearchSubstring/SearchSubstring.tsx'
import { SearchSubstringAnimation as SuffixAutomatonSearchSubstringSequence } from './SuffixAutomaton/SearchSubstring/SearchSubstringAnimation.ts'
import SuffixAutomatonClear from './SuffixAutomaton/Clear/Clear.tsx'
import { ClearAnimation as SuffixAutomatonClearSequence } from './SuffixAutomaton/Clear/ClearAnimation.ts'
import AhoCorasickAutomatonBuild from './AhoCorasickAutomaton/Build/Build.tsx'
import { BuildAnimation as AhoCorasickAutomatonBuildSequence } from './AhoCorasickAutomaton/Build/BuildAnimation.ts'
import AhoCorasickAutomatonScan from './AhoCorasickAutomaton/Scan/Scan.tsx'
import { ScanAnimation as AhoCorasickAutomatonScanSequence } from './AhoCorasickAutomaton/Scan/ScanAnimation.ts'
import AhoCorasickAutomatonClear from './AhoCorasickAutomaton/Clear/Clear.tsx'
import { ClearAnimation as AhoCorasickAutomatonClearSequence } from './AhoCorasickAutomaton/Clear/ClearAnimation.ts'
import DAWGBuild from './DAWG/Build/Build.tsx'
import { BuildAnimation as DAWGBuildSequence } from './DAWG/Build/BuildAnimation.ts'
import DAWGContainsWord from './DAWG/ContainsWord/ContainsWord.tsx'
import { ContainsWordAnimation as DAWGContainsWordSequence } from './DAWG/ContainsWord/ContainsWordAnimation.ts'
import DAWGClear from './DAWG/Clear/Clear.tsx'
import { ClearAnimation as DAWGClearSequence } from './DAWG/Clear/ClearAnimation.ts'
import FMIndexBuild from './FMIndex/Build/Build.tsx'
import { BuildAnimation as FMIndexBuildSequence } from './FMIndex/Build/BuildAnimation.ts'
import FMIndexSearchSubstring from './FMIndex/SearchSubstring/SearchSubstring.tsx'
import { SearchSubstringAnimation as FMIndexSearchSubstringSequence } from './FMIndex/SearchSubstring/SearchSubstringAnimation.ts'
import FMIndexClear from './FMIndex/Clear/Clear.tsx'
import { ClearAnimation as FMIndexClearSequence } from './FMIndex/Clear/ClearAnimation.ts'

export class StringTextFeatures {
  public static render(action: ActionKind, props: StructuredLinearActionProps, session: number): ReactNode {
    switch (props.model.kind) {
      case 'suffix-array':
        switch (action) {
          case 'build-text': return <SuffixArrayBuild key={session} {...props} />
          case 'search-value': return <SuffixArraySearchSubstring key={session} {...props} />
          case 'clear': return <SuffixArrayClear key={session} {...props} />
        }
        break
      case 'suffix-automaton':
        switch (action) {
          case 'build-text': return <SuffixAutomatonBuild key={session} {...props} />
          case 'append-text': return <SuffixAutomatonAppend key={session} {...props} />
          case 'search-value': return <SuffixAutomatonSearchSubstring key={session} {...props} />
          case 'clear': return <SuffixAutomatonClear key={session} {...props} />
        }
        break
      case 'aho-corasick-automaton':
        switch (action) {
          case 'build-words': return <AhoCorasickAutomatonBuild key={session} {...props} />
          case 'search-text': return <AhoCorasickAutomatonScan key={session} {...props} />
          case 'clear': return <AhoCorasickAutomatonClear key={session} {...props} />
        }
        break
      case 'dawg':
        switch (action) {
          case 'build-words': return <DAWGBuild key={session} {...props} />
          case 'search-value': return <DAWGContainsWord key={session} {...props} />
          case 'clear': return <DAWGClear key={session} {...props} />
        }
        break
      case 'fm-index':
        switch (action) {
          case 'build-text': return <FMIndexBuild key={session} {...props} />
          case 'search-value': return <FMIndexSearchSubstring key={session} {...props} />
          case 'clear': return <FMIndexClear key={session} {...props} />
        }
        break
    }
    return null
  }
  public static describe(action: ActionKind, model: LinearModel): AlgorithmInformation | null {
    switch (model.kind) {
      case 'suffix-array':
        switch (action) {
          case 'build-text': return SuffixArrayBuildSequence.describe(model.length)
          case 'search-value': return SuffixArraySearchSubstringSequence.describe(model.length)
          case 'clear': return SuffixArrayClearSequence.describe(model.length)
        }
        break
      case 'suffix-automaton':
        switch (action) {
          case 'build-text': return SuffixAutomatonBuildSequence.describe(model.length)
          case 'append-text': return SuffixAutomatonAppendSequence.describe(model.length)
          case 'search-value': return SuffixAutomatonSearchSubstringSequence.describe(model.length)
          case 'clear': return SuffixAutomatonClearSequence.describe(model.length)
        }
        break
      case 'aho-corasick-automaton':
        switch (action) {
          case 'build-words': return AhoCorasickAutomatonBuildSequence.describe(model.length)
          case 'search-text': return AhoCorasickAutomatonScanSequence.describe(model.length)
          case 'clear': return AhoCorasickAutomatonClearSequence.describe(model.length)
        }
        break
      case 'dawg':
        switch (action) {
          case 'build-words': return DAWGBuildSequence.describe(model.length)
          case 'search-value': return DAWGContainsWordSequence.describe(model.length)
          case 'clear': return DAWGClearSequence.describe(model.length)
        }
        break
      case 'fm-index':
        switch (action) {
          case 'build-text': return FMIndexBuildSequence.describe(model.length)
          case 'search-value': return FMIndexSearchSubstringSequence.describe(model.length)
          case 'clear': return FMIndexClearSequence.describe(model.length)
        }
        break
    }
    return null
  }
}
