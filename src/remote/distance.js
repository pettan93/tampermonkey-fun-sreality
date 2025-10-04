import { DISTANCE_BY_CITY } from './city-distances.js';

function normalizeName(name) {
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

function stripParentheses(value) {
    return value
        .replace(/\s*\(.*?\)\s*/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function collectCandidates(locationText) {
    const results = [];
    const add = (value) => {
        const trimmed = (value || '').trim();
        if (trimmed && !results.includes(trimmed)) {
            results.push(trimmed);
        }
    };

    const base = stripParentheses(locationText);
    add(base);
    base.split(',').forEach(add);
    base.split('/').forEach(add);

    const separators = [' - ', ' – '];
    results.slice().forEach((candidate) => {
        separators.forEach((sep) => {
            if (candidate.includes(sep)) {
                const [firstPart] = candidate.split(sep);
                add(firstPart);
            }
        });
    });

    return results;
}

export function resolveDistance(locationText) {
    const candidates = collectCandidates(locationText);
    for (const candidate of candidates) {
        const normalized = normalizeName(candidate);
        if (Object.prototype.hasOwnProperty.call(DISTANCE_BY_CITY, normalized)) {
            return {
                city: candidate,
                distance: DISTANCE_BY_CITY[normalized]
            };
        }
    }

    if (candidates.length) {
        const primary = candidates[0];
        const fallback = normalizeName(primary.split(/[\s-]/)[0]);
        if (Object.prototype.hasOwnProperty.call(DISTANCE_BY_CITY, fallback)) {
            return {
                city: primary,
                distance: DISTANCE_BY_CITY[fallback]
            };
        }
    }

    return {
        city: candidates[0] || '',
        distance: undefined
    };
}
