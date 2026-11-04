import { StructureCatalog } from '../../../visualization/StructureCatalog.ts'
import { MenuStructureCatalog } from '../MenuStructureCatalog.ts'
import { ActionCatalog } from '../../../visualization/ActionCatalog.ts'
import type { ActionKind, ActionScope } from '../../../visualization/ActionCatalog.ts'
import { AlgorithmTechnologyCatalog } from '../../../visualization/AlgorithmTechnologyCatalog.ts'
import type { AlgorithmInformation, AlgorithmTechnology } from '../../../visualization/AlgorithmInformation.ts'
import type { StructureKind } from '../../../visualization/Scene.ts'
import { StructureInformation } from '../../StructureInfo/StructureInformation.ts'

export type SearchTarget = 'structures' | 'algorithms'
export type DescribeSearchAlgorithm = (structure: StructureKind, action: ActionKind, scope: ActionScope) => AlgorithmInformation | null

export interface MenuSearchResult {
  readonly key: string
  readonly structure: StructureKind
  readonly scope: ActionScope
  readonly action?: ActionKind
  readonly name: string
  readonly description: string
  readonly context: string
  readonly symbol: string
  readonly realSystems: boolean
  readonly popular: boolean
}

interface SearchDocument {
  readonly target: SearchTarget
  readonly result: MenuSearchResult
  readonly text: string
}

export class MenuSearchIndex {
  private readonly documents: SearchDocument[] = []

  constructor(describe: DescribeSearchAlgorithm) {
    for (const structure of StructureCatalog.structures) {
      const information = StructureInformation.get(structure.kind)
      const group = MenuStructureCatalog.getGroupForStructure(structure.kind)
      let text = structure.name
      for (const useCase of information.useCases) text += ` ${useCase.area}`
      text += this.technologyNames(information.technologies)
      text += this.technologyNames(StructureInformation.getProducts(structure.kind))
      this.documents.push({
        target: 'structures', text: this.normalize(text),
        result: {
          key: structure.kind, structure: structure.kind, scope: 'overview',
          name: structure.name, description: structure.description, context: group.name,
          symbol: structure.symbol, realSystems: information.technologies.length > 0,
          popular: information.technologies.length >= 3,
        },
      })
      for (const scope of ['sorting', 'graph-traversal'] as const) {
        for (const action of ActionCatalog.getScopedActions(structure.kind, scope)) {
          const details = describe(structure.kind, action.kind, scope)
          const usage = AlgorithmTechnologyCatalog.get(structure.kind, action.kind, scope)
          let algorithmText = `${action.title} ${details?.name ?? ''} ${structure.name}`
          if (usage) {
            algorithmText += this.technologyNames(usage.technologies) + this.technologyNames(usage.products)
          }
          this.documents.push({
            target: 'algorithms', text: this.normalize(algorithmText),
            result: {
              key: `${scope}:${structure.kind}:${action.kind}`, structure: structure.kind, scope,
              action: action.kind, name: action.title, description: action.description,
              context: structure.name, symbol: structure.symbol,
              realSystems: !!usage && (usage.technologies.length > 0 || usage.products.length > 0),
              popular: AlgorithmTechnologyCatalog.isPopular(structure.kind, action.kind, scope),
            },
          })
        }
      }
    }
  }

  public find(target: SearchTarget, query: string): MenuSearchResult[] {
    const normalized = this.normalize(query).trim()
    if (!normalized) return []
    const words = normalized.split(/\s+/)
    const results: MenuSearchResult[] = []
    for (const document of this.documents) {
      if (document.target !== target) continue
      let matches = true
      for (const word of words) {
        if (!document.text.includes(word)) {
          matches = false
          break
        }
      }
      if (matches) results.push(document.result)
    }
    results.sort((first, second) =>
      first.name.localeCompare(second.name, 'en', { sensitivity: 'base' }) ||
      first.context.localeCompare(second.context, 'en', { sensitivity: 'base' }) ||
      first.key.localeCompare(second.key, 'en'),
    )
    return results
  }

  private normalize(text: string): string {
    return text.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('en')
  }

  private technologyNames(examples: readonly AlgorithmTechnology[]): string {
    let text = ''
    for (const example of examples) text += ` ${example.name}`
    return text
  }
}
