import { LinkedLayout } from '../../../../visualization/LinkedLayout.ts'

export class DoublyLinkedListLayout extends LinkedLayout {
  constructor() { super('doubly-linked-list', 'head', 'tail') }
}
