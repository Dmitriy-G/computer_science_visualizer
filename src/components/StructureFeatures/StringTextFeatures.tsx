import type { ReactNode } from 'react'
import type { ActionKind } from '../../visualization/ActionCatalog.ts'
import type { AlgorithmInformation } from '../../visualization/AlgorithmInformation.ts'
import type { LinearModel } from '../../visualization/LinearModel.ts'
import type { StructuredLinearActionProps } from '../ActionPlayback/StructuredLinearAction.tsx'
import SuffixArrayBuild from '../AdvancedDataStructures/TextSearch/SuffixArray/Build/Build.tsx'
import { BuildAnimation as SuffixArrayBuildSequence } from '../AdvancedDataStructures/TextSearch/SuffixArray/Build/BuildAnimation.ts'
import SuffixArraySearchSubstring from '../AdvancedDataStructures/TextSearch/SuffixArray/SearchSubstring/SearchSubstring.tsx'
import { SearchSubstringAnimation as SuffixArraySearchSubstringSequence } from '../AdvancedDataStructures/TextSearch/SuffixArray/SearchSubstring/SearchSubstringAnimation.ts'
import SuffixArrayClear from '../AdvancedDataStructures/TextSearch/SuffixArray/Clear/Clear.tsx'
import { ClearAnimation as SuffixArrayClearSequence } from '../AdvancedDataStructures/TextSearch/SuffixArray/Clear/ClearAnimation.ts'
import SuffixAutomatonBuild from '../AdvancedDataStructures/TextSearch/SuffixAutomaton/Build/Build.tsx'
import { BuildAnimation as SuffixAutomatonBuildSequence } from '../AdvancedDataStructures/TextSearch/SuffixAutomaton/Build/BuildAnimation.ts'
import SuffixAutomatonAppend from '../AdvancedDataStructures/TextSearch/SuffixAutomaton/Append/Append.tsx'
import { AppendAnimation as SuffixAutomatonAppendSequence } from '../AdvancedDataStructures/TextSearch/SuffixAutomaton/Append/AppendAnimation.ts'
import SuffixAutomatonSearchSubstring from '../AdvancedDataStructures/TextSearch/SuffixAutomaton/SearchSubstring/SearchSubstring.tsx'
import { SearchSubstringAnimation as SuffixAutomatonSearchSubstringSequence } from '../AdvancedDataStructures/TextSearch/SuffixAutomaton/SearchSubstring/SearchSubstringAnimation.ts'
import SuffixAutomatonClear from '../AdvancedDataStructures/TextSearch/SuffixAutomaton/Clear/Clear.tsx'
import { ClearAnimation as SuffixAutomatonClearSequence } from '../AdvancedDataStructures/TextSearch/SuffixAutomaton/Clear/ClearAnimation.ts'
import AhoCorasickAutomatonBuild from '../AdvancedDataStructures/TextSearch/AhoCorasickAutomaton/Build/Build.tsx'
import { BuildAnimation as AhoCorasickAutomatonBuildSequence } from '../AdvancedDataStructures/TextSearch/AhoCorasickAutomaton/Build/BuildAnimation.ts'
import AhoCorasickAutomatonScan from '../AdvancedDataStructures/TextSearch/AhoCorasickAutomaton/Scan/Scan.tsx'
import { ScanAnimation as AhoCorasickAutomatonScanSequence } from '../AdvancedDataStructures/TextSearch/AhoCorasickAutomaton/Scan/ScanAnimation.ts'
import AhoCorasickAutomatonClear from '../AdvancedDataStructures/TextSearch/AhoCorasickAutomaton/Clear/Clear.tsx'
import { ClearAnimation as AhoCorasickAutomatonClearSequence } from '../AdvancedDataStructures/TextSearch/AhoCorasickAutomaton/Clear/ClearAnimation.ts'
import DAWGBuild from '../AdvancedDataStructures/TextSearch/DAWG/Build/Build.tsx'
import { BuildAnimation as DAWGBuildSequence } from '../AdvancedDataStructures/TextSearch/DAWG/Build/BuildAnimation.ts'
import DAWGContainsWord from '../AdvancedDataStructures/TextSearch/DAWG/ContainsWord/ContainsWord.tsx'
import { ContainsWordAnimation as DAWGContainsWordSequence } from '../AdvancedDataStructures/TextSearch/DAWG/ContainsWord/ContainsWordAnimation.ts'
import DAWGClear from '../AdvancedDataStructures/TextSearch/DAWG/Clear/Clear.tsx'
import { ClearAnimation as DAWGClearSequence } from '../AdvancedDataStructures/TextSearch/DAWG/Clear/ClearAnimation.ts'
import FMIndexBuild from '../AdvancedDataStructures/TextSearch/FMIndex/Build/Build.tsx'
import { BuildAnimation as FMIndexBuildSequence } from '../AdvancedDataStructures/TextSearch/FMIndex/Build/BuildAnimation.ts'
import FMIndexSearchSubstring from '../AdvancedDataStructures/TextSearch/FMIndex/SearchSubstring/SearchSubstring.tsx'
import { SearchSubstringAnimation as FMIndexSearchSubstringSequence } from '../AdvancedDataStructures/TextSearch/FMIndex/SearchSubstring/SearchSubstringAnimation.ts'
import FMIndexClear from '../AdvancedDataStructures/TextSearch/FMIndex/Clear/Clear.tsx'
import { ClearAnimation as FMIndexClearSequence } from '../AdvancedDataStructures/TextSearch/FMIndex/Clear/ClearAnimation.ts'

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
