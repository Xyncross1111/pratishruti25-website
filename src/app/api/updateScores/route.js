import { setCachedScores } from "@/lib/cache";
import { baseSections } from "@/lib/sections";

export async function POST(request) {
    try {
        const payload = await request.json();
        if (!Array.isArray(payload)) {
            return new Response(JSON.stringify({ message: "Payload must be an array" }), { status: 400 });
        }

        const allowedSections = new Set(baseSections.map((s) => s.section));
        const updates = payload
            .filter((item) => item && allowedSections.has(item.section) && Number.isFinite(Number(item.score)))
            .map((item) => ({ section: item.section, score: Number(item.score) }));

        if (updates.length === 0) {
            return new Response(JSON.stringify({ message: "No valid updates provided" }), { status: 400 });
        }

        await setCachedScores(updates);

        return new Response(JSON.stringify({ message: "Scores updated", updated: updates.length }), {
            status: 200,
        });
    } catch (e) {
        console.error(e);
        return new Response(JSON.stringify({ message: "Internal Server Error" }), { status: 500 });
    }
}
