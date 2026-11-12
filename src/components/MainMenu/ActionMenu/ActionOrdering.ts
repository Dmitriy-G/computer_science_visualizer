import type { ActionChoice, ActionKind } from '../../../visualization/ActionCatalog.ts'
import type { AlgorithmInformation } from '../../../visualization/AlgorithmInformation.ts'

export type ActionOrder = 'alphabetical' | 'average-time' | 'average-memory'

export class ActionOrdering {
  public static readonly labels: Readonly<Record<ActionOrder, string>> = {
    alphabetical: 'Alphabetical (A–Z)',
    'average-time': 'Average time (fast to slow)',
    'average-memory': 'Average memory (less to more)',
  }

  public static readonly complexityHint = 'Orders asymptotic growth classes, not measured speed. Bounded digit, radix, and key-range parameters are held fixed; equal bounds use A–Z. Unestablished or unavailable bounds appear last.'

  private static readonly growth: Readonly<Record<string, number>> = {
    'O(1)': 0,
    'O(d)': 0,
    'O(logn)': 1,
    'O(√n)': 2,
    'O(n)': 3,
    'O(nd)': 3,
    'O(n+b)': 3,
    'O(n+k)': 3,
    'O(d(n+b))': 3,
    'O(n+e)': 3,
    'O(V)': 3,
    'O(V+E)': 3,
    'O(V²)': 7,
    'O(V²+E)': 7,
    'O(V(E+1))': 7,
    'O(V(E+V))': 7,
    'O(V(H+I+1))': 7,
    'O(VE²+V+E)': 9,
    'O(nlogn)': 4,
    'O(nlog²n)': 5,
    'O(n^(3/2))': 6,
    'O(n²)': 7,
    'O(n²+b)': 7,
    'O(V^2+E)': 7,
    'O(n^2.71)': 8,
    'O(n^(log₂n))': 9,
    'O(n·n!)': 10,
  }

  public static arrange(actions: readonly ActionChoice[], order: ActionOrder, describe: (action: ActionKind) => AlgorithmInformation | null): ActionChoice[] {
    const ordered = [...actions]
    const ranks = new Map<ActionKind, number>()
    if (order !== 'alphabetical') {
      for (const action of actions) {
        const information = describe(action.kind)
        const complexity = order === 'average-time' ? information?.time.average : information?.memory.average
        ranks.set(action.kind, this.rank(complexity))
      }
    }
    ordered.sort((first, second) => {
      if (order !== 'alphabetical') {
        const difference = ranks.get(first.kind)! - ranks.get(second.kind)!
        if (difference !== 0) return difference
      }
      return first.title.localeCompare(second.title, 'en', { sensitivity: 'base' }) || first.kind.localeCompare(second.kind, 'en')
    })
    return ordered
  }

  private static rank(complexity?: string): number {
    if (complexity === 'Unbounded') return 101
    return complexity ? this.growth[complexity.replace(/\s/g, '')] ?? 100 : 100
  }
}
