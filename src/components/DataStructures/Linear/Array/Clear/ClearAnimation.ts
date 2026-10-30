import { FixedArray } from '../FixedArray.ts'
import { ArrayLayout } from '../ArrayLayout.ts'
import { AnimationSequence } from '../../../../../visualization/AnimationSequence.ts'
import type { SceneNode, SceneSlot } from '../../../../../visualization/Scene.ts'

export class ClearAnimation extends AnimationSequence {
  public readonly result: FixedArray

  public static describe(size: number) {
    return AnimationSequence.information(
      'Clear', 'Replace the selected fixed array with an empty fixed array.', size,
      ['O(1)', 'O(1)', 'O(1)'],
      'Every case is O(1), independent of n: create an empty result and replace the selected reference. No elements are copied or individually erased. Automatic garbage collection of unused storage is outside this operation.',
      'O(1)', 'An empty array and a fixed number of references. The original allocation is unchanged.',
    )
  }

  constructor(model: FixedArray) {
    super()
    this.result = model.withoutAll()
    const layout = new ArrayLayout()
    const initial = layout.create(model.getEntries())
    this.add(1, 'Inspect the fixed array', `The current allocation has exactly ${model.length} occupied slots. Clear selects an empty allocation; it does not leave spare slots.`, 'original = array', initial)
    this.add(2, 'Create an empty result', 'Create a separate fixed array of length zero. The original values and allocation remain unchanged.', 'result = FixedArray(0)', { ...initial, nodes: [...initial.nodes], slots: [...(initial.slots ?? [])] })
    const nodes: SceneNode[] = []
    const slots: SceneSlot[] = []
    for (const node of initial.nodes) nodes.push({ ...node, opacity: 0 })
    for (const slot of initial.slots ?? []) slots.push({ ...slot, opacity: 0 })
    this.add(3, 'Release the selected reference', 'Fade the old allocation from the drawing. Storage becomes eligible for automatic collection when no references remain; values are not overwritten.', 'array = result', { ...initial, nodes, slots, focusId: null })
    this.add(4, 'Clear complete', model.length ? 'The selected array now has zero slots and zero values. Inserting next will create an exact-sized result of length one.' : 'The array was already empty. It still has zero slots and zero values.', 'commit result', layout.create(this.result.getEntries()))
  }
}
