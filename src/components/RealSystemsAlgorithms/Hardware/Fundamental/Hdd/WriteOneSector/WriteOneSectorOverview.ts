import { HddAccessOverview } from '../HddAccessOverview.ts'

export class WriteOneSectorOverview {
  public static describe() { return HddAccessOverview.create('write') }
}
