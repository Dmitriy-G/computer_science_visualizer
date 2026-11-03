import StructuredLinearAction from '../../../../ActionPlayback/StructuredLinearAction.tsx'
import { DeleteDocumentAnimation } from './DeleteDocumentAnimation.ts'
import './DeleteDocument.css'

export default class DeleteDocument extends StructuredLinearAction {
  protected readonly sequence = DeleteDocumentAnimation
}
