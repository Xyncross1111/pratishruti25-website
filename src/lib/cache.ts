import { baseSections } from '@/lib/sections';

type SectionScore = { section: string; score: number };

let cachedScores: SectionScore[] = baseSections.map((s) => ({ ...s }));

export async function refreshData() {
    cachedScores = baseSections.map((s) => ({ ...s }));
}

export async function getCachedScores() {
    return cachedScores;
}

export async function setCachedScores(updates: Array<Partial<SectionScore>> = []) {
    const allowed = new Set(baseSections.map((s) => s.section));
    const updateMap = new Map<string, number>(
        updates
            .filter((u): u is SectionScore => Boolean(u) && allowed.has(u.section ?? '') && Number.isFinite(Number(u.score)))
            .map((u) => [u.section, Number(u.score)])
    );

    cachedScores = baseSections.map((base) => ({
        ...base,
        score: updateMap.has(base.section) ? (updateMap.get(base.section) as number) : base.score,
    }));
    return cachedScores;
}
