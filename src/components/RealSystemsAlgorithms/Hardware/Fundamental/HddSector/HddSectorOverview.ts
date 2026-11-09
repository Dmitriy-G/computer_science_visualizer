import type { SystemOverviewInformation } from '../../../../../visualization/SystemOverviewInformation.ts'

export class HddSectorOverview {
  public static describe(): SystemOverviewInformation {
    return {
      name: 'HDD: locating a sector and recording magnetic data',
      summary: 'A rotating magnetic platter, positioning servo, head, and read/write channel cooperate to store and recover sector data.',
      problem: 'Persistent data must be located and transferred while its recording surface moves under the head.',
      steps: [
        'Accept a host logical-sector request and resolve an illustrative internal recording location.',
        'Seek to the track and settle using servo position feedback.',
        'Wait for the requested sector to rotate under the head.',
        'Encode the write and drive magnetic transitions using head current.',
        'On a later pass, sense the weak magnetic read signal.',
        'Amplify, decode, and check the recovered data.',
        'Transfer checked sector data to the host-facing interface.',
      ],
      implementationNote: 'Conventional recording example with three symbolic tracks and eight angular positions. Host LBAs do not expose this geometry. Toy two-region coding plus parity illustrates the channel; real magnetic channels use different encoding and error control. SMR, HAMR, analog channel behavior, and OS scheduling are outside the model.',
      realWorldUsage: {
        technologies: [
          { name: 'Seagate Laptop HDD servo and read/write channel', url: 'https://www.seagate.com/www-content/support-content/samsung/internal-products/spinpoint-m-series/en-us/docs/100772113c.pdf', usage: 'Sections 8.3 and 8.4 describe servo positioning and the recording/readback path. Geometry and channel coding here are illustrative.' },
        ],
        products: [], note: 'Conventional recording example with three symbolic tracks and eight angular positions. Host LBAs do not expose this geometry. Toy two-region coding plus parity illustrates the channel; real magnetic channels use different encoding and error control. SMR, HAMR, analog channel behavior, and OS scheduling are outside the model.',
      },
    }
  }
}
