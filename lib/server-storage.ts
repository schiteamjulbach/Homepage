import { put, get } from '@vercel/blob';
export function storageConfigured() { return !!process.env.BLOB_READ_WRITE_TOKEN; }
export async function putImage(key: string, bytes: Uint8Array, contentType: string) {
  await put(`events/${key}`, Buffer.from(bytes), { access: 'public', addRandomSuffix: false, contentType });
}
export async function getImage(key: string) {
  const object = await get(`events/${key}`, { access: 'public' });
  return object?.statusCode === 200 ? { body: object.stream, contentType: object.blob.contentType } : null;
}
