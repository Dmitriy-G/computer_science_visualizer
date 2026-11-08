import { PureComponent } from 'react'
import type { ReactNode } from 'react'
import type { OverviewArchitectureKind, OverviewComponentKind } from '../../visualization/OverviewComponent.ts'
import './OverviewTags.css'

interface OverviewTagsProps {
  readonly components: readonly OverviewComponentKind[]
  readonly architectures: readonly OverviewArchitectureKind[]
}

export default class OverviewTags extends PureComponent<OverviewTagsProps> {
  public render(): ReactNode {
    const tags: ReactNode[] = []
    for (const component of this.props.components) {
      tags.push(
        <span className="overview-component-tag" data-component={component} key={component}>
          {component}
        </span>,
      )
    }
    for (const architecture of this.props.architectures) {
      tags.push(
        <span className="overview-component-tag overview-architecture-tag" data-architecture={architecture} key={architecture} title={`Architecture: ${architecture}`}>
          {architecture}
        </span>,
      )
    }
    return <span className="overview-component-tags" aria-label="Components and architectures covered">{tags}</span>
  }
}
