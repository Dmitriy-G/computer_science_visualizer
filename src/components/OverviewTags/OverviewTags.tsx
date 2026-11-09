import { PureComponent } from 'react'
import type { ReactNode } from 'react'
import type { OverviewArchitectureKind, OverviewComponentKind, OverviewDeviceKind } from '../../visualization/OverviewComponent.ts'
import './OverviewTags.css'

interface OverviewTagsProps {
  readonly components: readonly OverviewComponentKind[]
  readonly architectures: readonly OverviewArchitectureKind[]
  readonly devices?: readonly OverviewDeviceKind[]
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
    for (const device of this.props.devices ?? []) {
      tags.push(
        <span className="overview-component-tag overview-device-tag" data-device={device} key={device} title={`Storage device: ${device}`}>
          {device}
        </span>,
      )
    }
    return <span className="overview-component-tags" aria-label="Components, architectures, and devices covered">{tags}</span>
  }
}
