import { PureComponent, createRef } from 'react'
import type { ChangeEvent, MouseEvent, ReactNode } from 'react'
import { MenuSearchIndex } from './MenuSearchIndex.ts'
import type { DescribeSearchAlgorithm, MenuSearchResult, SearchTarget } from './MenuSearchIndex.ts'
import './MenuSearch.css'

interface MenuSearchProps {
  readonly describeAlgorithm: DescribeSearchAlgorithm
  readonly onResultSelected: (result: MenuSearchResult) => void
  readonly renderIcon: (result: MenuSearchResult) => ReactNode
}

interface MenuSearchState {
  readonly query: string
  readonly target: SearchTarget
}

export default class MenuSearch extends PureComponent<MenuSearchProps, MenuSearchState> {
  public state: MenuSearchState = { query: '', target: 'structures' }
  private readonly input = createRef<HTMLInputElement>()
  private readonly index = new MenuSearchIndex(this.props.describeAlgorithm)

  public componentDidMount(): void {
    this.focusInput()
  }

  public focusInput(): void {
    this.input.current?.focus()
  }

  private changeQuery = (event: ChangeEvent<HTMLInputElement>): void => {
    this.setState({ query: event.currentTarget.value })
  }

  private changeTarget = (event: ChangeEvent<HTMLInputElement>): void => {
    const target = event.currentTarget.value
    if (target === 'structures' || target === 'algorithms') this.setState({ target })
  }

  private selectResult = (event: MouseEvent<HTMLButtonElement>): void => {
    for (const result of this.index.find(this.state.target, this.state.query)) {
      if (result.key === event.currentTarget.dataset.result) {
        this.props.onResultSelected(result)
        return
      }
    }
  }

  private renderResults(results: readonly MenuSearchResult[]): ReactNode[] {
    const buttons: ReactNode[] = []
    for (const result of results) {
      const description = `${result.context} · ${result.description}`
      buttons.push(
        <button className="structure-choice structure-choice--labeled" key={result.key} data-result={result.key} onClick={this.selectResult}>
          <span className="usage-tags">
            <span className={`usage-tag usage-tag--${result.realSystems ? 'real-systems' : 'educational'}`}>
              {result.realSystems ? 'Real Systems' : 'Educational'}
            </span>
            {result.popular && <span className="usage-tag usage-tag--popular" title="Has at least three documented real examples.">Popular</span>}
          </span>
          <span className="structure-symbol" aria-hidden="true">{this.props.renderIcon(result)}</span>
          <span className="choice-copy">
            <strong title={result.name}>{result.name}</strong>
            <small title={description}>{description}</small>
          </span>
        </button>,
      )
    }
    return buttons
  }

  public render(): ReactNode {
    const results = this.index.find(this.state.target, this.state.query)
    const searching = this.state.query.trim().length > 0
    return (
      <div className="menu-search">
        <label className="menu-search-label" htmlFor="menu-search-query">Search by name, area of use, or real technology</label>
        <input id="menu-search-query" type="search" ref={this.input} value={this.state.query} onChange={this.changeQuery} placeholder="e.g. Redis, tree, shortest path" aria-controls="menu-search-results" />
        <fieldset className="menu-search-target">
          <legend>Search in</legend>
          <label><input type="radio" name="menu-search-target" value="structures" checked={this.state.target === 'structures'} onChange={this.changeTarget} /> Data structures</label>
          <label><input type="radio" name="menu-search-target" value="algorithms" checked={this.state.target === 'algorithms'} onChange={this.changeTarget} /> Algorithms</label>
        </fieldset>
        <p className="menu-search-status" role="status">
          {!searching ? 'Enter text to search.' : results.length === 0 ? 'No matches found.' : `${results.length} ${results.length === 1 ? 'result' : 'results'}`}
        </p>
        <nav id="menu-search-results" aria-label="Search results">{this.renderResults(results)}</nav>
      </div>
    )
  }
}
