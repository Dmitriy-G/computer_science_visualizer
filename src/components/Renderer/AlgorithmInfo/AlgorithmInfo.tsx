import { PureComponent } from 'react'
import type { ReactNode } from 'react'
import type { AlgorithmInformation } from '../../../visualization/AlgorithmInformation.ts'
import './AlgorithmInfo.css'

interface AlgorithmInfoProps {
  readonly information: AlgorithmInformation
}

export default class AlgorithmInfo extends PureComponent<
  AlgorithmInfoProps,
  Record<string, never>
> {
  private renderTerms(): ReactNode[] {
    const terms: ReactNode[] = []
    for (const term of this.props.information.terms) {
      terms.push(
        <div key={term.symbol}>
          <dt>
            <code>{term.symbol}</code>
          </dt>
          <dd>{term.meaning}</dd>
        </div>,
      )
    }
    return terms
  }

  public render() {
    const information = this.props.information
    return (
      <aside className="algorithm-info" aria-labelledby="algorithm-info-title">
        <span className="eyebrow">Algorithm overview</span>
        <h2 id="algorithm-info-title">{information.name}</h2>
        <p className="algorithm-summary">{information.summary}</p>
        <dl className="algorithm-complexities">
          <div>
            <dt>Time complexity</dt>
            <dd>
              <code>{information.time.order}</code>
            </dd>
          </div>
          <div>
            <dt>Additional memory</dt>
            <dd>
              <code>{information.memory.order}</code>
            </dd>
          </div>
        </dl>
        <p className="complexity-explanation">
          <strong>Time.</strong> {information.time.explanation}
        </p>
        <p className="complexity-explanation">
          <strong>Memory.</strong> {information.memory.explanation}
        </p>
        {information.terms.length > 0 && (
          <>
            <h3>Terms used in this action</h3>
            <dl className="algorithm-terms">{this.renderTerms()}</dl>
          </>
        )}
      </aside>
    )
  }
}
