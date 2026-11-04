import StructuredLinearAction from '../../../../ActionPlayback/StructuredLinearAction.tsx'
import { IndexDocumentAnimation } from './IndexDocumentAnimation.ts'
import './IndexDocument.css'

export default class IndexDocument extends StructuredLinearAction {
  protected readonly sequence = IndexDocumentAnimation
}
