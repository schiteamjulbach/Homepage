import { database } from '@/lib/server-db';

export async function putImage(key: string, bytes: Uint8Array, contentType: string) {
  await database().prepare('INSERT INTO images (id,content_type,data,created_at) VALUES (?,?,?,?)')
    .bind(key, contentType, Buffer.from(bytes).toString('base64'), new Date().toISOString()).run();
}

export async function getImage(key: string) {
  const image = await database().prepare('SELECT content_type,data FROM images WHERE id=?').bind(key).first<{content_type:string;data:string}>();
  return image ? { body: new Uint8Array(Buffer.from(image.data, 'base64')), contentType: image.content_type } : null;
}
