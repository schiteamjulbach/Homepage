// Runs the actual PostgreSQL queries in embedded Postgres, without network access.
export function neon() {
  const query = (text, params=[]) => ({text,params});
  return { query, transaction: async (queries, options) => {
    if (options.isolationLevel !== 'ReadCommitted') throw new Error('Unexpected isolation level');
    return globalThis.__postgresTestDb.transaction(async tx => {
      const results = [];
      for (const {text,params} of queries) results.push((await tx.query(text,params)).rows);
      return results;
    });
  }};
}
