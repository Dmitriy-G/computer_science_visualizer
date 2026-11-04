import { OrthantTreeModel } from '../OrthantTreeModel.ts'
export class Octree extends OrthantTreeModel {
  public readonly kind = 'octree'
  protected readonly dimensions = 3
  protected empty(): Octree { return new Octree() }
  public static createDefault(): Octree {
    const tree = new Octree()
    for (let index = 0; index < 10; index += 1) tree.execute('insert', { x: index % 2 ? 500 : -500, y: Math.floor(index / 2) % 2 ? 500 : -500, z: index < 8 ? Math.floor(index / 4) % 2 ? 500 : -500 : 100 })
    return tree
  }
}
