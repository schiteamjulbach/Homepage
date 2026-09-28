const images = new Map();
export async function put(pathname, bytes, options) {
  if (options.access !== 'public' || options.addRandomSuffix !== false) throw new Error('Unexpected Blob settings');
  images.set(pathname,{bytes:new Uint8Array(bytes),contentType:options.contentType});
}
export async function get(pathname, options) {
  if(options.access !== 'public') throw new Error('Unexpected Blob settings');
  const image=images.get(pathname);
  return image ? {statusCode:200,stream:new Blob([image.bytes]).stream(),blob:{contentType:image.contentType}} : null;
}
