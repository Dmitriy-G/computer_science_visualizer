import { OrthantTreeModel } from '../OrthantTreeModel.ts'
export class Quadtree extends OrthantTreeModel {
  public readonly kind = 'quadtree'
  protected readonly dimensions = 2
  protected empty(): Quadtree { return new Quadtree() }
  public static createDefault(): Quadtree {
    const tree = new Quadtree()
    for (const [x, y] of [[-500, -500], [500, 500], [-500, 500], [500, -500], [-100, 100], [100, -100], [100, 100], [-100, -100], [700, 200], [-700, 200]]) tree.execute('insert', { x, y })
    return tree
  }
}
