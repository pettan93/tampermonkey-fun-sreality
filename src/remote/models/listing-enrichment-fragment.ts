import { EnrichmentBadge } from './enrichment-badge'

// Represents partial enrichment data provided by a single enricher.
export interface ListingEnrichmentFragment {
  readonly badges?: readonly EnrichmentBadge[]
  readonly data?: Record<string, unknown>
}
