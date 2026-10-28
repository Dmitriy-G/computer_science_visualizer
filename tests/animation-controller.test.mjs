import assert from 'node:assert/strict'
import { test } from 'node:test'
import { AnimationController } from '../src/visualization/AnimationController.ts'

class ManualClock {
  tasks = new Map()
  nextId = 1

  schedule(callback, delay) {
    const id = this.nextId++
    this.tasks.set(id, { callback, delay })
    return id
  }

  cancel(id) {
    this.tasks.delete(id)
  }

  tick() {
    const entry = this.tasks.entries().next().value
    if (!entry) return
    this.tasks.delete(entry[0])
    entry[1].callback()
  }

  pendingDelay() {
    return this.tasks.values().next().value?.delay
  }
}

class Observer {
  index = -1
  playing = false
  notifications = 0

  onTimelineChange(index, playing) {
    this.index = index
    this.playing = playing
    this.notifications += 1
  }
}

class Fixture {
  clock = new ManualClock()
  observer = new Observer()
  controller = new AnimationController(
    [{ duration: 1200 }, { duration: 1600 }, { duration: 1000 }],
    this.observer,
    this.clock,
  )
}

test('play advances in order and stops on the final frame', () => {
  const f = new Fixture()
  f.controller.play()
  assert.equal(f.observer.index, 0)
  assert.equal(f.observer.playing, true)
  f.clock.tick()
  assert.equal(f.observer.index, 1)
  f.clock.tick()
  assert.equal(f.observer.index, 2)
  assert.equal(f.observer.playing, false)
  assert.equal(f.clock.tasks.size, 0)
})

test('pause and dispose cancel timers without late updates', () => {
  const f = new Fixture()
  f.controller.play()
  f.controller.pause()
  f.clock.tick()
  assert.equal(f.observer.index, 0)
  assert.equal(f.clock.tasks.size, 0)
  f.controller.play()
  f.controller.dispose()
  const count = f.observer.notifications
  f.clock.tick()
  assert.equal(f.observer.notifications, count)
  assert.equal(f.clock.tasks.size, 0)
})

test('manual steps and seek pause playback; replay starts from the head', () => {
  const f = new Fixture()
  f.controller.play()
  f.controller.next()
  assert.equal(f.observer.index, 1)
  assert.equal(f.observer.playing, false)
  f.controller.previous()
  assert.equal(f.observer.index, 0)
  f.controller.previous()
  assert.equal(f.observer.index, 0)
  f.controller.seek(2)
  f.controller.next()
  assert.equal(f.observer.index, 2)
  f.controller.play()
  assert.equal(f.observer.index, 0)
  assert.equal(f.clock.tasks.size, 1)
})

test('speed changes reschedule exactly one timer with the correct duration', () => {
  const f = new Fixture()
  f.controller.play()
  assert.equal(f.clock.pendingDelay(), 1200)
  f.controller.setSpeed(2)
  assert.equal(f.clock.pendingDelay(), 600)
  assert.equal(f.clock.tasks.size, 1)
  f.clock.tick()
  assert.equal(f.clock.pendingDelay(), 800)
  f.controller.play()
  assert.equal(f.clock.tasks.size, 1)
})

test('invalid seeks and speeds cannot corrupt the running timeline', () => {
  const f = new Fixture()
  f.controller.play()
  for (const index of [-1, 3, NaN, 0.5])
    assert.throws(() => f.controller.seek(index), RangeError)
  for (const speed of [0, -1, NaN, Infinity])
    assert.throws(() => f.controller.setSpeed(speed), RangeError)
  assert.equal(f.observer.index, 0)
  assert.equal(f.clock.tasks.size, 1)
})

test('a disposed controller can mount again under React StrictMode', () => {
  const f = new Fixture()
  f.controller.play()
  f.controller.dispose()
  f.controller.play()
  assert.equal(f.clock.tasks.size, 1)
  f.clock.tick()
  assert.equal(f.observer.index, 1)
})
