import type { ReactNode } from 'react'
import type { ActionKind } from '../../../../visualization/ActionCatalog.ts'
import type { AlgorithmInformation } from '../../../../visualization/AlgorithmInformation.ts'
import type { LinearModel } from '../../../../visualization/LinearModel.ts'
import type { StructuredLinearActionProps } from '../../../ActionPlayback/StructuredLinearAction.tsx'
import RopeInsert from './Insert/Insert.tsx'
import { InsertAnimation as RopeInsertSequence } from './Insert/InsertAnimation.ts'
import RopeConcatenate from './Concatenate/Concatenate.tsx'
import { ConcatenateAnimation as RopeConcatenateSequence } from './Concatenate/ConcatenateAnimation.ts'
import RopeSearchByIndex from './SearchByIndex/SearchByIndex.tsx'
import { SearchByIndexAnimation as RopeSearchByIndexSequence } from './SearchByIndex/SearchByIndexAnimation.ts'
import RopeDelete from './Delete/Delete.tsx'
import { DeleteAnimation as RopeDeleteSequence } from './Delete/DeleteAnimation.ts'
import RopeClear from './Clear/Clear.tsx'
import { ClearAnimation as RopeClearSequence } from './Clear/ClearAnimation.ts'

export class RopeFeatures {
  public static render(action: ActionKind, props: StructuredLinearActionProps, session: number): ReactNode {
    switch (action) {
      case 'insert': return <RopeInsert key={session} {...props} />
      case 'concatenate': return <RopeConcatenate key={session} {...props} />
      case 'search-index': return <RopeSearchByIndex key={session} {...props} />
      case 'delete-index': return <RopeDelete key={session} {...props} />
      case 'clear': return <RopeClear key={session} {...props} />
      default: return null
    }
  }

  public static describe(action: ActionKind, model: LinearModel): AlgorithmInformation | null {
    switch (action) {
      case 'insert': return RopeInsertSequence.describe(model.length)
      case 'concatenate': return RopeConcatenateSequence.describe(model.length)
      case 'search-index': return RopeSearchByIndexSequence.describe(model.length)
      case 'delete-index': return RopeDeleteSequence.describe(model.length)
      case 'clear': return RopeClearSequence.describe(model.length)
      default: return null
    }
  }
}
