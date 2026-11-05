import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { ContentAddressedLayersLayout } from '../ContentAddressedLayersLayout.ts'

export class VerifyAnimation extends LinearAnimation {
  public static readonly title = 'Verify identities'
  public static readonly summary = 'Recompute content and chain hashes for every stored layer.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(n)', average: 'O(n)', worst: 'O(n²)', explanation: 'Check each layer once with bounded integer payloads and fixed-size SHA-256 digests. Assumes average constant-time map access; no filesystem or external trusted-root verification is performed. The average bound assumes constant-time map access; conservative linear worst-case map access can make total work quadratic. Rows state upper bounds; empty, rejected, and early-return cases may finish sooner.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'Includes operation working storage and returned output. Playback clones, trace snapshots, and scene storage are excluded. Empty operations can use constant storage.' },
      terms: [
        { symbol: 'n', meaning: `Logical entries before the operation; currently ${size}.` },
        { symbol: 'O(n)', meaning: 'Linear work under average constant-time map access.' },
        { symbol: 'O(n²)', meaning: 'Quadratic upper bound with linear worst-case map access.' },
        { symbol: 'O(1)', meaning: 'Additional working and output storage for the operation.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new ContentAddressedLayersLayout(), 'verify-proof', input, VerifyAnimation.title, VerifyAnimation.summary)
  }
}
