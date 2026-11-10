// Static listings for graph algorithms.
export class WeightedGraphPseudocode {
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

  public static readonly shortestPath = `DIJKSTRA(source, target):
  validate both vertices
  distance[v] = infinity and predecessor[v] = none for all vertices
  distance[source] = 0
  unsettled = all vertices
  while unsettled is not empty:
    u = unsettled vertex with smallest known distance
    if distance[u] is infinity: break
    remove u from unsettled
    if u == target: break
    for each stored edge from u to v:
      candidate = distance[u] + weight(u, v)   // exact integer sum
      if v is unsettled and candidate < distance[v]:
        distance[v] = candidate
        predecessor[v] = u
  if distance[target] is infinity: return unreachable
  follow predecessor links from target back to source
  reverse that sequence and return it with distance[target]`
}
