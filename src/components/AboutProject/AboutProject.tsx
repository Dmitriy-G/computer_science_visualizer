import { PureComponent, createRef } from 'react'
import type { MouseEvent, SyntheticEvent } from 'react'
import { ActionCatalog } from '../../visualization/ActionCatalog.ts'
import { StructureCatalog } from '../../visualization/StructureCatalog.ts'
import './AboutProject.css'

interface AboutProjectProps {
  readonly open: boolean
  readonly onClose: () => void
}

export default class AboutProject extends PureComponent<
  AboutProjectProps,
  Record<string, never>
> {
  private readonly dialog = createRef<HTMLDialogElement>()
  private readonly descriptionMinimum = Math.floor(this.countDescriptions() / 100) * 100

  public componentDidMount(): void {
    this.syncDialog()
  }

  public componentDidUpdate(): void {
    this.syncDialog()
  }

  public componentWillUnmount(): void {
    this.dialog.current?.close()
  }

  private countDescriptions(): number {
    let count = StructureCatalog.structures.length
    for (const structure of StructureCatalog.structures) {
      for (const scope of ['overview', 'sorting', 'graph-traversal'] as const) {
        count += ActionCatalog.getScopedActions(structure.kind, scope).length
      }
    }
    return count
  }

  private syncDialog(): void {
    const dialog = this.dialog.current
    if (!dialog) return
    if (this.props.open && !dialog.open) dialog.showModal()
    if (!this.props.open && dialog.open) dialog.close()
  }

  private handleCancel = (event: SyntheticEvent<HTMLDialogElement>): void => {
    event.preventDefault()
    this.props.onClose()
  }

  private handleBackdrop = (event: MouseEvent<HTMLDialogElement>): void => {
    if (event.target !== event.currentTarget) return
    const bounds = event.currentTarget.getBoundingClientRect()
    if (
      event.clientX < bounds.left || event.clientX > bounds.right ||
      event.clientY < bounds.top || event.clientY > bounds.bottom
    ) this.props.onClose()
  }

  public render() {
    return (
      <dialog
        id="about-project"
        className="about-project"
        ref={this.dialog}
        onCancel={this.handleCancel}
        onClick={this.handleBackdrop}
        aria-labelledby="about-project-title"
      >
        <div className="about-project-heading">
          <button
            type="button"
            className="icon-button close-about-project"
            onClick={this.props.onClose}
            aria-label="Close project information"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <h2 id="about-project-title">About this project</h2>
        <p>
          Computer Science Visualizer is a free educational project for visualizing
          fundamental computer science concepts.
        </p>
        <p>
          I developed this application for my own learning and decided to share it
          so others can learn from it too.
        </p>
        <section aria-labelledby="about-project-contents">
          <h3 id="about-project-contents">What this application contains</h3>
          <ul className="about-project-contents">
            <li>Nearly 150 interactive data structures.</li>
            <li>Nearly 60 animated algorithms.</li>
            <li>More than {this.descriptionMinimum.toLocaleString('en')} detailed descriptions with short summaries and explanations of time complexity and memory usage.</li>
            <li>More than 30 examples of real systems that use these algorithms and data structures, with links to official documentation explaining how they are used.</li>
          </ul>
        </section>
        <footer className="about-project-footer" aria-label="Project links">
          <a
            className="icon-button"
            href="https://www.linkedin.com/in/dmytro-g-360398142"
            target="_blank"
            rel="noreferrer"
            aria-label="View my LinkedIn profile"
            title="LinkedIn profile"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124ZM7.119 20.452H3.555V9h3.564v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z" />
            </svg>
          </a>
          <a
            className="icon-button"
            href="https://github.com/Dmitriy-G/computer_science_visualizer"
            target="_blank"
            rel="noreferrer"
            aria-label="View project source code on GitHub"
            title="Source code on GitHub"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 .297a12 12 0 0 0-3.793 23.385c.6.111.82-.261.82-.577 0-.285-.011-1.04-.017-2.04-3.338.724-4.043-1.609-4.043-1.609-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.085 1.839 1.237 1.839 1.237 1.07 1.835 2.807 1.305 3.492.998.108-.776.418-1.305.762-1.605-2.665-.304-5.467-1.334-5.467-5.931 0-1.31.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.323 3.301 1.23a11.52 11.52 0 0 1 6.006 0c2.291-1.553 3.297-1.23 3.297-1.23.654 1.652.243 2.873.119 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.015 2.898-.015 3.293 0 .319.216.694.825.576A12 12 0 0 0 12 .297Z" />
            </svg>
          </a>
        </footer>
      </dialog>
    )
  }
}
