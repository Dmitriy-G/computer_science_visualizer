import type { AnimationStep, Scene, SceneNode } from './Scene.ts'
import type { AlgorithmInformation, AlgorithmTerm } from './AlgorithmInformation.ts'

// Snapshot construction only; each action supplies its algorithm and ordered steps.
export class AnimationSequence {
  public readonly steps: AnimationStep[] = []

  public add(phase: number, title: string, description: string, code: string, scene: Scene): void {
    this.steps.push({ phase, title, description, code, duration: 1100, scene })
  }

  public static mark(scene: Scene, activeId: string | null, visited: readonly string[] = [], status = 'CURRENT'): Scene {
    const nodes: SceneNode[] = []
    const seen = new Set(visited)
    for (const node of scene.nodes) {
      nodes.push({
        ...node,
        tone: node.id === activeId ? 'active' : seen.has(node.id) ? 'visited' : node.tone,
        status: node.id === activeId ? status : 'VISITED',
      })
    }
    return { ...scene, nodes, focusId: activeId }
  }

  public static information(
    name: string,
    summary: string,
    size: number,
    time: readonly [string, string, string],
    timeExplanation: string,
    memory: string | readonly [string, string, string],
    memoryExplanation: string,
    extraTerms: readonly AlgorithmTerm[] = [],
  ): AlgorithmInformation {
    const memoryCases = typeof memory === 'string' ? [memory, memory, memory] : memory
    const symbols = new Set([...time, ...memoryCases])
    const terms: AlgorithmTerm[] = [{ symbol: 'n', meaning: `Original number of elements for this run: n = ${size}.` }]
    for (const symbol of symbols) {
      let meaning = 'Constant work or storage, independent of input size.'
      if (symbol === 'O(n)') meaning = 'Linear work or storage, proportional to the number of elements.'
      if (symbol === 'O(log n)') meaning = 'Logarithmic work in a tree of logarithmic height.'
      if (symbol === 'O(n + e)') meaning = 'Work or storage proportional to vertices plus edges.'
      terms.push({ symbol, meaning })
    }
    terms.push(...extraTerms)
    return {
      name,
      summary,
      time: { best: time[0], average: time[1], worst: time[2], explanation: timeExplanation },
      memory: {
        best: memoryCases[0],
        average: memoryCases[1],
        worst: memoryCases[2],
        explanation: `${memoryExplanation} Animation storage excluded.`,
      },
      terms,
    }
  }
}
