import { ListingEnrichmentContext } from './listing-enrichment-context'
import { ListingEnrichmentFragment } from './listing-enrichment-fragment'
import { Nil } from '../util/nil'

// Contract for objects that enrich listing cards with extra data.
export interface ListingEnricher {
  enrich(context: ListingEnrichmentContext): ListingEnrichmentFragment | Nil
}
