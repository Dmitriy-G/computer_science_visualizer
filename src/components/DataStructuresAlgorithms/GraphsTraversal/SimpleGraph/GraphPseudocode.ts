export class GraphPseudocode {
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
}
