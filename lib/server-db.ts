import { env } from 'cloudflare:workers';
export function database(){if(!env.DB)throw new Error('Datenbank nicht verfügbar');return env.DB;}
export function adminPassword(){const password=(env as unknown as {ADMIN_PASSWORD?:string}).ADMIN_PASSWORD;if(!password)throw new Error('Adminzugang nicht konfiguriert');return password;}
