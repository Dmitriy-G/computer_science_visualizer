import { PureComponent, createRef } from 'react'
import type { MouseEvent, ReactNode, SyntheticEvent } from 'react'
import './PseudocodeDialog.css'

interface PseudocodeDialogProps {
  readonly title: string
  readonly code: string
}

export default class PseudocodeDialog extends PureComponent<PseudocodeDialogProps, Record<string, never>> {
  private readonly dialog = createRef<HTMLDialogElement>()
  private readonly trigger = createRef<HTMLButtonElement>()

  public componentWillUnmount(): void {
    this.dialog.current?.close()
  }

  private open = (): void => {
    const dialog = this.dialog.current
    if (!dialog || dialog.open) return
    dialog.showModal()
    dialog.scrollTop = 0
  }

  private close = (): void => {
    this.dialog.current?.close()
    this.trigger.current?.focus()
  }

  private cancel = (event: SyntheticEvent<HTMLDialogElement>): void => {
    event.preventDefault()
    this.close()
  }

  private dismissBackdrop = (event: MouseEvent<HTMLDialogElement>): void => {
    if (event.target !== event.currentTarget) return
    const bounds = event.currentTarget.getBoundingClientRect()
    if (event.clientX < bounds.left || event.clientX > bounds.right ||
      event.clientY < bounds.top || event.clientY > bounds.bottom) this.close()
  }

  public render(): ReactNode {
    return <>
      <button type="button" className="pseudocode-trigger" ref={this.trigger} onClick={this.open}
        aria-label={`Show pseudocode for ${this.props.title}`} title="Show pseudocode"
        aria-haspopup="dialog" aria-controls="pseudocode-dialog">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
          <path d="m8 7-5 5 5 5m8-10 5 5-5 5m-3-13-2 16" />
        </svg>
        <span>Show pseudocode</span>
      </button>
      <dialog id="pseudocode-dialog" className="pseudocode-dialog" ref={this.dialog}
        onCancel={this.cancel} onClick={this.dismissBackdrop} aria-labelledby="pseudocode-title">
        <div className="pseudocode-heading">
          <span className="eyebrow">Full pseudocode</span>
          <button type="button" className="icon-button" onClick={this.close} aria-label="Close pseudocode" autoFocus>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true" focusable="false">
              <path d="m6 6 12 12M18 6 6 18" />
            </svg>
          </button>
        </div>
        <h2 id="pseudocode-title">{this.props.title}</h2>
        <pre className="pseudocode-listing" role="region" tabIndex={0} aria-label="Full pseudocode listing"><code>{this.props.code}</code></pre>
      </dialog>
    </>
  }
}
