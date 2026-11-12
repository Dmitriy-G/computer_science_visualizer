export class ArraySortingPseudocode {
  public static readonly americanFlagSort = `// FixedArray: AmericanFlagSort

FixedArray.americanFlagSort() {
  new AmericanFlagArraySort(this.items).sort()
}

AmericanFlagArraySort.sort() {
  if (this.entries.length < 2): return
  { minimum, maximum } = this.bounds()
  if (minimum == maximum) {
    return
  }
  place = 1n
  while ((maximum - minimum) / place >= 16n)
    place *= 16n
  this.sortRange(0, this.entries.length, minimum, place)
}

AmericanFlagArraySort.bounds(start = 0, end = this.entries.length) {
  minimum = BigInt(this.entries[start].value)
  maximum = minimum
  maximumIndex = start
  ordered = true
  for (index = start + 1; index < end; index += 1) {
    value = BigInt(this.entries[index].value)
    if (value < minimum): minimum = value
    if (value > maximum) {
      maximum = value
      maximumIndex = index
    }
    if (this.entries[index - 1].value > this.entries[index].value): ordered = false
  }
  return { minimum, maximum, maximumIndex, ordered }
}

AmericanFlagArraySort.sortRange(start, end, minimum, place) {
  if (end - start < 2 || place == 0n): return
  this.cells = []
  boundaries = this.distribute(start, end, 16, (entry) => Number(((BigInt(entry.value) - minimum) / place) % 16n))
  for (bin = 0; bin < 16; bin += 1)
    this.sortRange(boundaries[bin], boundaries[bin + 1], minimum, place / 16n)
}

AmericanFlagArraySort.swap(first, second, frame = {}) {
  if (first == second): return
  temporary = this.entries[first]
  this.entries[first] = this.entries[second]
  this.entries[second] = temporary
}`

  public static readonly binaryInsertionSort = `// FixedArray: BinaryInsertionSort

FixedArray.binaryInsertionSort() {
  this.insertSortedPrefix(true)
}

FixedArray.getAt(index) {
  if (!Number.isInteger(index) || index < 0 || index >= this.length)
    throw new RangeError('Index is outside the array')
  return { ...this.items[index] }
}

FixedArray.insertSortedPrefix(binary) {
  for (index = 1; index < this.length; index += 1) {
    held = this.items[index]
    position = index
    if (binary) {
      low = 0
      high = index
      while (low < high) {
        middle = low + Math.floor((high - low) / 2)
        if (held.value < this.items[middle].value): high = middle
        else: low = middle + 1
      }
      position = low
    }
    else {
      while (position > 0) {
        if (this.items[position - 1].value <= held.value): break
        position -= 1
      }
    }
    for (hole = index; hole > position; hole -= 1) {
      this.items[hole] = this.items[hole - 1]
    }
    this.items[position] = held
  }
}

get FixedArray.length() {
  return this.items.length
}`

  public static readonly bitonicSort = `// FixedArray: BitonicSort

FixedArray.bitonicSort() {
  new BitonicArraySort(this.items).sort()
}

BitonicArraySort.sort() {
  this.sortRange(0, this.entries.length, true)
}

BitonicArraySort.sortRange(start, count, ascending) {
  if (count < 2): return
  half = Math.floor(count / 2)
  this.sortRange(start, half, !ascending)
  this.sortRange(start + half, count - half, ascending)
  this.merge(start, count, ascending)
}

BitonicArraySort.merge(start, count, ascending) {
  if (count < 2): return
  distance = 1
  while (2 * distance < count)
    distance *= 2
  for (index = start; index < start + count - distance; index += 1)
    this.compareExchange(index, index + distance, ascending)
  this.merge(start, distance, ascending)
  this.merge(start + distance, count - distance, ascending)
}

BitonicArraySort.compareExchange(first, second, ascending = true) {
  if (second >= this.entries.length): return false
  frame = { comparator: { first, second, ascending }, roles: { [first]: ascending ? 'LOW' : 'HIGH', [second]: ascending ? 'HIGH' : 'LOW' } }
  order = this.compare(first, second, frame)
  if (ascending ? order <= 0 : order >= 0): return false
  this.swap(first, second, frame)
  return true
}

BitonicArraySort.compare(first, second, frame = {}) {
  a = this.entries[first].value
  b = this.entries[second].value
  return a < b ? -1 : a > b ? 1 : 0
}

BitonicArraySort.swap(first, second, frame = {}) {
  if (first == second): return
  temporary = this.entries[first]
  this.entries[first] = this.entries[second]
  this.entries[second] = temporary
}`

  public static readonly blockMergeSort = `BLOCK_MERGE_SORT(A):
  if A is already ordered: return
  blockSize = ceil(sqrt(length(A)))
  split A into consecutive blocks of at most blockSize entries
  for each block:
    stably sort it by bottom-up buffered merging
  heap = min-heap of the first entry of each nonempty block
  compare heap entries by (key, original block index)
  output = []
  while heap is not empty:
    entry, block = extract_min(heap)
    append entry to output
    if block has another entry:
      insert its next entry into heap
  copy output back into A`

  public static readonly bogoSort = `// FixedArray: BogoSort

FixedArray.maximumBogoShuffles = 24

FixedArray.bogoSort() {
  return new BogoArraySort(this.items).sort(FixedArray.maximumBogoShuffles)
}

BogoArraySort.sort(attempts) {
  if (this.ordered()): return true
  original = [...this.entries]
  for (attempt = 1; attempt <= attempts; attempt += 1) {
    for (index = this.entries.length - 1; index > 0; index -= 1) {
      this.seed ^= this.seed << 13
      this.seed ^= this.seed >>> 17
      this.seed ^= this.seed << 5
      other = (this.seed >>> 0) % (index + 1)
      entry = this.entries[index]
      this.entries[index] = this.entries[other]
      this.entries[other] = entry
    }
    if (this.ordered()): return true
  }
  for (index = 0; index < this.entries.length; index += 1)
    this.entries[index] = original[index]
  return false
}

BogoArraySort.constructor(entries) {
  this.seed = rame, Array
  this.entries = entries
}

BogoArraySort.ordered() {
  for (index = 1; index < this.entries.length; index += 1) {
    if (this.entries[index - 1].value > this.entries[index].value) {
      return false
    }
  }
  return true
}`

  public static readonly bubbleSorting = `// FixedArray: BubbleSorting

FixedArray.bubbleSort() {
  for (end = this.length - 1; end > 0; end -= 1) {
    swapped = false
    for (index = 0; index < end; index += 1) {
      if (this.items[index].value > this.items[index + 1].value) {
        temporary = this.items[index]
        this.items[index] = this.items[index + 1]
        this.items[index + 1] = temporary
        swapped = true
      }
    }
    if (!swapped): break
  }
}

get FixedArray.length() {
  return this.items.length
}`

  public static readonly bucketSort = `// FixedArray: BucketSort

FixedArray.bucketSort() {
  if (this.length < 2): return
  { minimum, maximum } = this.sortBounds()
  span = maximum - minimum + 1n
  bucketCount = this.length
  buckets = []
  for (bucket = 0; bucket < bucketCount; bucket += 1)
    buckets.push([])
  for (index = 0; index < this.length; index += 1) {
    entry = this.items[index]
    bucket = Number(((BigInt(entry.value) - minimum) * BigInt(bucketCount)) / span)
    buckets[bucket].push(entry)
  }
  for (bucket = 0; bucket < buckets.length; bucket += 1) {
    for (index = 1; index < buckets[bucket].length; index += 1) {
      for (position = index; position > 0; position -= 1) {
        first = buckets[bucket][position - 1]
        second = buckets[bucket][position]
        if (first.value <= second.value): break
        buckets[bucket][position - 1] = second
        buckets[bucket][position] = first
      }
    }
  }
  destination = 0
  for (bucket of buckets) {
    for (entry of bucket)
      this.items[destination++] = entry
  }
}

FixedArray.getAt(index) {
  if (!Number.isInteger(index) || index < 0 || index >= this.length)
    throw new RangeError('Index is outside the array')
  return { ...this.items[index] }
}

FixedArray.sortBounds() {
  minimum = BigInt(this.items[0].value)
  maximum = minimum
  for (index = 1; index < this.length; index += 1) {
    value = BigInt(this.items[index].value)
    if (value < minimum): minimum = value
    if (value > maximum): maximum = value
  }
  return { minimum, maximum }
}`

  public static readonly burstsort = `BURSTSORT(A):
  if length(A) < 2: return
  minimum = min key; maximum = max key
  width = hexadecimal digit count of (maximum - minimum)
  encode each entry as zero-padded hex(key - minimum, width)
  root = empty prefix container
  for entry in A: INSERT(root, entry, depth=0)
  output = []
  traverse trie children in hexadecimal digit order:
    at a nonterminal leaf, stably insertion-sort by remaining suffix
    append all leaf entries to output
  copy output back into A

INSERT(container, entry, depth):
  if container is already a trie node:
    INSERT(child for entry.digit[depth], entry, depth + 1)
    return
  append entry to container
  if size(container) <= 3 or depth == width: return
  replace container with a trie node
  redistribute its entries to children by digit[depth]
  recursively burst children that exceed the leaf capacity`

  public static readonly cocktailShakerSort = `// FixedArray: CocktailShakerSort

FixedArray.cocktailShakerSort() {
  new CocktailShakerArraySort(this.items).sort()
}

CocktailShakerArraySort.sort() {
  left = 0
  right = this.entries.length - 1
  while (left < right) {
    swapped = false
    for (index = left; index < right; index += 1) {
      frame = { sortedPrefix: left, sortedFrom: right + 1 }
      if (this.compare(index, index + 1, frame) <= 0): continue
      this.swap(index, index + 1, frame)
      swapped = true
    }
    right -= 1
    complete = !swapped || left >= right
    if (complete): return
    swapped = false
    for (index = right; index > left; index -= 1) {
      frame = { sortedPrefix: left, sortedFrom: right + 1 }
      if (this.compare(index - 1, index, frame) <= 0): continue
      this.swap(index - 1, index, frame)
      swapped = true
    }
    left += 1
    if (!swapped): return
  }
}

CocktailShakerArraySort.constructor(entries) {
  this.entries = entries
}

CocktailShakerArraySort.compare(first, second, frame = {}) {
  a = this.entries[first].value
  b = this.entries[second].value
  return a < b ? -1 : a > b ? 1 : 0
}

CocktailShakerArraySort.swap(first, second, frame = {}) {
  if (first == second): return
  temporary = this.entries[first]
  this.entries[first] = this.entries[second]
  this.entries[second] = temporary
}`

  public static readonly combSort = `// FixedArray: CombSort

FixedArray.combSort() {
  new CombArraySort(this.items).sort()
}

CombArraySort.sort() {
  length = this.entries.length
  if (length < 2): return
  gap = length
  swapped = true
  while (gap > 1 || swapped) {
    gap = Math.max(1, Math.floor(gap * 10 / 13))
    swapped = false
    this.observer?.({ kind: 'gap', index: 0, amount: gap, label: 'Shrink the comparison gap', detail: \`Compare entries \${gap} slots apart. Continue shrinking even after a pass without swaps, until gap 1 also has a clean pass.\`, frame: {} })
    for (index = 0; index + gap < length; index += 1) {
      other = index + gap
      frame = { roles: { [index]: 'GAP LEFT', [other]: 'GAP RIGHT' } }
      if (this.compare(index, other, frame) <= 0): continue
      this.swap(index, other, frame)
      swapped = true
    }
    complete = gap == 1 && !swapped
  }
}

CombArraySort.constructor(entries) {
  this.entries = entries
}

CombArraySort.compare(first, second, frame = {}) {
  a = this.entries[first].value
  b = this.entries[second].value
  return a < b ? -1 : a > b ? 1 : 0
}

CombArraySort.swap(first, second, frame = {}) {
  if (first == second): return
  temporary = this.entries[first]
  this.entries[first] = this.entries[second]
  this.entries[second] = temporary
}`

  public static readonly countingSort = `// FixedArray: CountingSort

FixedArray.maximumCountingRange = 4096

FixedArray.countingSort() {
  if (this.length < 2): return true
  { minimum, maximum } = this.sortBounds()
  span = maximum - minimum + 1n
  if (span > BigInt(FixedArray.maximumCountingRange)) {
    return false
  }
  range = Number(span)
  counts = new Array(range).fill(0)
  for (index = 0; index < this.length; index += 1) {
    key = Number(BigInt(this.items[index].value) - minimum)
    counts[key] += 1
  }
  next = new Array(range).fill(0)
  position = 0
  for (key = 0; key < range; key += 1) {
    next[key] = position
    position += counts[key]
  }
  output = new Array(this.length).fill(null)
  for (index = 0; index < this.length; index += 1) {
    entry = this.items[index]
    key = Number(BigInt(entry.value) - minimum)
    destination = next[key]++
    output[destination] = entry
  }
  for (index = 0; index < this.length; index += 1)
    this.items[index] = output[index]
  return true
}

get FixedArray.length() {
  return this.items.length
}

FixedArray.sortBounds() {
  minimum = BigInt(this.items[0].value)
  maximum = minimum
  for (index = 1; index < this.length; index += 1) {
    value = BigInt(this.items[index].value)
    if (value < minimum): minimum = value
    if (value > maximum): maximum = value
  }
  return { minimum, maximum }
}`

  public static readonly cycleSort = `// FixedArray: CycleSort

FixedArray.cycleSort() {
  new CycleArraySort(this.items).sort()
}

CycleArraySort.sort() {
  for (start = 0; start < this.entries.length - 1; start += 1) {
    held = this.entries[start]
    position = this.rank(held, start, false)
    if (position == start) {
      continue
    }
    while (true) {
      while (this.entries[position].value == held.value) {
        position += 1
      }
      placed = held
      held = this.entries[position]
      this.entries[position] = placed
      closed = position == start
      frame = closed
        ? { sortedPrefix: start + 1, roles: { [start]: 'CYCLE CLOSED' } }
        : { held, hole: start, sortedPrefix: start, roles: { [position]: 'WRITE' } }
      if (closed): break
      position = this.rank(held, start, true)
    }
  }
}

CycleArraySort.constructor(entries) {
  this.entries = entries
}

CycleArraySort.rank(held, start, lifted) {
  position = start
  for (index = start + 1; index < this.entries.length; index += 1) {
    frame = lifted
      ? { held, hole: start, sortedPrefix: start, activeIndices: [index] }
      : { sortedPrefix: start, activeIndices: [start, index], roles: { [start]: 'CYCLE START' } }
    if (this.entries[index].value < held.value): position += 1
  }
  return position
}`

  public static readonly dualPivotQuickSort = `// FixedArray: DualPivotQuickSort

FixedArray.dualPivotQuickSort() {
  new HybridArraySort(this.items).dualPivotQuickSort()
}

HybridArraySort.dualPivotQuickSort() {
  this.dualPivotRange(0, this.entries.length)
}

HybridArraySort.dualPivotRange(start, end) {
  while (end - start > 3) {
    if (this.compare(start, end - 1) > 0): this.swap(start, end - 1)
    lower = this.entries[start].value
    upper = this.entries[end - 1].value
    left = start + 1
    right = end - 2
    for (index = left; index <= right; index += 1) {
      if (this.compare(index, start) < 0): this.swap(index, left++)
      else if (this.compare(index, end - 1) > 0) {
        while (index < right && this.compare(right, end - 1) > 0)
          right -= 1
        this.swap(index, right--)
        if (this.compare(index, start) < 0): this.swap(index, left++)
      }
    }
    left -= 1
    right += 1
    this.swap(start, left)
    this.swap(end - 1, right)
    ranges = [{ start, end: left }, { start: left + 1, end: lower == upper ? left + 1 : right }, { start: right + 1, end }]
    largest = 0
    for (index = 1; index < ranges.length; index += 1) {
      if (ranges[index].end - ranges[index].start > ranges[largest].end - ranges[largest].start)
        largest = index
    }
    for (index = 0; index < ranges.length; index += 1) {
      if (index != largest): this.dualPivotRange(ranges[index].start, ranges[index].end)
    }
    start = ranges[largest].start
    end = ranges[largest].end
  }
  this.insertion(start, end)
}

HybridArraySort.compare(first, second) {
  a = this.entries[first].value
  b = this.entries[second].value
  return a < b ? -1 : a > b ? 1 : 0
}`

  public static readonly externalMergeSort = `EXTERNAL_MERGE_SORT(A):
  input = two empty virtual tapes
  output = two empty virtual tapes
  for each consecutive chunk of up to 3 entries:
    stably sort the chunk in memory
    write the sorted run to alternating input tapes
  while total run count > 1:
    repeatedly take the next run from each input tape
    stably merge the pair, or copy an unpaired run
    write each resulting run to alternating output tapes
    swap the input and output tape pairs; clear the new outputs
  load the sole remaining run back into A

MERGE(run1, run2):
  compare the two current records, choosing run1 on ties
  output the smaller record and advance its run
  copy the remaining records after one run is exhausted`

  public static readonly flashsort = `FLASHSORT(A):
  if length(A) < 2: return
  find minimum, maximum, and index of maximum
  if minimum == maximum: return
  classes = max(2, floor(0.43 * length(A)))
  CLASS(key) = floor((key - minimum) * (classes - 1) / (maximum - minimum))
  count entries in each class, then prefix-sum exclusive class ends
  move maximum entry to first slot
  for each unfilled cycle start:
    hold the entry from that slot
    repeat:
      class = CLASS(held.key)
      destination = --classEnd[class]
      swap held entry with A[destination]
    until the cycle returns to its start
  finish by adjacent insertion exchanges`

  public static readonly gnomeSort = `// FixedArray: GnomeSort

FixedArray.gnomeSort() {
  new GnomeArraySort(this.items).sort()
}

GnomeArraySort.sort() {
  position = 1
  while (position < this.entries.length) {
    if (position == 0) {
      position = 1
      continue
    }
    if (this.compare(position - 1, position) <= 0) {
      position += 1
    }
    else {
      this.swap(position - 1, position)
      position -= 1
    }
  }
}

GnomeArraySort.constructor(entries) {
  this.entries = entries
}

GnomeArraySort.compare(first, second, frame = {}) {
  a = this.entries[first].value
  b = this.entries[second].value
  return a < b ? -1 : a > b ? 1 : 0
}

GnomeArraySort.swap(first, second, frame = {}) {
  if (first == second): return
  temporary = this.entries[first]
  this.entries[first] = this.entries[second]
  this.entries[second] = temporary
}`

  public static readonly heapSort = `// FixedArray: HeapSort

FixedArray.heapSort() {
  if (this.length < 2): return
  for (parent = Math.floor(this.length / 2) - 1; parent >= 0; parent -= 1) {
    this.siftSortHeap(parent, this.length)
  }
  for (end = this.length - 1; end > 0; end -= 1) {
    this.swapEntries(0, end)
    this.siftSortHeap(0, end)
  }
}

FixedArray.getAt(index) {
  if (!Number.isInteger(index) || index < 0 || index >= this.length)
    throw new RangeError('Index is outside the array')
  return { ...this.items[index] }
}

get FixedArray.length() {
  return this.items.length
}

FixedArray.siftSortHeap(start, size) {
  parent = start
  while (2 * parent + 1 < size) {
    child = 2 * parent + 1
    if (child + 1 < size) {
      if (this.items[child].value < this.items[child + 1].value): child += 1
    }
    if (this.items[parent].value >= this.items[child].value): break
    this.swapEntries(parent, child)
    parent = child
  }
}

FixedArray.swapEntries(first, second) {
  temporary = this.items[first]
  this.items[first] = this.items[second]
  this.items[second] = temporary
}`

  public static readonly insertionSort = `// FixedArray: InsertionSort

FixedArray.insertionSort() {
  this.insertSortedPrefix(false)
}

FixedArray.getAt(index) {
  if (!Number.isInteger(index) || index < 0 || index >= this.length)
    throw new RangeError('Index is outside the array')
  return { ...this.items[index] }
}

FixedArray.insertSortedPrefix(binary) {
  for (index = 1; index < this.length; index += 1) {
    held = this.items[index]
    position = index
    if (binary) {
      low = 0
      high = index
      while (low < high) {
        middle = low + Math.floor((high - low) / 2)
        if (held.value < this.items[middle].value): high = middle
        else: low = middle + 1
      }
      position = low
    }
    else {
      while (position > 0) {
        if (this.items[position - 1].value <= held.value): break
        position -= 1
      }
    }
    for (hole = index; hole > position; hole -= 1) {
      this.items[hole] = this.items[hole - 1]
    }
    this.items[position] = held
  }
}

get FixedArray.length() {
  return this.items.length
}`

  public static readonly interpolationSort = `// FixedArray: InterpolationSort

FixedArray.interpolationSort() {
  new InterpolationArraySort(this.items).sort()
}

InterpolationArraySort.sort() {
  if (this.entries.length < 2): return
  { minimum, maximum } = this.bounds()
  if (minimum == maximum) {
    return
  }
  count = this.entries.length
  address = (value) => Number((BigInt(value) - minimum) * BigInt(count - 1) / (maximum - minimum))
  this.cells = new Array(count).fill(0)
  for (index = 0; index < count; index += 1) {
    bin = address(this.entries[index].value)
    this.cells[bin] += 1
  }
  total = 0
  for (bin = 0; bin < count; bin += 1) {
    size = this.cells[bin]
    this.cells[bin] = total
    total += size
  }
  output = new Array(count).fill(null)
  for (index = 0; index < count; index += 1) {
    entry = this.entries[index]
    bin = address(entry.value)
    destination = this.cells[bin]++
    output[destination] = entry
  }
  for (index = 0; index < count; index += 1)
    this.entries[index] = output[index]
  this.cells = []
  this.insertion(0, count)
}

InterpolationArraySort.insertion(start, end) {
  for (index = start + 1; index < end; index += 1) {
    for (position = index; position > start; position -= 1) {
      if (this.compare(position - 1, position, undefined) <= 0): break
      this.swap(position - 1, position, undefined)
    }
  }
}`

  public static readonly introSort = `INTROSORT(A):
  SORT(0, length(A), 2 * floor(log2(length(A))))

SORT(lo, hi, depth):
  while hi - lo > 4:
    if depth == 0:
      heap-sort A[lo:hi] and return
    depth -= 1
    pivot = median of first, middle, and last keys in A[lo:hi]
    split = partition around pivot
    recursively SORT the smaller partition with the reduced depth
    continue the loop on the larger partition
  insertion-sort A[lo:hi]`

  public static readonly librarySort = `LIBRARY_SORT(A):
  if A is already ordered: return
  shelf = 2 * length(A) + 1 empty slots
  target = 1
  for each entry in original order:
    if insertedCount reaches the current round target:
      evenly redistribute the entries already on the shelf
      double the round target
    position = upper bound of entry.key among occupied slots
    find a nearby gap
    shift intervening entries toward that gap
    place entry after all previously inserted equal keys
  gather occupied shelf slots in order back into A`

  public static readonly mergeSort = `// FixedArray: MergeSort

FixedArray.mergeSort() {
  buffer = new Array(this.length)
  this.mergeRange(0, this.length - 1, buffer)
}

FixedArray.getAt(index) {
  if (!Number.isInteger(index) || index < 0 || index >= this.length)
    throw new RangeError('Index is outside the array')
  return { ...this.items[index] }
}

get FixedArray.length() {
  return this.items.length
}

FixedArray.mergeRange(left, right, buffer) {
  if (left >= right): return
  middle = left + Math.floor((right - left) / 2)
  this.mergeRange(left, middle, buffer)
  this.mergeRange(middle + 1, right, buffer)
  for (index = left; index <= right; index += 1)
    buffer[index] = this.items[index]
  snapshot = onStep ? buffer.slice(left, right + 1) : undefined
  first = left
  second = middle + 1
  for (destination = left; destination <= right; destination += 1) {
    source
    if (second > right || first <= middle && buffer[first].value <= buffer[second].value)
      source = first++
    else: source = second++
    this.items[destination] = buffer[source]
  }
}`

  public static readonly naturalMergeSort = `// FixedArray: NaturalMergeSort

FixedArray.naturalMergeSort() {
  new NaturalMergeArraySort(this.items).sort()
}

NaturalMergeArraySort.sort() {
  if (this.entries.length < 2): return
  runs = []
  start = 0
  while (start < this.entries.length) {
    end = start + 1
    descending = false
    if (end < this.entries.length) {
      descending = this.compare(start, end, this.context()) > 0
      end += 1
      while (end < this.entries.length) {
        order = this.compare(end - 1, end, this.context())
        if (descending ? order <= 0 : order > 0): break
        end += 1
      }
    }
    if (descending) {
      for (first = start, last = end - 1; first < last; first += 1, last -= 1)
        this.swap(first, last, this.context())
    }
    runs.push({ start, end })
    this.updateVisual(runs)
    start = end
  }
  while (runs.length > 1) {
    next = []
    for (index = 0; index < runs.length; index += 2) {
      first = runs[index]
      second = runs[index + 1]
      if (second): this.mergeRange(first.start, first.end, second.end)
      next.push({ start: first.start, end: second?.end ?? first.end })
      if (this.observer) {
        visible = [...next, ...runs.slice(index + 2)]
        this.updateVisual(visible)
      }
    }
    runs = next
  }
}

NaturalMergeArraySort.context() {
  return { storage: this.visualRuns }
}`

  public static readonly oddEvenMergeSort = `// FixedArray: OddEvenMergeSort

FixedArray.oddEvenMergeSort() {
  new OddEvenMergeArraySort(this.items).sort()
}

OddEvenMergeArraySort.sort() {
  if (this.entries.length < 2): return
  this.sortRange(0, this.networkWidth())
}

OddEvenMergeArraySort.sortRange(start, count) {
  if (count < 2 || start >= this.entries.length): return
  half = count / 2
  this.sortRange(start, half)
  this.sortRange(start + half, half)
  this.merge(start, count, 1)
}

OddEvenMergeArraySort.networkWidth() {
  width = 1
  while (width < this.entries.length)
    width *= 2
  return width
}

OddEvenMergeArraySort.merge(start, count, stride) {
  if (start >= this.entries.length): return
  doubled = 2 * stride
  if (doubled < count) {
    this.merge(start, count, doubled)
    this.merge(start + stride, count, doubled)
    for (index = start + stride; index + stride < start + count; index += doubled)
      this.compareExchange(index, index + stride)
  }
  else: this.compareExchange(start, start + stride)
}

OddEvenMergeArraySort.compareExchange(first, second, ascending = true) {
  if (second >= this.entries.length): return false
  frame = { comparator: { first, second, ascending }, roles: { [first]: ascending ? 'LOW' : 'HIGH', [second]: ascending ? 'HIGH' : 'LOW' } }
  order = this.compare(first, second, frame)
  if (ascending ? order <= 0 : order >= 0): return false
  this.swap(first, second, frame)
  return true
}`

  public static readonly oddEvenSort = `// FixedArray: OddEvenSort

FixedArray.oddEvenSort() {
  new OddEvenArraySort(this.items).sort()
}

OddEvenArraySort.sort() {
  if (this.entries.length < 2): return
  swapped = true
  while (swapped) {
    swapped = false
    for (parity = 0; parity < 2; parity += 1) {
      for (index = parity; index + 1 < this.entries.length; index += 2) {
        if (this.compareExchange(index, index + 1)): swapped = true
      }
    }
  }
}

OddEvenArraySort.constructor(entries) {
  this.entries = entries
}

OddEvenArraySort.compareExchange(first, second, ascending = true) {
  if (second >= this.entries.length): return false
  frame = { comparator: { first, second, ascending }, roles: { [first]: ascending ? 'LOW' : 'HIGH', [second]: ascending ? 'HIGH' : 'LOW' } }
  order = this.compare(first, second, frame)
  if (ascending ? order <= 0 : order >= 0): return false
  this.swap(first, second, frame)
  return true
}

OddEvenArraySort.compare(first, second, frame = {}) {
  a = this.entries[first].value
  b = this.entries[second].value
  return a < b ? -1 : a > b ? 1 : 0
}

OddEvenArraySort.swap(first, second, frame = {}) {
  if (first == second): return
  temporary = this.entries[first]
  this.entries[first] = this.entries[second]
  this.entries[second] = temporary
}`

  public static readonly pairwiseSortingNetwork = `// FixedArray: PairwiseSortingNetwork

FixedArray.pairwiseSortingNetwork() {
  new PairwiseNetworkArraySort(this.items).sort()
}

PairwiseNetworkArraySort.sort() {
  if (this.entries.length < 2): return
  this.sortPairs(0, this.networkWidth(), 1)
}

PairwiseNetworkArraySort.sortPairs(start, count, stride) {
  if (count < 2 || start >= this.entries.length): return
  for (pair = 0; pair < count / 2; pair += 1) {
    first = start + 2 * pair * stride
    this.compareExchange(first, first + stride)
  }
  this.sortPairs(start, count / 2, 2 * stride)
  this.sortPairs(start + stride, count / 2, 2 * stride)
  for (distance = count / 4; distance >= 1; distance /= 2) {
    for (pair = 0; pair < count / 2 - distance; pair += 1) {
      this.compareExchange(start + (2 * pair + 1) * stride, start + 2 * (pair + distance) * stride)
    }
  }
}

PairwiseNetworkArraySort.networkWidth() {
  width = 1
  while (width < this.entries.length)
    width *= 2
  return width
}

PairwiseNetworkArraySort.compareExchange(first, second, ascending = true) {
  if (second >= this.entries.length): return false
  frame = { comparator: { first, second, ascending }, roles: { [first]: ascending ? 'LOW' : 'HIGH', [second]: ascending ? 'HIGH' : 'LOW' } }
  order = this.compare(first, second, frame)
  if (ascending ? order <= 0 : order >= 0): return false
  this.swap(first, second, frame)
  return true
}

PairwiseNetworkArraySort.compare(first, second, frame = {}) {
  a = this.entries[first].value
  b = this.entries[second].value
  return a < b ? -1 : a > b ? 1 : 0
}`

  public static readonly pancakeSort = `// FixedArray: PancakeSort

FixedArray.pancakeSort() {
  new PancakeArraySort(this.items).sort()
}

PancakeArraySort.sort() {
  if (this.entries.length < 2): return
  ordered = true
  for (index = 1; index < this.entries.length; index += 1) {
    if (this.entries[index - 1].value > this.entries[index].value): ordered = false
  }
  if (ordered) {
    return
  }
  for (end = this.entries.length - 1; end > 0; end -= 1) {
    maximum = 0
    for (index = 1; index <= end; index += 1) {
      if (this.compare(maximum, index, { sortedFrom: end + 1, roles: { [maximum]: 'MAXIMUM' } }) < 0)
        maximum = index
    }
    if (maximum != end) {
      if (maximum > 0): this.flip(maximum, end)
      this.flip(end, end)
    }
  }
}

PancakeArraySort.constructor(entries) {
  this.entries = entries
}

PancakeArraySort.compare(first, second, frame = {}) {
  a = this.entries[first].value
  b = this.entries[second].value
  return a < b ? -1 : a > b ? 1 : 0
}

PancakeArraySort.flip(last, end) {
  for (first = 0; first < last; first += 1, last -= 1)
    this.swap(first, last, { sortedFrom: end + 1 })
}

PancakeArraySort.swap(first, second, frame = {}) {
  if (first == second): return
  temporary = this.entries[first]
  this.entries[first] = this.entries[second]
  this.entries[second] = temporary
}`

  public static readonly parallelMergeSort = `PARALLEL_MERGE_SORT(A):
  create a task to sort the full range
  dispatch ready tasks deterministically on two virtual workers
  for each sort task over A[lo:hi]:
    if hi - lo <= 1: mark complete
    else:
      mid = floor((lo + hi) / 2)
      fork sort tasks for [lo, mid) and [mid, hi)
      make the parent merge depend on both child tasks
  when both child tasks are complete:
    stably merge their ranges through a buffer
    mark the parent complete
  return when the root task completes

// The two workers are simulated; actual execution is sequential.`

  public static readonly parallelQuickSort = `PARALLEL_QUICKSORT(A):
  create a task for the full range
  dispatch ready tasks deterministically on two virtual workers
  for each task over A[lo:hi]:
    if hi - lo <= 1: mark complete; continue
    pivot = key in the middle slot
    partition into disjoint less, equal, and greater ranges
    the equal range is finished
    schedule independent tasks for the nontrivial less/greater ranges
    mark the parent complete after its children complete
  return when the root task completes`

  public static readonly patienceSort = `// FixedArray: PatienceSort

FixedArray.patienceSort() {
  new PatienceArraySort(this.items).sort()
}

PatienceArraySort.sort() {
  if (this.entries.length < 2): return
  piles = []
  for (index = 0; index < this.entries.length; index += 1) {
    entry = this.entries[index]
    low = 0
    high = piles.length
    while (low < high) {
      middle = low + Math.floor((high - low) / 2)
      top = piles[middle][piles[middle].length - 1]
      if (top.value < entry.value): low = middle + 1
      else: high = middle
    }
    if (low == piles.length): piles.push([])
    piles[low].push(entry)
  }
  heap = []
  for (pile = 0; pile < piles.length; pile += 1)
    heap.push(pile)
  for (parent = Math.floor(heap.length / 2) - 1; parent >= 0; parent -= 1)
    this.sift(heap, parent, piles)
  output = new Array(this.entries.length).fill(null)
  for (destination = 0; heap.length; destination += 1) {
    pile = heap[0]
    output[destination] = piles[pile].pop()
    if (!piles[pile].length) {
      last = heap.pop()
      if (heap.length): heap[0] = last
    }
    this.sift(heap, 0, piles, output)
  }
  for (index = 0; index < this.entries.length; index += 1)
    this.entries[index] = output[index]
}

PatienceArraySort.before(first, second, piles, output) {
  a = piles[first][piles[first].length - 1]
  b = piles[second][piles[second].length - 1]
  return a.value < b.value || a.value == b.value && first < second
}`

  public static readonly pigeonholeSort = `// FixedArray: PigeonholeSort

FixedArray.maximumPigeonholeRange = 4096

FixedArray.pigeonholeSort() {
  return new PigeonholeArraySort(this.items).sort(FixedArray.maximumPigeonholeRange)
}

PigeonholeArraySort.sort(maximumRange) {
  if (this.entries.length < 2): return true
  this.minimum = BigInt(this.entries[0].value)
  maximum = this.minimum
  for (entry of this.entries) {
    key = BigInt(entry.value)
    if (key < this.minimum): this.minimum = key
    if (key > maximum): maximum = key
  }
  range = maximum - this.minimum + 1n
  if (range > BigInt(maximumRange)) {
    return false
  }
  for (index = 0; index < Number(range); index += 1)
    this.holes.push([])
  for (index = 0; index < this.entries.length; index += 1) {
    entry = this.entries[index]
    hole = Number(BigInt(entry.value) - this.minimum)
    this.holes[hole].push(entry)
  }
  this.output = new Array(this.entries.length).fill(null)
  destination = 0
  for (hole = 0; hole < this.holes.length; hole += 1) {
    for (entry of this.holes[hole]) {
      this.output[destination] = entry
      destination += 1
    }
  }
  for (index = 0; index < this.entries.length; index += 1)
    this.entries[index] = this.output[index]
  return true
}

PigeonholeArraySort.constructor(entries) {
  this.holes = []
  this.minimum = 0n
  this.output = []
  this.entries = entries
}`

  public static readonly polyphaseMergeSort = `POLYPHASE_MERGE_SORT(A):
  make stable sorted runs from consecutive chunks of up to 3 entries
  choose consecutive Fibonacci quotas that fit the run count
  fill two virtual input tapes to those quotas with runs and dummy runs
  output = third empty tape
  while more than one run remains:
    while both input tapes have a run:
      a = consume next run from first tape
      b = consume next run from second tape
      if a and b are dummy: append a dummy to output
      else if one is dummy: append the other without record copying
      else: merge by head keys using input tape order for ties
    if a single real run remains: break
    rotate the exhausted input tape into the output role
    keep the runs already written to the former output tape
  load the final real run back into A`

  public static readonly quickSort = `// FixedArray: QuickSort

FixedArray.quickSort() {
  this.quickSortRange(0, this.length - 1)
}

FixedArray.getAt(index) {
  if (!Number.isInteger(index) || index < 0 || index >= this.length)
    throw new RangeError('Index is outside the array')
  return { ...this.items[index] }
}

FixedArray.quickSortRange(left, right) {
  if (left > right): return
  if (left == right) {
    return
  }
  pivot = this.items[right].value
  boundary = left
  for (index = left; index < right; index += 1) {
    if (this.items[index].value <= pivot) {
      if (boundary != index) {
        this.swapEntries(boundary, index)
      }
      boundary += 1
    }
  }
  if (boundary != right) {
    this.swapEntries(boundary, right)
  }
  this.quickSortRange(left, boundary - 1)
  this.quickSortRange(boundary + 1, right)
}

get FixedArray.length() {
  return this.items.length
}

FixedArray.swapEntries(first, second) {
  temporary = this.items[first]
  this.items[first] = this.items[second]
  this.items[second] = temporary
}`

  public static readonly radixSort = `// FixedArray: RadixSort

FixedArray.radixSort() {
  if (this.length < 2): return
  { minimum, maximum } = this.sortBounds()
  largestKey = maximum - minimum
  for (place = 1n; place == 1n || place <= largestKey; place *= 10n) {
    buckets = []
    for (digit = 0; digit < 10; digit += 1)
      buckets.push([])
    for (index = 0; index < this.length; index += 1) {
      entry = this.items[index]
      digit = Number(((BigInt(entry.value) - minimum) / place) % 10n)
      buckets[digit].push(entry)
    }
    destination = 0
    for (bucket of buckets) {
      for (entry of bucket)
        this.items[destination++] = entry
    }
  }
}

FixedArray.getAt(index) {
  if (!Number.isInteger(index) || index < 0 || index >= this.length)
    throw new RangeError('Index is outside the array')
  return { ...this.items[index] }
}

get FixedArray.length() {
  return this.items.length
}

FixedArray.sortBounds() {
  minimum = BigInt(this.items[0].value)
  maximum = minimum
  for (index = 1; index < this.length; index += 1) {
    value = BigInt(this.items[index].value)
    if (value < minimum): minimum = value
    if (value > maximum): maximum = value
  }
  return { minimum, maximum }
}`

  public static readonly sampleSort = `SAMPLE_SORT(A):
  if length(A) < 2: return
  choose 2 to 4 buckets and at most 7 regularly spaced samples
  stably sort the sample and pick sample quantiles as splitters
  for entry in A, in arrival order:
    bucket = upper_bound(splitters, entry.key)
    append entry to bucket
  for bucket in order:
    stably sort it by bottom-up merge passes
  concatenate the ordered buckets into output
  copy output back into A`

  public static readonly selectionSort = `// FixedArray: SelectionSort

FixedArray.selectionSort() {
  for (start = 0; start < this.length - 1; start += 1) {
    minimum = start
    for (index = start + 1; index < this.length; index += 1) {
      if (this.items[index].value < this.items[minimum].value) {
        minimum = index
      }
    }
    if (minimum != start) {
      this.swapEntries(start, minimum)
    }
  }
}

FixedArray.getAt(index) {
  if (!Number.isInteger(index) || index < 0 || index >= this.length)
    throw new RangeError('Index is outside the array')
  return { ...this.items[index] }
}

get FixedArray.length() {
  return this.items.length
}

FixedArray.swapEntries(first, second) {
  temporary = this.items[first]
  this.items[first] = this.items[second]
  this.items[second] = temporary
}`

  public static readonly shellSort = `// FixedArray: ShellSort

FixedArray.shellSort() {
  if (this.length < 2): return
  gap = 1
  while (gap < Math.floor(this.length / 3))
    gap = 3 * gap + 1
  while (gap >= 1) {
    for (index = gap; index < this.length; index += 1) {
      for (position = index; position >= gap; position -= gap) {
        if (this.items[position - gap].value <= this.items[position].value): break
        this.swapEntries(position - gap, position)
      }
    }
    gap = Math.floor(gap / 3)
  }
}

FixedArray.getAt(index) {
  if (!Number.isInteger(index) || index < 0 || index >= this.length)
    throw new RangeError('Index is outside the array')
  return { ...this.items[index] }
}

get FixedArray.length() {
  return this.items.length
}

FixedArray.swapEntries(first, second) {
  temporary = this.items[first]
  this.items[first] = this.items[second]
  this.items[second] = temporary
}`

  public static readonly sleepSort = `// FixedArray: SleepSort

FixedArray.sleepSort() {
  new SleepArraySort(this.items).sort()
}

SleepArraySort.sort() {
  if (this.entries.length < 2): return
  this.minimum = BigInt(this.entries[0].value)
  for (entry of this.entries) {
    if (BigInt(entry.value) < this.minimum): this.minimum = BigInt(entry.value)
  }
  this.output = new Array(this.entries.length).fill(null)
  for (index = 0; index < this.entries.length; index += 1) {
    entry = this.entries[index]
    this.queue.push({ entry, deadline: BigInt(entry.value) - this.minimum, order: index })
    child = this.queue.length - 1
    while (child > 0) {
      parent = Math.floor((child - 1) / 2)
      if (!this.less(child, parent)): break
      this.exchange(child, parent)
      child = parent
    }
  }
  destination = 0
  while (this.queue.length) {
    event = this.queue[0]
    last = this.queue.pop()
    if (this.queue.length) {
      this.queue[0] = last
      parent = 0
      while (parent * 2 + 1 < this.queue.length) {
        child = parent * 2 + 1
        if (child + 1 < this.queue.length && this.less(child + 1, child)): child += 1
        if (!this.less(child, parent)): break
        this.exchange(child, parent)
        parent = child
      }
    }
    this.now = event.deadline
    this.output[destination++] = event.entry
  }
  for (index = 0; index < this.entries.length; index += 1)
    this.entries[index] = this.output[index]
}`

  public static readonly slowSort = `// FixedArray: SlowSort

FixedArray.slowSort() {
  return new SlowArraySort(this.items).sort(FixedArray.maximumSlowSortLength)
}

SlowArraySort.sort(limit) {
  if (!this.accept('Slow Sort', limit)): return false
  this.sortRange(0, this.entries.length - 1)
  if (this.entries.length > 1): this.complete()
  return true
}

SlowArraySort.accept(name, limit) {
  if (this.entries.length <= limit): return true
  return false
}

SlowArraySort.sortRange(start, end) {
  if (start >= end): return
  middle = start + Math.floor((end - start) / 2)
  this.sortRange(start, middle)
  this.sortRange(middle + 1, end)
  this.compareRange(middle, end, 'sort halves; compare their maxima')
  this.sortRange(start, end - 1)
}

SlowArraySort.complete() {
}

FixedArray.maximumSlowSortLength = 12`

  public static readonly smoothsort = `SMOOTHSORT(A):
  maintain a forest of max-heaps with Leonardo sizes
  L[0] = L[1] = 1; L[k] = L[k-1] + L[k-2] + 1
  for each next entry at the right end of the prefix:
    if the last two heaps can form a larger Leonardo heap:
      merge those heaps with the new entry as root
    else:
      add a singleton heap rooted at the new entry
    restore local heap order by sifting the new root down
    trinkle across earlier heap roots when root order is required
  while the forest is not empty:
    finalize the rightmost root in the sorted suffix
    remove its heap from the forest
    if it had children:
      expose its two Leonardo subheaps
      repair their root order with semitrinkle

SIFT: move a held root down toward the larger child until it fits.
TRINKLE: move a held root past larger predecessor roots while
  respecting its children, then sift it within the destination heap.
SEMITRINKLE: exchange a newly exposed root with a larger predecessor
  when needed and trinkle the displaced root.`

  public static readonly splaySort = `SPLAY_SORT(A):
  root = null
  for entry in A:
    descend left for smaller keys and right for equal or larger keys
    link the new node as a leaf
    while the new node has a parent:
      if it has no grandparent:
        rotate it above its parent                          // zig
      else if node and parent are both left or both right children:
        rotate parent above grandparent, then node above parent
      else:
        rotate node above parent, then node above grandparent
  output = []
  for node in inorder using child and parent links:
    append its original entry to output
  copy output back into A`

  public static readonly spreadsort = `SPREADSORT(A):
  SORT_RANGE(0, length(A), 2 * floor(log2(length(A))))

SORT_RANGE(lo, hi, budget):
  if hi - lo <= 1: return
  scan actual minimum, maximum, and existing order
  if already ordered or minimum == maximum: return
  if hi - lo <= 4: insertion-sort the range; return
  if budget == 0: heap-sort the range; return
  choose up to four significant range bits for at most 16 bins
  classify each entry by the chosen bits of (key - minimum)
  count bins and prefix-sum their boundaries
  cycle misplaced entries into the next free position of their bin
  for each nontrivial bin:
    SORT_RANGE(bin.start, bin.end, budget - 1)`

  public static readonly stoogeSort = `// FixedArray: StoogeSort

FixedArray.stoogeSort() {
  return new StoogeArraySort(this.items).sort(FixedArray.maximumStoogeSortLength)
}

StoogeArraySort.sort(limit) {
  if (!this.accept('Stooge Sort', limit)): return false
  this.sortRange(0, this.entries.length - 1)
  if (this.entries.length > 1): this.complete()
  return true
}

StoogeArraySort.accept(name, limit) {
  if (this.entries.length <= limit): return true
  return false
}

StoogeArraySort.sortRange(start, end) {
  if (start >= end): return
  this.compareRange(start, end, 'if first > last: swap')
  if (end - start < 2): return
  third = Math.floor((end - start + 1) / 3)
  this.sortRange(start, end - third)
  this.sortRange(start + third, end)
  this.sortRange(start, end - third)
}

StoogeArraySort.complete() {
}

FixedArray.maximumStoogeSortLength = 12`

  public static readonly strandSort = `// FixedArray: StrandSort

FixedArray.strandSort() {
  new StrandArraySort(this.items).sort()
}

StrandArraySort.sort() {
  if (this.entries.length < 2): return
  tail = null
  for (entry of this.entries) {
    node = new StrandNode(entry)
    if (tail): tail.next = node
    else: this.remaining = node
    tail = node
  }
  while (this.remaining) {
    this.strand = null
    strandTail = null
    previous = null
    node = this.remaining
    while (node) {
      next = node.next
      if (!strandTail || node.entry.value >= strandTail.entry.value) {
        if (previous): previous.next = next
        else: this.remaining = next
        node.next = null
        if (strandTail): strandTail.next = node
        else: this.strand = node
        strandTail = node
      }
      else: previous = node
      node = next
    }
    this.mergeStrand()
  }
  destination = 0
  for (node = this.sorted; node; node = node.next)
    this.entries[destination++] = node.entry
}`

  public static readonly timSort = `TIMSORT(A):
  runs = empty stack
  while unprocessed entries remain:
    find next nondecreasing or strictly decreasing run
    reverse a strictly decreasing run
    extend short runs to at least 8 entries with stable binary insertion
    push the run on runs
    COLLAPSE(force=false)
  COLLAPSE(force=true)

COLLAPSE(force):
  while runs has at least two entries:
    i = length(runs) - 2
    violated = (i > 0 and len[i-1] <= len[i] + len[i+1])
            or (i > 1 and len[i-2] <= len[i-1] + len[i])
    if force or violated:
      if i > 0 and len[i-1] < len[i+1]: i -= 1
    else if len[i] > len[i+1]: break
    merge runs[i] and runs[i+1]; replace them with the merged run

MERGE(left, right):
  copy both runs to a buffer
  take the smaller head, choosing the left head on ties
  after seven consecutive wins, find a winning streak by
    exponential search followed by binary search
  copy the winning streak and resume head comparisons
  copy any remaining entries into the merged range`

  public static readonly tournamentSort = `// FixedArray: TournamentSort

FixedArray.tournamentSort() {
  new TournamentArraySort(this.items).sort()
}

TournamentArraySort.sort() {
  length = this.entries.length
  if (length < 2): return
  leaves = 1
  while (leaves < length)
    leaves *= 2
  winners = new Array(2 * leaves).fill(-1)
  for (index = 0; index < length; index += 1)
    winners[leaves + index] = index
  output = new Array(length).fill(null)
  for (match = leaves - 1; match > 0; match -= 1) {
    winners[match] = this.winner(winners[2 * match], winners[2 * match + 1], match, winners, output)
  }
  for (destination = 0; destination < length; destination += 1) {
    source = winners[1]
    output[destination] = this.entries[source]
    match = leaves + source
    winners[match] = -1
    while (match > 1) {
      match = Math.floor(match / 2)
      winners[match] = this.winner(winners[2 * match], winners[2 * match + 1], match, winners, output)
    }
  }
  for (index = 0; index < length; index += 1)
    this.entries[index] = output[index]
}

TournamentArraySort.constructor(entries) {
  this.entries = entries
}

TournamentArraySort.winner(first, second, match, winners, output) {
  winner = first
  if (first < 0): winner = second
  else if (second >= 0 && (this.entries[second].value < this.entries[first].value || this.entries[second].value == this.entries[first].value && second < first))
    winner = second
  if (this.observer) {
    snapshot = [...winners]
    snapshot[match] = winner
  }
  return winner
}`

  public static readonly treeSort = `// FixedArray: TreeSort

FixedArray.treeSort() {
  new TreeArraySort(this.items).sort()
}

TreeArraySort.sort() {
  if (this.entries.length < 2): return
  for (index = 0; index < this.entries.length; index += 1) {
    entry = this.entries[index]
    parent = null
    current = this.root
    while (current) {
      parent = current
      current = entry.value < current.entry.value ? current.left : current.right
    }
    node = new SortTreeNode(entry, index, parent)
    if (!parent): this.root = node
    else if (entry.value < parent.entry.value)
      parent.left = node
    else: parent.right = node
  }
  node = this.root
  while (node?.left)
    node = node.left
  destination = 0
  while (node) {
    this.entries[destination] = node.entry
    destination += 1
    if (node.right) {
      node = node.right
      while (node.left)
        node = node.left
    }
    else {
      child = node
      node = node.parent
      while (node && node.right == child) {
        child = node
        node = node.parent
      }
    }
  }
}`

  public static readonly wikiSort = `WIKISORT(A):
  if A is already ordered: return
  stably insertion-sort small base runs
  repeatedly merge adjacent runs of increasing size:
    if the runs already meet in order: continue
    select distinct keys for block tags and an internal merge buffer
    if too few distinct keys are available:
      stably merge by rotating adjacent misplaced ranges
      continue
    adapt block length to the number of available keys
    tag full left-run blocks with borrowed keys
    roll tagged blocks through the right run in key order
    recover original block order from their tags as each block is used
    merge local pieces using the borrowed buffer and rotations
    sort and redistribute the borrowed keys into the merged range

ROTATE_MERGE(left, right):
  find where a right-run prefix belongs inside the left run
  rotate that prefix before the larger left-run suffix
  repeat on the remaining pieces, preserving equal-key order

// Borrowed buffers occupy the input array itself.`
}
