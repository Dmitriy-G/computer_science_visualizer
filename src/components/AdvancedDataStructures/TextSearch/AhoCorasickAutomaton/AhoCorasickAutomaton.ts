import { StringTextModel } from '../StringTextModel.ts'
import type { ActionKind } from '../../../../visualization/ActionCatalog.ts'
import type { LinearInputValues, LinearObserver, LinearResult } from '../../../../visualization/LinearModel.ts'

class AhoState {
  public id: string
  public depth: number
  public failure = 'ac-root'
  public output: string | null = null
  public pattern: number | null = null
  public transitions = new Map<string, string>()
  constructor(id: string, depth: number) {
    this.id = id
    this.depth = depth
  }
}

export interface AhoStateSnapshot {
  readonly id: string
  readonly depth: number
  readonly failure: string
  readonly output: string | null
  readonly pattern: number | null
  readonly transitions: ReadonlyMap<string, string>
}

export interface AhoMatch {
  readonly pattern: string
  readonly start: number
  readonly end: number
}

export class AhoCorasickAutomaton extends StringTextModel {
  public readonly kind = 'aho-corasick-automaton' as const
  private states = new Map<string, AhoState>([['ac-root', new AhoState('ac-root', 0)]])
  private patterns: string[] = []
  private nextId = 0

  public get length(): number { return this.patterns.length }
  public getPatterns(): readonly string[] { return [...this.patterns] }
  public getStates(): readonly AhoStateSnapshot[] {
    const result: AhoStateSnapshot[] = []
    for (const state of this.states.values()) result.push({ ...state, transitions: new Map(state.transitions) })
    return result
  }

  public static createDefault(): AhoCorasickAutomaton {
    const model = new AhoCorasickAutomaton()
    model.execute('build-words', { words: this.defaultWords })
    return model
  }

  public clone(): AhoCorasickAutomaton {
    const copy = new AhoCorasickAutomaton()
    copy.patterns = [...this.patterns]
    copy.nextId = this.nextId
    copy.states.clear()
    for (const state of this.states.values()) {
      const next = new AhoState(state.id, state.depth)
      next.failure = state.failure
      next.output = state.output
      next.pattern = state.pattern
      next.transitions = new Map(state.transitions)
      copy.states.set(next.id, next)
    }
    return copy
  }

  public execute(action: ActionKind, input: LinearInputValues, observer?: LinearObserver): LinearResult {
    if (action === 'clear') {
      this.states = new Map([['ac-root', new AhoState('ac-root', 0)]])
      this.patterns = []
      AhoCorasickAutomaton.emit(observer, 'ac-root', 'Keep the empty initial state and release patterns, failure links, and output links.', 'states = {root}; patterns = []')
      return { description: 'The Aho-Corasick pattern dictionary is empty.' }
    }
    if (action === 'build-words') {
      if (typeof input.words !== 'string') throw new TypeError('Enter comma-separated patterns')
      const patterns = AhoCorasickAutomaton.words(input.words)
      this.states = new Map([['ac-root', new AhoState('ac-root', 0)]])
      this.patterns = [...patterns]
      for (let index = 0; index < patterns.length; index += 1) {
        let state = this.states.get('ac-root')!
        for (const character of patterns[index]) {
          let target = state.transitions.get(character)
          if (!target) {
            target = `ac-${this.nextId++}`
            this.states.set(target, new AhoState(target, state.depth + 1))
            state.transitions.set(character, target)
          }
          state = this.states.get(target)!
          AhoCorasickAutomaton.emit(observer, state.id, `Build the trie path for pattern ${patterns[index]}.`, 'create missing trie transition; advance state')
        }
        state.pattern = index
        AhoCorasickAutomaton.emit(observer, state.id, `Mark the end of pattern ${patterns[index]}.`, 'state.pattern = patternIndex', 'NEW')
      }
      const queue: string[] = [...this.states.get('ac-root')!.transitions.values()]
      for (let head = 0; head < queue.length; head += 1) {
        const state = this.states.get(queue[head])!
        for (const [character, target] of state.transitions) {
          const child = this.states.get(target)!
          let failure = this.states.get(state.failure)!
          while (failure.id !== 'ac-root' && !failure.transitions.has(character)) {
            AhoCorasickAutomaton.emit(observer, failure.id, `Follow a failure link while assigning the fallback for ${character}.`, 'while missing(f, c) and f != root: f = fail[f]')
            failure = this.states.get(failure.failure)!
          }
          child.failure = failure.transitions.get(character) ?? 'ac-root'
          const fallback = this.states.get(child.failure)!
          child.output = fallback.pattern !== null ? fallback.id : fallback.output
          queue.push(child.id)
          AhoCorasickAutomaton.emit(observer, child.id, `Set failure to ${child.failure}${child.output ? ` and output link to ${child.output}` : ''}.`, 'fail[child] = fallback; output[child] = nearest terminal failure state')
        }
      }
      return { description: `Built ${patterns.length} patterns with trie transitions, breadth-first failure links, and terminal output links. Scans report all overlapping matches.` }
    }
    if (action !== 'search-text') throw new RangeError('Unsupported Aho-Corasick operation')
    const text = AhoCorasickAutomaton.letters(input, 'text', 128)
    const matches: AhoMatch[] = []
    let state = this.states.get('ac-root')!
    for (let index = 0; index < text.length; index += 1) {
      const character = text[index]
      while (state.id !== 'ac-root' && !state.transitions.has(character)) {
        AhoCorasickAutomaton.emit(observer, state.id, `No ${character} transition; fall back to ${state.failure} without consuming the character.`, 'while missing(state, c) and state != root: state = fail[state]')
        state = this.states.get(state.failure)!
      }
      state = this.states.get(state.transitions.get(character) ?? 'ac-root')!
      AhoCorasickAutomaton.emit(observer, state.id, `Consume text[${index}] = ${character}.`, 'state = next[state][c] or root')
      let output: AhoState | null = state
      while (output !== null) {
        if (output.pattern !== null) {
          const pattern = this.patterns[output.pattern]
          const match = { pattern, start: index + 1 - pattern.length, end: index + 1 }
          matches.push(match)
          AhoCorasickAutomaton.emit(observer, output.id, `Match ${pattern} at [${match.start}, ${match.end}).`, 'report terminal pattern; follow output link', 'MATCH')
        }
        output = output.output ? this.states.get(output.output)! : null
      }
    }
    return { description: `${matches.length} overlapping match(es), with zero-based half-open ranges: ${matches.map((match) => `${match.pattern}@[${match.start},${match.end})`).join('; ') || 'none'}.`, value: JSON.stringify(matches) }
  }
}
