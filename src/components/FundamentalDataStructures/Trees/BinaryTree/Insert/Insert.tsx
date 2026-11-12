import { Component } from 'react'
import ActionPlayback from '../../../../ActionPlayback/ActionPlayback.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import type { Scene } from '../../../../../visualization/Scene.ts'
import { BinaryTree } from '../BinaryTree.ts'
import { InsertionAnimation } from './InsertionAnimation.ts'
import './Insert.css'

interface InsertProps {
  readonly tree: BinaryTree
  readonly value?: number
  readonly onSceneChange: (scene: Scene, tree: BinaryTree) => void
  readonly onComplete?: () => void
}

class BinaryTreeInsertionDefinition implements ActionDefinition<BinaryTree> {
  public readonly title = 'Insert a key'

  public create(tree: BinaryTree, value: number): InsertionAnimation {
    return new InsertionAnimation(tree, value)
  }
}

export default class Insert extends Component<InsertProps, Record<string, never>> {
  private readonly definition = new BinaryTreeInsertionDefinition()

  public render() {
    return (
      <div className="binary-tree-insertion">
        <ActionPlayback<BinaryTree>
          model={this.props.tree}
          definition={this.definition}
          value={this.props.value}
          onSceneChange={this.props.onSceneChange}
          onComplete={this.props.onComplete}
        />
      </div>
    )
  }
}
