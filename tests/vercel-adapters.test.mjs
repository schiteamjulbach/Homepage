import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
await mkdir('.sites-runtime',{recursive:true});
await build({entryPoints:['lib/server-db.ts'],bundle:true,platform:'node',format:'esm',alias:{'@neondatabase/serverless':path.resolve('tests/neon-double.mjs')},outfile:'.sites-runtime/db-adapter-test.mjs'});
const { database, adminPassword, postgresParameters } = await import('../.sites-runtime/db-adapter-test.mjs');
const originalEnv={...process.env};
try {
 delete process.env.DATABASE_URL;delete process.env.ADMIN_PASSWORD;
 await assert.rejects(database().prepare('SELECT 1').all(),/DATABASE_URL/);
 assert.throws(adminPassword,/ADMIN_PASSWORD/);
 process.env.DATABASE_URL='postgresql://test:test@localhost/test';
 let transactions=[];let fail=false;
 globalThis.__postgresTestDb={transaction:async callback=>{const statements=[];transactions.push(statements);return callback({query:async(text,params)=>{statements.push({text,params});if(fail)throw new Error('secret participant');return {rows:[]};}});}};
 assert.equal(postgresParameters("SELECT '?' AS literal, ?, 'it''s ?'"),"SELECT '?' AS literal, $1, 'it''s ?'");
 assert.equal(await database().prepare('SELECT ?').bind("O'Brien").first(),null);
 assert.ok(transactions[0][0].text.includes('pg_advisory_xact_lock'));
 assert.deepEqual(transactions.at(-1),[{text:'SELECT $1',params:["O'Brien"]}]);
 const statement=database().prepare('UPDATE events SET capacity=?');
 await database().batch([statement.bind(1),statement.bind(2)]);
 assert.equal(transactions.at(-1).length,3);
 assert.ok(transactions.at(-1)[0].text.includes('pg_advisory_xact_lock'));
 assert.deepEqual(transactions.at(-1).slice(1).map(x=>x.params),[[1],[2]]);
 fail=true;
 await assert.rejects(database().prepare('SELECT 1').all(),error=>error.message==='Datenbankanfrage fehlgeschlagen');
 console.log('Postgres adapter checks passed: missing configuration, parameter binding, quoted literals, atomic locked batches, sanitized errors.');
} finally {for(const key of Object.keys(process.env))if(!(key in originalEnv))delete process.env[key];Object.assign(process.env,originalEnv);delete globalThis.__postgresTestDb;}
