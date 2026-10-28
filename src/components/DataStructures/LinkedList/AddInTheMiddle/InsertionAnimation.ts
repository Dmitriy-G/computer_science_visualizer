import { LinkedList } from '../LinkedList.ts'
import { LinkedListLayout } from '../LinkedListLayout.ts'
import type { LinkedListFrame } from '../LinkedListLayout.ts'
import type { AnimationStep } from '../../../../visualization/Scene.ts'
import type { AlgorithmInformation } from '../../../../visualization/AlgorithmInformation.ts'

export class InsertionAnimation {
  public readonly steps: readonly AnimationStep[]
  public readonly result: LinkedList
  public readonly insertionIndex: number

  public static describe(size: number): AlgorithmInformation {
    return {
      name: 'Insert in the middle',
      summary:
        'Follow the linked list to its middle, then connect a new node between its neighbors.',
      time: {
        order: 'O(n)',
        explanation:
          'Finding the middle visits about half of the n nodes, so traversal is O(n). Updating the two next pointers takes O(1).',
      },
      memory: {
        order: 'O(1)',
        explanation:
          'One new node and a fixed number of pointers. The list itself occupies O(n) memory.',
      },
      terms: [
        {
          symbol: 'n',
          meaning: `The number of nodes before insertion. For this run, n = ${size}.`,
        },
        {
          symbol: 'O(n)',
          meaning:
            'Linear: traversal work grows in proportion to the number of nodes.',
        },
        {
          symbol: 'O(1)',
          meaning:
            'Constant: pointer updates and additional memory stay bounded as the list grows.',
        },
      ],
    }
  }

  constructor(list: LinkedList, value: number) {
    if (list.length < 2)
      throw new RangeError('Middle insertion needs at least two existing nodes')
    this.insertionIndex = Math.floor(list.length / 2)
    this.result = list.clone()
    const pending = this.result.insertAt(this.insertionIndex, value)
    const entries = list.getEntries()
    const predecessor = this.insertionIndex - 1
    const layout = new LinkedListLayout()
    const steps: AnimationStep[] = []
    const frame: LinkedListFrame = {
      insertionIndex: this.insertionIndex,
      pendingNode: pending,
    }

    for (let index = 0; index <= predecessor; index += 1) {
      steps.push({
        phase: index === 0 ? 1 : 2,
        title:
          index === 0
            ? 'Start at the head'
            : `Follow the pointer to index ${index}`,
        description:
          index === 0
            ? `The list has ${list.length} nodes. To insert at index ${this.insertionIndex}, start at the head and find the node immediately before that position.`
            : `Follow next from ${entries[index - 1].value} to ${entries[index].value}. A linked list has no direct index access; each pointer is visited in order.`,
        code:
          index === 0
            ? 'current = head'
            : `current = current.next  // index ${index}`,
        duration: 1200,
        scene: layout.create(entries, {
          ...frame,
          activeIndex: index,
          visitedThrough: index - 1,
        }),
      })
    }

    const reached: LinkedListFrame = {
      ...frame,
      activeIndex: predecessor,
      visitedThrough: predecessor - 1,
    }
    steps.push({
      phase: 3,
      title: 'Stop at the insertion point',
      description: `The middle is between ${entries[predecessor].value} and ${entries[this.insertionIndex].value}. Keep a reference to the right neighbor before changing any links.`,
      code: 'successor = current.next',
      duration: 1800,
      scene: layout.create(entries, reached),
    })
    const appeared: LinkedListFrame = { ...reached, showPending: true }
    steps.push({
      phase: 4,
      title: 'Create a new node above the list',
      description: `Allocate a node containing ${value}. It is not connected yet; all original nodes and pointers are still in place.`,
      code: `newNode = new LinkedListNode(${value})`,
      duration: 1600,
      scene: layout.create(entries, appeared),
    })
    const detached: LinkedListFrame = { ...appeared, detached: true }
    steps.push({
      phase: 5,
      title: 'Unlink the two middle neighbors',
      description: `Fade out the link from ${entries[predecessor].value} to ${entries[this.insertionIndex].value}. The saved successor reference keeps the rest of the list reachable during this visual transition.`,
      code: '// successor is saved; retire the old visual link',
      duration: 1300,
      scene: layout.create(entries, detached),
    })
    const opened: LinkedListFrame = { ...detached, gap: true }
    steps.push({
      phase: 5,
      title: 'Make room in the middle',
      description:
        'Move the right half of the drawing one position to the right. This space is only for the visualization: linked list nodes do not need adjacent memory.',
      code: '// open a visual gap at the insertion index',
      duration: 1500,
      scene: layout.create(entries, opened),
    })
    const lowered: LinkedListFrame = { ...opened, lowered: true }
    steps.push({
      phase: 6,
      title: 'Lower the new node into the gap',
      description: `Move ${value} down between its neighbors. The node is in position, but the new next pointers have not been connected yet.`,
      code: '// position the new node between current and successor',
      duration: 1500,
      scene: layout.create(entries, lowered),
    })
    const nextConnected: LinkedListFrame = { ...lowered, connectNext: true }
    steps.push({
      phase: 7,
      title: 'Connect the new node to its successor',
      description: `Set the new node's next pointer to ${entries[this.insertionIndex].value} first. This preserves the path to the remaining nodes.`,
      code: 'newNode.next = successor',
      duration: 1600,
      scene: layout.create(entries, nextConnected),
    })
    const connected: LinkedListFrame = {
      ...nextConnected,
      connectPrevious: true,
    }
    steps.push({
      phase: 7,
      title: 'Connect the predecessor to the new node',
      description: `Set ${entries[predecessor].value}'s next pointer to ${value}. Both links are now in place and the list is connected again.`,
      code: 'current.next = newNode',
      duration: 1600,
      scene: layout.create(entries, connected),
    })
    steps.push({
      phase: 7,
      title: 'Insertion complete',
      description: `The list now has ${this.result.length} nodes. The new value ${value} is at index ${this.insertionIndex}. Finding the position took O(n); changing the pointers took O(1).`,
      code: 'size += 1  // insertion complete',
      duration: 1400,
      scene: layout.create(entries, {
        ...connected,
        activeIndex: -1,
        visitedThrough: -1,
        complete: true,
      }),
    })
    this.steps = steps
  }
}
