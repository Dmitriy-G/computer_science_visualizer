import type { StructureKind } from './Scene.ts'
import type { ActionKind } from './ActionCatalog.ts'
import type { ActionInputField, StructuredActionInput } from './StructuredActionInput.ts'
import type { TreeInputValues } from './AdditionalTreeModel.ts'
import { ExtendedTreeDefinitions } from './ExtendedTreeDefinitions.ts'
export class ExtendedTreeInput implements StructuredActionInput {
  public readonly fields: readonly ActionInputField[]
  public readonly available: boolean
  public readonly hint: string
  private constructor(kind: StructureKind, action: ActionKind, size: number) {
    const key = { name: 'key', label: kind === 'complete-binary-tree' ? 'Value' : 'Key' }
    const value = { name: 'value', label: 'Value' }
    const index = { name: 'index', label: 'Index (zero-based)', minimum: 0, maximum: size - 1 }
    const range = [
      { name: 'minimum', label: 'Minimum index (inclusive)', minimum: 0, maximum: size - 1 },
      { name: 'maximum', label: 'Maximum index (inclusive)', minimum: 0, maximum: size - 1 },
    ]
    this.available = !((action === 'range-min' || action === 'range-sum' || action === 'update-index' || action === 'verify-proof' || action === 'select-rank') && size === 0)
    this.hint = !this.available ? 'The structure is empty; build values or reset its example first.'
      : kind === 'persistent-segment-tree' ? 'Choose an existing version v0..v7 shown in the diagram. A missing version is rejected during playback. Updates create a new version; array indices are zero-based.'
      : kind === 'quadtree' || kind === 'octree' ? 'Point coordinates are whole numbers in [-1024,1024). Query bounds are inclusive and may extend outside the indexed domain.'
      : kind === 'van-emde-boas-tree' ? 'The fixed integer universe is 0..255. Successor means strictly greater, even for an absent key.'
      : kind === 'general-tree' || kind === 'unordered-binary-tree' ? 'Use a unique key and an existing parent. For an empty tree, the key becomes the root and parent/side placement is ignored. Deletion removes the entire selected subtree.'
      : kind === 'sparse-table' ? 'Build 1 to 64 comma-separated safe integers. Queries use inclusive zero-based endpoints; build again to replace the static values.'
      : kind === 'radix-tree' || kind === 'ternary-search-tree' || kind === 'suffix-tree' ? 'Use 1 to 32 lowercase letters a-z. Complete words, prefixes, and substrings use different matching rules.'
      : kind === 'interval-tree' ? 'Endpoints are inclusive safe integers. Lower endpoint must not exceed upper endpoint. Overlap search returns one match.'
      : kind === 'merkle-tree' ? 'Choose a zero-based data-leaf index. Verification checks the supplied value using sibling hashes from this tree against the full SHA-256 root.'
      : 'Enter whole safe integers. Negative values are allowed; ranges include both endpoints.'
    if (kind === 'general-tree' || kind === 'unordered-binary-tree') {
      const fields: ActionInputField[] = [key]
      if (action === 'insert') {
        fields.push({ name: 'parent', label: 'Parent key (ignored for an empty tree)' })
        if (kind === 'unordered-binary-tree') fields.push({ name: 'side', label: 'Child position (0 = left, 1 = right)', minimum: 0, maximum: 1 })
      }
      this.fields = fields
    } else if (kind === 'radix-tree' || kind === 'ternary-search-tree' || kind === 'suffix-tree') {
      this.fields = [{ name: action === 'build-text' ? 'text' : 'word', label: action === 'build-text' ? 'Source text' : kind === 'suffix-tree' ? 'Substring' : action === 'starts-with' ? 'Prefix' : 'Word', text: true }]
    } else if (kind === 'interval-tree') this.fields = [{ name: 'low', label: 'Lower endpoint (inclusive)' }, { name: 'high', label: 'Upper endpoint (inclusive)' }]
    else if (kind === 'cartesian-tree') this.fields = action === 'insert' ? [value] : range
    else if (kind === 'sparse-table') this.fields = action === 'build-values' ? [{ name: 'values', label: 'Values (comma-separated)', text: true }] : range
    else if (kind === 'persistent-segment-tree') this.fields = [{ name: 'version', label: 'Version number', minimum: 0, maximum: 7 }, ...(action === 'update-index' ? [index, value] : range)]
    else if (kind === 'merkle-tree') this.fields = [index, value]
    else if (action === 'select-rank') this.fields = [{ name: 'rank', label: 'Sorted rank (zero-based)', minimum: 0, maximum: size - 1 }]
    else if (kind === 'van-emde-boas-tree') this.fields = [{ ...key, minimum: 0, maximum: 255 }]
    else if (kind === 'kd-tree' || kind === 'quadtree' || kind === 'octree' || kind === 'bvh') {
      const fields: ActionInputField[] = []
      const dimensions = kind === 'octree' ? ['X', 'Y', 'Z'] : ['X', 'Y']
      if (action === 'insert' && kind !== 'bvh') {
        for (const axis of dimensions) fields.push({ name: axis.toLowerCase(), label: axis, ...(kind === 'quadtree' || kind === 'octree' ? { minimum: -1024, maximum: 1023 } : {}) })
      } else {
        for (const axis of dimensions) fields.push({ name: `min${axis}`, label: `Minimum ${axis} (inclusive)` })
        for (const axis of dimensions) fields.push({ name: `max${axis}`, label: `Maximum ${axis} (inclusive)` })
      }
      this.fields = fields
    } else this.fields = [key]
  }
  public static supports(kind: StructureKind): boolean {
    for (const structure of ExtendedTreeDefinitions.structures) if (structure.kind === kind) return true
    return false
  }
  public static create(kind: StructureKind, action: ActionKind, size: number): ExtendedTreeInput | null {
    if (!this.supports(kind) || action === 'clear' || action === 'traverse-inorder') return null
    return new ExtendedTreeInput(kind, action, size)
  }
  public acceptsDraft(field: ActionInputField, value: string): boolean {
    if (field.name === 'values') return /^[\d,\s-]*$/.test(value) && value.length <= 1400
    if (field.text) return /^[a-z]*$/.test(value) && value.length <= 32
    return (field.minimum ?? -1) >= 0 ? /^\d*$/.test(value) : /^-?\d*$/.test(value)
  }
  public validate(values: Readonly<Record<string, string>>): Readonly<Record<string, string>> {
    const errors: Record<string, string> = {}
    for (const field of this.fields) {
      const text = values[field.name] ?? ''
      if (!this.available) errors[field.name] = this.hint
      else if (field.name === 'values') {
        const parts = text.split(',')
        if (parts.length > 64 || parts.length < 1) errors[field.name] = 'Enter 1 to 64 comma-separated safe integers.'
        for (const part of parts) if (!/^-?\d+$/.test(part.trim()) || !Number.isSafeInteger(Number(part))) errors[field.name] = 'Enter 1 to 64 comma-separated safe integers.'
      } else if (field.text) {
        if (!/^[a-z]{1,32}$/.test(text)) errors[field.name] = 'Enter 1 to 32 lowercase letters a-z.'
      } else if (!/^-?\d+$/.test(text) || !Number.isSafeInteger(Number(text))) errors[field.name] = 'Enter a whole safe integer.'
      else if (Number(text) < (field.minimum ?? Number.MIN_SAFE_INTEGER) || Number(text) > (field.maximum ?? Number.MAX_SAFE_INTEGER)) errors[field.name] = `Enter a number from ${field.minimum ?? Number.MIN_SAFE_INTEGER} to ${field.maximum ?? Number.MAX_SAFE_INTEGER}.`
    }
    for (const [minimum, maximum] of [['minimum', 'maximum'], ['low', 'high'], ['minX', 'maxX'], ['minY', 'maxY'], ['minZ', 'maxZ']]) {
      if (values[minimum] !== undefined && values[maximum] !== undefined && !errors[minimum] && !errors[maximum] && Number(values[minimum]) > Number(values[maximum])) errors[maximum] = 'Maximum must be greater than or equal to minimum.'
    }
    return errors
  }
  public parse(values: Readonly<Record<string, string>>): TreeInputValues {
    if (Object.keys(this.validate(values)).length) throw new TypeError('Invalid tree input')
    const input: Record<string, string | number> = {}
    for (const field of this.fields) input[field.name] = field.text ? values[field.name] : Number(values[field.name])
    return input
  }
}
