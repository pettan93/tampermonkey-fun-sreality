import { DistanceEnricher } from './enrichers/distance'
import { StraitLineDistanceEnricher } from './enrichers/strait-line-distance-enricher'
import { HasBrnoMhdEnricher } from './enrichers/has-brno-mhd'
import { ListingAnnotator } from './listing-annotator'
;((): void => {
  'use strict'

  if (!location.hostname.endsWith('sreality.cz')) {
    return
  }

  const enrichers = [
    new DistanceEnricher(),
    new StraitLineDistanceEnricher(),
    new HasBrnoMhdEnricher()
  ]
  const annotator = new ListingAnnotator(
    enrichers,
    'a[href^="/detail/"], a[href^="https://www.sreality.cz/detail/"]'
  )

  if (document.readyState === 'loading') {
    document.addEventListener(
      'DOMContentLoaded',
      () => {
        annotator.start()
      },
      { once: true }
    )
  } else {
    annotator.start()
  }
})()
