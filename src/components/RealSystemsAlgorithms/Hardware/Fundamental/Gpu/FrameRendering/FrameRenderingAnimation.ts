import type { ActionDefinition, ActionPlan } from '../../../../../../visualization/ActionDefinition.ts'
import type { HardwareSnapshot } from '../../HardwareSnapshot.ts'
import { ComponentInformation } from '../../ComponentLesson.ts'
import { GpuLessonLayout } from '../GpuLessonLayout.ts'
import { FrameRenderingModel } from './FrameRenderingModel.ts'
import { FrameRenderingOverview } from './FrameRenderingOverview.ts'

export class FrameRenderingAnimation implements ActionDefinition<HardwareSnapshot> {
  public readonly title = 'Render one frame'
  public static describe() { return ComponentInformation.describe(FrameRenderingOverview.describe()) }

  public create(_source: HardwareSnapshot): ActionPlan<HardwareSnapshot> {
    const model = new FrameRenderingModel()
    const trace = GpuLessonLayout.trace('Draw F1', 'F0 / assets ready', [
      { id: 'vertices', label: '3 vertices', data: model.vertexData() },
      { id: 'texture', label: model.texture, data: new Uint8Array([255, 128, 0, 255]) },
      { id: 'frame', label: 'F0 / black', data: model.frameData() },
    ])
    trace.start('Render one triangle into a 2 × 2 frame. Geometry and a one-texel orange texture are already in VRAM. Frame F0 is black. This is a logical flow; exact cache behavior, timing, depth, and blending are outside the example.')
    trace.transfer('gpu-host-link', 'gpu-host-interface', 'Draw F1', 'Submit draw', 'The host submits one draw command through PCIe.')
    trace.transfer('gpu-command-input', 'gpu-scheduler', 'Draw F1 queued', 'Queue graphics work', 'The command processor receives the draw and schedules its shader work.')
    trace.transfer('gpu-schedule-compute', 'gpu-compute-cores', 'Vertex shader', 'Dispatch vertex work', 'The same programmable cores run vertex and fragment shaders at different logical stages.')
    trace.transfer('gpu-compute-cache', 'gpu-cache', 'Read 3 vertices', 'Fetch vertex inputs', 'The vertex shader requests three preloaded vertices through the memory hierarchy.')
    trace.transfer('gpu-cache-memory', 'gpu-memory-controllers', 'Read vertices', 'Request vertex memory', 'The teaching path follows a cache miss to the memory controllers.')
    const vertices = trace.read('vertices')
    trace.transfer('gpu-cache-memory', 'gpu-cache', '3 vertices', 'Fill vertex cache', 'The memory response reaches the shared cache.', true)
    trace.transfer('gpu-compute-cache', 'gpu-compute-cores', '3 vertices', 'Receive vertex inputs', 'The shader cores receive the vertex data.', true)
    model.shadeVertices(vertices.data)
    trace.local('gpu-compute-cores', '3 screen vertices', 'Run vertex shader', 'Transform clip-space vertices to screen positions (0,0), (2,0), and (0,1.8).')
    trace.transfer('gpu-vertex-raster', 'gpu-raster', 'Triangle ready', 'Assemble triangle', 'Pass transformed vertices to primitive setup and rasterization.')
    model.rasterize()
    trace.local('gpu-raster', `${model.fragments.length} fragment`, 'Rasterize', 'Test the four pixel centers. Only center (0.5,0.5) lies inside this triangle; none lies exactly on an edge.')
    trace.transfer('gpu-raster-shader', 'gpu-compute-cores', 'Fragment (0,0)', 'Dispatch fragment', 'Rasterization supplies the covered fragment to the programmable cores.')
    trace.transfer('gpu-texture-requests', 'gpu-texture-units', 'Sample texel 0', 'Request texture sample', 'The fragment shader asks the texture units for the single orange texel.')
    trace.transfer('gpu-texture-cache', 'gpu-cache', 'Read texel 0', 'Fetch texture', 'Texture access uses the memory hierarchy; local texture caches are omitted.')
    trace.transfer('gpu-cache-memory', 'gpu-memory-controllers', 'Read texel 0', 'Request texture memory', 'Follow the selected texture fetch through the memory controllers.')
    const texture = trace.read('texture')
    trace.transfer('gpu-cache-memory', 'gpu-cache', model.texture, 'Cache texel', 'The texture value arrives through the memory controller response.', true)
    trace.transfer('gpu-texture-cache', 'gpu-texture-units', model.texture, 'Receive texture data', 'The texture units receive the selected texel.', true)
    trace.transfer('gpu-texture-requests', 'gpu-compute-cores', model.texture, 'Return texture sample', 'The sampled color reaches the fragment shader.', true)
    model.shadeFragments(texture.data)
    trace.local('gpu-compute-cores', model.shaded!, 'Shade fragment', 'The fragment shader outputs orange for pixel (0,0). Ray tracing and AI units remain idle.')
    trace.transfer('gpu-shader-output', 'gpu-render-output', model.shaded!, 'Deliver fragment color', 'Pass the shaded fragment to render output; depth and blending are disabled in this example.')
    model.render()
    trace.transfer('gpu-render-cache', 'gpu-cache', 'F1 / 1 orange pixel', 'Write render result', 'The 2 × 2 frame contains one orange pixel and three black pixels. The new frame has not reached VRAM yet.')
    trace.transfer('gpu-cache-memory', 'gpu-memory-controllers', 'Store F1', 'Write back frame', 'The selected render result passes through the memory controllers.')
    trace.write({ id: 'frame', label: 'F1 / 1 orange pixel', data: model.frameData() })
    model.store()
    trace.local('gpu-display-engine', 'F1 selected', 'Select completed frame', 'After render completion and presentation synchronization, select F1 for scanout. Page-flip timing is abstracted.')
    trace.transfer('gpu-frame-scanout', 'gpu-cache', 'Read frame F1', 'Request scanout data', 'The Display Engine requests frame data through the abstracted memory path.', true)
    trace.transfer('gpu-cache-memory', 'gpu-memory-controllers', 'Read F1', 'Fetch completed frame', 'The display read follows the selected memory path; actual scanout cache routing varies by GPU.')
    const frame = trace.read('frame')
    trace.transfer('gpu-cache-memory', 'gpu-cache', 'F1 data', 'Route scanout data', 'The diagram groups memory-system routing through the shared cache block.', true)
    trace.transfer('gpu-frame-scanout', 'gpu-display-engine', 'F1 / scanout', 'Load Display Engine', 'Frame data reaches the Display Engine, which produces timing and the output stream.')
    model.present(frame.data)
    trace.transfer('gpu-display-output', 'gpu-display-ports', 'F1 / 1 orange pixel', 'Send display stream', 'Only the Display Engine drives the HDMI / DisplayPort connection. The frame is now presented.')
    trace.finish('One frame presented', `F1 pixels in row order: ${model.displayed.join(', ')}. Rendering and display scanout are distinct operations.`)
    return { steps: trace.steps, result: trace.result.clone() }
  }
}
