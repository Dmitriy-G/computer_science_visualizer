import type { StructureKind, Scene } from './Scene.ts'
import type { LinearFrame } from './LinearModel.ts'
import type { StringTextModel } from '../components/DataStructuresOverview/StringText/StringTextModel.ts'
import { StringTextStructureDefinitions } from './StringTextStructureDefinitions.ts'
import { SuffixArray } from '../components/DataStructuresOverview/StringText/SuffixArray/SuffixArray.ts'
import { SuffixArrayLayout } from '../components/DataStructuresOverview/StringText/SuffixArray/SuffixArrayLayout.ts'
import { SuffixAutomaton } from '../components/DataStructuresOverview/StringText/SuffixAutomaton/SuffixAutomaton.ts'
import { SuffixAutomatonLayout } from '../components/DataStructuresOverview/StringText/SuffixAutomaton/SuffixAutomatonLayout.ts'
import { AhoCorasickAutomaton } from '../components/DataStructuresOverview/StringText/AhoCorasickAutomaton/AhoCorasickAutomaton.ts'
import { AhoCorasickAutomatonLayout } from '../components/DataStructuresOverview/StringText/AhoCorasickAutomaton/AhoCorasickAutomatonLayout.ts'
import { DAWG } from '../components/DataStructuresOverview/StringText/DAWG/DAWG.ts'
import { DAWGLayout } from '../components/DataStructuresOverview/StringText/DAWG/DAWGLayout.ts'
import { FMIndex } from '../components/DataStructuresOverview/StringText/FMIndex/FMIndex.ts'
import { FMIndexLayout } from '../components/DataStructuresOverview/StringText/FMIndex/FMIndexLayout.ts'

export class StringTextStructureCatalog {
  public static supports(kind: StructureKind): boolean {
    for (const definition of StringTextStructureDefinitions.structures) if (definition.kind === kind) return true
    return false
  }
  public static createModels(): Map<StructureKind, StringTextModel> {
    const models = new Map<StructureKind, StringTextModel>()
    for (const definition of StringTextStructureDefinitions.structures) models.set(definition.kind, this.createDefault(definition.kind)!)
    return models
  }
  public static createDefault(kind: StructureKind): StringTextModel | null {
    switch (kind) {
      case 'suffix-array': return SuffixArray.createDefault()
      case 'suffix-automaton': return SuffixAutomaton.createDefault()
      case 'aho-corasick-automaton': return AhoCorasickAutomaton.createDefault()
      case 'dawg': return DAWG.createDefault()
      case 'fm-index': return FMIndex.createDefault()
      default: return null
    }
  }
  public static createScene(model: StringTextModel, frame: LinearFrame = {}): Scene {
    switch (model.kind) {
      case 'suffix-array': return new SuffixArrayLayout().create(model, frame)
      case 'suffix-automaton': return new SuffixAutomatonLayout().create(model, frame)
      case 'aho-corasick-automaton': return new AhoCorasickAutomatonLayout().create(model, frame)
      case 'dawg': return new DAWGLayout().create(model, frame)
      case 'fm-index': return new FMIndexLayout().create(model, frame)
      default: throw new RangeError('Unknown string/text structure')
    }
  }
}
