import type { ReactNode } from 'react'
import type { ActionKind } from '../../../../visualization/ActionCatalog.ts'
import type { AlgorithmInformation } from '../../../../visualization/AlgorithmInformation.ts'
import type { StructuredTreeActionProps } from '../../../ActionPlayback/StructuredTreeAction.tsx'
import HeapInsert from './Insert/Insert.tsx'
import { InsertAnimation } from './Insert/InsertAnimation.ts'
import HeapExtractMin from './ExtractMin/ExtractMin.tsx'
import { ExtractMinAnimation } from './ExtractMin/ExtractMinAnimation.ts'
import HeapPeek from './Peek/Peek.tsx'
import { PeekAnimation } from './Peek/PeekAnimation.ts'
import HeapClear from './Clear/Clear.tsx'
import { ClearAnimation } from './Clear/ClearAnimation.ts'

export class HeapFeatures {
  public static render(action: ActionKind, props: StructuredTreeActionProps, session: number): ReactNode {
    switch (action) {
      case 'insert': return <HeapInsert key={session} {...props} />
      case 'extract-min': return <HeapExtractMin key={session} {...props} />
      case 'peek': return <HeapPeek key={session} {...props} />
      case 'clear': return <HeapClear key={session} {...props} />
      default: return null
    }
  }

  public static describe(action: ActionKind, model: StructuredTreeActionProps['model']): AlgorithmInformation | null {
    switch (action) {
      case 'insert': return InsertAnimation.describe(model.length)
      case 'extract-min': return ExtractMinAnimation.describe(model.length)
      case 'peek': return PeekAnimation.describe(model.length)
      case 'clear': return ClearAnimation.describe(model.length)
      default: return null
    }
  }
}
