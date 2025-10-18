import { Nil } from './nil'

// Helps reading listing-related data exposed by Next.js payload.
export class ListingDataLookup {
  private static readonly ID_KEYS = [
    'id',
    'hashId',
    'hash_id',
    'estateId',
    'estate_id',
    'itemId'
  ] as const

  static listingIdFromCard(card: HTMLElement): string | Nil {
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

  static readNextData(): unknown {
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

  static searchListing<T>(root: unknown, listingId: string, extractor: (record: Record<string, unknown>) => T | Nil): T | Nil {
    return ListingDataLookup.walk(root, listingId, null, extractor)
  }

  private static walk<T>(node: unknown, listingId: string, currentId: string | Nil, extractor: (record: Record<string, unknown>) => T | Nil): T | Nil {
    if (!node || typeof node !== 'object') {
      return null
    }

    if (Array.isArray(node)) {
      for (const item of node) {
        const match = ListingDataLookup.walk(item, listingId, currentId, extractor)
        if (match !== null && match !== undefined) {
          return match
        }
      }
      return null
    }

    const record = node as Record<string, unknown>
    const nextId = ListingDataLookup.extractId(record) ?? currentId

    if (nextId === listingId) {
      const direct = extractor(record)
      if (direct !== null && direct !== undefined) {
        return direct
      }
    }

    for (const value of Object.values(record)) {
      const match = ListingDataLookup.walk(value, listingId, nextId, extractor)
      if (match !== null && match !== undefined) {
        return match
      }
    }

    return null
  }

  private static extractId(record: Record<string, unknown>): string | Nil {
    for (const key of ListingDataLookup.ID_KEYS) {
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
}
