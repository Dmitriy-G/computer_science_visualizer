import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import type { SystemOverviewInformation } from '../../../../../visualization/SystemOverviewInformation.ts'
import type { HardwareSnapshot } from '../HardwareSnapshot.ts'
import type { HardwareOverviewChoice } from '../HardwareOverviewChoice.ts'
import { FrameRenderingAnimation } from './FrameRendering/FrameRenderingAnimation.ts'
import { FrameRenderingOverview } from './FrameRendering/FrameRenderingOverview.ts'
import { HashcatIterationAnimation } from './HashcatIteration/HashcatIterationAnimation.ts'
import { HashcatIterationOverview } from './HashcatIteration/HashcatIterationOverview.ts'

export type GpuAlgorithmKind = 'gpu-frame-rendering' | 'gpu-hashcat-iteration'

export class GpuAlgorithmCatalog {
  public static readonly choices: readonly HardwareOverviewChoice<GpuAlgorithmKind>[] = [
    { kind: 'gpu-frame-rendering', name: 'Render one frame', description: 'Read geometry and textures from VRAM, render a frame, and write it back for display.', components: ['GPU', 'VRAM'], architectures: [] },
    { kind: 'gpu-hashcat-iteration', name: 'Hashcat: one candidate iteration', description: 'Write inputs to VRAM, read them on compute cores, and store and retrieve the match result.', components: ['GPU', 'VRAM'], architectures: [] },
  ]

  public static definition(kind: GpuAlgorithmKind): ActionDefinition<HardwareSnapshot> {
    switch (kind) {
      case 'gpu-frame-rendering': return new FrameRenderingAnimation()
      case 'gpu-hashcat-iteration': return new HashcatIterationAnimation()
    }
    throw new RangeError('Unknown GPU overview')
  }

  public static describeOverview(kind: GpuAlgorithmKind): SystemOverviewInformation {
    switch (kind) {
      case 'gpu-frame-rendering': return FrameRenderingOverview.describe()
      case 'gpu-hashcat-iteration': return HashcatIterationOverview.describe()
    }
    throw new RangeError('Unknown GPU overview')
  }

  public static describe(kind: GpuAlgorithmKind): AlgorithmInformation {
    switch (kind) {
      case 'gpu-frame-rendering': return FrameRenderingAnimation.describe()
      case 'gpu-hashcat-iteration': return HashcatIterationAnimation.describe()
    }
    throw new RangeError('Unknown GPU overview')
  }
}
