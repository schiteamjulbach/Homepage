import { neon } from '@neondatabase/serverless';
import { schemaSql } from '@/db/postgres-schema';

type Parameter = string | number | null;
type Query = { sql: string; params: Parameter[] };
let initialized: Promise<void> | undefined;

export function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Serverkonfiguration fehlt: ${name}`);
  return value;
}

function client() { return neon(requiredEnv('DATABASE_URL')); }

// Separate statements under READ COMMITTED: the write sees changes made by a
// preceding lock holder. This protects capacity checks against parallel bookings.
const lockSql = 'SELECT pg_advisory_xact_lock(73120260928)';

async function initialize() {
  if (!initialized) {
    initialized = (async () => {
      const sql = client();
      await sql.transaction([
        sql.query(lockSql),
        ...schemaSql.split(';').map(part => part.trim()).filter(Boolean).map(part => sql.query(part)),
      ], { isolationLevel: 'ReadCommitted' });
    })().catch(error => { initialized = undefined; throw error; });
  }
  await initialized;
}

export async function queryPostgres<T = Record<string, unknown>>(queries: Query[]) {
  if (!queries.length) return [];
  await initialize();
  const sql = client();
  const write = queries.some(query => !/^\s*SELECT\b/i.test(query.sql));
  const operations = queries.map(query => sql.query(query.sql, query.params));
  if (write) operations.unshift(sql.query(lockSql));
  try {
    const results = await sql.transaction(operations, { isolationLevel: 'ReadCommitted' });
    return results.slice(write ? 1 : 0).map(rows => ({ results: rows as T[], success: true }));
  } catch {
    // SQL errors may include participant data. Do not expose them in responses/logs.
    throw new Error('Datenbankanfrage fehlgeschlagen');
  }
}

// Existing statements use ? placeholders; ignore ? inside quoted SQL strings.
export function postgresParameters(sql: string) {
  let index = 0;
  return sql.replace(/'(?:[^']|'')*'|\?/g, token => token === '?' ? `$${++index}` : token);
}
class Statement {
  constructor(readonly sql: string, readonly params: Parameter[] = []) {}
  bind(...params: Parameter[]) { return new Statement(this.sql, params); }
  async all<T = Record<string, unknown>>() { return (await queryPostgres<T>([{sql:postgresParameters(this.sql),params:this.params}]))[0]; }
  async first<T = Record<string, unknown>>(): Promise<T | null> { return (await this.all<T>()).results[0] ?? null; }
  async run() { return this.all(); }
}
export function database() {
  return {
    prepare: (sql: string) => new Statement(sql),
    batch: (statements: Statement[]) => queryPostgres(statements.map(statement => ({sql:postgresParameters(statement.sql),params:statement.params}))),
  };
}
export function adminPassword() { return requiredEnv('ADMIN_PASSWORD'); }
