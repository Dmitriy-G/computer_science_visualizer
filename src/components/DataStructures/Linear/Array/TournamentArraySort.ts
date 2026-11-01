import { ArraySortOperations } from './ArraySortOperations.ts'
import type { ArrayEntry } from './FixedArray.ts'
import type { ArraySortTreeNode } from './ArraySortTrace.ts'

export class TournamentArraySort extends ArraySortOperations {
  public sort(): void {
    const length = this.entries.length
    if (length < 2) return
    let leaves = 1
    while (leaves < length) leaves *= 2
    const winners = new Array<number>(2 * leaves).fill(-1)
    for (let index = 0; index < length; index += 1) winners[leaves + index] = index
    const output = new Array<ArrayEntry | null>(length).fill(null)
    for (let match = leaves - 1; match > 0; match -= 1) {
      winners[match] = this.winner(winners[2 * match], winners[2 * match + 1], match, winners, output)
    }
    for (let destination = 0; destination < length; destination += 1) {
      const source = winners[1]
      output[destination] = this.entries[source]
      this.emit('extract', 'Output the tournament winner', `Key ${this.entries[source].value} from original index ${source} wins. Equal keys are resolved by original position.`, `output[${destination}] = winner`, { activeIndices: [source], output: this.observer ? [...output] : undefined, tree: this.snapshot(winners, 1), treeRoot: 'match-1' }, source, destination)
      let match = leaves + source
      winners[match] = -1
      this.emit('stage', 'Remove the winning leaf', 'Mark the leaf exhausted using an empty marker, so the full safe-integer range remains available for keys.', 'leaf = empty; replay its ancestor matches', { output: this.observer ? [...output] : undefined, tree: this.snapshot(winners, match), treeRoot: 'match-1' }, source)
      while (match > 1) {
        match = Math.floor(match / 2)
        winners[match] = this.winner(winners[2 * match], winners[2 * match + 1], match, winners, output)
      }
    }
    for (let index = 0; index < length; index += 1) this.entries[index] = output[index]!
    this.emit('gather', 'Copy the tournament output back', 'Every leaf has won once. Copy the ordered entries into the original fixed allocation.', 'array[:] = output[:]', { sortedPrefix: length })
  }

  private winner(first: number, second: number, match: number, winners: readonly number[], output: readonly (ArrayEntry | null)[]): number {
    let winner = first
    if (first < 0) winner = second
    else if (second >= 0 && (this.entries[second].value < this.entries[first].value || this.entries[second].value === this.entries[first].value && second < first)) winner = second
    // Render the newly decided match, not its previous cached winner.
    if (this.observer) {
      const snapshot = [...winners]
      snapshot[match] = winner
      this.emit('compare', 'Play one tournament match', first < 0 || second < 0 ? 'An exhausted or padding leaf cannot win; advance the remaining contender.' : `Compare keys ${this.entries[first].value} and ${this.entries[second].value}, preferring the earlier original index on equality.`, `winner[${match}] = min(left, right)`, { activeIndices: [first, second].filter((index) => index >= 0), output: [...output], tree: this.snapshot(snapshot, match), treeRoot: 'match-1' }, Math.max(0, first), second)
    }
    return winner
  }

  private snapshot(winners: readonly number[], active: number): ArraySortTreeNode[] | undefined {
    if (!this.observer) return undefined
    const nodes: ArraySortTreeNode[] = []
    const leaves = winners.length / 2
    for (let index = 1; index < winners.length; index += 1) {
      const source = winners[index]
      nodes.push({ id: `match-${index}`, entry: source < 0 ? null : this.entries[source], left: index < leaves ? `match-${2 * index}` : null, right: index < leaves ? `match-${2 * index + 1}` : null, status: source < 0 ? 'EMPTY' : index < leaves ? 'WINNER' : 'LEAF', active: index === active })
    }
    return nodes
  }
}
