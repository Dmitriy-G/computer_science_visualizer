import { AdditionalTreeModel } from '../../../../visualization/AdditionalTreeModel.ts'
import type { TreeDiagramEntry, TreeInputValues, TreeOperationResult } from '../../../../visualization/AdditionalTreeModel.ts'
import type { ActionKind } from '../../../../visualization/ActionCatalog.ts'
import { TreeTrace } from '../../../../visualization/TreeTrace.ts'
import type { TreeTraceObserver } from '../../../../visualization/TreeTrace.ts'
import { ASTParser } from './ASTParser.ts'
import type { ASTNodeKind, ParsedExpression } from './ASTParser.ts'

export type ASTTraversalOrder = 'preorder' | 'inorder' | 'postorder'

class ASTNode {
  public readonly id: string
  public readonly kind: ASTNodeKind
  public readonly token: string
  public readonly children: ASTNode[] = []

  constructor(id: string, kind: ASTNodeKind, token: string) {
    this.id = id
    this.kind = kind
    this.token = token
  }
}

export class ASTEvaluationError extends Error {
  public readonly nodeId: string

  constructor(message: string, nodeId: string) {
    super(message)
    this.nodeId = nodeId
  }
}

export class AST extends AdditionalTreeModel {
  public readonly kind = 'ast'
  private roots: ASTNode[] = []
  private count = 0
  private nextId = 1
  private source = ''

  public get length(): number { return this.count }
  public get expression(): string { return this.source }

  public static createDefault(): AST {
    const result = new AST()
    result.build('-(8 + 2) * (9 - 3) / 2')
    return result
  }

  public clone(): AST {
    const result = new AST()
    const copy = (node: ASTNode): ASTNode => {
      const cloned = new ASTNode(node.id, node.kind, node.token)
      for (const child of node.children) cloned.children.push(copy(child))
      return cloned
    }
    for (const root of this.roots) result.roots.push(copy(root))
    result.count = this.count
    result.nextId = this.nextId
    result.source = this.source
    return result
  }

  public build(expression: string, observer?: TreeTraceObserver): void {
    // Validate the whole expression before replacing a tree or consuming IDs.
    const parsed = new ASTParser(expression).parse()
    this.roots = []
    this.count = 0
    this.source = expression.trim()
    TreeTrace.emit(observer, 'remove', null, 'Replace the expression', 'Replace the old root reference and build a new syntax tree. Unused storage can be collected.', 'root = null')
    const create = (entry: ParsedExpression): ASTNode => {
      const children: ASTNode[] = []
      for (const child of entry.children) children.push(create(child))
      const node = new ASTNode(`ast-${this.nextId++}`, entry.kind, entry.token)
      this.roots.push(node)
      this.count += 1
      TreeTrace.emit(observer, 'create', node.id, 'Create a syntax node', `Create ${entry.kind} node '${entry.token}'. Parentheses guide grouping but are not stored as nodes.`, 'node = new Node(kind, token)', node.id)
      const firstChildIndex = this.roots.length - children.length - 1
      for (const child of children) {
        this.roots.splice(firstChildIndex, 1)
        node.children.push(child)
        TreeTrace.emit(observer, 'connect', node.id, 'Attach an operand', `Attach '${child.token}' as ${entry.kind === 'unary' ? 'the operand' : node.children.length === 1 ? 'the left operand' : 'the right operand'} of '${node.token}'.`, 'node.children.append(operand)')
      }
      return node
    }
    create(parsed)
  }

  public traverse(order: ASTTraversalOrder, observer?: TreeTraceObserver): readonly string[] {
    const tokens: string[] = []
    const record = (node: ASTNode): void => {
      const token = node.kind === 'unary' ? node.token === '-' ? 'neg' : 'pos' : node.token
      tokens.push(token)
      if (observer) TreeTrace.emit(observer, 'visit', node.id, 'Visit a syntax node', `${order}: append '${token}'. Order so far: ${tokens.join(' ')}.`, `output.append(${JSON.stringify(token)})`)
    }
    const visit = (node: ASTNode): void => {
      if (order === 'preorder' || order === 'inorder' && node.kind !== 'binary') record(node)
      if (node.children[0]) visit(node.children[0])
      if (order === 'inorder' && node.kind === 'binary') record(node)
      if (node.children[1]) visit(node.children[1])
      if (order === 'postorder') record(node)
    }
    if (this.roots[0]) visit(this.roots[0])
    return tokens
  }

  public evaluate(observer?: TreeTraceObserver): number | null {
    const evaluate = (node: ASTNode): number => {
      TreeTrace.emit(observer, 'visit', node.id, 'Inspect a syntax node', `Evaluate ${node.kind} '${node.token}' after its operands.`, 'evaluate(node)')
      let value: number
      if (node.kind === 'literal') value = Number(node.token)
      else {
        const left = evaluate(node.children[0])
        if (node.kind === 'unary') value = node.token === '-' ? -left : left
        else {
          const right = evaluate(node.children[1])
          if (node.token === '+') value = left + right
          else if (node.token === '-') value = left - right
          else if (node.token === '*') value = left * right
          else {
            if (right === 0) throw new ASTEvaluationError('Division by zero.', node.id)
            value = left / right
          }
        }
      }
      if (!Number.isFinite(value)) throw new ASTEvaluationError('The result is not a finite number.', node.id)
      if (Number.isInteger(value) && !Number.isSafeInteger(value)) throw new ASTEvaluationError('The integer result is outside the safe integer range.', node.id)
      TreeTrace.emit(observer, 'visit', node.id, 'Return the node value', `'${node.token}' evaluates to ${value}.`, `return ${value}`)
      return value
    }
    return this.roots[0] ? evaluate(this.roots[0]) : null
  }

  public clear(observer?: TreeTraceObserver): void {
    while (this.roots.length) {
      const stack: ASTNode[] = [this.roots[this.roots.length - 1]]
      while (stack.length) {
        const node = stack[stack.length - 1]
        if (node.children.length) stack.push(node.children[node.children.length - 1])
        else {
          stack.pop()
          const parent = stack[stack.length - 1]
          if (parent) parent.children.pop()
          else this.roots.pop()
          this.count -= 1
          TreeTrace.emit(observer, 'remove', parent?.id ?? null, 'Release a syntax node', `Release '${node.token}' after its children.`, 'disconnect and release node')
        }
      }
    }
    this.source = ''
  }

  public getDiagram(): readonly TreeDiagramEntry[] {
    const entries: TreeDiagramEntry[] = []
    const visit = (node: ASTNode): void => {
      const children: string[] = []
      for (const child of node.children) children.push(child.id)
      entries.push({ id: node.id, text: node.token, label: node.kind, children, width: 96 })
      for (const child of node.children) visit(child)
    }
    for (const root of this.roots) visit(root)
    return entries
  }

  public execute(action: ActionKind, input: TreeInputValues, observer?: TreeTraceObserver): TreeOperationResult {
    if (action === 'build-expression') {
      this.build(String(input.expression ?? ''), observer)
      return { description: `Built AST for ${this.expression}: ${this.length} syntax nodes.`, activeId: this.roots[0]?.id }
    }
    if (action === 'clear') {
      this.clear(observer)
      return { description: 'The AST is empty. Build an expression to create another tree.' }
    }
    if (action === 'evaluate') {
      try {
        const value = this.evaluate(observer)
        return { description: value === null ? 'The AST is empty; no expression to evaluate.' : `${this.expression} = ${value}. The AST is unchanged.`, returnValue: value, activeId: this.roots[0]?.id, status: value === null ? 'EMPTY' : 'VALUE' }
      } catch (error) {
        if (!(error instanceof ASTEvaluationError)) throw error
        return { description: `Cannot evaluate: ${error.message} The AST is unchanged.`, error: error.message, activeId: error.nodeId, status: 'ERROR' }
      }
    }
    let order: ASTTraversalOrder
    if (action === 'traverse-preorder') order = 'preorder'
    else if (action === 'traverse-inorder') order = 'inorder'
    else if (action === 'traverse-postorder') order = 'postorder'
    else throw new RangeError('Unsupported AST action')
    const tokens = this.traverse(order, observer)
    return { description: tokens.length ? `${order}: ${tokens.join(' ')}. Unary signs are neg / pos; parentheses are not nodes.` : 'The AST is empty; traversal returns [].', returnValue: tokens, status: 'VISITED' }
  }
}
