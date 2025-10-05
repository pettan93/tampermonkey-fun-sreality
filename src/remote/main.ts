import { DistanceEnricher } from './enrichers/distance'
import { StraitLineEnricher } from './enrichers/strait-line'
import { ListingAnnotator } from './listing-annotator'

((): void => {
  'use strict'

  if (!location.hostname.endsWith('sreality.cz')) {
    return
  }

  const enrichers = [
    new DistanceEnricher(),
    new StraitLineEnricher()
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
