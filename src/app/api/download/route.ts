import type { AnimeData } from '@/types/jikan.interface.ts';

export async function POST(req: Request) {
  const { items } = await req.json();

  const headers = ['ID', 'Title', 'Episodes', 'Score', 'URL'];
  const csv = [
    headers.join(','),
    ...(items as AnimeData[]).map((anime) =>
      [anime.mal_id, anime.titles?.[0]?.title ?? 'Untitled', anime.episodes ?? 'Unknown', anime.score ?? 'N/A', anime.url ?? 'N/A'].join(
        ',',
      ),
    ),
  ].join('\n');

  return new Response(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="selected_items.csv"`,
    },
  });
}
