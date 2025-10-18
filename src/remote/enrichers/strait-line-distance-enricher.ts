import { ListingEnricher } from '../models/listing-enricher'
import { ListingEnrichmentContext } from '../models/listing-enrichment-context'
import { ListingEnrichmentFragment } from '../models/listing-enrichment-fragment'
import { EnrichmentBadge } from '../models/enrichment-badge'
import { GPSCoordinates } from '../models/gps-coordinates'
import { ListingDataLookup } from '../util/listing-data'
import { Nil } from '../util/nil'

// Calculates straight-line distance to Brno center using GPS data.
export class StraitLineDistanceEnricher implements ListingEnricher {
  constructor(
    private readonly originLatitude = 49.1948011,
    private readonly originLongitude = 16.6086014
  ) {}

  enrich({ card }: ListingEnrichmentContext): ListingEnrichmentFragment {
    const listingId = ListingDataLookup.listingIdFromCard(card)
    const nextData = ListingDataLookup.readNextData()

    let distance: number | Nil = null

    if (listingId && nextData) {
      const coordinates = ListingDataLookup.searchListing(nextData, listingId, record =>
        StraitLineDistanceEnricher.extractCoordinates(record)
      )
      if (coordinates) {
        const rawDistance = StraitLineDistanceEnricher.computeDistanceKm(
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

    return StraitLineDistanceEnricher.composeFragment(distance)
  }

  private static composeFragment(distance: number | Nil): ListingEnrichmentFragment {
    const badge: EnrichmentBadge = {
      id: 'straight-line',
      text: StraitLineDistanceEnricher.formatBadge(distance),
      title: 'Straight-line distance to Brno city center'
    }

    return {
      badges: [badge],
      data: {
        straightLineDistanceKm: distance ?? undefined
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
    const latitude = StraitLineDistanceEnricher.extractNumber(record, ['latitude', 'lat', 'y'])
    const longitude = StraitLineDistanceEnricher.extractNumber(record, ['longitude', 'lon', 'lng', 'long', 'x'])

    if (latitude == null || longitude == null) {
      return null
    }

    if (!StraitLineDistanceEnricher.isValidLatitude(latitude) || !StraitLineDistanceEnricher.isValidLongitude(longitude)) {
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
