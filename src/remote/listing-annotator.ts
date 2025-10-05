import { ListingEnrichment } from './enrichers/listing-enrichment'
import { ListingEnricher } from './models/listing-enricher'

// Observes listing cards and applies enrichers to them.
export class ListingAnnotator {
  private readonly processedElements = new WeakMap<HTMLElement, string>()
  private readonly onMutations: MutationCallback = () => this.scheduleScan()
  private readonly onPopState = (_event: PopStateEvent): void => this.scheduleScan()

  private observer: MutationObserver | null = null
  private scheduled = false
  private initialized = false
  private historyPatched = false

  constructor(
    private readonly enrichers: readonly ListingEnricher[],
    private readonly anchorSelector: string
  ) {}

  start(): void {
    const body = document.body
    if (!body) {
      requestAnimationFrame(() => {
        this.start()
      })
      return
    }

    if (!this.initialized) {
      this.initialized = true
      this.patchHistory()
      window.addEventListener('popstate', this.onPopState)
      this.observer = new MutationObserver(this.onMutations)
      this.observer.observe(body, { childList: true, subtree: true })
    }

    this.scan()
  }

  private ensureOriginalText(element: HTMLElement): string {
    const existing = element.dataset.tmOriginalLocation
    if (existing !== undefined) {
      return existing
    }
    const originalText = element.textContent?.trim() ?? ''
    element.dataset.tmOriginalLocation = originalText
    return originalText
  }

  private annotateElement(element: HTMLElement, enrichment: ListingEnrichment): void {
    const badgeTexts = enrichment.badgeTexts()
    const value = badgeTexts.length ? badgeTexts.join(' • ') : 'n/a'
    let badge = element.querySelector<HTMLSpanElement>('.tm-enhance')
    if (!badge) {
      badge = document.createElement('span')
      badge.className = 'tm-enhance'
      badge.style.whiteSpace = 'nowrap'
      badge.style.fontWeight = 'normal'
      badge.style.marginLeft = '0.25em'
      badge.style.fontSize = 'inherit'
      element.appendChild(document.createTextNode(' '))
      element.appendChild(badge)
    }
    badge.textContent = `(${value})`
  }

  private detectLocationElement(card: HTMLElement): HTMLParagraphElement | null {
    const paragraphs = Array.from(card.querySelectorAll<HTMLParagraphElement>('p'))
    if (!paragraphs.length) {
      return null
    }

    const candidates = paragraphs.length > 1 ? paragraphs.slice(1) : paragraphs
    for (const paragraph of candidates) {
      const original = this.ensureOriginalText(paragraph)
      if (!original) {
        continue
      }
      const lower = original.toLowerCase()
      if (lower.includes('kč') || lower.includes('eur') || lower.includes('€')) {
        continue
      }
      return paragraph
    }

    return null
  }

  private processCard(card: HTMLElement): void {
    const locationElement = this.detectLocationElement(card)
    if (!locationElement) {
      return
    }

    const originalText = this.ensureOriginalText(locationElement)
    if (!originalText) {
      return
    }

    const enrichment = new ListingEnrichment()
    this.enrichers.forEach(enricher => {
      const fragment = enricher.enrich({ card, locationText: originalText })
      enrichment.merge(fragment)
    })

    const key = `${originalText}|${enrichment.cacheKey() || 'none'}`
    if (this.processedElements.get(locationElement) === key) {
      return
    }

    this.annotateElement(locationElement, enrichment)
    this.processedElements.set(locationElement, key)
  }

  private scan(): void {
    const cards = document.querySelectorAll<HTMLElement>(this.anchorSelector)
    cards.forEach(card => this.processCard(card))
  }

  private scheduleScan(): void {
    if (this.scheduled) {
      return
    }
    this.scheduled = true
    requestAnimationFrame(() => {
      this.scheduled = false
      this.scan()
    })
  }

  private patchHistory(): void {
    if (this.historyPatched) {
      return
    }
    this.historyPatched = true

    const originalPushState = history.pushState.bind(history)
    history.pushState = ((...args: Parameters<History['pushState']>) => {
      const result = originalPushState(...args)
      this.scheduleScan()
      return result
    }) as History['pushState']

    const originalReplaceState = history.replaceState.bind(history)
    history.replaceState = ((...args: Parameters<History['replaceState']>) => {
      const result = originalReplaceState(...args)
      this.scheduleScan()
      return result
    }) as History['replaceState']
  }
}
