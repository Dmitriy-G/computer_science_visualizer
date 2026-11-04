import { LinkedLayout } from '../../../../visualization/LinkedLayout.ts'

export class DequeLayout extends LinkedLayout {
  constructor() { super('deque', 'front', 'back') }
}
