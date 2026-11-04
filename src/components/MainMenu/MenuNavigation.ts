import { StructureCatalog } from '../../visualization/StructureCatalog.ts'
import { MenuStructureCatalog } from './MenuStructureCatalog.ts'
import type { MenuStructureGroup, MenuStructureGroupKind, StructureCategoryKind } from './MenuStructureCatalog.ts'
import type { StructureKind } from '../../visualization/Scene.ts'
import type { StructureDefinition } from '../../visualization/StructureCatalog.ts'
import type { ActionScope } from '../../visualization/ActionCatalog.ts'

export type MenuScreen = 'categories' | 'groups' | 'structures' | 'algorithms' | 'sorting' | 'algorithm-structures'
export type MenuCategoryKind = StructureCategoryKind | 'algorithms'
export type AlgorithmGroupKind = 'sorting' | 'graph-traversal'

export interface MenuCategory {
  readonly kind: MenuCategoryKind
  readonly name: string
  readonly description: string
  readonly symbol: string
}

export interface AlgorithmGroup {
  readonly kind: AlgorithmGroupKind
  readonly name: string
  readonly description: string
  readonly symbol: string
}

// Browsing the menu never changes the selected structure or its animation.
export class MenuNavigation {
  public static readonly categoryName = 'Fundamental Data Structures'
  public static readonly advancedCategoryName = 'Advanced Data Structures'
  public static readonly algorithmsCategoryName = 'Data Structures Algorithms'
  public static readonly algorithmGroups: readonly AlgorithmGroup[] = [
    { kind: 'sorting', name: 'Sorting', description: 'Sorting algorithms for data structures', symbol: '[]' },
    { kind: 'graph-traversal', name: 'Graphs Traversal', description: 'Reachability, shortest paths, ordering, and maximum flow', symbol: '→' },
  ]
  public static readonly categories: readonly MenuCategory[] = [
    { kind: 'fundamental', name: MenuNavigation.categoryName, description: 'Explore fundamental structures and their common operations', symbol: '≡' },
    { kind: 'advanced', name: MenuNavigation.advancedCategoryName, description: 'Explore specialized structures, indexes, and storage techniques', symbol: '+' },
    { kind: 'algorithms', name: MenuNavigation.algorithmsCategoryName, description: 'Explore algorithms that work with data structures', symbol: '↔' },
  ]
  public readonly screen: MenuScreen
  public readonly group: MenuStructureGroupKind | null
  public readonly category: StructureCategoryKind

  constructor(screen: MenuScreen = 'categories', group: MenuStructureGroupKind | null = null, category: StructureCategoryKind = 'fundamental') {
    if (screen === 'structures' && group === null)
      throw new Error('Structure menus require a group')
    this.screen = screen
    this.group = group
    this.category = group ? MenuStructureCatalog.getGroup(group).category : category
  }

  public static forStructure(kind: StructureKind, scope: ActionScope = 'overview'): MenuNavigation {
    if (scope === 'sorting') {
      if (kind !== 'array') throw new Error('Choose an array for sorting examples')
      return new MenuNavigation('sorting')
    }
    if (scope === 'graph-traversal') {
      if (StructureCatalog.getGroupForStructure(kind) !== 'graphs') throw new Error('Choose a graph for traversal examples')
      return new MenuNavigation('algorithm-structures')
    }
    return new MenuNavigation('structures', MenuStructureCatalog.getGroupForStructure(kind).kind)
  }

  public get categoryName(): string {
    return this.category === 'advanced' ? MenuNavigation.advancedCategoryName : MenuNavigation.categoryName
  }

  public getGroups(): readonly MenuStructureGroup[] {
    return MenuStructureCatalog.getGroups(this.category)
  }

  public get actionScope(): ActionScope {
    if (this.screen === 'sorting') return 'sorting'
    return this.screen === 'algorithm-structures' ? 'graph-traversal' : 'overview'
  }

  public getStructures(): readonly StructureDefinition[] {
    if (this.screen === 'sorting') {
      const structures: StructureDefinition[] = []
      for (const structure of StructureCatalog.getStructures('linear')) {
        if (structure.kind === 'array') structures.push(structure)
      }
      return structures
    }
    if (this.screen === 'algorithm-structures') return StructureCatalog.getStructures('graphs')
    return this.screen === 'structures' && this.group ? MenuStructureCatalog.getStructures(this.group) : []
  }

  public selectAlgorithmGroup(kind: AlgorithmGroupKind): MenuNavigation {
    if (this.screen !== 'algorithms') throw new Error('Choose an algorithm group from Algorithms')
    switch (kind) {
      case 'sorting': return new MenuNavigation('sorting')
      case 'graph-traversal': return new MenuNavigation('algorithm-structures')
      default: throw new RangeError('Unknown algorithm group')
    }
  }

  public selectCategory(kind: MenuCategoryKind = 'fundamental'): MenuNavigation {
    switch (kind) {
      case 'fundamental': return new MenuNavigation('groups', null, 'fundamental')
      case 'advanced': return new MenuNavigation('groups', null, 'advanced')
      case 'algorithms': return new MenuNavigation('algorithms')
      default: throw new RangeError('Unknown menu category')
    }
  }

  public selectGroup(kind: MenuStructureGroupKind): MenuNavigation {
    if (this.screen === 'algorithms' || this.screen === 'algorithm-structures' || this.screen === 'sorting')
      throw new Error('Structure groups belong to the Overview category')
    const group = MenuStructureCatalog.getGroup(kind)
    if (this.screen !== 'groups' || group.category !== this.category)
      throw new Error('Choose a group from the current category')
    return new MenuNavigation('structures', kind, this.category)
  }

  public selectStructure(kind: StructureKind): MenuNavigation {
    for (const structure of this.getStructures()) {
      if (structure.kind === kind) return MenuNavigation.forStructure(kind, this.actionScope)
    }
    throw new Error('Choose a structure from the current group')
  }

  public back(): MenuNavigation {
    if (this.screen === 'algorithm-structures' || this.screen === 'sorting') return new MenuNavigation('algorithms')
    if (this.screen === 'structures') return new MenuNavigation('groups', null, this.category)
    return new MenuNavigation()
  }

  public get title(): string {
    if (this.screen === 'categories') return 'Categories'
    if (this.screen === 'algorithms') return MenuNavigation.algorithmsCategoryName
    if (this.screen === 'algorithm-structures') return 'Graphs Traversal'
    if (this.screen === 'sorting') return 'Sorting'
    if (this.screen === 'groups') return this.categoryName
    return MenuStructureCatalog.getGroup(this.group!).name
  }

  public get backLabel(): string {
    if (this.screen === 'algorithm-structures' || this.screen === 'sorting') return 'Algorithms'
    if (this.screen === 'structures') return 'Structure groups'
    return 'Categories'
  }

  public getPath(): readonly string[] {
    if (this.screen === 'categories') return []
    if (this.screen === 'algorithms') return [MenuNavigation.algorithmsCategoryName]
    if (this.screen === 'algorithm-structures' || this.screen === 'sorting') return [MenuNavigation.algorithmsCategoryName, this.title]
    const path = [this.categoryName]
    if (this.group) path.push(MenuStructureCatalog.getGroup(this.group).name)
    return path
  }
}
