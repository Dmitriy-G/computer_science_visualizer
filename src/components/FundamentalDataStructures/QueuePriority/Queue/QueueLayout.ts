import { LinkedLayout } from '../../../../visualization/LinkedLayout.ts'

export class QueueLayout extends LinkedLayout {
  constructor() { super('queue', 'front', 'rear') }
}
