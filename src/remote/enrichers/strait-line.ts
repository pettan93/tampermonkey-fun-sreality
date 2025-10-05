import { ListingEnricher } from '../models/listing-enricher'
import { ListingEnrichmentContext } from '../models/listing-enrichment-context'
import { ListingEnrichmentFragment } from '../models/listing-enrichment-fragment'
import { EnrichmentBadge } from '../models/enrichment-badge'
import { GPSCoordinates } from '../models/gps-coordinates'
import { Nil } from '../util/nil'

// Calculates straight-line distance to Brno center using GPS data.
export class StraitLineEnricher implements ListingEnricher {
  constructor(
    private readonly originLatitude = 49.1948011,
    private readonly originLongitude = 16.6086014
  ) {}

  enrich({ card }: ListingEnrichmentContext): ListingEnrichmentFragment {
    const listingId = StraitLineEnricher.extractListingId(card)
    const nextData = StraitLineEnricher.readNextData()

    let distance: number | Nil = null

    if (listingId && nextData) {
      const coordinates = StraitLineEnricher.findCoordinates(nextData, listingId, null)
      if (coordinates) {
        const rawDistance = StraitLineEnricher.computeDistanceKm(
          coordinates.latitude,
          coordinates.longitude,
          this.originLatitude,
          this.originLongitude
        )

        if (Number.isFinite(rawDistance)) {
          distance = Number(rawDistance.toFixed(3))
        }
      }
    }

    return StraitLineEnricher.composeFragment(distance)
  }

  private static extractListingId(card: HTMLElement): string | Nil {
    if (card instanceof HTMLAnchorElement) {
      const rawHref = card.getAttribute('href') ?? card.href
      if (rawHref) {
        const idMatch = rawHref.match(/(\d{6,})/)
        if (idMatch) {
          return idMatch[1]
        }
      }
    }

    const datasetId = (card as HTMLElement & { dataset?: DOMStringMap }).dataset?.tmListingId
    if (datasetId) {
      return datasetId
    }

    return null
  }

  private static readNextData(): unknown {
    const script = document.getElementById('__NEXT_DATA__')
    const text = script?.textContent ?? script?.innerHTML
    if (!text) {
      return null
    }

    try {
      return JSON.parse(text)
    } catch {
      return null
    }
  }

  private static findCoordinates(node: unknown, targetId: string, currentId: string | Nil): GPSCoordinates | Nil {
    if (!node || typeof node !== 'object') {
      return null
    }

    if (Array.isArray(node)) {
      for (const item of node) {
        const match = StraitLineEnricher.findCoordinates(item, targetId, currentId)
        if (match) {
          return match
        }
      }
      return null
    }

    const record = node as Record<string, unknown>
    const nextId = StraitLineEnricher.extractId(record) ?? currentId

    if (nextId === targetId) {
      const direct = StraitLineEnricher.extractCoordinates(record)
      if (direct) {
        return direct
      }
    }

    for (const value of Object.values(record)) {
      const match = StraitLineEnricher.findCoordinates(value, targetId, nextId)
      if (match) {
        return match
      }
    }

    return null
  }

  private static extractId(record: Record<string, unknown>): string | Nil {
    const idKeys: readonly string[] = [
      'id',
      'hashId',
      'hash_id',
      'estateId',
      'estate_id',
      'itemId'
    ]

    for (const key of idKeys) {
      const value = record[key]
      if (typeof value === 'number' || typeof value === 'string') {
        const trimmed = String(value).trim()
        if (trimmed.length) {
          return trimmed
        }
      }
    }

    return null
  }

  private static composeFragment(distance: number | Nil): ListingEnrichmentFragment {
    const badge: EnrichmentBadge = {
      id: 'straight-line',
      text: StraitLineEnricher.formatBadge(distance),
      title: 'Straight-line distance to Brno city center'
    }

    return {
      badges: [badge],
      data: {
        straightLineDistanceKm: distance ?? null
      }
    }
  }

  private static formatBadge(distance: number | Nil): string {
    if (typeof distance === 'number') {
      return `⭸ ${Math.round(distance)}km`
    }
    return '⭸ n/a'
  }

  private static extractCoordinates(record: Record<string, unknown>): GPSCoordinates | Nil {
    const latitude = StraitLineEnricher.extractNumber(record, ['latitude', 'lat', 'y'])
    const longitude = StraitLineEnricher.extractNumber(record, ['longitude', 'lon', 'lng', 'long', 'x'])

    if (latitude == null || longitude == null) {
      return null
    }

    if (!StraitLineEnricher.isValidLatitude(latitude) || !StraitLineEnricher.isValidLongitude(longitude)) {
      return null
    }

    return { latitude, longitude }
  }

  private static extractNumber(record: Record<string, unknown>, keys: readonly string[]): number | Nil {
    for (const key of keys) {
      const value = record[key]
      if (typeof value === 'number') {
        return value
      }
      if (typeof value === 'string') {
        const parsed = Number(value)
        if (Number.isFinite(parsed)) {
          return parsed
        }
      }
    }
    return null
  }

  private static isValidLatitude(value: number): boolean {
    return value >= -90 && value <= 90
  }

  private static isValidLongitude(value: number): boolean {
    return value >= -180 && value <= 180
  }

  private static computeDistanceKm(
    fromLat: number,
    fromLon: number,
    toLat: number,
    toLon: number
  ): number {
    const rad = Math.PI / 180
    const dLat = (toLat - fromLat) * rad
    const dLon = (toLon - fromLon) * rad
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(fromLat * rad) * Math.cos(toLat * rad) * Math.sin(dLon / 2) ** 2
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const earthRadiusKm = 6371
    return earthRadiusKm * c
  }
}
