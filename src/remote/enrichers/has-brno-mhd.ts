import { ListingEnricher } from '../models/listing-enricher'
import { ListingEnrichmentContext } from '../models/listing-enrichment-context'
import { ListingEnrichmentFragment } from '../models/listing-enrichment-fragment'
import { ListingDataLookup } from '../util/listing-data'
import { Nil } from '../util/nil'

// Sets a flag when listing supports Brno MHD transport.
export class HasBrnoMhdEnricher implements ListingEnricher {
  enrich({ card }: ListingEnrichmentContext): ListingEnrichmentFragment {
    const listingId = ListingDataLookup.listingIdFromCard(card)
    const nextData = ListingDataLookup.readNextData()

    let hasBrnoMhd = false

    if (listingId && nextData) {
      const flag = ListingDataLookup.searchListing(nextData, listingId, record =>
        HasBrnoMhdEnricher.extractFlag(record)
      )
      hasBrnoMhd = flag === true
    }

    return {
      data: {
        hasBrnoMhd: hasBrnoMhd ? true : undefined
      }
    }
  }

  private static extractFlag(record: Record<string, unknown>): boolean | Nil {
    const candidate = record.hasBrnoMhd ?? record.brnoMhd ?? record.has_brno_mhd
    if (typeof candidate === 'boolean') {
      return candidate
    }
    return null
  }
}
