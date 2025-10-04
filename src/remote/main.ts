import { DistanceResolver } from './distance';
import { ListingAnnotator } from './class/listing-annotator';

((): void => {
    'use strict';

    if (!location.hostname.endsWith('sreality.cz')) {
        return;
    }

    const distanceResolver = new DistanceResolver();
    const annotator = new ListingAnnotator(
        distanceResolver,
        'a[href^="/detail/"], a[href^="https://www.sreality.cz/detail/"]'
    );

    if (document.readyState === 'loading') {
        document.addEventListener(
            'DOMContentLoaded',
            () => {
                annotator.start();
            },
            { once: true }
        );
    } else {
        annotator.start();
    }
})();
