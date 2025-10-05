(function () {
    'use strict';

    // models/listing-enrichment-context.ts


    // models/enrichment-badge.ts


    // models/listing-enrichment-fragment.ts


    // util/nil.ts


    // models/listing-enricher.ts


    // enrichers/city-distances.ts
    const DISTANCE_BY_CITY = Object.freeze({
        'adamov': 11.93,
        'babice nad svitavou': 11.77,
        'bilovice nad svitavou': 7.51,
        'blansko': 19.12,
        'blatnice pod svatym antoninkem': 68.41,
        'blazovice': 13.44,
        'blizkovice': 60.25,
        'blucina': 15.81,
        'boretice': 36.13,
        'boritov': 25.6,
        'boskovice': 32.75,
        'bosovice': 22.97,
        'bozice': 46.08,
        'breclav': 53.1,
        'brezi': 41.88,
        'brezina': 14.48,
        'brno': 0,
        'brumovice': 33.51,
        'bucovice': 29.32,
        'bzenec': 54.03,
        'cebin': 16.13,
        'cejc': 38.01,
        'cejkovice': 40.39,
        'cerna hora': 24.38,
        'ceska': 9.92,
        'chudcice': 14.95,
        'damborice': 28.56,
        'deblin': 23.47,
        'dobsice': 54.14,
        'dolni bojanovice': 48.43,
        'dolni dunajovice': 37.88,
        'dolni kounice': 17.3,
        'dolni loucky': 25.77,
        'domanin': 53.84,
        'doubravice nad svitavou': 26.92,
        'drasov': 17.85,
        'drnholec': 38.55,
        'drnovice': 30.86,
        'dubnany': 46.87,
        'hevlin': 51.92,
        'hlohovec': 48.17,
        'hodejice': 23.1,
        'hodonice': 51.3,
        'hodonin': 53.67,
        'holasice': 13.25,
        'holubice': 15.06,
        'hosteradice': 37.18,
        'hovorany': 38.81,
        'hroznova lhota': 67.13,
        'hrusky': 52.15,
        'hrusovany nad jevisovkou': 43.24,
        'hrusovany u brna': 17.41,
        'hustopece': 29.83,
        'ivancice': 19.65,
        'ivanovice na hane': 37.4,
        'jaroslavice': 55.84,
        'jedovnice': 19.84,
        'jevisovice': 50.5,
        'kanice': 10.94,
        'klobouky u brna': 28.87,
        'knezdub': 66.94,
        'kobyli': 35.78,
        'kobylnice': 11.09,
        'kostice': 56.75,
        'krenovice': 17.22,
        'krepice': 23.21,
        'krumvir': 31.83,
        'kunstat': 35.23,
        'kurim': 12.74,
        'kyjov': 42.82,
        'ladna': 47.46,
        'lanzhot': 58.56,
        'lednice': 46.22,
        'lelekovice': 10.91,
        'letonice': 25.69,
        'letovice': 39.22,
        'lipov': 70.16,
        'lipovec': 25.49,
        'lipuvka': 16.62,
        'lomnice': 27.19,
        'luzice': 51.93,
        'lysice': 28.97,
        'malhostovice': 17.18,
        'menin': 14.05,
        'mikulcice': 53.13,
        'mikulov': 43.39,
        'milotice': 47.16,
        'miroslav': 34.87,
        'modrice': 7.48,
        'mokra-horakov': 10.97,
        'moravany': 5.93,
        'moravska nova ves': 52.74,
        'moravske kninice': 13.32,
        'moravsky krumlov': 26.92,
        'moravsky pisek': 57.56,
        'moravsky zizkov': 46.72,
        'moutnice': 18.79,
        'mutenice': 44.66,
        'nedvedice': 35.2,
        'nesovice': 34.82,
        'nosislav': 20.44,
        'novosedly': 40.66,
        'novy saldorf-sedlesovice': 56.85,
        'ochoz u brna': 11.54,
        'olbramovice': 27.71,
        'olesnice': 42.48,
        'olomucany': 15.83,
        'opatovice': 13.57,
        'orechov': 11.12,
        'oslavany': 21.2,
        'ostopovice': 5.84,
        'ostrov u macochy': 23.71,
        'otnice': 19.34,
        'petrov': 60.06,
        'podivin': 44.7,
        'podoli': 8.31,
        'pohorelice': 24.52,
        'popuvky': 8.88,
        'pozorice': 13.47,
        'predklasteri': 22.95,
        'pribice': 26.06,
        'prusanky': 49.05,
        'pustimer': 33.7,
        'racice-pistovice': 21.31,
        'rajec-jestrebi': 24.07,
        'rajecko': 22.19,
        'rajhrad': 11.65,
        'rajhradice': 11.57,
        'rakvice': 40.38,
        'ratiskovice': 50.93,
        'rebesovice': 10.21,
        'ricany': 15.64,
        'rohatec': 54.68,
        'rosice': 15.97,
        'rousinov': 20.03,
        'rozdrojovice': 9.66,
        'sakvice': 34,
        'sanov': 46.88,
        'saratice': 16.71,
        'sardice': 40.02,
        'satov': 62.39,
        'sitborice': 23.71,
        'sivice': 12.81,
        'slapanice': 9.24,
        'slavkov u brna': 20.15,
        'sokolnice': 12.29,
        'strachotice': 54.51,
        'straznice': 61.21,
        'strelice': 8.85,
        'suchohrdly': 52.55,
        'sudomerice': 59.79,
        'svabenice': 38.64,
        'svatoborice-mistrin': 42.69,
        'svitavka': 34.12,
        'syrovice': 13.54,
        'tasovice': 51.72,
        'telnice': 13.13,
        'tesany': 20.98,
        'tetcice': 14.87,
        'tisnov': 21.61,
        'troubsko': 7.53,
        'tvarozna': 11.98,
        'tvrdonice': 55.99,
        'tynec': 54.91,
        'uhercice': 25.49,
        'ujezd u brna': 14.89,
        'unanov': 51.35,
        'vacenovice': 49.8,
        'valtice': 51.66,
        'velesovice': 17.71,
        'velka nad velickou': 75.13,
        'velke bilovice': 43.72,
        'velke nemcice': 23.1,
        'velke opatovice': 46.71,
        'velke pavlovice': 35.7,
        'veseli nad moravou': 62.52,
        'veverska bityska': 15.26,
        'vinicne sumice': 16.02,
        'visnove': 40.79,
        'vlkos': 46.54,
        'vnorovy': 61.63,
        'vojkovice': 15.97,
        'vracov': 50.34,
        'vranovice': 25.46,
        'vrbice': 37.67,
        'vrbovec': 57.4,
        'vyskov': 29.72,
        'zabcice': 20.4,
        'zajeci': 37.66,
        'zarosice': 31.35,
        'zastavka': 17.72,
        'zbraslav': 22.9,
        'zbysov': 19.21,
        'zdanice': 33.75,
        'zelesice': 8.88,
        'zidlochovice': 17.31,
        'znojmo': 55.17
    });

    // enrichers/distance.ts
    // Provides distance information based on the textual location.
    class DistanceEnricher {
        constructor(distanceByCity = DISTANCE_BY_CITY) {
            this.distanceByCity = distanceByCity;
        }
        enrich({ locationText }) {
            if (!locationText.trim()) {
                return null;
            }
            const result = this.resolve(locationText);
            const badge = {
                id: 'distance',
                text: typeof result.distance === 'number' ? `${Math.round(result.distance)}km` : 'n/a',
                title: result.city ? `Distance for ${result.city}` : undefined
            };
            return {
                badges: [badge],
                data: {
                    distanceKm: result.distance,
                    distanceCity: result.city
                }
            };
        }
        resolve(locationText) {
            var _a;
            const candidates = DistanceEnricher.collectCandidates(locationText);
            for (const candidate of candidates) {
                const normalized = DistanceEnricher.normalizeName(candidate);
                if (Object.prototype.hasOwnProperty.call(this.distanceByCity, normalized)) {
                    return {
                        city: candidate,
                        distance: this.distanceByCity[normalized]
                    };
                }
            }
            if (candidates.length) {
                const primary = candidates[0];
                const fallback = DistanceEnricher.normalizeName(primary.split(/[\s-]/)[0]);
                if (Object.prototype.hasOwnProperty.call(this.distanceByCity, fallback)) {
                    return {
                        city: primary,
                        distance: this.distanceByCity[fallback]
                    };
                }
            }
            return {
                city: (_a = candidates[0]) !== null && _a !== void 0 ? _a : '',
                distance: undefined
            };
        }
        static normalizeName(name) {
            if (!name) {
                return '';
            }
            return name
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/\s+/g, ' ')
                .trim()
                .toLowerCase();
        }
        static stripParentheses(value) {
            return value
                .replace(/\s*\(.*?\)\s*/g, ' ')
                .replace(/\s+/g, ' ')
                .trim();
        }
        static collectCandidates(locationText) {
            const results = [];
            const add = (value) => {
                const trimmed = value.trim();
                if (trimmed && !results.includes(trimmed)) {
                    results.push(trimmed);
                }
            };
            const base = DistanceEnricher.stripParentheses(locationText);
            add(base);
            base.split(',').forEach(candidate => add(candidate));
            base.split('/').forEach(candidate => add(candidate));
            const separators = [' - ', ' – '];
            results.slice().forEach(candidate => {
                separators.forEach(sep => {
                    if (candidate.includes(sep)) {
                        const [firstPart] = candidate.split(sep);
                        add(firstPart);
                    }
                });
            });
            return results;
        }
    }

    // models/gps-coordinates.ts


    // enrichers/strait-line.ts
    // Calculates straight-line distance to Brno center using GPS data.
    class StraitLineEnricher {
        constructor(originLatitude = 49.1948011, originLongitude = 16.6086014) {
            this.originLatitude = originLatitude;
            this.originLongitude = originLongitude;
        }
        enrich({ card }) {
            const listingId = StraitLineEnricher.extractListingId(card);
            const nextData = StraitLineEnricher.readNextData();
            let distance = null;
            if (listingId && nextData) {
                const coordinates = StraitLineEnricher.findCoordinates(nextData, listingId, null);
                if (coordinates) {
                    const rawDistance = StraitLineEnricher.computeDistanceKm(coordinates.latitude, coordinates.longitude, this.originLatitude, this.originLongitude);
                    if (Number.isFinite(rawDistance)) {
                        distance = Number(rawDistance.toFixed(3));
                    }
                }
            }
            return StraitLineEnricher.composeFragment(distance);
        }
        static extractListingId(card) {
            var _a, _b;
            if (card instanceof HTMLAnchorElement) {
                const rawHref = (_a = card.getAttribute('href')) !== null && _a !== void 0 ? _a : card.href;
                if (rawHref) {
                    const idMatch = rawHref.match(/(\d{6,})/);
                    if (idMatch) {
                        return idMatch[1];
                    }
                }
            }
            const datasetId = (_b = card.dataset) === null || _b === void 0 ? void 0 : _b.tmListingId;
            if (datasetId) {
                return datasetId;
            }
            return null;
        }
        static readNextData() {
            var _a;
            const script = document.getElementById('__NEXT_DATA__');
            const text = (_a = script === null || script === void 0 ? void 0 : script.textContent) !== null && _a !== void 0 ? _a : script === null || script === void 0 ? void 0 : script.innerHTML;
            if (!text) {
                return null;
            }
            try {
                return JSON.parse(text);
            }
            catch {
                return null;
            }
        }
        static findCoordinates(node, targetId, currentId) {
            var _a;
            if (!node || typeof node !== 'object') {
                return null;
            }
            if (Array.isArray(node)) {
                for (const item of node) {
                    const match = StraitLineEnricher.findCoordinates(item, targetId, currentId);
                    if (match) {
                        return match;
                    }
                }
                return null;
            }
            const record = node;
            const nextId = (_a = StraitLineEnricher.extractId(record)) !== null && _a !== void 0 ? _a : currentId;
            if (nextId === targetId) {
                const direct = StraitLineEnricher.extractCoordinates(record);
                if (direct) {
                    return direct;
                }
            }
            for (const value of Object.values(record)) {
                const match = StraitLineEnricher.findCoordinates(value, targetId, nextId);
                if (match) {
                    return match;
                }
            }
            return null;
        }
        static extractId(record) {
            const idKeys = [
                'id',
                'hashId',
                'hash_id',
                'estateId',
                'estate_id',
                'itemId'
            ];
            for (const key of idKeys) {
                const value = record[key];
                if (typeof value === 'number' || typeof value === 'string') {
                    const trimmed = String(value).trim();
                    if (trimmed.length) {
                        return trimmed;
                    }
                }
            }
            return null;
        }
        static composeFragment(distance) {
            const badge = {
                id: 'straight-line',
                text: StraitLineEnricher.formatBadge(distance),
                title: 'Straight-line distance to Brno city center'
            };
            return {
                badges: [badge],
                data: {
                    straightLineDistanceKm: distance !== null && distance !== void 0 ? distance : null
                }
            };
        }
        static formatBadge(distance) {
            if (typeof distance === 'number') {
                return `⭸ ${Math.round(distance)}km`;
            }
            return '⭸ n/a';
        }
        static extractCoordinates(record) {
            const latitude = StraitLineEnricher.extractNumber(record, ['latitude', 'lat', 'y']);
            const longitude = StraitLineEnricher.extractNumber(record, ['longitude', 'lon', 'lng', 'long', 'x']);
            if (latitude == null || longitude == null) {
                return null;
            }
            if (!StraitLineEnricher.isValidLatitude(latitude) || !StraitLineEnricher.isValidLongitude(longitude)) {
                return null;
            }
            return { latitude, longitude };
        }
        static extractNumber(record, keys) {
            for (const key of keys) {
                const value = record[key];
                if (typeof value === 'number') {
                    return value;
                }
                if (typeof value === 'string') {
                    const parsed = Number(value);
                    if (Number.isFinite(parsed)) {
                        return parsed;
                    }
                }
            }
            return null;
        }
        static isValidLatitude(value) {
            return value >= -90 && value <= 90;
        }
        static isValidLongitude(value) {
            return value >= -180 && value <= 180;
        }
        static computeDistanceKm(fromLat, fromLon, toLat, toLon) {
            const rad = Math.PI / 180;
            const dLat = (toLat - fromLat) * rad;
            const dLon = (toLon - fromLon) * rad;
            const a = Math.sin(dLat / 2) ** 2 + Math.cos(fromLat * rad) * Math.cos(toLat * rad) * Math.sin(dLon / 2) ** 2;
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            const earthRadiusKm = 6371;
            return earthRadiusKm * c;
        }
    }

    // enrichers/listing-enrichment.ts
    // Aggregates fragments from multiple enrichers into a single listing view.
    class ListingEnrichment {
        constructor() {
            this.badges = new Map();
            this.data = new Map();
        }
        merge(fragment) {
            var _a;
            if (!fragment) {
                return;
            }
            (_a = fragment.badges) === null || _a === void 0 ? void 0 : _a.forEach(badge => {
                if (!badge.id) {
                    return;
                }
                this.badges.set(badge.id, badge);
            });
            if (fragment.data) {
                Object.entries(fragment.data).forEach(([key, value]) => {
                    if (value === undefined) {
                        this.data.delete(key);
                        return;
                    }
                    this.data.set(key, value);
                });
            }
        }
        badgeTexts() {
            return Array.from(this.badges.values())
                .filter(badge => badge.text)
                .map(badge => badge.text);
        }
        cacheKey() {
            const badgePart = Array.from(this.badges.values())
                .sort((a, b) => a.id.localeCompare(b.id))
                .map(badge => { var _a; return `${badge.id}:${(_a = badge.text) !== null && _a !== void 0 ? _a : ''}`; })
                .join('|');
            const dataPart = Array.from(this.data.entries())
                .filter(([, value]) => value !== undefined)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([key, value]) => `${key}:${JSON.stringify(value)}`)
                .join('|');
            return [badgePart, dataPart]
                .filter(part => part.length > 0)
                .join('||');
        }
    }

    // listing-annotator.ts
    // Observes listing cards and applies enrichers to them.
    class ListingAnnotator {
        constructor(enrichers, anchorSelector) {
            this.enrichers = enrichers;
            this.anchorSelector = anchorSelector;
            this.processedElements = new WeakMap();
            this.onMutations = () => this.scheduleScan();
            this.onPopState = (_event) => this.scheduleScan();
            this.observer = null;
            this.scheduled = false;
            this.initialized = false;
            this.historyPatched = false;
        }
        start() {
            const body = document.body;
            if (!body) {
                requestAnimationFrame(() => {
                    this.start();
                });
                return;
            }
            if (!this.initialized) {
                this.initialized = true;
                this.patchHistory();
                window.addEventListener('popstate', this.onPopState);
                this.observer = new MutationObserver(this.onMutations);
                this.observer.observe(body, { childList: true, subtree: true });
            }
            this.scan();
        }
        ensureOriginalText(element) {
            var _a, _b;
            const existing = element.dataset.tmOriginalLocation;
            if (existing !== undefined) {
                return existing;
            }
            const originalText = (_b = (_a = element.textContent) === null || _a === void 0 ? void 0 : _a.trim()) !== null && _b !== void 0 ? _b : '';
            element.dataset.tmOriginalLocation = originalText;
            return originalText;
        }
        annotateElement(element, enrichment) {
            const badgeTexts = enrichment.badgeTexts();
            const value = badgeTexts.length ? badgeTexts.join(' • ') : 'n/a';
            let badge = element.querySelector('.tm-enhance');
            if (!badge) {
                badge = document.createElement('span');
                badge.className = 'tm-enhance';
                badge.style.whiteSpace = 'nowrap';
                badge.style.fontWeight = 'normal';
                badge.style.marginLeft = '0.25em';
                badge.style.fontSize = 'inherit';
                element.appendChild(document.createTextNode(' '));
                element.appendChild(badge);
            }
            badge.textContent = `(${value})`;
        }
        detectLocationElement(card) {
            const paragraphs = Array.from(card.querySelectorAll('p'));
            if (!paragraphs.length) {
                return null;
            }
            const candidates = paragraphs.length > 1 ? paragraphs.slice(1) : paragraphs;
            for (const paragraph of candidates) {
                const original = this.ensureOriginalText(paragraph);
                if (!original) {
                    continue;
                }
                const lower = original.toLowerCase();
                if (lower.includes('kč') || lower.includes('eur') || lower.includes('€')) {
                    continue;
                }
                return paragraph;
            }
            return null;
        }
        processCard(card) {
            const locationElement = this.detectLocationElement(card);
            if (!locationElement) {
                return;
            }
            const originalText = this.ensureOriginalText(locationElement);
            if (!originalText) {
                return;
            }
            const enrichment = new ListingEnrichment();
            this.enrichers.forEach(enricher => {
                const fragment = enricher.enrich({ card, locationText: originalText });
                enrichment.merge(fragment);
            });
            const key = `${originalText}|${enrichment.cacheKey() || 'none'}`;
            if (this.processedElements.get(locationElement) === key) {
                return;
            }
            this.annotateElement(locationElement, enrichment);
            this.processedElements.set(locationElement, key);
        }
        scan() {
            const cards = document.querySelectorAll(this.anchorSelector);
            cards.forEach(card => this.processCard(card));
        }
        scheduleScan() {
            if (this.scheduled) {
                return;
            }
            this.scheduled = true;
            requestAnimationFrame(() => {
                this.scheduled = false;
                this.scan();
            });
        }
        patchHistory() {
            if (this.historyPatched) {
                return;
            }
            this.historyPatched = true;
            const originalPushState = history.pushState.bind(history);
            history.pushState = ((...args) => {
                const result = originalPushState(...args);
                this.scheduleScan();
                return result;
            });
            const originalReplaceState = history.replaceState.bind(history);
            history.replaceState = ((...args) => {
                const result = originalReplaceState(...args);
                this.scheduleScan();
                return result;
            });
        }
    }

    // main.ts
    (() => {
        'use strict';
        if (!location.hostname.endsWith('sreality.cz')) {
            return;
        }
        const enrichers = [
            new DistanceEnricher(),
            new StraitLineEnricher()
        ];
        const annotator = new ListingAnnotator(enrichers, 'a[href^="/detail/"], a[href^="https://www.sreality.cz/detail/"]');
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                annotator.start();
            }, { once: true });
        }
        else {
            annotator.start();
        }
    })();
})();
