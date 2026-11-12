export class DAGPseudocode {
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

  public static readonly depthFirst = `DEPTH_FIRST(start):
  validate that start exists
  seen = {start.id}; order = [start.value]
  stack = [(start, iterator over its edges)]
  while stack is not empty:
    vertex, edges = top of stack
    if edges is exhausted: pop stack; continue
    neighbor = other endpoint of next edge from vertex
    if neighbor.id is in seen: continue
    add neighbor.id to seen
    append neighbor.value to order
    push (neighbor, iterator over its edges) onto stack
  return order`

  public static readonly topologicalSort = `// DAG: topological-sort

DAG.execute(input) {
  number = (name) => {
    value = input[name]
    if (typeof value != 'number')
      throw new TypeError(\`Enter \${name}\`)
    GraphModel.integer(value)
    return value
  }
  vertex = (name) => {
    value = number(name)
    for (entry of this.vertices.values())
      if (entry.value == value): return entry.id
    throw new RangeError(\`Vertex \${value} does not exist\`)
  }
  edge = () => {
    id = number('edge')
    entry = this.edges.get(\`\${this.kind}-edge-\${id}\`)
    if (!entry)
      throw new RangeError(\`Edge e\${id} does not exist\`)
    return entry
  }
  try {
    ids = this.topological()
    values = ids.map((id) => this.vertices.get(id).value)
    return
  }
  catch (error) {
    message = error instanceof Error ? error.message : String(error)
    return { error: true }
  }
}

DAG.kind = 'dag'`
}
