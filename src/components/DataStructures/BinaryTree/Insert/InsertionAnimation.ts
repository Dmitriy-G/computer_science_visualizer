import { BinaryTree } from '../BinaryTree.ts'
import type { BinaryTreeEntry } from '../BinaryTree.ts'
import { BinaryTreeLayout } from '../BinaryTreeLayout.ts'
import type { BinaryTreeFrame } from '../BinaryTreeLayout.ts'
import type { AnimationStep } from '../../../../visualization/Scene.ts'
import type { AlgorithmInformation } from '../../../../visualization/AlgorithmInformation.ts'

export class InsertionAnimation {
  public readonly steps: readonly AnimationStep[]
  public readonly result: BinaryTree

  public static describe(size: number): AlgorithmInformation {
    return {
      name: 'Insert into a binary search tree',
      summary:
        'Smaller values go left; larger or equal values go right.',
      time: {
        best: 'O(1)',
        average: 'O(log n)',
        worst: 'O(n)',
        explanation:
          'O(h), bounded by tree height. Best O(1): an empty root or root child. Average O(log n) assumes distinct keys inserted in random order. Worst O(n): a chain from sorted or all-equal inputs.',
      },
      memory: {
        best: 'O(1)',
        average: 'O(1)',
        worst: 'O(1)',
        explanation:
          'One new leaf and a few pointers in every case; no recursion stack. Animation storage excluded.',
      },
      terms: [
        {
          symbol: 'n',
          meaning: `The number of nodes before insertion. For this run, n = ${size}.`,
        },
        {
          symbol: 'h',
          meaning:
            'The height of the tree: the number of nodes on its longest root-to-leaf path (0 for an empty tree).',
        },
        {
          symbol: 'O(h)',
          meaning: 'Work grows with the height of the tree.',
        },
        {
          symbol: 'O(log n)',
          meaning:
            'Logarithmic: expected traversal grows with the logarithm of the number of nodes under the random insertion assumption.',
        },
        {
          symbol: 'O(n)',
          meaning: 'Linear: traversal can visit every node in a chain.',
        },
        {
          symbol: 'O(1)',
          meaning:
            'Constant: work or additional algorithm memory stays bounded as the tree grows.',
        },
      ],
    }
  }

  constructor(tree: BinaryTree, value: number) {
    this.result = tree.clone()
    const pending = this.result.insert(value)
    const entries = tree.getEntries()
    const byId = new Map<string, BinaryTreeEntry>()
    for (const entry of entries) byId.set(entry.id, entry)
    const layout = new BinaryTreeLayout()
    const steps: AnimationStep[] = []
    const visited: string[] = []
    let current: BinaryTreeEntry | null = entries[0] ?? null
    let parent: BinaryTreeEntry | null = current
    let side = 'root'
    steps.push({
      phase: 1,
      title: current ? 'Start at the root' : 'Start with an empty tree',
      description: current
        ? `The binary search tree has ${tree.length} nodes. Start at ${current.value} to find a position for ${value}. Smaller values go left; larger or equal values go right.`
        : `There is no root yet. The new value ${value} will become the root.`,
      code: 'current = root',
      duration: 1400,
      scene: layout.create(entries, { activeId: current?.id }),
    })
    while (current !== null) {
      parent = current
      const goLeft: boolean = value < current.value
      side = goLeft ? 'left' : 'right'
      const childId: string | null = goLeft ? current.leftId : current.rightId
      steps.push({
        phase: 2,
        title: `Compare with ${current.value}: go ${side}`,
        description: `${value} ${goLeft ? '<' : '>='} ${current.value}, so follow the ${side} child.${value === current.value ? ' Equal values follow the right branch, keeping duplicates as separate nodes.' : ''}`,
        code: `if (value ${goLeft ? '<' : '>='} current.value)\n  current = current.${side}`,
        duration: 1600,
        scene: layout.create(entries, {
          activeId: current.id,
          visitedIds: [...visited],
        }),
      })
      visited.push(current.id)
      current = childId === null ? null : byId.get(childId)!
      if (current) {
        steps.push({
          phase: 2,
          title: `Follow the ${side} child to ${current.value}`,
          description: `Move from ${parent.value} to ${current.value}. Continue comparing until the chosen child pointer is empty.`,
          code: `current = current.${side}`,
          duration: 1200,
          scene: layout.create(entries, {
            activeId: current.id,
            visitedIds: [...visited],
          }),
        })
      }
    }
    const frame: BinaryTreeFrame = {
      pendingId: pending.id,
      visitedIds: [...visited],
      activeId: parent?.id,
    }
    const resultEntries = this.result.getEntries()
    steps.push({
      phase: 3,
      title: parent
        ? `The ${side} child of ${parent.value} is empty`
        : 'The root pointer is empty',
      description: parent
        ? `Insert ${value} as the ${side} child of ${parent.value}. Existing nodes stay connected; only this empty child pointer needs to change.`
        : `Insert ${value} at the root. No comparisons are needed.`,
      code: parent ? `parent.${side} == null` : 'root == null',
      duration: 1600,
      scene: layout.create(resultEntries, frame),
    })
    steps.push({
      phase: 4,
      title: 'Create the new leaf',
      description: `Allocate a node containing ${value} with empty left and right child pointers. It is pending until insertion finishes.`,
      code: `newNode = new BinaryTreeNode(${value})\nnewNode.left = null\nnewNode.right = null`,
      duration: 1600,
      scene: layout.create(resultEntries, { ...frame, showPending: true }),
    })
    steps.push({
      phase: 5,
      title: parent ? 'Connect the parent to the new leaf' : 'Set the root pointer',
      description: parent
        ? `Set ${parent.value}'s ${side} pointer to the new node. The new leaf has no children.`
        : `Set the tree's root pointer to the new node.`,
      code: parent ? `parent.${side} = newNode` : 'root = newNode',
      duration: 1600,
      scene: layout.create(resultEntries, {
        ...frame,
        showPending: true,
        connectPending: true,
      }),
    })
    steps.push({
      phase: 6,
      title: 'Insertion complete',
      description: `The tree now has ${this.result.length} nodes. The new value ${value} is ${parent ? `the ${side} child of ${parent.value}` : 'the root'}. All smaller values remain in left subtrees; larger or equal values remain in right subtrees.`,
      code: 'size += 1  // insertion complete',
      duration: 1400,
      scene: layout.create(resultEntries, {
        pendingId: pending.id,
        showPending: true,
        connectPending: true,
        complete: true,
      }),
    })
    this.steps = steps
  }
}
