import { CityDistanceMap, DISTANCE_BY_CITY } from './city-distances'
import { EnrichmentBadge } from '../models/enrichment-badge'
import { ListingEnricher } from '../models/listing-enricher'
import { ListingEnrichmentContext } from '../models/listing-enrichment-context'
import { ListingEnrichmentFragment } from '../models/listing-enrichment-fragment'
import { Nil } from '../util/nil'

// Describes the resolved city and its distance.
interface DistanceResult {
  readonly city: string
  readonly distance: number | undefined
}

// Provides distance information based on the textual location.
export class DistanceEnricher implements ListingEnricher {
  constructor(private readonly distanceByCity: CityDistanceMap = DISTANCE_BY_CITY) {}

  enrich({ locationText }: ListingEnrichmentContext): ListingEnrichmentFragment | Nil {
    if (!locationText.trim()) {
      return null
    }

    const result = this.resolve(locationText)
    const badge: EnrichmentBadge = {
      id: 'distance',
      text: typeof result.distance === 'number' ? `${Math.round(result.distance)}km` : 'n/a',
      title: result.city ? `Distance for ${result.city}` : undefined
    }

    return {
      badges: [badge],
      data: {
        distanceKm: result.distance,
        distanceCity: result.city
      }
    }
  }

  private resolve(locationText: string): DistanceResult {
    const candidates = DistanceEnricher.collectCandidates(locationText)
    for (const candidate of candidates) {
      const normalized = DistanceEnricher.normalizeName(candidate)
      if (Object.prototype.hasOwnProperty.call(this.distanceByCity, normalized)) {
        return {
          city: candidate,
          distance: this.distanceByCity[normalized]
        }
      }
    }

    if (candidates.length) {
      const primary = candidates[0]
      const fallback = DistanceEnricher.normalizeName(primary.split(/[\s-]/)[0])
      if (Object.prototype.hasOwnProperty.call(this.distanceByCity, fallback)) {
        return {
          city: primary,
          distance: this.distanceByCity[fallback]
        }
      }
    }

    return {
      city: candidates[0] ?? '',
      distance: undefined
    }
  }

  private static normalizeName(name: string | Nil): string {
    if (!name) {
      return ''
    }
    return name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase()
  }

  private static stripParentheses(value: string): string {
    return value
      .replace(/\s*\(.*?\)\s*/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  }

  private static collectCandidates(locationText: string): string[] {
    const results: string[] = []
    const add = (value: string): void => {
      const trimmed = value.trim()
      if (trimmed && !results.includes(trimmed)) {
        results.push(trimmed)
      }
    }

    const base = DistanceEnricher.stripParentheses(locationText)
    add(base)
    base.split(',').forEach(candidate => add(candidate))
    base.split('/').forEach(candidate => add(candidate))

    const separators: readonly string[] = [' - ', ' – ']
    results.slice().forEach(candidate => {
      separators.forEach(sep => {
        if (candidate.includes(sep)) {
          const [firstPart] = candidate.split(sep)
          add(firstPart)
        }
      })
    })

    return results
  }
}
