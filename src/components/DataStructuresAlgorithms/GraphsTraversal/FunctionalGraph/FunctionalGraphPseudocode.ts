export class FunctionalGraphPseudocode {
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
  seen = {}; order = []
  VISIT(start)
  return order

VISIT(vertex):
  add vertex.id to seen
  append vertex.value to order
  for neighbor in traversal links from vertex, in stored order:
    if neighbor.id is not in seen: VISIT(neighbor)`
}
