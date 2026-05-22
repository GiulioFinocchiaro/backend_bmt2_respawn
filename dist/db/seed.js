import { db, sqlite } from './index.js';
import { config } from './schema.js';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';
// Crea tabelle (il seed è standalone)
// Aggiunte tabelle users e refresh_tokens per coerenza con schema.ts
sqlite.exec(`CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, email TEXT NOT NULL UNIQUE, nome TEXT NOT NULL, password_hash TEXT NOT NULL, admin INTEGER DEFAULT 0, created_at TEXT DEFAULT (datetime('now')))`);
sqlite.exec(`CREATE TABLE IF NOT EXISTS refresh_tokens (id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, token TEXT NOT NULL UNIQUE, expires_at TEXT NOT NULL, created_at TEXT DEFAULT (datetime('now')))`);
sqlite.exec(`CREATE TABLE IF NOT EXISTS config (key TEXT PRIMARY KEY, value TEXT NOT NULL)`);
sqlite.exec(`CREATE TABLE IF NOT EXISTS mappe (id TEXT PRIMARY KEY, nome TEXT NOT NULL, image_url TEXT, created_at TEXT DEFAULT (datetime('now')))`);
sqlite.exec(`CREATE TABLE IF NOT EXISTS metin_boss (id TEXT PRIMARY KEY, nome TEXT NOT NULL, categoria TEXT DEFAULT 'Metin' CHECK(categoria IN ('Metin','Boss')), icona TEXT, note TEXT, created_at TEXT DEFAULT (datetime('now')))`);
sqlite.exec(`CREATE TABLE IF NOT EXISTS mb_tmp (id TEXT PRIMARY KEY, metin_boss_id TEXT NOT NULL REFERENCES metin_boss(id) ON DELETE CASCADE, descrizione TEXT, tempo_respawn INTEGER NOT NULL, created_at TEXT DEFAULT (datetime('now')))`);
sqlite.exec(`CREATE TABLE IF NOT EXISTS mappa_mbt (id TEXT PRIMARY KEY, mbt_id TEXT NOT NULL REFERENCES mb_tmp(id) ON DELETE CASCADE, coord_y INTEGER NOT NULL, coord_x INTEGER NOT NULL, mappa_id TEXT NOT NULL REFERENCES mappe(id) ON DELETE CASCADE, created_at TEXT DEFAULT (datetime('now')))`);
const riavvio = new Date('2026-04-14T21:20:00.000Z'); // 23:20 CEST
const existing = db.select().from(config).where(eq(config.key, 'data_riavvio')).get();
if (!existing) {
    db.insert(config).values({ key: 'data_riavvio', value: riavvio.toISOString() }).run();
}
const now = new Date().toISOString();
const mbId = () => randomUUID();
// ── Mappe ──
process.exit(0);
//# sourceMappingURL=seed.js.map