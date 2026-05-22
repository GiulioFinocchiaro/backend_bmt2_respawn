import { sqlite } from './index.js';
// Ensure `users` and `refresh_tokens` tables exist (so they can be emptied)
sqlite.exec(`CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, email TEXT NOT NULL UNIQUE, nome TEXT NOT NULL, password_hash TEXT NOT NULL, admin INTEGER DEFAULT 0, created_at TEXT DEFAULT (datetime('now')))`);
sqlite.exec(`CREATE TABLE IF NOT EXISTS refresh_tokens (id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, token TEXT NOT NULL UNIQUE, expires_at TEXT NOT NULL, created_at TEXT DEFAULT (datetime('now')))`);
// Recupera tutte le tabelle user-defined (esclude sqlite_... interne)
const rows = sqlite.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'").all();
const tables = rows.map((r) => r.name).filter(Boolean);
if (tables.length === 0) {
    console.log('Nessuna tabella trovata da troncare.');
    process.exit(0);
}
const confirmed = process.argv.includes('--yes') || process.argv.includes('-y');
console.log('Tabelle trovate:', tables.join(', '));
if (!confirmed) {
    console.log('\nATTENZIONE: questo script eliminerà TUTTI i dati da tutte le tabelle sopra elencate.');
    console.log('Esegui con `npx tsx src/db/truncate.ts --yes` per confermare.');
    process.exit(0);
}
try {
    // Esegui in transaction: disabilita FK, cancella tutte le tabelle, riabilita FK
    const tx = sqlite.transaction(() => {
        sqlite.exec('PRAGMA foreign_keys = OFF;');
        for (const t of tables) {
            // Use DELETE FROM instead of TRUNCATE (sqlite non supporta TRUNCATE)
            sqlite.exec(`DELETE FROM \"${t}\";`);
        }
        sqlite.exec('PRAGMA foreign_keys = ON;');
    });
    tx();
    // Recupera spazio e reset degli indici interni
    sqlite.exec('VACUUM;');
    console.log('Operazione completata: tutte le tabelle sono state svuotate.');
}
catch (err) {
    console.error('Errore durante il truncate:', err.message);
    process.exit(1);
}
//# sourceMappingURL=truncate.js.map