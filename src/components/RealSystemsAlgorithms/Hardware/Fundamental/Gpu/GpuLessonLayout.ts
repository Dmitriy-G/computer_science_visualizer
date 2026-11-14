import { GpuVramTrace } from './GpuVramTrace.ts'
import type { GpuVramBuffer } from './GpuVramModel.ts'
import { GpuLayout } from './GpuLayout.ts'

export class GpuLessonLayout {
  public static trace(host: string, vram: string, buffers: readonly GpuVramBuffer[] = []): GpuVramTrace {
    return new GpuVramTrace(GpuLayout.diagram(), [
      ['gpu-connector', host], ['gpu-host-interface', 'idle'], ['gpu-scheduler', 'idle'],
      ['gpu-compute-cores', 'idle'], ['gpu-raster', 'idle'], ['gpu-texture-units', 'idle'],
      ['gpu-render-output', 'idle'], ['gpu-cache', 'idle'], ['gpu-memory-controllers', 'idle'],
      ['gpu-vram', vram], ['gpu-display-engine', 'F0 / ready'], ['gpu-display-ports', 'F0 / black'],
      ['gpu-ray-tracing', 'idle'], ['gpu-ai', 'idle'],
      ['gpu-vram-control', 'idle'], ['gpu-vram-row-decoder', 'closed'],
      ['gpu-vram-transistor', 'OFF'], ['gpu-vram-capacitor', '0'],
      ['gpu-vram-sense', 'precharged'], ['gpu-vram-column-decoder', 'idle'],
      ['gpu-vram-io', 'idle'], ['gpu-vram-refresh', 'idle'],
    ], buffers)
  }
}
