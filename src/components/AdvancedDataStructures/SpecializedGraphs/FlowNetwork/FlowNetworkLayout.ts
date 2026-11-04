import { FlowNetwork } from './FlowNetwork.ts'
import { ExtendedGraphLayout } from '../../../../visualization/ExtendedGraphLayout.ts'
import type { ExtendedGraphModel, ExtendedVertex } from '../../../../visualization/ExtendedGraphModel.ts'

export class FlowNetworkLayout extends ExtendedGraphLayout {
  protected role(model: ExtendedGraphModel, vertex: ExtendedVertex): string {
    if (!(model instanceof FlowNetwork)) throw new TypeError('Expected FlowNetwork')
    const [source, sink] = model.terminals
    return `${vertex.id === source ? 'SOURCE · ' : vertex.id === sink ? 'SINK · ' : ''}vertex ${vertex.value}`
  }
}
