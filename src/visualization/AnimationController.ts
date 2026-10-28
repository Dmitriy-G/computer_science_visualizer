import type { AnimationStep } from './Scene.ts'

export interface TimelineObserver {
  onTimelineChange(index: number, playing: boolean): void
}

export interface TimelineClock {
  schedule(callback: () => void, delay: number): number
  cancel(handle: number): void
}

export class BrowserClock implements TimelineClock {
  public schedule(callback: () => void, delay: number): number {
    return window.setTimeout(callback, delay)
  }

  public cancel(handle: number): void {
    window.clearTimeout(handle)
  }
}

export class AnimationController {
  private readonly steps: readonly AnimationStep[]
  private readonly observer: TimelineObserver
  private readonly clock: TimelineClock
  private index = 0
  private playing = false
  private speed = 1
  private timer: number | null = null

  constructor(
    steps: readonly AnimationStep[],
    observer: TimelineObserver,
    clock: TimelineClock = new BrowserClock(),
  ) {
    if (steps.length === 0)
      throw new Error('An animation needs at least one step')
    this.steps = steps
    this.observer = observer
    this.clock = clock
  }

  public play(): void {
    this.clearTimer()
    if (this.index === this.steps.length - 1) this.index = 0
    this.playing = this.steps.length > 1
    this.notify()
    this.schedule()
  }

  public pause(): void {
    this.clearTimer()
    this.playing = false
    this.notify()
  }

  public seek(index: number): void {
    if (!Number.isInteger(index) || index < 0 || index >= this.steps.length) {
      throw new RangeError('Animation step is outside the timeline')
    }
    this.clearTimer()
    this.playing = false
    this.index = index
    this.notify()
  }

  public next(): void {
    this.seek(Math.min(this.index + 1, this.steps.length - 1))
  }

  public previous(): void {
    this.seek(Math.max(this.index - 1, 0))
  }

  public setSpeed(speed: number): void {
    if (!Number.isFinite(speed) || speed <= 0)
      throw new RangeError('Animation speed must be positive')
    this.speed = speed
    this.clearTimer()
    this.schedule()
  }

  public dispose(): void {
    this.clearTimer()
    this.playing = false
  }

  private advance = (): void => {
    this.timer = null
    if (!this.playing) return
    this.index = Math.min(this.index + 1, this.steps.length - 1)
    if (this.index === this.steps.length - 1) this.playing = false
    this.notify()
    this.schedule()
  }

  private schedule(): void {
    if (!this.playing) return
    this.timer = this.clock.schedule(
      this.advance,
      this.steps[this.index].duration / this.speed,
    )
  }

  private clearTimer(): void {
    if (this.timer === null) return
    this.clock.cancel(this.timer)
    this.timer = null
  }

  private notify(): void {
    this.observer.onTimelineChange(this.index, this.playing)
  }
}
