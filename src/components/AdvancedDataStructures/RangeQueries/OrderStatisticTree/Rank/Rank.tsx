import StructuredTreeAction from '../../../../ActionPlayback/StructuredTreeAction.tsx'
import { RankAnimation } from './RankAnimation.ts'
import './Rank.css'

export default class Rank extends StructuredTreeAction {
  protected readonly sequence = RankAnimation
}
