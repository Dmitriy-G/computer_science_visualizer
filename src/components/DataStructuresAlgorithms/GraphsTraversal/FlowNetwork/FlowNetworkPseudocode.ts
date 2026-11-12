export class FlowNetworkPseudocode {
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

  public static readonly maxFlow = `EDMONDS_KARP(source, sink):
  validate that source and sink exist and differ
  set flow of every edge to 0
  total = 0
  repeat:
    use BFS to find a shortest residual path from source to sink
    if no path exists: return total
    amount = smallest residual capacity on that path
    for each residual arc on the path:
      if arc follows an original edge: increase its flow by amount
      else: cancel amount of flow on the corresponding original edge
    publish the complete augmentation together
    total += amount

RESIDUAL_ARCS(vertex):
  for each outgoing edge with capacity > flow:
    offer a forward arc of capacity (capacity - flow)
  for each incoming edge with flow > 0:
    offer a reverse arc of capacity flow

// All capacities, bottlenecks, and flow sums use exact integers.`
}
