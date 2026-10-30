import { PureComponent } from 'react'
import type { ReactNode } from 'react'
import type {
  AlgorithmInformation,
  ComplexityInformation,
} from '../../../visualization/AlgorithmInformation.ts'
import './AlgorithmInfo.css'

interface AlgorithmInfoProps {
  readonly information: AlgorithmInformation | null
}

export default class AlgorithmInfo extends PureComponent<
  AlgorithmInfoProps,
  Record<string, never>
> {
  private renderComplexity(
    label: string,
    information: ComplexityInformation,
  ): ReactNode {
    return (
      <section className="algorithm-complexity" aria-label={label}>
        <h3>{label}</h3>
        <dl>
          <div>
            <dt>Best case</dt>
            <dd><code>{information.best}</code></dd>
          </div>
          <div>
            <dt>Average case</dt>
            <dd><code>{information.average}</code></dd>
          </div>
          <div>
            <dt>Worst case</dt>
            <dd><code>{information.worst}</code></dd>
          </div>
        </dl>
      </section>
    )
  }

  private renderTerms(information: AlgorithmInformation): ReactNode[] {
    const terms: ReactNode[] = []
    for (const term of information.terms) {
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
    if (!information) {
      return (
        <aside className="algorithm-info" aria-labelledby="algorithm-info-title">
          <span className="eyebrow">Algorithm overview</span>
          <h2 id="algorithm-info-title">Pick your action</h2>
          <p className="algorithm-summary">
            Choose an action from the left. Its description will appear here.
          </p>
        </aside>
      )
    }
    return (
      <aside className="algorithm-info" aria-labelledby="algorithm-info-title">
        <span className="eyebrow">Algorithm overview</span>
        <h2 id="algorithm-info-title">{information.name}</h2>
        <p className="algorithm-summary">{information.summary}</p>
        <div className="algorithm-complexities">
          {this.renderComplexity('Time complexity', information.time)}
          {this.renderComplexity('Additional memory', information.memory)}
        </div>
        <p className="complexity-explanation">
          <strong>Time.</strong> {information.time.explanation}
        </p>
        <p className="complexity-explanation">
          <strong>Memory.</strong> {information.memory.explanation}
        </p>
        {information.terms.length > 0 && (
          <>
            <h3>Terms used in this action</h3>
            <dl className="algorithm-terms">{this.renderTerms(information)}</dl>
          </>
        )}
      </aside>
    )
  }
}
