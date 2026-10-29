import { StructureCatalog } from '../../visualization/StructureCatalog.ts'
import type { StructureGroupKind } from '../../visualization/StructureCatalog.ts'
import type { StructureKind } from '../../visualization/Scene.ts'

export type MenuScreen = 'categories' | 'groups' | 'structures' | 'actions'

// Browsing the menu never changes the selected structure or its animation.
export class MenuNavigation {
  public static readonly categoryName = 'Data structures common operations'
  public readonly screen: MenuScreen
  public readonly group: StructureGroupKind | null

  constructor(screen: MenuScreen = 'categories', group: StructureGroupKind | null = null) {
    if ((screen === 'structures' || screen === 'actions') && group === null)
      throw new Error('Structure and action menus require a group')
    this.screen = screen
    this.group = group
  }

  public static forStructure(kind: StructureKind): MenuNavigation {
    return new MenuNavigation('actions', StructureCatalog.getGroupForStructure(kind))
  }

  public selectCategory(): MenuNavigation {
    return new MenuNavigation('groups')
  }

  public selectGroup(kind: StructureGroupKind): MenuNavigation {
    StructureCatalog.getGroup(kind)
    return new MenuNavigation('structures', kind)
  }

  public selectStructure(kind: StructureKind): MenuNavigation {
    const group = StructureCatalog.getGroupForStructure(kind)
    if (this.screen !== 'structures' || group !== this.group)
      throw new Error('Choose a structure from the current group')
    return new MenuNavigation('actions', group)
  }

  public back(): MenuNavigation {
    if (this.screen === 'actions') return new MenuNavigation('structures', this.group)
    if (this.screen === 'structures') return new MenuNavigation('groups')
    return new MenuNavigation()
  }

  public get title(): string {
    if (this.screen === 'categories') return 'Categories'
    if (this.screen === 'groups') return MenuNavigation.categoryName
    if (this.screen === 'structures') return StructureCatalog.getGroup(this.group!).name
    return 'Choose an action'
  }

  public get backLabel(): string {
    if (this.screen === 'actions') return StructureCatalog.getGroup(this.group!).name
    if (this.screen === 'structures') return 'Structure groups'
    return 'Categories'
  }

  public getPath(selected: StructureKind | null): readonly string[] {
    if (this.screen === 'categories') return []
    const path = [MenuNavigation.categoryName]
    if (this.group) path.push(StructureCatalog.getGroup(this.group).name)
    if (this.screen === 'actions' && selected) path.push(StructureCatalog.getName(selected))
    return path
  }
}
