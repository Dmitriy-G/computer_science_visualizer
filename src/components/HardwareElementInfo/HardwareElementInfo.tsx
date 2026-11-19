import { PureComponent, createRef } from 'react'
import type { MouseEvent, ReactNode, SyntheticEvent } from 'react'
import { HardwareElementCatalog } from '../../visualization/HardwareElementCatalog.ts'
import type { HardwareElementInformation } from '../../visualization/HardwareElementInformation.ts'
import './HardwareElementInfo.css'

interface HardwareElementInfoProps {
  readonly elementId: string | null
  readonly title: string | null
  readonly onClose: () => void
}

export default class HardwareElementInfo extends PureComponent<HardwareElementInfoProps, Record<string, never>> {
  private readonly dialog = createRef<HTMLDialogElement>()
  private readonly content = createRef<HTMLDivElement>()

  public componentDidMount(): void { this.syncDialog() }

  public componentDidUpdate(previousProps: HardwareElementInfoProps): void {
    this.syncDialog()
    if (previousProps.elementId !== this.props.elementId && this.content.current) this.content.current.scrollTop = 0
  }

  public componentWillUnmount(): void { this.dialog.current?.close() }

  private syncDialog(): void {
    const dialog = this.dialog.current
    if (!dialog) return
    if (this.props.title !== null && !dialog.open) {
      dialog.showModal()
      if (this.content.current) this.content.current.scrollTop = 0
    }
    if (this.props.title === null && dialog.open) dialog.close()
  }

  private cancel = (event: SyntheticEvent<HTMLDialogElement>): void => {
    event.preventDefault()
    this.props.onClose()
  }

  private dismissBackdrop = (event: MouseEvent<HTMLDialogElement>): void => {
    if (event.target !== event.currentTarget) return
    const bounds = event.currentTarget.getBoundingClientRect()
    if (event.clientX < bounds.left || event.clientX > bounds.right ||
      event.clientY < bounds.top || event.clientY > bounds.bottom) this.props.onClose()
  }

  private renderPhotos(information: HardwareElementInformation): ReactNode[] {
    const photos: ReactNode[] = []
    for (const photo of information.photos) photos.push(
      <figure className={`hardware-element-photo${photo.fullWidth ? ' hardware-element-photo--wide' : ''}`} key={`${photo.src}-${photo.caption}`}>
        <img src={photo.src} alt={photo.alt} width={photo.width} height={photo.height}
          decoding="async" />
        <figcaption>
          <strong>{photo.caption}</strong>
          {photo.description && <p>{photo.description}</p>}
          {!photo.hideCredit && photo.author && photo.license && <span className="hardware-element-photo-credit">
            {photo.sourceUrl ? <a href={photo.sourceUrl} target="_blank" rel="noreferrer">{photo.author}</a> : photo.author}
            {' · '}{photo.licenseUrl ? <a href={photo.licenseUrl} target="_blank" rel="noreferrer">{photo.license}</a> : photo.license}
            {' · '}{photo.changes ?? 'Resized from original'}
          </span>}
        </figcaption>
      </figure>,
    )
    return photos
  }

  private renderInformation(information: HardwareElementInformation): ReactNode {
    const characteristics: ReactNode[] = []
    for (const characteristic of information.characteristics) characteristics.push(
      <div key={characteristic.name}><dt>{characteristic.name}</dt><dd>{characteristic.value}</dd></div>,
    )
    const documentation: ReactNode[] = []
    for (const document of information.documentation) documentation.push(
      <li key={document.url}><a href={document.url} target="_blank" rel="noreferrer">{document.title}</a></li>,
    )
    return <>
      {information.photos.length > 0 && <div className="hardware-element-photos" aria-label="Component photographs">{this.renderPhotos(information)}</div>}
      <section aria-labelledby="hardware-element-overview-title">
        <h3 id="hardware-element-overview-title">Overview</h3>
        <p>{information.overview}</p>
      </section>
      <section aria-labelledby="hardware-element-problem-title">
        <h3 id="hardware-element-problem-title">Problem it solves</h3>
        <p>{information.problem}</p>
      </section>
      <section aria-labelledby="hardware-element-characteristics-title">
        <h3 id="hardware-element-characteristics-title">Key characteristics</h3>
        <p className="hardware-element-note">{information.characteristicNote}</p>
        <dl className="hardware-element-characteristics">{characteristics}</dl>
      </section>
      <section aria-labelledby="hardware-element-documentation-title">
        <h3 id="hardware-element-documentation-title">Official documentation</h3>
        <ul className="hardware-element-documentation">{documentation}</ul>
      </section>
    </>
  }

  public render(): ReactNode {
    const information = HardwareElementCatalog.get(this.props.elementId)
    return <dialog id="hardware-element-info" className={`hardware-element-info${information ? ' hardware-element-info--populated' : ''}`} ref={this.dialog}
      onCancel={this.cancel} onClick={this.dismissBackdrop} aria-labelledby="hardware-element-info-title">
      <div className="hardware-element-info-heading">
        <h2 id="hardware-element-info-title">{this.props.title}</h2>
        <button type="button" className="icon-button" onClick={this.props.onClose} aria-label="Close element information" autoFocus>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true" focusable="false">
            <path d="m6 6 12 12M18 6 6 18" />
          </svg>
        </button>
      </div>
      <div className="hardware-element-info-content" ref={this.content}>{information && this.renderInformation(information)}</div>
    </dialog>
  }
}
