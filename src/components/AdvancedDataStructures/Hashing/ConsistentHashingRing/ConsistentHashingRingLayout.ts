import { ConsistentHashingRing } from './ConsistentHashingRing.ts'
import { LinearScene } from '../../../../visualization/LinearScene.ts'
import type { LinearModel, LinearFrame } from '../../../../visualization/LinearModel.ts'
import type { Scene, SceneNode, SceneEdge } from '../../../../visualization/Scene.ts'

export class ConsistentHashingRingLayout {
  public create(model: LinearModel, frame: LinearFrame = {}): Scene {
    if (!(model instanceof ConsistentHashingRing)) throw new TypeError('Expected consistent hashing ring')
    const nodes: SceneNode[] = []
    const edges: SceneEdge[] = []
    const tokens = model.getTokens()
    let tokenWidth = 150
    for (const token of tokens) tokenWidth = Math.max(tokenWidth, String(token.server).length * 10 + 40)
    const radius = Math.max(400, tokens.length * (tokenWidth + 70) / (2 * Math.PI))
    const centerX = radius + tokenWidth / 2 + 100
    const centerY = radius + 120
    for (let index = 0; index < tokens.length; index += 1) {
      const token = tokens[index]
      const angle = -Math.PI / 2 + index * 2 * Math.PI / tokens.length
      const x = centerX + radius * Math.cos(angle)
      const y = centerY + radius * Math.sin(angle)
      nodes.push(LinearScene.node(token.id, String(token.server), `v${token.replica}; token ${token.position}`, x, y, tokenWidth))
      edges.push(LinearScene.edge(token.id, tokens[(index + 1) % tokens.length].id, 'clockwise'))
    }
    const assignments = model.getAssignments()
    const sampleY = tokens.length ? centerY + radius + 200 : 100
    let sampleWidth = 200
    for (const assignment of assignments) sampleWidth = Math.max(sampleWidth, `${assignment.key} → ${assignment.owner ?? 'none'}`.length * 10 + 24)
    for (let index = 0; index < assignments.length; index += 1) {
      const assignment = assignments[index]
      nodes.push(LinearScene.node(`${model.kind}-sample-${assignment.key}`, `${assignment.key} → ${assignment.owner ?? 'none'}`, 'sample key → server', 100 + sampleWidth / 2 + (index % 5) * (sampleWidth + 40), sampleY + Math.floor(index / 5) * 130, sampleWidth))
    }
    return LinearScene.create(model, nodes, edges, frame, 'servers')
  }
}
