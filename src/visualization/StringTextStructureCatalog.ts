import type { StructureKind, Scene } from './Scene.ts'
import type { LinearFrame } from './LinearModel.ts'
import type { StringTextModel } from '../components/AdvancedDataStructures/TextSearch/StringTextModel.ts'
import { StringTextStructureDefinitions } from './StringTextStructureDefinitions.ts'
import { SuffixArray } from '../components/AdvancedDataStructures/TextSearch/SuffixArray/SuffixArray.ts'
import { SuffixArrayLayout } from '../components/AdvancedDataStructures/TextSearch/SuffixArray/SuffixArrayLayout.ts'
import { SuffixAutomaton } from '../components/AdvancedDataStructures/TextSearch/SuffixAutomaton/SuffixAutomaton.ts'
import { SuffixAutomatonLayout } from '../components/AdvancedDataStructures/TextSearch/SuffixAutomaton/SuffixAutomatonLayout.ts'
import { AhoCorasickAutomaton } from '../components/AdvancedDataStructures/TextSearch/AhoCorasickAutomaton/AhoCorasickAutomaton.ts'
import { AhoCorasickAutomatonLayout } from '../components/AdvancedDataStructures/TextSearch/AhoCorasickAutomaton/AhoCorasickAutomatonLayout.ts'
import { DAWG } from '../components/AdvancedDataStructures/TextSearch/DAWG/DAWG.ts'
import { DAWGLayout } from '../components/AdvancedDataStructures/TextSearch/DAWG/DAWGLayout.ts'
import { FMIndex } from '../components/AdvancedDataStructures/TextSearch/FMIndex/FMIndex.ts'
import { FMIndexLayout } from '../components/AdvancedDataStructures/TextSearch/FMIndex/FMIndexLayout.ts'

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
