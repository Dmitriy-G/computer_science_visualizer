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
      if (!symbol.startsWith('O(')) continue
      let meaning = 'Constant work or storage, independent of input size.'
      if (symbol === 'O(n)') meaning = 'Linear work or storage, proportional to the number of elements.'
      if (symbol === 'O(n²)') meaning = 'Quadratic work, proportional to the square of the number of elements.'
      if (symbol === 'O(log n)') meaning = 'Logarithmic work or storage, proportional to the logarithm of the number of elements.'
      if (symbol === 'O(√n)') meaning = 'Storage proportional to the square root of the number of entries.'
      if (symbol === 'O(n log n)') meaning = 'Work proportional to the number of elements times its logarithm.'
      if (symbol === 'O(n + k)') meaning = 'Work or storage proportional to entries plus the inclusive integer key range.'
      if (symbol === 'O(n + b)') meaning = 'Work or storage proportional to entries plus buckets.'
      if (symbol === 'O(d(n + b))') meaning = 'One linear distribution and collection over entries and buckets for each digit pass.'
      if (symbol === 'O(n² + b)') meaning = 'Quadratic insertion work within buckets plus bucket initialization.'
      if (symbol === 'O(n^(3/2))') meaning = 'Work bounded by the number of entries raised to the power three halves.'
      if (symbol === 'O(n + e)') meaning = 'Work or storage proportional to vertices plus edges.'
      if (symbol === 'O(log n + k)') meaning = 'Logarithmic descent plus work proportional to the number of reported records.'
      if (symbol === 'O(k + 1)') meaning = 'Storage for the reported records and a fixed number of references; constant when no records match.'
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
