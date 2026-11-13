import type { ReactNode } from 'react'
import type { Scene } from '../../../../../visualization/Scene.ts'
import { SystemOverviewLayout } from '../../../SystemOverview/SystemOverviewLayout.ts'
import ComponentWorkspace from '../ComponentWorkspace.tsx'
import type { ComponentPlaybackProps } from '../ComponentWorkspace.tsx'
import { RamAlgorithmCatalog } from './RamAlgorithmCatalog.ts'
import { RamPlaybackLayout } from './RamPlaybackLayout.ts'
import WriteOneBit from './WriteOneBit/WriteOneBit.tsx'
import ReadOneBit from './ReadOneBit/ReadOneBit.tsx'

export default class RamWorkspace extends ComponentWorkspace {
  protected readonly group = 'hardware-ram' as const
  protected readonly choices = RamAlgorithmCatalog.choices
  private readonly preview = this.props.previewScene ?? SystemOverviewLayout.create('ram', null)

  protected presentScene(scene: Scene | null): Scene {
    return scene?.kind === 'hardware-component' ? RamPlaybackLayout.create(scene, this.preview) : this.preview
  }

  protected renderLesson(props: ComponentPlaybackProps): ReactNode {
    switch (this.props.algorithm) {
      case 'ram-write-bit': return <WriteOneBit {...props} />
      case 'ram-read-bit': return <ReadOneBit {...props} />
    }
    return null
  }
}
