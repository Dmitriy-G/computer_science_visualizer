import type { SystemOverviewInformation } from '../../../../../../visualization/SystemOverviewInformation.ts'
import { GpuVramOverview } from '../GpuVramOverview.ts'

export class FrameRenderingOverview {
  public static describe(): SystemOverviewInformation {
    const note = 'A deterministic 2 × 2 frame, one triangle, and one orange texel illustrate one graphics submission. Only pixel (0,0) is covered; no sample lies on an edge. Depth/blending are disabled. Assets start in VRAM. Memory fetches, completion, and scanout are logical stages, not exact GPU wiring or timing. Actual display reads need not traverse this illustrated shared cache. Ray tracing and AI remain idle.'
    return {
      name: 'Render one frame',
      summary: 'Read geometry and a texture from VRAM, render a triangle, store the frame, and read it for display scanout.',
      problem: 'A draw command must become a completed image in memory before the Display Engine can produce a monitor signal.',
      steps: [
        'Submit a draw through PCIe and queue it in the command processor.',
        'Dispatch the vertex shader; open a VRAM row, sense and restore its cells, select columns, and return vertex data through GDDR I/O.',
        'Transform three vertices and pass them to primitive setup.',
        'Rasterize the triangle to identify the covered pixel center.',
        'Dispatch its fragment shader and read an orange texture sample through the same VRAM circuitry.',
        'Send the shaded fragment to render output; write the frame through GDDR I/O, selected columns, row buffer, bitline, transistor, and capacitor.',
        'After render completion, select the new frame for presentation.',
        'Read the completed frame from VRAM for the Display Engine; accesses close their rows with PRECHARGE.',
        'The Display Engine generates the HDMI / DisplayPort stream; memory controllers communicate with VRAM.',
      ],
      implementationNote: `${note} ${GpuVramOverview.note}`,
      realWorldUsage: { technologies: [
        { name: 'Vulkan graphics pipeline', url: 'https://docs.vulkan.org/spec/latest/chapters/shaders.html', usage: 'Vertex processing precedes rasterization; fragment shaders process the generated fragments.' },
        { name: 'Linux DRM/KMS display scanout', url: 'https://docs.kernel.org/gpu/drm-kms.html', usage: 'Framebuffers, display controllers, encoders, and connectors describe presentation separately from rendering.' },
        ...GpuVramOverview.technologies,
      ], products: [], note },
    }
  }
}
