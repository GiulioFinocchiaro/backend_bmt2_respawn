import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { db } from '../db/index.js';
import { metinBoss, mb_tmp, mappa_mbt, mappe, config } from '../db/schema.js';
import { adminMiddleware } from '../middleware/auth.js';
import { broadcast } from '../ws/index.js';
import { randomUUID } from 'crypto';
import { eq } from 'drizzle-orm';
const router = new Hono({ strict: false });
router.use('*', adminMiddleware);
// ── Metin Boss ──
router.get('/metin-boss', (c) => {
    return c.json(db.select().from(metinBoss).all());
});
router.get('/metin-boss/:id', (c) => {
    const mb = db.select().from(metinBoss).where(eq(metinBoss.id, c.req.param('id'))).get();
    if (!mb)
        return c.json({ error: 'Metin/Boss non trovato' }, 404);
    return c.json(mb);
});
const metinBossCreateSchema = z.object({
    nome: z.string().min(1),
    categoria: z.enum(['Metin', 'Boss']).default('Metin'),
    icona: z.string().nullable().optional(),
    note: z.string().nullable().optional(),
});
router.post('/metin-boss', zValidator('json', metinBossCreateSchema), (c) => {
    const body = c.req.valid('json');
    const id = randomUUID();
    const nuovo = {
        id,
        nome: body.nome,
        categoria: body.categoria,
        icona: body.icona || null,
        note: body.note || null,
        created_at: new Date().toISOString(),
    };
    db.insert(metinBoss).values(nuovo).run();
    broadcast('admin:metin-boss-created', { metinBoss: nuovo });
    return c.json(nuovo, 201);
});
const metinBossUpdateSchema = z.object({
    nome: z.string().min(1).optional(),
    categoria: z.enum(['Metin', 'Boss']).optional(),
    icona: z.string().nullable().optional(),
    note: z.string().nullable().optional(),
});
router.patch('/metin-boss/:id', zValidator('json', metinBossUpdateSchema), (c) => {
    const { id } = c.req.param();
    const body = c.req.valid('json');
    const existing = db.select().from(metinBoss).where(eq(metinBoss.id, id)).get();
    if (!existing)
        return c.json({ error: 'Metin/Boss non trovato' }, 404);
    db.update(metinBoss).set(body).where(eq(metinBoss.id, id)).run();
    const updated = db.select().from(metinBoss).where(eq(metinBoss.id, id)).get();
    broadcast('admin:metin-boss-updated', { metinBoss: updated });
    return c.json(updated);
});
router.delete('/metin-boss/:id', (c) => {
    const { id } = c.req.param();
    const existing = db.select().from(metinBoss).where(eq(metinBoss.id, id)).get();
    if (!existing)
        return c.json({ error: 'Metin/Boss non trovato' }, 404);
    db.delete(metinBoss).where(eq(metinBoss.id, id)).run();
    broadcast('admin:metin-boss-deleted', { metinBossId: id });
    return c.json({ message: 'Metin/Boss eliminato' });
});
// ── MbTmp (varianti respawn) ──
router.get('/mb-tmp', (c) => {
    return c.json(db.select().from(mb_tmp).all());
});
router.get('/mb-tmp/:id', (c) => {
    const row = db.select().from(mb_tmp).where(eq(mb_tmp.id, c.req.param('id'))).get();
    if (!row)
        return c.json({ error: 'MbTmp non trovato' }, 404);
    return c.json(row);
});
const mbTmpCreateSchema = z.object({
    metin_boss_id: z.string().min(1),
    descrizione: z.string().min(1),
    tempo_respawn: z.number().int().positive(),
});
router.post('/mb-tmp', zValidator('json', mbTmpCreateSchema), (c) => {
    const body = c.req.valid('json');
    const id = randomUUID();
    const nuovo = { id, ...body, created_at: new Date().toISOString() };
    db.insert(mb_tmp).values(nuovo).run();
    broadcast('admin:mb-tmp-created', { mbTmp: nuovo });
    return c.json(nuovo, 201);
});
const mbTmpUpdateSchema = z.object({
    descrizione: z.string().min(1).optional(),
    tempo_respawn: z.number().int().positive().optional(),
});
router.patch('/mb-tmp/:id', zValidator('json', mbTmpUpdateSchema), (c) => {
    const { id } = c.req.param();
    const body = c.req.valid('json');
    const existing = db.select().from(mb_tmp).where(eq(mb_tmp.id, id)).get();
    if (!existing)
        return c.json({ error: 'MbTmp non trovato' }, 404);
    db.update(mb_tmp).set(body).where(eq(mb_tmp.id, id)).run();
    const updated = db.select().from(mb_tmp).where(eq(mb_tmp.id, id)).get();
    broadcast('admin:mb-tmp-updated', { mbTmp: updated });
    return c.json(updated);
});
router.delete('/mb-tmp/:id', (c) => {
    const { id } = c.req.param();
    const existing = db.select().from(mb_tmp).where(eq(mb_tmp.id, id)).get();
    if (!existing)
        return c.json({ error: 'MbTmp non trovato' }, 404);
    db.delete(mb_tmp).where(eq(mb_tmp.id, id)).run();
    broadcast('admin:mb-tmp-deleted', { mbTmpId: id });
    return c.json({ message: 'MbTmp eliminato' });
});
// ── MappaMbt (coordinate) ──
router.get('/mappa-mbt', (c) => {
    return c.json(db.select().from(mappa_mbt).all());
});
router.get('/mappa-mbt/:id', (c) => {
    const row = db.select().from(mappa_mbt).where(eq(mappa_mbt.id, c.req.param('id'))).get();
    if (!row)
        return c.json({ error: 'MappaMbt non trovata' }, 404);
    return c.json(row);
});
const mappaMbtCreateSchema = z.object({
    mbt_id: z.string().min(1),
    coord_x: z.number().int(),
    coord_y: z.number().int(),
    mappa_id: z.string().min(1),
});
router.post('/mappa-mbt', zValidator('json', mappaMbtCreateSchema), (c) => {
    const body = c.req.valid('json');
    const id = randomUUID();
    const nuovo = { id, ...body, created_at: new Date().toISOString() };
    db.insert(mappa_mbt).values(nuovo).run();
    broadcast('admin:mappa-mbt-created', { mappaMbt: nuovo });
    return c.json(nuovo, 201);
});
const mappaMbtUpdateSchema = z.object({
    coord_x: z.number().int().optional(),
    coord_y: z.number().int().optional(),
    mappa_id: z.string().min(1).optional(),
});
router.patch('/mappa-mbt/:id', zValidator('json', mappaMbtUpdateSchema), (c) => {
    const { id } = c.req.param();
    const body = c.req.valid('json');
    const existing = db.select().from(mappa_mbt).where(eq(mappa_mbt.id, id)).get();
    if (!existing)
        return c.json({ error: 'MappaMbt non trovata' }, 404);
    db.update(mappa_mbt).set(body).where(eq(mappa_mbt.id, id)).run();
    const updated = db.select().from(mappa_mbt).where(eq(mappa_mbt.id, id)).get();
    broadcast('admin:mappa-mbt-updated', { mappaMbt: updated });
    return c.json(updated);
});
router.delete('/mappa-mbt/:id', (c) => {
    const { id } = c.req.param();
    const existing = db.select().from(mappa_mbt).where(eq(mappa_mbt.id, id)).get();
    if (!existing)
        return c.json({ error: 'MappaMbt non trovata' }, 404);
    db.delete(mappa_mbt).where(eq(mappa_mbt.id, id)).run();
    broadcast('admin:mappa-mbt-deleted', { mappaMbtId: id });
    return c.json({ message: 'MappaMbt eliminata' });
});
// ── Mappe ──
router.get('/mappe', (c) => {
    return c.json(db.select().from(mappe).all());
});
router.get('/mappe/:id', (c) => {
    const map = db.select().from(mappe).where(eq(mappe.id, c.req.param('id'))).get();
    if (!map)
        return c.json({ error: 'Mappa non trovata' }, 404);
    return c.json(map);
});
const mappaSchema = z.object({
    nome: z.string().min(1),
    image_url: z.string().nullable().optional(),
});
router.post('/mappe', zValidator('json', mappaSchema), (c) => {
    const body = c.req.valid('json');
    const id = randomUUID();
    const nuova = { id, nome: body.nome, image_url: body.image_url || null, created_at: new Date().toISOString() };
    db.insert(mappe).values(nuova).run();
    broadcast('admin:mappa-created', { mappa: nuova });
    return c.json(nuova, 201);
});
router.patch('/mappe/:id', zValidator('json', mappaSchema.partial()), (c) => {
    const { id } = c.req.param();
    const body = c.req.valid('json');
    const existing = db.select().from(mappe).where(eq(mappe.id, id)).get();
    if (!existing)
        return c.json({ error: 'Mappa non trovata' }, 404);
    db.update(mappe).set(body).where(eq(mappe.id, id)).run();
    const updated = db.select().from(mappe).where(eq(mappe.id, id)).get();
    broadcast('admin:mappa-updated', { mappa: updated });
    return c.json(updated);
});
router.delete('/mappe/:id', (c) => {
    const { id } = c.req.param();
    const existing = db.select().from(mappe).where(eq(mappe.id, id)).get();
    if (!existing)
        return c.json({ error: 'Mappa non trovata' }, 404);
    db.delete(mappe).where(eq(mappe.id, id)).run();
    broadcast('admin:mappa-deleted', { mappaId: id });
    return c.json({ message: 'Mappa eliminata' });
});
// ── Config ──
router.get('/config', (c) => {
    const all = db.select().from(config).all();
    const obj = {};
    for (const row of all)
        obj[row.key] = row.value;
    return c.json(obj);
});
router.patch('/config/:key', zValidator('json', z.object({ value: z.string() })), (c) => {
    const { key } = c.req.param();
    const { value } = c.req.valid('json');
    const existing = db.select().from(config).where(eq(config.key, key)).get();
    if (existing) {
        db.update(config).set({ value }).where(eq(config.key, key)).run();
    }
    else {
        db.insert(config).values({ key, value }).run();
    }
    broadcast('admin:config-updated', { key, value });
    return c.json({ key, value });
});
export default router;
//# sourceMappingURL=admin.js.map