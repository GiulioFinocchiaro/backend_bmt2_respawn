import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
const dbPath = path.resolve(process.cwd(), 'data', 'bmt2.db');
// Assicura che la cartella esista
fs.mkdirSync(path.dirname(dbPath), { recursive: true });
// Crea il file se non esiste (evita errori di "short read" su aprimenti)
if (!fs.existsSync(dbPath)) {
    const fd = fs.openSync(dbPath, 'a');
    fs.closeSync(fd);
    // opzionale: impostare permessi
    // fs.chmodSync(dbPath, 0o644);
}
let sqlite;
try {
    sqlite = new Database(dbPath, { fileMustExist: false });
    // esempio di pragma protetto da error handling
    try {
        sqlite.pragma('journal_mode = WAL');
    }
    catch (err) {
        console.error('Impossibile applicare PRAGMA:', err.message);
    }
}
catch (err) {
    console.error('Errore aprendo il DB:', err.message);
    throw err;
}
// Crea istanza drizzle (ORM) a partire dalla connessione better-sqlite3
const db = drizzle(sqlite);
// Esporta named export `db` (drizzle) e `sqlite` (raw better-sqlite3) per compatibilità
export { db, sqlite };
//# sourceMappingURL=index.js.map