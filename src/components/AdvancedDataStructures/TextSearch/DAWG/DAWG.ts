import { StringTextModel } from '../StringTextModel.ts'
import type { ActionKind } from '../../../../visualization/ActionCatalog.ts'
import type { LinearInputValues, LinearObserver, LinearResult } from '../../../../visualization/LinearModel.ts'

class WordTrieNode {
  public terminal = false
  public children = new Map<string, WordTrieNode>()
}

export interface WordGraphState {
  readonly id: string
  readonly terminal: boolean
  readonly height: number
  readonly transitions: ReadonlyMap<string, string>
}

export class DAWG extends StringTextModel {
  public readonly kind = 'dawg' as const
  private states = new Map<string, WordGraphState>()
  private root: string | null = null
  private wordCount = 0
  private nextId = 0

  public get length(): number { return this.wordCount }
  public get rootId(): string | null { return this.root }
  public getStates(): readonly WordGraphState[] {
    const copy: WordGraphState[] = []
    for (const state of this.states.values()) copy.push({ ...state, transitions: new Map(state.transitions) })
    return copy
  }

  public static createDefault(): DAWG {
    const model = new DAWG()
    model.execute('build-words', { words: this.defaultWords })
    return model
  }

  public clone(): DAWG {
    const copy = new DAWG()
    copy.root = this.root
    copy.wordCount = this.wordCount
    copy.nextId = this.nextId
    for (const state of this.getStates()) copy.states.set(state.id, state)
    return copy
  }

  public execute(action: ActionKind, input: LinearInputValues, observer?: LinearObserver): LinearResult {
    if (action === 'clear') {
      this.states.clear()
      this.root = null
      this.wordCount = 0
      DAWG.emit(observer, null, 'Release all shared word states and reset the dictionary count.', 'states.clear(); root = null; wordCount = 0')
      return { description: 'The dictionary word graph is empty.' }
    }
    if (action === 'build-words') {
      if (typeof input.words !== 'string') throw new TypeError('Enter comma-separated dictionary words')
      const words = DAWG.words(input.words)
      const trie = new WordTrieNode()
      for (const word of words) {
        let node = trie
        for (const character of word) {
          let child = node.children.get(character)
          if (!child) {
            child = new WordTrieNode()
            node.children.set(character, child)
          }
          node = child
        }
        node.terminal = true
        DAWG.emit(observer, null, `Insert ${word} into the temporary construction trie.`, 'build a trie of the complete dictionary before minimization')
      }
      this.states.clear()
      this.root = null
      this.wordCount = 0
      const register = new Map<string, WordGraphState>()
      const minimize = (node: WordTrieNode): WordGraphState => {
        const transitions = new Map<string, string>()
        let height = 0
        for (const character of [...node.children.keys()].sort()) {
          const target = minimize(node.children.get(character)!)
          transitions.set(character, target.id)
          height = Math.max(height, target.height + 1)
        }
        const signature = `${+node.terminal}|${[...transitions].map(([character, target]) => `${character}:${target}`).join('|')}`
        const existing = register.get(signature)
        if (existing) {
          DAWG.emit(observer, existing.id, 'Reuse a state with the same final flag and identical labeled outgoing transitions.', 'if equivalent state exists: reuse canonical state')
          return existing
        }
        const state = { id: `dawg-${this.nextId++}`, terminal: node.terminal, height, transitions }
        register.set(signature, state)
        this.states.set(state.id, state)
        DAWG.emit(observer, state.id, `Intern ${state.id}; ${node.terminal ? 'accepting' : 'nonaccepting'}, ${transitions.size} transition(s).`, 'register[signature] = canonical state', 'NEW')
        return state
      }
      this.root = minimize(trie).id
      this.wordCount = words.length
      DAWG.emit(observer, this.root, 'Set the initial state after all equivalent right languages have been merged.', 'root = minimize(trieRoot); release temporary trie')
      return { description: `Built a minimal acyclic dictionary automaton for ${words.length} words. Shared suffix languages use one state; construction is trie-then-minimize, not incremental insertion.` }
    }
    if (action !== 'search-value') throw new RangeError('Unsupported dictionary DAWG operation')
    const word = DAWG.letters(input, 'word')
    if (!this.root) return { description: `${word} is absent from the empty dictionary.`, value: false }
    let state = this.states.get(this.root)!
    for (const character of word) {
      DAWG.emit(observer, state.id, `Follow ${character} from ${state.id}.`, 'state = next[state][character]; reject if missing')
      const target = state.transitions.get(character)
      if (!target) return { description: `${word} is absent: a dictionary transition is missing.`, value: false, activeId: state.id }
      state = this.states.get(target)!
    }
    return { description: state.terminal ? `${word} is a complete dictionary word.` : `${word} is only a path prefix, not a complete dictionary word.`, value: state.terminal, activeId: state.id, status: state.terminal ? 'MATCH' : 'PREFIX ONLY' }
  }
}
