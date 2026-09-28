import { PGlite } from '@electric-sql/pglite';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
export class VercelHarness {
  constructor(options) {
    this.options = options;
    this.db = new PGlite(path.join(options.d1Persist, 'postgres'));
    globalThis.__postgresTestDb = this.db;
    Object.assign(process.env, { VERCEL: '1', ADMIN_PASSWORD: options.bindings.ADMIN_PASSWORD,
      DATABASE_URL: 'postgresql://test:test@localhost/test', BLOB_READ_WRITE_TOKEN: 'test-token' });
  }
  async dispatchFetch(url, init) {
    const handlers = await import(pathToFileURL(this.options.scriptPath).href);
    return handlers.default.fetch(new Request(url, init));
  }
  async getDatabase() { return { prepare: sql => ({ run: async () => this.db.exec(sql) }) }; }
  async dispose() { await this.db.close(); }
}
