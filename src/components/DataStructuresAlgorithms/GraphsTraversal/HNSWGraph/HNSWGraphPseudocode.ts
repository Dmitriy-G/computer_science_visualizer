// Static listings for graph algorithms.
export class HNSWGraphPseudocode {
  public static readonly breadthFirst = `BREADTH_FIRST(start):
  validate that start exists
  queue = FIFO queue containing start
  seen = {start.id}; order = []
  while queue is not empty:
    vertex = remove front of queue
    append vertex.value to order
    for neighbor in traversal links from vertex, in stored order:
      if neighbor.id is in seen: continue
      add neighbor.id to seen
      append neighbor to queue
  return order

// Only vertices reachable from start are visited.`

  public static readonly depthFirst = `// HNSWGraph: depth-first

HNSWGraph.execute(input) {
  return this.traverse("depth-first", input)
}

HNSWGraph.traverse(input) {
  start = LinearModel.integer(input, 'index')
  if (!this.getVertexIds().includes(start))
    return this.reject('Choose an existing vertex ID from the diagram.')
  visited = new Set()
  result = []
  visit = (id) => {
    visited.add(id)
    result.push(id)
  }
  dfs = (id) => {
    visit(id)
    for (neighbor of this.getNeighborIds(id))
      if (!visited.has(neighbor)): dfs(neighbor)
  }
  dfs(start)
  return { value: result, status: 'VISITED' }
}

LinearModel.integer(input, name) {
  value = input[name]
  if (typeof value != 'number' || !Number.isSafeInteger(value))
    throw new TypeError(\`\${name} must be a safe integer\`)
  return value
}

HNSWGraph.getVertexIds() {
  return [...this.vertices.keys()]
}

HNSWGraph.reject(description) {
  return { status: 'REJECTED' }
}

HNSWGraph.getNeighborIds(id) {
  return this.vertices.get(id)?.neighbors.get(0) ?? []
}`
}
