export type ASTNodeKind = 'literal' | 'unary' | 'binary'

export interface ParsedExpression {
  readonly kind: ASTNodeKind
  readonly token: string
  readonly children: readonly ParsedExpression[]
}

// Arithmetic grammar only: this parser never executes source text.
export class ASTParser {
  public static readonly maximumLength = 128
  private readonly expression: string
  private position = 0

  constructor(expression: string) {
    this.expression = expression
  }

  public static validate(expression: string): string | null {
    try {
      new ASTParser(expression).parse()
      return null
    } catch (error) {
      if (error instanceof SyntaxError) return error.message
      throw error
    }
  }

  public parse(): ParsedExpression {
    this.position = 0
    if (this.expression.length > ASTParser.maximumLength) throw new SyntaxError(`Use at most ${ASTParser.maximumLength} characters.`)
    if (!this.expression.trim()) throw new SyntaxError('Enter an arithmetic expression.')
    const result = this.sum()
    if (this.peek()) throw this.error(`Unexpected '${this.expression[this.position]}'.`)
    return result
  }

  private error(message: string): SyntaxError {
    return new SyntaxError(`${message} At character ${this.position + 1}.`)
  }

  private peek(): string {
    while (this.position < this.expression.length && /\s/.test(this.expression[this.position])) this.position += 1
    return this.expression[this.position] ?? ''
  }

  private sum(): ParsedExpression {
    let left = this.product()
    while (this.peek() === '+' || this.peek() === '-') {
      const token = this.expression[this.position++]
      left = { kind: 'binary', token, children: [left, this.product()] }
    }
    return left
  }

  private product(): ParsedExpression {
    let left = this.unary()
    while (this.peek() === '*' || this.peek() === '/') {
      const token = this.expression[this.position++]
      left = { kind: 'binary', token, children: [left, this.unary()] }
    }
    return left
  }

  private unary(): ParsedExpression {
    const token = this.peek()
    if (token === '+' || token === '-') {
      this.position += 1
      return { kind: 'unary', token, children: [this.unary()] }
    }
    return this.primary()
  }

  private primary(): ParsedExpression {
    if (this.peek() === '(') {
      this.position += 1
      const expression = this.sum()
      if (this.peek() !== ')') throw this.error('Expected a closing parenthesis.')
      this.position += 1
      return expression
    }
    const start = this.position
    while (this.position < this.expression.length && /[0-9]/.test(this.expression[this.position])) this.position += 1
    if (this.position === start) throw this.error('Expected an integer or opening parenthesis.')
    const token = this.expression.slice(start, this.position)
    if (!Number.isSafeInteger(Number(token))) throw this.error('Integer literal is outside the safe integer range.')
    return { kind: 'literal', token, children: [] }
  }
}
