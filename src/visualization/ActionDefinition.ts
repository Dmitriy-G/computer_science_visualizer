import type { AnimationStep, Scene } from './Scene.ts'

export interface ActionModel<TModel> {
  clone(): TModel
}

export interface ActionPlan<TModel> {
  readonly steps: readonly AnimationStep[]
  readonly result: TModel
}

export interface ActionDefinition<TModel> {
  readonly title: string
  readonly context: string
  readonly summary: string
  readonly phases: readonly string[]
  readonly timelineHint: string
  readonly inputLabel?: string
  readonly initialValue?: number
  readonly inputMinimum?: number
  readonly inputMaximum?: number
  readonly acceptsValue?: boolean
  create(model: TModel, value: number, upperValue?: number): ActionPlan<TModel>
}

export interface ActionPlaybackProps<TModel> {
  readonly model: TModel
  readonly definition: ActionDefinition<TModel>
  readonly value?: number
  readonly upperValue?: number
  readonly onSceneChange: (scene: Scene, model: TModel) => void
  readonly onComplete?: () => void
}
