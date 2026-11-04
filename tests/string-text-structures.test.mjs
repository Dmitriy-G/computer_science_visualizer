import assert from 'node:assert/strict'
import { test } from 'node:test'
import { readFileSync, existsSync } from 'node:fs'
import { StringTextStructureCatalog } from '../src/visualization/StringTextStructureCatalog.ts'
import { StringTextStructureDefinitions } from '../src/visualization/StringTextStructureDefinitions.ts'
import { StringTextActionCatalog } from '../src/visualization/StringTextActionCatalog.ts'
import { StructuredStringTextInput } from '../src/visualization/StructuredStringTextInput.ts'
import { LinearStructureCatalog } from '../src/visualization/LinearStructureCatalog.ts'
import { ActionCatalog } from '../src/visualization/ActionCatalog.ts'
import { ActionInputRequest } from '../src/visualization/ActionInputRequest.ts'
import { StructureCatalog } from '../src/visualization/StructureCatalog.ts'
import { StructureInformation } from '../src/components/StructureInfo/StructureInformation.ts'
import { SuffixArray } from '../src/components/AdvancedDataStructures/TextSearch/SuffixArray/SuffixArray.ts'
import { SuffixAutomaton } from '../src/components/AdvancedDataStructures/TextSearch/SuffixAutomaton/SuffixAutomaton.ts'
import { AhoCorasickAutomaton } from '../src/components/AdvancedDataStructures/TextSearch/AhoCorasickAutomaton/AhoCorasickAutomaton.ts'
import { DAWG } from '../src/components/AdvancedDataStructures/TextSearch/DAWG/DAWG.ts'
import { FMIndex } from '../src/components/AdvancedDataStructures/TextSearch/FMIndex/FMIndex.ts'

const build = (model, text) => model.execute('build-text', { text })
const search = (model, pattern) => model.execute('search-value', { pattern }).value
const view = (model) => StringTextStructureCatalog.createScene(model)
const snapshot = (model) => JSON.stringify(view(model))
const numeric = (values) => [...values].sort((left, right) => left - right)
const positions = (text, pattern) => {
  const found = []
  for (let start = 0; start + pattern.length <= text.length; start += 1) if (text.startsWith(pattern, start)) found.push(start)
  return found
}
const suffixOrder = (text) => Array.from({ length: text.length }, (_, index) => index).sort((left, right) => {
  const a = text.slice(left)
  const b = text.slice(right)
  return a < b ? -1 : a > b ? 1 : 0
})
const assertScene = (scene) => {
  const ids = new Set(scene.nodes.map((node) => node.id))
  assert.equal(ids.size, scene.nodes.length)
  assert.equal(new Set(scene.edges.map((edge) => edge.id)).size, scene.edges.length)
  if (scene.focusId) assert.ok(ids.has(scene.focusId))
  for (const edge of scene.edges) assert.ok(ids.has(edge.from) && ids.has(edge.to), edge.id)
  for (const node of scene.nodes) {
    assert.ok(Number.isFinite(node.x) && Number.isFinite(node.y))
    assert.ok(node.x - node.width / 2 >= 0 && node.x + node.width / 2 <= scene.width)
    assert.ok(node.y >= 66 && node.y + 66 < scene.height)
    assert.ok(node.width >= node.label.length * 6, `caption width for ${node.id}`)
    assert.ok(node.width >= node.displayValue.length * 12, `value width for ${node.id}`)
  }
}

test('five text indexes have ten-input defaults, unique menu entries, input routes, and information', () => {
  assert.equal(StringTextStructureDefinitions.structures.length, 5)
  const models = LinearStructureCatalog.createModels()
  for (const definition of StringTextStructureDefinitions.structures) {
    const model = models.get(definition.kind)
    assert.equal(model.length, 10, definition.name)
    assert.equal(StructureCatalog.getGroupForStructure(definition.kind), 'string-text')
    assert.equal(StructureCatalog.structures.filter((entry) => entry.kind === definition.kind).length, 1)
    assert.deepEqual(ActionCatalog.getScopedActions(definition.kind, 'overview'), StringTextActionCatalog.getActions(definition.kind))
    assert.deepEqual(ActionCatalog.getScopedActions(definition.kind, 'sorting'), [])
    assert.deepEqual(ActionCatalog.getScopedActions(definition.kind, 'graph-traversal'), [])
    for (const action of ActionCatalog.getActions(definition.kind)) {
      const request = ActionInputRequest.create(definition.kind, action.kind, model.length)
      assert.equal(request !== null, action.kind !== 'clear')
      if (request) assert.ok(request.structured)
    }
    assertScene(view(model))
    assert.deepEqual(LinearStructureCatalog.createScene(model), view(model))
    const info = StructureInformation.get(definition.kind)
    assert.equal(info.useCases.length, 4)
    for (const technology of info.technologies) assert.match(technology.url, /^https:\/\//)
  }
})

test('text dialogs validate alphabet, reserved terminators, dictionary limits, and scan lengths', () => {
  const source = StructuredStringTextInput.create('suffix-array', 'build-text')
  for (const text of ['', 'Banana', 'a b', 'a$', 'a'.repeat(33)]) assert.ok(source.validate({ text }).text)
  assert.deepEqual(source.parse({ text: 'banana' }), { text: 'banana' })
  const dictionary = StructuredStringTextInput.create('dawg', 'build-words')
  assert.deepEqual(dictionary.parse({ words: 'cat, bat,rat' }), { words: 'cat, bat,rat' })
  for (const words of ['', 'a,a', 'cat,,dog', 'UPPER', Array.from({ length: 17 }, (_, index) => 'a' + String.fromCharCode(97 + index)).join(','), ['a', 'b', 'c', 'd', 'e'].map((letter) => letter.repeat(32)).join(',')]) assert.ok(dictionary.validate({ words }).words)
  const scan = StructuredStringTextInput.create('aho-corasick-automaton', 'search-text')
  assert.deepEqual(scan.validate({ text: 'a'.repeat(128) }), {})
  assert.ok(scan.validate({ text: 'a'.repeat(129) }).text)
  assert.equal(ActionInputRequest.create('fm-index', 'clear', 0), null)
})

const corpus = ['a', 'aaaa', 'banana', 'mississippi', 'abababa', 'zyxw', 'bananaband', 'abcdefghijklmnopqrstuvwxyz', 'a'.repeat(32)]

test('suffix arrays match lexicographic order, LCP invariants, and brute-force occurrence starts', () => {
  for (const text of corpus) {
    const model = new SuffixArray()
    build(model, text)
    const indexed = text + '$'
    const order = suffixOrder(indexed)
    assert.deepEqual(model.getSuffixes(), order)
    assert.equal(new Set(order).size, text.length + 1)
    assert.equal(model.getLCP()[0], 0)
    model.getLCP().forEach((common, rank) => {
      if (!rank) return
      const left = indexed.slice(order[rank - 1])
      const right = indexed.slice(order[rank])
      assert.equal(left.slice(0, common), right.slice(0, common))
      assert.notEqual(left[common], right[common])
    })
    for (const pattern of ['a', 'ana', 'issi', 'zz', text, text.slice(-1), 'aa']) assert.deepEqual(numeric(search(model, pattern)), positions(text, pattern))
  }
  assert.deepEqual(search(new SuffixArray(), 'a'), [])
})

test('suffix automata preserve link/transition invariants and recognize every substring after append', () => {
  for (const text of corpus.slice(0, 7)) {
    const model = new SuffixAutomaton()
    const split = Math.max(1, Math.floor(text.length / 2))
    build(model, text.slice(0, split))
    if (split < text.length) model.execute('append-text', { text: text.slice(split) })
    assert.equal(model.source, text)
    const states = model.getStates()
    const byId = new Map(states.map((state) => [state.id, state]))
    assert.ok(states.length <= text.length * 2 + 1)
    for (const state of states) {
      if (state.link) assert.ok(byId.get(state.link).maximum < state.maximum)
      for (const target of state.transitions.values()) assert.ok(byId.get(target).maximum > state.maximum)
    }
    for (let start = 0; start < text.length; start += 1) {
      for (let end = start + 1; end <= text.length; end += 1) assert.equal(search(model, text.slice(start, end)), true)
      let state = byId.get('sam-root')
      for (const character of text.slice(start)) state = byId.get(state.transitions.get(character))
      assert.equal(state.terminal, true, 'the suffix-final chain accepts every complete suffix')
    }
    assert.equal(search(model, 'zzzz'), false)
  }
  const cloned = new SuffixAutomaton()
  build(cloned, 'abbcbc')
  assert.ok(cloned.getStates().some((state) => state.clone))
  const independent = cloned.clone()
  independent.execute('append-text', { text: 'xyz' })
  assert.equal(search(cloned, 'xyz'), false)
  assert.equal(search(independent, 'xyz'), true)
  const limited = new SuffixAutomaton()
  build(limited, 'a'.repeat(32))
  limited.execute('append-text', { text: 'b'.repeat(32) })
  const before = snapshot(limited)
  assert.equal(limited.execute('append-text', { text: 'a' }).status, 'REJECTED')
  assert.equal(snapshot(limited), before)
})

test('Aho-Corasick matches brute force including overlaps and nested output-link patterns', () => {
  const model = new AhoCorasickAutomaton()
  const patterns = ['a', 'aa', 'aaa', 'ba', 'aba', 'bab', 'he', 'she', 'his', 'hers']
  model.execute('build-words', { words: patterns.join(',') })
  const states = model.getStates()
  const byId = new Map(states.map((state) => [state.id, state]))
  for (const state of states) {
    if (state.id !== 'ac-root') assert.ok(byId.get(state.failure).depth < state.depth)
    if (state.output) {
      assert.notEqual(byId.get(state.output).pattern, null)
      assert.ok(byId.get(state.output).depth < state.depth)
    }
  }
  const key = (match) => `${match.start}:${match.end}:${match.pattern}`
  for (const text of ['ushersababaaahishers', 'aaaaaa', 'zzzzz', 'shehehis']) {
    const expected = []
    for (const pattern of patterns) for (const start of positions(text, pattern)) expected.push({ pattern, start, end: start + pattern.length })
    const before = snapshot(model)
    const actual = JSON.parse(model.execute('search-text', { text }).value)
    assert.deepEqual(actual.map(key).sort(), expected.map(key).sort())
    assert.equal(snapshot(model), before, 'scanning does not modify the automaton')
  }
  const copy = model.clone()
  copy.execute('clear', {})
  assert.equal(copy.length, 0)
  assert.equal(model.length, patterns.length)
  assert.deepEqual(JSON.parse(copy.execute('search-text', { text: 'aaaa' }).value), [])
})

test('dictionary DAWG is acyclic, minimal by right language, and accepts exactly its dictionary', () => {
  const words = ['cat', 'bat', 'rat', 'cats', 'bats', 'rats', 'at', 'ats', 'a', 'b']
  const model = new DAWG()
  model.execute('build-words', { words: words.join(',') })
  const states = model.getStates()
  const byId = new Map(states.map((state) => [state.id, state]))
  const rightLanguages = new Map()
  const active = new Set()
  const language = (id) => {
    if (rightLanguages.has(id)) return rightLanguages.get(id)
    assert.ok(!active.has(id), 'word graph must be acyclic')
    active.add(id)
    const state = byId.get(id)
    const result = state.terminal ? [''] : []
    for (const [character, target] of state.transitions) {
      assert.ok(byId.get(target).height < state.height)
      for (const suffix of language(target)) result.push(character + suffix)
    }
    active.delete(id)
    result.sort()
    rightLanguages.set(id, result)
    return result
  }
  assert.deepEqual(language(model.rootId), [...words].sort())
  const signatures = states.map((state) => JSON.stringify(language(state.id)))
  assert.equal(new Set(signatures).size, states.length, 'no two canonical states may have equal right languages')
  const prefixes = new Set([''])
  for (const word of words) for (let length = 1; length <= word.length; length += 1) prefixes.add(word.slice(0, length))
  assert.ok(states.length < prefixes.size, 'equivalent trie states must actually merge')
  for (const word of [...words, 'ca', 'c', 'baa', 'catss', 'z']) assert.equal(model.execute('search-value', { word }).value, words.includes(word))
  const copy = model.clone()
  copy.execute('build-words', { words: 'hello,world' })
  assert.equal(model.execute('search-value', { word: 'cat' }).value, true)
  assert.equal(copy.execute('search-value', { word: 'cat' }).value, false)
})

test('FM transform, exclusive prefix ranks, LF mapping, and sampled locations match suffix order', () => {
  for (const text of corpus) {
    const model = new FMIndex()
    build(model, text)
    const indexed = text + '$'
    const order = suffixOrder(indexed)
    const bwt = order.map((start) => indexed[(start + indexed.length - 1) % indexed.length]).join('')
    assert.equal(model.transform, bwt)
    assert.equal(model.constructionSource, '', 'temporary full source is released after construction')
    const cumulative = model.getCumulative()
    const counts = model.getOccurrences()
    const samples = model.getSamples()
    for (const [character, rank] of cumulative) {
      assert.equal(rank, [...indexed].filter((letter) => letter < character).length)
      for (let prefix = 0; prefix <= bwt.length; prefix += 1) assert.equal(counts.get(character)[prefix], [...bwt.slice(0, prefix)].filter((letter) => letter === character).length)
    }
    for (let row = 0; row < order.length; row += 1) {
      assert.equal(order[model.lf(row)], (order[row] + indexed.length - 1) % indexed.length)
      let current = row
      let steps = 0
      while (!samples.has(current) && steps < 4) { current = model.lf(current); steps += 1 }
      assert.ok(steps <= 3)
      assert.equal((samples.get(current) + steps) % indexed.length, order[row])
    }
    for (const [row, position] of samples) {
      assert.equal(position % 4, 0)
      assert.equal(order[row], position)
    }
    const before = snapshot(model)
    for (const pattern of ['a', 'ana', 'issi', 'zz', 'aa', text]) assert.deepEqual(numeric(search(model, pattern)), positions(text, pattern))
    assert.equal(snapshot(model), before)
  }
  assert.deepEqual(search(new FMIndex(), 'a'), [])
})

test('invalid rebuilds preserve storage and cleared models accept a fresh build', () => {
  for (const definition of StringTextStructureDefinitions.structures) {
    const model = StringTextStructureCatalog.createDefault(definition.kind)
    const dictionary = definition.kind === 'dawg' || definition.kind === 'aho-corasick-automaton'
    const before = snapshot(model)
    assert.throws(() => model.execute(dictionary ? 'build-words' : 'build-text', dictionary ? { words: 'a,a' } : { text: 'BAD$' }))
    assert.equal(snapshot(model), before)
    const copy = model.clone()
    copy.execute('clear', {})
    assert.equal(copy.length, 0)
    assertScene(view(copy))
    copy.execute(dictionary ? 'build-words' : 'build-text', dictionary ? { words: 'a,aba' } : { text: 'aba' })
    assert.equal(copy.length, dictionary ? 2 : 3)
    assert.equal(snapshot(model), before)
  }
})

test('all sixteen string/text sequences have action-owned metadata and bounded immutable playback', async () => {
  const featuresUrl = new URL('../src/components/StructureFeatures/StringTextFeatures.tsx', import.meta.url)
  const source = readFileSync(featuresUrl, 'utf8')
  const imports = [...source.matchAll(/import \{ (\w+)Animation as \w+Sequence \} from '([^']+)'/g)]
  assert.equal(imports.length, 16)
  for (const [, actionFolder, relative] of imports) {
    const sequenceUrl = new URL(relative, featuresUrl)
    const name = sequenceUrl.pathname.split('/').at(-3)
    const modelSource = readFileSync(new URL(`../${name}.ts`, sequenceUrl), 'utf8')
    const kind = /readonly kind = '([^']+)'/.exec(modelSource)[1]
    const { [actionFolder + 'Animation']: Sequence } = await import(sequenceUrl)
    const model = StringTextStructureCatalog.createDefault(kind)
    const before = snapshot(model)
    const input = { text: 'abcbcaba', pattern: 'ana', word: 'cat', words: 'a,aa,aba,ba' }
    const plan = new Sequence(model, input)
    assert.equal(snapshot(model), before)
    assert.notEqual(plan.result, model)
    assert.ok(plan.steps.length >= 2 && plan.steps.length <= 98)
    for (const step of plan.steps) {
      assertScene(step.scene)
      assert.equal(step.scene.width, plan.steps[0].scene.width)
      assert.equal(step.scene.height, plan.steps[0].scene.height)
      assert.ok(step.description && step.code)
    }
    for (const step of plan.steps.slice(0, -1)) assert.equal(step.scene.count, model.length)
    assert.equal(plan.steps.at(-1).scene.count, plan.result.length)
    assert.deepEqual(plan.steps, new Sequence(model, input).steps)
    const first = JSON.stringify(plan.steps[0].scene)
    plan.result.execute('clear', {})
    assert.equal(JSON.stringify(plan.steps[0].scene), first)
    const info = Sequence.describe(model.length)
    assert.ok(info.summary && info.time.explanation && info.memory.explanation && info.terms.length)
    assert.ok(existsSync(new URL(`./${actionFolder}.tsx`, sequenceUrl)))
    assert.ok(existsSync(new URL(`./${actionFolder}.css`, sequenceUrl)))
  }
})

test('long text scans execute all matches while capping detailed playback snapshots', async () => {
  const { ScanAnimation } = await import('../src/components/AdvancedDataStructures/TextSearch/AhoCorasickAutomaton/Scan/ScanAnimation.ts')
  const model = new AhoCorasickAutomaton()
  model.execute('build-words', { words: 'a,aa,aaa' })
  const plan = new ScanAnimation(model, { text: 'a'.repeat(128) })
  assert.equal(plan.steps.length, 98)
  assert.match(plan.steps.at(-1).description, /omitted/)
  assert.match(plan.steps.at(-1).description, /^381 overlapping match/)
  assert.equal(plan.result.length, 3)
})
