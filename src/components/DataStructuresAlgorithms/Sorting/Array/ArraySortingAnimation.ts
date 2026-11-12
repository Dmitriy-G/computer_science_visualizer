import { AnimationSequence } from '../../../../visualization/AnimationSequence.ts'
import { FixedArray } from '../../../FundamentalDataStructures/Linear/Array/FixedArray.ts'
import { ArraySortingLayout } from './ArraySortingLayout.ts'
import type { ArraySortEvent, ArraySortFrame } from './ArraySortTrace.ts'

export class ArraySortingAnimation extends AnimationSequence {
  public readonly result: FixedArray
  protected readonly layout = new ArraySortingLayout()
  protected readonly baseFrame: ArraySortFrame

  constructor(model: FixedArray, name: string, baseFrame: ArraySortFrame = {}) {
    super()
    this.baseFrame = baseFrame
    this.result = model.clone()
    this.add(1, 'Inspect the array', `${name} will arrange ${model.length} values in ascending order without changing the number of slots.`, 'n = array.length', this.layout.create(model.getEntries(), baseFrame))
  }

  protected record(event: ArraySortEvent, phase: number, title: string, description: string, code: string): void {
    this.add(phase, title, description, code, this.layout.create(this.result.getEntries(), { ...this.baseFrame, ...event.frame }))
  }

  protected finish(stable: boolean): void {
    const description = this.result.length < 2
      ? 'An empty or singleton array is already sorted; no comparisons or moves are needed.'
      : `The array is sorted in ascending order. ${stable ? 'Equal values retain their original relative order.' : 'This algorithm does not guarantee the relative order of equal values.'}`
    this.add(5, 'Sorting complete', description, 'commit array', this.layout.create(this.result.getEntries(), { ...this.baseFrame, sortedPrefix: this.result.length }))
  }

  protected recordTrace(event: ArraySortEvent): void {
    const phase = event.kind === 'compare' || event.kind === 'run' || event.kind === 'block' || event.kind === 'fallback' || event.kind === 'stage' ? 2
      : event.kind === 'merge' || event.kind === 'partition' || event.kind === 'collapse' || event.kind === 'pass' ? 4 : 3
    this.record(event, phase, event.label!, event.detail!, event.code!)
  }

  protected fitScenes(): void {
    let width = 0
    let height = 0
    for (const step of this.steps) {
      width = Math.max(width, step.scene.width)
      height = Math.max(height, step.scene.height)
    }
    for (let index = 0; index < this.steps.length; index += 1) {
      const step = this.steps[index]
      this.steps[index] = { ...step, scene: { ...step.scene, width, height } }
    }
  }
}
