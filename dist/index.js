import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serve } from '@hono/node-server';
import { swaggerUI } from '@hono/swagger-ui';
import { db } from './db/index.js';
import timersRouter from './routes/timers.js';
import authRouter from './routes/auth.js';
import adminRouter from './routes/admin.js';
import { spec } from './openapi.js';
import { initWebSocket } from './ws/index.js';
import { sql } from 'drizzle-orm';
// Solo seed config, le tabelle le gestisce Drizzle via migrate
db.run(sql `INSERT OR IGNORE INTO config (key, value) VALUES ('data_riavvio', '2026-04-14T23:20:00.000Z')`);
const app = new Hono();
app.use('/*', cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
}));
app.get('/', (c) => c.json({ name: 'BMT2 Timer API', version: '1.0.0' }));
app.get('/openapi.json', (c) => c.json(spec));
app.get('/docs', swaggerUI({ url: '/openapi.json' }));
app.route('/api/auth', authRouter);
app.route('/api/timers', timersRouter);
app.route('/api/admin', adminRouter);
const port = parseInt(process.env.PORT || '3001');
const server = serve({
    fetch: app.fetch,
    port,
}, (info) => {
    console.log(`🚀 BMT2 Timer API running on http://localhost:${port}`);
});
initWebSocket(server);
//# sourceMappingURL=index.js.map