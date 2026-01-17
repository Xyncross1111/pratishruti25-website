import { baseSections } from '@/lib/sections';

let cachedScores = baseSections.map((s) => ({ ...s }));

export async function refreshData() {
    cachedScores = baseSections.map((s) => ({ ...s }));
}

export async function getCachedScores() {
    return cachedScores;
}

export async function setCachedScores(updates) {
    const allowed = new Set(baseSections.map((s) => s.section));
    const updateMap = new Map(
        (updates || [])
            .filter((u) => u && allowed.has(u.section) && Number.isFinite(Number(u.score)))
            .map((u) => [u.section, Number(u.score)])
    );

    cachedScores = baseSections.map((base) => ({
        ...base,
        score: updateMap.has(base.section) ? updateMap.get(base.section) : base.score,
    }));
    return cachedScores;
}
