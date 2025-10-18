
// Aggregates fragments from multiple enrichers into a single listing view.
import { EnrichmentBadge } from './models/enrichment-badge'
import { ListingEnrichmentFragment } from './models/listing-enrichment-fragment'
import { Nil } from './util/nil'

export class ListingEnrichment {
  private readonly badges = new Map<string, EnrichmentBadge>()
  private readonly data = new Map<string, unknown>()

  merge(fragment: ListingEnrichmentFragment | Nil): void {
    if (!fragment) {
      return
    }

    fragment.badges?.forEach(badge => {
      if (!badge.id) {
        return
      }
      this.badges.set(badge.id, badge)
    })

    if (fragment.data) {
      Object.entries(fragment.data).forEach(([key, value]) => {
        if (value === undefined) {
          this.data.delete(key)
          return
        }
        this.data.set(key, value)
      })
    }
  }

  badgeTexts(): string[] {
    return Array.from(this.badges.values())
      .filter(badge => badge.text)
      .map(badge => badge.text)
  }

  dataValue<T>(key: string): T | undefined {
    if (!this.data.has(key)) {
      return undefined
    }
    return this.data.get(key) as T
  }

  cacheKey(): string {
    const badgePart = Array.from(this.badges.values())
      .sort((a, b) => a.id.localeCompare(b.id))
      .map(badge => `${badge.id}:${badge.text ?? ''}`)
      .join('|')

    const dataPart = Array.from(this.data.entries())
      .filter(([, value]) => value !== undefined)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}:${JSON.stringify(value)}`)
      .join('|')

    return [badgePart, dataPart].filter(part => part.length > 0).join('||')
  }
}
