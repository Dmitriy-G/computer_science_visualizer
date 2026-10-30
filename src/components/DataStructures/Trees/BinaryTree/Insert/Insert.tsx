import { Component, createRef } from 'react'
import ActionPlayback from '../../../../ActionPlayback/ActionPlayback.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import type { Scene } from '../../../../../visualization/Scene.ts'
import { BinaryTree } from '../BinaryTree.ts'
import { InsertionAnimation } from './InsertionAnimation.ts'
import './Insert.css'

interface InsertProps {
  readonly tree: BinaryTree
  readonly onSceneChange: (scene: Scene, tree: BinaryTree) => void
}

class BinaryTreeInsertionDefinition implements ActionDefinition<BinaryTree> {
  public readonly title = 'Insert a value'
  public readonly context = 'Binary search tree / insertion'
  public readonly summary =
    'Smaller goes left. Larger goes right. Duplicate keys are rejected.'
  public readonly phases = [
    'Start',
    'Compare',
    'Locate',
    'Create',
    'Connect',
    'Finish',
  ]
  public readonly timelineHint = 'O(h) traversal · O(1) extra memory'

  public create(tree: BinaryTree, value: number): InsertionAnimation {
    return new InsertionAnimation(tree, value)
  }
}

export default class Insert extends Component<InsertProps, Record<string, never>> {
  private readonly definition = new BinaryTreeInsertionDefinition()
  private readonly player = createRef<ActionPlayback<BinaryTree>>()

  public pausePlayback(): void {
    this.player.current?.pausePlayback()
  }

  public render() {
    return (
      <div className="binary-tree-insertion">
        <ActionPlayback<BinaryTree>
          ref={this.player}
          model={this.props.tree}
          definition={this.definition}
          onSceneChange={this.props.onSceneChange}
        />
      </div>
    )
  }
}
