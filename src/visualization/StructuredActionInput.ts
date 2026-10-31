export interface ActionInputField {
  readonly name: string
  readonly label: string
  readonly text?: boolean
  readonly expression?: boolean
  readonly minimum?: number
  readonly maximum?: number
}

export interface StructuredActionInput {
  readonly fields: readonly ActionInputField[]
  readonly available: boolean
  readonly hint: string
  acceptsDraft(field: ActionInputField, value: string): boolean
  validate(values: Readonly<Record<string, string>>): Readonly<Record<string, string>>
  parse(values: Readonly<Record<string, string>>): Readonly<Record<string, string | number>>
}
