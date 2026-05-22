import Database from 'better-sqlite3';
declare let sqlite: Database.Database;
declare const db: import("drizzle-orm/better-sqlite3").BetterSQLite3Database<Record<string, never>> & {
    $client: Database.Database;
};
export { db, sqlite };
//# sourceMappingURL=index.d.ts.map