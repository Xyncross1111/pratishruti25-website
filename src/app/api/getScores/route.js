import { getCachedScores } from "@/lib/cache";

export async function GET() {
    try {
        const data = await getCachedScores();
        return new Response(JSON.stringify(data), { status: 200 });
    } catch (e) {
        console.error(e);
        return new Response(JSON.stringify({ message: 'Error Fetching Scores' }), {
            status: 500,
        });
    }
}