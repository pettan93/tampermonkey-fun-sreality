import { DISTANCE_BY_CITY, type CityDistanceMap } from './city-distances';

export interface DistanceResult {
    city: string;
    distance: number | undefined;
}

export class DistanceResolver {
    constructor(private readonly distanceByCity: CityDistanceMap = DISTANCE_BY_CITY) {}

    resolve(locationText: string): DistanceResult {
        const candidates = DistanceResolver.collectCandidates(locationText);
        for (const candidate of candidates) {
            const normalized = DistanceResolver.normalizeName(candidate);
            if (Object.prototype.hasOwnProperty.call(this.distanceByCity, normalized)) {
                return {
                    city: candidate,
                    distance: this.distanceByCity[normalized]
                };
            }
        }

        if (candidates.length) {
            const primary = candidates[0];
            const fallback = DistanceResolver.normalizeName(primary.split(/[\s-]/)[0]);
            if (Object.prototype.hasOwnProperty.call(this.distanceByCity, fallback)) {
                return {
                    city: primary,
                    distance: this.distanceByCity[fallback]
                };
            }
        }

        return {
            city: candidates[0] ?? '',
            distance: undefined
        };
    }

    private static normalizeName(name: string | null | undefined): string {
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

    private static stripParentheses(value: string): string {
        return value
            .replace(/\s*\(.*?\)\s*/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    private static collectCandidates(locationText: string): string[] {
        const results: string[] = [];
        const add = (value: string): void => {
            const trimmed = value.trim();
            if (trimmed && !results.includes(trimmed)) {
                results.push(trimmed);
            }
        };

        const base = DistanceResolver.stripParentheses(locationText);
        add(base);
        base.split(',').forEach((candidate) => add(candidate));
        base.split('/').forEach((candidate) => add(candidate));

        const separators: readonly string[] = [' - ', ' – '];
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
}
