import { getImage } from '@/lib/server-storage';
export const runtime = 'nodejs';
export async function GET(request: Request) {
  const key = new URL(request.url).searchParams.get('key') || '';
  if (!/^[0-9a-f-]{36}$/.test(key)) return new Response('Nicht gefunden', { status: 404 });
  try {
    const object = await getImage(key);
    if (!object) return new Response('Nicht gefunden', { status: 404 });
    return new Response(object.body, { headers: { 'Content-Type': object.contentType || 'application/octet-stream', 'Cache-Control': 'public, max-age=86400', 'X-Content-Type-Options': 'nosniff' } });
  } catch {
    console.error('Image read failed');
    return new Response('Bild derzeit nicht verfügbar', { status: 503 });
  }
}
