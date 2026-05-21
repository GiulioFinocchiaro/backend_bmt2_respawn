import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serve } from '@hono/node-server';
import { sqlite } from './db';
import timersRouter from './routes/timers';

sqlite.exec(`
  CREATE TABLE IF NOT EXISTS timers (
    id TEXT PRIMARY KEY,
    nome_boss TEXT NOT NULL,
    categoria TEXT DEFAULT 'Metin',
    tempo_respawn INTEGER NOT NULL,
    spawn_precedente TEXT,
    ultimo_spawn TEXT,
    spawn_oggi INTEGER DEFAULT 0,
    stato TEXT DEFAULT 'fermo',
    note TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  )
`);

const app = new Hono();

app.use('/*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

app.get('/', (c) => c.json({ name: 'BMT2 Timer API', version: '1.0.0' }));
app.route('/api/timers', timersRouter);

const port = parseInt(process.env.PORT || '3001');

serve({
  fetch: app.fetch,
  port,
}, (info) => {
  console.log(`🚀 BMT2 Timer API running on http://localhost:${port}`);
});
