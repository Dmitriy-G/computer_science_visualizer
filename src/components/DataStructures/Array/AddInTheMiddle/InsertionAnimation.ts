import { FixedArray } from '../FixedArray.ts'
import { ArrayLayout } from '../ArrayLayout.ts'
import type { ArrayFrame } from '../ArrayLayout.ts'
import type { AnimationStep } from '../../../../visualization/Scene.ts'
import type { AlgorithmInformation } from '../../../../visualization/AlgorithmInformation.ts'

export class InsertionAnimation {
  public readonly steps: readonly AnimationStep[]
  public readonly result: FixedArray
  public readonly insertionIndex: number

  public static describe(size: number): AlgorithmInformation {
    return {
      name: 'Insert in the middle',
      summary:
        'Build a new fixed-size array: copy the prefix, insert the value, then copy the suffix.',
      time: {
        best: 'O(n)',
        average: 'O(n)',
        worst: 'O(n)',
        explanation:
          'Best, average, and worst cases are O(n): copy each of the n original elements once and write one new value, regardless of their values.',
      },
      memory: {
        best: 'O(n)',
        average: 'O(n)',
        worst: 'O(n)',
        explanation:
          'All cases allocate a separate fixed array with n + 1 slots while the original array remains in memory.',
      },
      terms: [
        {
          symbol: 'n',
          meaning: `The number of elements in the original fixed array. For this run, n = ${size}. The new array has ${size + 1} slots.`,
        },
        {
          symbol: 'O(n)',
          meaning:
            'Linear: copying work and additional storage grow in proportion to the original array length.',
        },
      ],
    }
  }

  constructor(array: FixedArray, value: number) {
    this.insertionIndex = Math.floor(array.length / 2)
    this.result = array.withInsertedAt(this.insertionIndex, value)
    const pending = this.result.getEntries()[this.insertionIndex]
    const entries = array.getEntries()
    const layout = new ArrayLayout()
    const steps: AnimationStep[] = []
    const base: ArrayFrame = { insertionIndex: this.insertionIndex, pending }

    steps.push({
      phase: 1,
      title: 'Locate the insertion index',
      description: `The original array has exactly ${array.length} slots. Insert at index ${this.insertionIndex}. Its fixed length cannot change, so insertion will produce a separate array.`,
      code: `middle = floor(${array.length} / 2)  // ${this.insertionIndex}`,
      duration: 1800,
      scene: layout.create(entries, {
        ...base,
        activeSource: entries.length > 0 ? this.insertionIndex : undefined,
      }),
    })
    const allocated: ArrayFrame = { ...base, allocated: true }
    steps.push({
      phase: 2,
      title: `Allocate a new array of ${this.result.length} slots`,
      description: `The upper row is the unchanged original array of ${array.length} slots. Allocate a distinct array of exactly ${this.result.length} slots below it. All new slots start empty.`,
      code: `result = new Array(${this.result.length})`,
      duration: 1800,
      scene: layout.create(entries, allocated),
    })

    for (let index = 0; index < this.insertionIndex; index += 1) {
      steps.push({
        phase: 3,
        title: `Read original index ${index}`,
        description: `Read ${entries[index].value} from the prefix. This value belongs at the same index in the new array. The original slot remains unchanged.`,
        code: `read original[${index}]  // ${entries[index].value}`,
        duration: 1000,
        scene: layout.create(entries, {
          ...allocated,
          prefixCopied: index,
          activeSource: index,
        }),
      })
      steps.push({
        phase: 3,
        title: `Copy ${entries[index].value} to new index ${index}`,
        description: `Write a copy of ${entries[index].value} into the new array at index ${index}. Both arrays now contain this value; no original element moves or disappears.`,
        code: `result[${index}] = original[${index}]`,
        duration: 1400,
        scene: layout.create(entries, {
          ...allocated,
          prefixCopied: index + 1,
          copyingSource: index,
        }),
      })
    }

    const prefix: ArrayFrame = {
      ...allocated,
      prefixCopied: this.insertionIndex,
      showPending: true,
    }
    steps.push({
      phase: 4,
      title: 'Prepare the value above the new middle slot',
      description: `The prefix has been copied. The new value ${value} appears above index ${this.insertionIndex} of the new array.`,
      code: `valueToInsert = ${value}`,
      duration: 1500,
      scene: layout.create(entries, prefix),
    })
    const inserted: ArrayFrame = { ...prefix, inserted: true }
    steps.push({
      phase: 4,
      title: 'Write the new value into the new array',
      description: `Write ${value} into result[${this.insertionIndex}]. The original array still contains exactly the same ${array.length} elements as before.`,
      code: `result[${this.insertionIndex}] = ${value}`,
      duration: 1500,
      scene: layout.create(entries, inserted),
    })

    for (let index = this.insertionIndex; index < entries.length; index += 1) {
      steps.push({
        phase: 5,
        title: `Read original index ${index}`,
        description: `Read ${entries[index].value} from the suffix. In the new array, it belongs at index ${index + 1} because the inserted value occupies one extra slot.`,
        code: `read original[${index}]  // ${entries[index].value}`,
        duration: 1000,
        scene: layout.create(entries, {
          ...inserted,
          suffixCopied: index - this.insertionIndex,
          activeSource: index,
        }),
      })
      steps.push({
        phase: 5,
        title: `Copy ${entries[index].value} to new index ${index + 1}`,
        description: `Copy from original[${index}] to result[${index + 1}]. Original indices remain fixed; this value occupies a different index only in the separate result array.`,
        code: `result[${index + 1}] = original[${index}]`,
        duration: 1400,
        scene: layout.create(entries, {
          ...inserted,
          suffixCopied: index - this.insertionIndex + 1,
          copyingSource: index,
        }),
      })
    }

    const filled: ArrayFrame = {
      ...inserted,
      suffixCopied: entries.length - this.insertionIndex,
    }
    steps.push({
      phase: 6,
      title: 'The new fixed array is ready',
      description: `All ${array.length} original values have been copied and the new value is at index ${this.insertionIndex}. The two arrays coexist: original length ${array.length}, result length ${this.result.length}.`,
      code: `// result contains ${this.result.length} values in order`,
      duration: 1800,
      scene: layout.create(entries, filled),
    })
    steps.push({
      phase: 7,
      title: 'Use the new array',
      description: `Switch to the new fixed array of ${this.result.length} slots. The original array never grew or changed; its storage can be released once it is no longer needed.`,
      code: `array = result  // new fixed length: ${this.result.length}`,
      duration: 1600,
      scene: layout.create(entries, { ...filled, complete: true }),
    })
    this.steps = steps
  }
}
