import { StringTextModel } from '../StringTextModel.ts'
import type { ActionKind } from '../../../../visualization/ActionCatalog.ts'
import type { LinearInputValues, LinearObserver, LinearResult } from '../../../../visualization/LinearModel.ts'

export interface SuffixState {
  readonly id: string
  readonly maximum: number
  readonly link: string | null
  readonly transitions: ReadonlyMap<string, string>
  readonly clone: boolean
  readonly terminal: boolean
}

class MutableSuffixState {
  public id: string
  public maximum: number
  public link: string | null = null
  public transitions = new Map<string, string>()
  public clone = false
  constructor(id: string, maximum: number) {
    this.id = id
    this.maximum = maximum
  }
}

export class SuffixAutomaton extends StringTextModel {
  public readonly kind = 'suffix-automaton' as const
  private text: string[] = []
  private states = new Map<string, MutableSuffixState>([['sam-root', new MutableSuffixState('sam-root', 0)]])
  private last = 'sam-root'
  private nextId = 0

  public get length(): number { return this.text.length }
  public get source(): string { return this.text.join('') }

  public static createDefault(): SuffixAutomaton {
    const model = new SuffixAutomaton()
    model.execute('build-text', { text: this.defaultText })
    return model
  }

  public getStates(): readonly SuffixState[] {
    const terminal = new Set<string>()
    let state: string | null = this.last
    while (state !== null) {
      terminal.add(state)
      state = this.states.get(state)!.link
    }
    const result: SuffixState[] = []
    for (const entry of this.states.values()) result.push({ id: entry.id, maximum: entry.maximum, link: entry.link, transitions: new Map(entry.transitions), clone: entry.clone, terminal: terminal.has(entry.id) })
    return result
  }

  public clone(): SuffixAutomaton {
    const copy = new SuffixAutomaton()
    copy.text = [...this.text]
    copy.last = this.last
    copy.nextId = this.nextId
    copy.states.clear()
    for (const state of this.states.values()) {
      const next = new MutableSuffixState(state.id, state.maximum)
      next.link = state.link
      next.clone = state.clone
      next.transitions = new Map(state.transitions)
      copy.states.set(next.id, next)
    }
    return copy
  }

  private extend(character: string, observer?: LinearObserver): void {
    const current = new MutableSuffixState(`sam-${this.nextId++}`, this.states.get(this.last)!.maximum + 1)
    current.link = 'sam-root'
    this.states.set(current.id, current)
    SuffixAutomaton.emit(observer, current.id, `Create a state for the new prefix ending in ${character}.`, 'cur.max = last.max + 1', 'NEW')
    let position: string | null = this.last
    while (position !== null && !this.states.get(position)!.transitions.has(character)) {
      const state = this.states.get(position)!
      state.transitions.set(character, current.id)
      SuffixAutomaton.emit(observer, state.id, `Add ${character} → ${current.id}, then follow the suffix link.`, 'while p != null and missing(p, c): next[p][c] = cur; p = link[p]')
      position = state.link
    }
    if (position !== null) {
      const state = this.states.get(position)!
      const target = this.states.get(state.transitions.get(character)!)!
      if (state.maximum + 1 === target.maximum) current.link = target.id
      else {
        const split = new MutableSuffixState(`sam-${this.nextId++}`, state.maximum + 1)
        split.transitions = new Map(target.transitions)
        split.link = target.link
        split.clone = true
        this.states.set(split.id, split)
        SuffixAutomaton.emit(observer, split.id, `Clone ${target.id} with shorter maximum length ${split.maximum}.`, 'clone.next = q.next; clone.link = q.link; clone.max = p.max + 1', 'NEW')
        while (position !== null && this.states.get(position)!.transitions.get(character) === target.id) {
          const predecessor = this.states.get(position)!
          predecessor.transitions.set(character, split.id)
          SuffixAutomaton.emit(observer, predecessor.id, `Redirect ${character} to the cloned state.`, 'while next[p][c] == q: next[p][c] = clone; p = link[p]')
          position = predecessor.link
        }
        target.link = split.id
        current.link = split.id
      }
    }
    this.last = current.id
    this.text.push(character)
    SuffixAutomaton.emit(observer, current.id, `Finish appending ${character}; suffix links and clone transitions are ready.`, 'last = cur; append character to source')
  }

  public execute(action: ActionKind, input: LinearInputValues, observer?: LinearObserver): LinearResult {
    if (action === 'clear') {
      this.states = new Map([['sam-root', new MutableSuffixState('sam-root', 0)]])
      this.text = []
      this.last = 'sam-root'
      SuffixAutomaton.emit(observer, this.last, 'Keep an empty root and release all other states.', 'states = {root}; last = root; text = empty')
      return { description: 'The suffix automaton is empty.' }
    }
    if (action === 'build-text' || action === 'append-text') {
      const text = SuffixAutomaton.letters(input, 'text')
      if (action === 'append-text' && this.text.length + text.length > 64) return this.rejected('Appending would exceed 64 source characters; the automaton is unchanged.')
      if (action === 'build-text') {
        this.states = new Map([['sam-root', new MutableSuffixState('sam-root', 0)]])
        this.text = []
        this.last = 'sam-root'
      }
      for (const character of text) this.extend(character, observer)
      return { description: `Indexed all substrings of ${this.text.length} source characters. Suffix-accepting states lie on the last state's suffix-link chain; all reachable states accept substring queries.` }
    }
    if (action !== 'search-value') throw new RangeError('Unsupported suffix-automaton operation')
    const pattern = SuffixAutomaton.letters(input, 'pattern')
    let state = this.states.get('sam-root')!
    for (const character of pattern) {
      SuffixAutomaton.emit(observer, state.id, `Follow transition ${character} from ${state.id}.`, 'state = next[state][character]; if missing: return false')
      const next = state.transitions.get(character)
      if (!next) return { description: `${pattern} is absent: a transition is missing.`, value: false, activeId: state.id }
      state = this.states.get(next)!
    }
    return { description: `${pattern} is a substring of the indexed source.`, value: true, activeId: state.id, status: 'MATCH' }
  }
}
