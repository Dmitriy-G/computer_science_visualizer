import { AdditionalTreeAnimation } from '../../../../../visualization/AdditionalTreeAnimation.ts'
import type { AdditionalTreeModel, TreeInputValues } from '../../../../../visualization/AdditionalTreeModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { TrieLayout } from '../TrieLayout.ts'

export class ClearAnimation extends AdditionalTreeAnimation {
  public static readonly title = 'Clear'
  public static readonly summary = 'Release prefix nodes in postorder and retain the root.'

  public static describe(size: number, storage = size, runs = 0): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(p)', average: 'O(p)', worst: 'O(p)', explanation: 'Every one of the p character nodes is released. An empty root is handled in constant time.' },
      memory: { best: 'O(h)', average: 'O(h)', worst: 'O(h)', explanation: 'A postorder traversal stack holds at most h nodes, where h is the greatest word length plus the root. Animation snapshots and traces are excluded.' },
      terms: [
        { symbol: 'p', meaning: 'Number of character nodes across all shared prefixes, excluding the retained root.' },
        { symbol: 'h', meaning: 'Maximum word length plus one for the root.' },
        { symbol: 'O(p)', meaning: 'Work proportional to the number of stored character nodes.' },
        { symbol: 'O(h)', meaning: 'Traversal storage proportional to the maximum prefix depth.' },
      ],
    }
  }

  constructor(model: AdditionalTreeModel, input: TreeInputValues = {}) {
    super(model, new TrieLayout(), 'clear', input, ClearAnimation.title, ClearAnimation.summary)
  }
}
