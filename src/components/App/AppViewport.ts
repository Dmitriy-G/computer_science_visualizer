export class AppViewport {
  public start(): void {
    this.update()
    window.visualViewport?.addEventListener('resize', this.update)
    window.visualViewport?.addEventListener('scroll', this.update)
  }

  public stop(): void {
    window.visualViewport?.removeEventListener('resize', this.update)
    window.visualViewport?.removeEventListener('scroll', this.update)
    for (const property of ['width', 'height', 'top', 'left']) {
      document.documentElement.style.removeProperty(`--viewport-${property}`)
    }
  }

  private update = (): void => {
    // On-screen keyboards can resize this viewport without changing 100dvh.
    const viewport = window.visualViewport
    if (!viewport) return
    const style = document.documentElement.style
    style.setProperty('--viewport-width', `${viewport.width}px`)
    style.setProperty('--viewport-height', `${viewport.height}px`)
    style.setProperty('--viewport-top', `${viewport.offsetTop}px`)
    style.setProperty('--viewport-left', `${viewport.offsetLeft}px`)
  }
}
