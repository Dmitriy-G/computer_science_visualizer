import { ComponentInformation, ComponentLesson } from '../ComponentLesson.ts'
import type { HardwareTrace } from '../HardwareTrace.ts'
import { LatchModel } from './LatchModel.ts'
import { LatchOverview } from './LatchOverview.ts'

export class LatchAnimation extends ComponentLesson {
  public readonly title = LatchOverview.describe().name
  public static describe() { return ComponentInformation.describe(LatchOverview.describe()) }

  protected build(trace: HardwareTrace): void {
    const model = new LatchModel()
    model.apply(0, false)
    trace.record(model.snapshot(), 'Start with a known bit', 'The powered latch begins holding Q = 0. This initialized state is a teaching choice.', 'D = 0; LE = 0; Q = 0', 0)
    model.apply(1, true)
    trace.record(model.snapshot(), 'Enable and apply one', 'LE is high, so the data path is transparent and Q follows D.', 'LE = 1\nD = 1\nQ = D')
    model.apply(0, true)
    trace.record(model.snapshot(), 'Still transparent', 'Q changes again while enable remains high. This is level sensitivity, not an edge-triggered capture.', 'D = 0  // LE stays high\nQ = D')
    model.apply(1, true)
    trace.record(model.snapshot(), 'Prepare the bit to retain', 'Hold D stable around disabling enable. Setup and hold requirements are assumed satisfied.', 'D = 1\nwait_symbolic_setup_interval()')
    model.apply(1, false)
    trace.record(model.snapshot(), 'Close the latch', 'With enable low, feedback retains the last value Q = 1.', 'LE = 0\nwait_symbolic_hold_interval()\nQ retains 1')
    model.apply(0, false)
    trace.record(model.snapshot(), 'Input changes while holding', 'D is now zero while Q stays one. The closed latch remembers the captured value.', 'D = 0\nassert Q == 1')
    model.apply(0, true)
    trace.record(model.snapshot(), 'Re-enable for a new value', 'The transparent latch accepts D = 0 without needing an edge-triggered flip-flop.', 'LE = 1\nQ = D  // 0')
    model.apply(0, false)
    model.outputEnabled = false
    trace.record(model.snapshot(), 'Disconnect the external output', 'Raising active-low /OE makes the output high impedance Z. The stored bit remains zero.', 'LE = 0\n/OE = 1\noutput = Z; Q remains 0')
    model.outputEnabled = true
    trace.record(model.snapshot(), 'Reconnect the held bit', 'The output drives the retained zero again. The sample history distinguishes D, enable, and Q; sample spacing is symbolic.', '/OE = 0\noutput = Q  // 0', 2)
  }
}
