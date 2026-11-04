import type { StructureKind } from './Scene.ts'
import type { ActionKind } from './ActionCatalog.ts'
import type { ActionInputField, StructuredActionInput } from './StructuredActionInput.ts'
import type { LinearInputValues } from './LinearModel.ts'
import { StringTextActionCatalog } from './StringTextActionCatalog.ts'
import { StringTextModel } from '../components/AdvancedDataStructures/TextSearch/StringTextModel.ts'

export class StructuredStringTextInput implements StructuredActionInput {
  public readonly fields: readonly ActionInputField[]
  public readonly available = true
  public readonly hint: string
  private readonly maximum: number

  private constructor(kind: StructureKind, action: ActionKind) {
    const name = action === 'build-words' ? 'words' : action === 'build-text' || action === 'append-text' || action === 'search-text' ? 'text' : kind === 'dawg' ? 'word' : 'pattern'
    const label = name === 'words' ? kind === 'dawg' ? 'Dictionary words (comma-separated)' : 'Patterns (comma-separated)'
      : action === 'append-text' ? 'Text to append' : action === 'search-text' ? 'Text to scan'
        : name === 'text' ? 'Source text' : name === 'word' ? 'Complete word' : 'Substring pattern'
    this.fields = [{ name, label, text: true }]
    this.maximum = action === 'search-text' ? 128 : 32
    this.hint = name === 'words'
      ? 'Enter 1 to 16 distinct comma-separated lowercase words, each up to 32 letters, with at most 128 total letters. Building replaces the complete dictionary.'
      : action === 'search-text'
        ? 'Enter 1 to 128 lowercase letters a-z. Scan the complete text and report all overlapping pattern matches using zero-based [start, end) positions.'
        : action === 'append-text'
          ? 'Append 1 to 32 lowercase letters a-z. The suffix automaton supports at most 64 total source characters; an oversized append is rejected unchanged.'
          : kind === 'dawg'
            ? 'Enter a complete lowercase word of 1 to 32 letters. A matching prefix path is not enough; its final state must accept a dictionary word.'
            : 'Enter 1 to 32 lowercase letters a-z. Build replaces the source. Searches are exact and case-sensitive; $ is reserved internally as a unique terminator.'
  }

  public static supports(kind: StructureKind): boolean { return StringTextActionCatalog.getActions(kind) !== null }
  public static create(kind: StructureKind, action: ActionKind): StructuredStringTextInput | null {
    const actions = StringTextActionCatalog.getActions(kind)
    if (!actions || action === 'clear') return null
    for (const choice of actions) if (choice.kind === action) return new StructuredStringTextInput(kind, action)
    return null
  }
  public acceptsDraft(field: ActionInputField, value: string): boolean {
    return field.name === 'words' ? /^[a-z,\s]*$/.test(value) && value.length <= 600 : /^[a-z]*$/.test(value) && value.length <= this.maximum
  }
  public validate(values: Readonly<Record<string, string>>): Readonly<Record<string, string>> {
    const errors: Record<string, string> = {}
    for (const field of this.fields) {
      const value = values[field.name] ?? ''
      try {
        if (field.name === 'words') StringTextModel.words(value)
        else StringTextModel.letters({ [field.name]: value }, field.name, this.maximum)
      } catch (error) { errors[field.name] = error instanceof Error ? error.message : 'Invalid text input' }
    }
    return errors
  }
  public parse(values: Readonly<Record<string, string>>): LinearInputValues {
    if (Object.keys(this.validate(values)).length) throw new TypeError('Invalid string/text input')
    const result: Record<string, string> = {}
    for (const field of this.fields) result[field.name] = values[field.name]
    return result
  }
}
