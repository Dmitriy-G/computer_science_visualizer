import assert from 'node:assert/strict'
import { test } from 'node:test'
import { StructureCatalog } from '../src/visualization/StructureCatalog.ts'
import { StructureInformation } from '../src/components/StructureInfo/StructureInformation.ts'
import { StructureProductCatalog } from '../src/components/StructureInfo/StructureProductCatalog.ts'

test('structure products retain their verified technology evidence and unique product names', () => {
  for (const structure of StructureCatalog.structures) {
    const information = StructureInformation.get(structure.kind)
    const original = information.technologies.map((technology) => ({ ...technology }))
    const names = new Set()
    for (const product of StructureInformation.getProducts(structure.kind)) {
      assert.ok(product.name, `${structure.kind} has a product name`)
      assert.equal(new URL(product.url).protocol, 'https:')
      assert.ok(information.technologies.some((technology) =>
        technology.url === product.url && technology.usage === product.usage,
      ), `${structure.kind} product evidence comes from its own technology catalog`)
      assert.ok(!names.has(product.name), `${structure.kind} lists ${product.name} only once`)
      names.add(product.name)
    }
    assert.deepEqual(information.technologies, original)
  }
})

test('product names identify the system rather than individual APIs or repeated subsystems', () => {
  const adjacency = StructureInformation.getProducts('adjacency-list')
  assert.deepEqual(adjacency.map((product) => product.name), ['NetworkX'])
  assert.equal(adjacency[0].url, 'https://networkx.org/documentation/stable/reference/classes/digraph.html')
  const products = StructureInformation.getProducts('red-black-tree')
  assert.deepEqual(products.map((product) => product.name), ['Java', '.NET', 'Linux', 'NGINX'])
  assert.equal(products.find((product) => product.name === 'Linux').url, 'https://docs.kernel.org/core-api/rbtree.html')
})

test('unverified structures, specifications, and unrecognized entries do not become products', () => {
  for (const structure of ['suffix-automaton', 'quotient-filter', 'xor-linked-list', 'functional-graph', 'address-space-graph', 'merkle-tree']) {
    assert.deepEqual(StructureInformation.getProducts(structure), [], structure)
  }
  assert.deepEqual(StructureProductCatalog.get([
    { name: 'Unverified product', url: 'https://example.com/', usage: 'Not verified.' },
    { name: 'constructor', url: 'https://example.com/', usage: 'Not a catalog entry.' },
  ]), [])
})

test('historical product evidence keeps the version qualification', () => {
  assert.deepEqual(StructureInformation.getProducts('robin-hood-hash-table').map((product) => product.name), ['Rust 1.35 (historical)'])
  assert.ok(StructureInformation.getProducts('linear-hashing').some((product) => product.name === 'OpenSSL 1.0.2 (historical)'))
})
