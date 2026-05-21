import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { db } from '../db';
import { timers } from '../db/schema';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';

const router = new Hono({ strict: false });

const timerSchema = z.object({
  nome_boss: z.string().min(1),
  categoria: z.string().default('Metin'),
  tempo_respawn: z.number().int().positive(),
  spawn_precedente: z.string().nullable().optional(),
  stato: z.string().default('fermo'),
  note: z.string().nullable().optional(),
});

router.get('/', (c) => {
  const all = db.select().from(timers).all();
  return c.json(all);
});

router.get('/:id', (c) => {
  const { id } = c.req.param();
  const timer = db.select().from(timers).where(eq(timers.id, id)).get();
  if (!timer) return c.json({ error: 'Timer not found' }, 404);
  return c.json(timer);
});

router.post('/', zValidator('json', timerSchema), (c) => {
  const body = c.req.valid('json');
  const now = new Date().toISOString();
  const newTimer = {
    id: randomUUID(),
    nome_boss: body.nome_boss,
    categoria: body.categoria,
    tempo_respawn: body.tempo_respawn,
    spawn_precedente: body.spawn_precedente || null,
    stato: body.stato,
    note: body.note || null,
    spawn_oggi: body.spawn_precedente ? 1 : 0,
    created_at: now,
    updated_at: now,
  };
  db.insert(timers).values(newTimer).run();
  return c.json(newTimer, 201);
});

const updateSchema = z.object({
  nome_boss: z.string().min(1).optional(),
  categoria: z.string().optional(),
  tempo_respawn: z.number().int().positive().optional(),
  spawn_precedente: z.string().nullable().optional(),
  stato: z.string().optional(),
  note: z.string().nullable().optional(),
});

router.patch('/:id', zValidator('json', updateSchema), (c) => {
  const { id } = c.req.param();
  const body = c.req.valid('json');
  const existing = db.select().from(timers).where(eq(timers.id, id)).get();
  if (!existing) return c.json({ error: 'Timer not found' }, 404);

  const updateData = {
    ...body,
    updated_at: new Date().toISOString(),
  };

  db.update(timers).set(updateData).where(eq(timers.id, id)).run();
  const updated = db.select().from(timers).where(eq(timers.id, id)).get();
  return c.json(updated);
});

router.delete('/:id', (c) => {
  const { id } = c.req.param();
  const existing = db.select().from(timers).where(eq(timers.id, id)).get();
  if (!existing) return c.json({ error: 'Timer not found' }, 404);
  db.delete(timers).where(eq(timers.id, id)).run();
  return c.json({ message: 'Timer deleted' });
});

router.post('/:id/record-spawn', (c) => {
  const { id } = c.req.param();
  const timer = db.select().from(timers).where(eq(timers.id, id)).get();
  if (!timer) return c.json({ error: 'Timer not found' }, 404);

  const now = new Date().toISOString();
  db.update(timers)
    .set({
      spawn_precedente: timer.ultimo_spawn || now,
      ultimo_spawn: now,
      spawn_oggi: (timer.spawn_oggi || 0) + 1,
      stato: 'in_corso',
      updated_at: now,
    })
    .where(eq(timers.id, id))
    .run();

  const updated = db.select().from(timers).where(eq(timers.id, id)).get();
  return c.json(updated);
});

export default router;
