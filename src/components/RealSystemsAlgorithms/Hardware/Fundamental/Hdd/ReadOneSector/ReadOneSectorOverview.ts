import { HddAccessOverview } from '../HddAccessOverview.ts'

export class ReadOneSectorOverview {
  public static describe() { return HddAccessOverview.create('read') }
}
