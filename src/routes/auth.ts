import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { randomUUID, randomBytes } from 'crypto';
import { db } from '../db';
import { users, refreshTokens } from '../db/schema';
import { eq } from 'drizzle-orm';
import { generateAccessToken, authMiddleware, JwtPayload } from '../middleware/auth';

const router = new Hono({ strict: false });

function generateTokenString(): string {
  return randomBytes(64).toString('hex');
}

router.post('/register', zValidator('json', z.object({
  email: z.string().email(),
  nome: z.string().min(1),
  password: z.string().min(6),
})), async (c) => {
  const { email, nome, password } = c.req.valid('json');

  const existing = db.select().from(users).where(eq(users.email, email)).get();
  if (existing) {
    return c.json({ error: 'Email già registrata' }, 409);
  }

  const password_hash = await bcrypt.hash(password, 10);
  const id = randomUUID();
  const now = new Date().toISOString();

  db.insert(users).values({ id, email, nome, password_hash, admin: false, created_at: now }).run();

  const payload = { userId: id, email, admin: false };
  const accessToken = generateAccessToken(payload);

  const refreshTokenString = generateTokenString();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  db.insert(refreshTokens).values({
    id: randomUUID(),
    user_id: id,
    token: refreshTokenString,
    expires_at: expiresAt,
  }).run();

  return c.json({
    user: { id, email, nome, admin: false },
    access_token: accessToken,
    refresh_token: refreshTokenString,
  }, 201);
});

router.post('/login', zValidator('json', z.object({
  email: z.string().email(),
  password: z.string(),
})), async (c) => {
  const { email, password } = c.req.valid('json');

  const user = db.select().from(users).where(eq(users.email, email)).get();
  if (!user) {
    return c.json({ error: 'Email o password errati' }, 401);
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    return c.json({ error: 'Email o password errati' }, 401);
  }

  const payload = { userId: user.id, email: user.email, admin: user.admin ?? false };
  const accessToken = generateAccessToken(payload);

  const refreshTokenString = generateTokenString();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  db.insert(refreshTokens).values({
    id: randomUUID(),
    user_id: user.id,
    token: refreshTokenString,
    expires_at: expiresAt,
  }).run();

  return c.json({
    user: { id: user.id, email: user.email, nome: user.nome, admin: user.admin ?? false },
    access_token: accessToken,
    refresh_token: refreshTokenString,
  });
});

router.post('/refresh', zValidator('json', z.object({
  refresh_token: z.string(),
})), (c) => {
  const { refresh_token } = c.req.valid('json');

  const stored = db.select().from(refreshTokens).where(eq(refreshTokens.token, refresh_token)).get();
  if (!stored) {
    return c.json({ error: 'Refresh token non valido' }, 401);
  }

  if (new Date(stored.expires_at) < new Date()) {
    db.delete(refreshTokens).where(eq(refreshTokens.id, stored.id)).run();
    return c.json({ error: 'Refresh token scaduto' }, 401);
  }

  const user = db.select().from(users).where(eq(users.id, stored.user_id)).get();
  if (!user) {
    return c.json({ error: 'Utente non trovato' }, 401);
  }

  db.delete(refreshTokens).where(eq(refreshTokens.id, stored.id)).run();

  const payload = { userId: user.id, email: user.email, admin: user.admin ?? false };
  const accessToken = generateAccessToken(payload);

  const newRefreshToken = generateTokenString();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  db.insert(refreshTokens).values({
    id: randomUUID(),
    user_id: user.id,
    token: newRefreshToken,
    expires_at: expiresAt,
  }).run();

  return c.json({
    access_token: accessToken,
    refresh_token: newRefreshToken,
  });
});

router.post('/logout', authMiddleware, (c: any) => {
  const user = c.get('user') as JwtPayload;
  db.delete(refreshTokens).where(eq(refreshTokens.user_id, user.userId)).run();
  return c.json({ message: 'Logout effettuato' });
});

router.get('/me', authMiddleware, (c: any) => {
  const user = c.get('user') as JwtPayload;
  const profile = db.select().from(users).where(eq(users.id, user.userId)).get();
  if (!profile) return c.json({ error: 'Utente non trovato' }, 404);
  return c.json({ id: profile.id, email: profile.email, nome: profile.nome, admin: profile.admin ?? false });
});

router.post('/promote', zValidator('json', z.object({
  email: z.string().email(),
  secret: z.string(),
})), (c) => {
  const { email, secret } = c.req.valid('json');

  if (secret !== (process.env.ADMIN_SECRET || 'bmt2-admin-secret')) {
    return c.json({ error: 'Secret non valido' }, 403);
  }

  const user = db.select().from(users).where(eq(users.email, email)).get();
  if (!user) return c.json({ error: 'Utente non trovato' }, 404);

  db.update(users).set({ admin: true }).where(eq(users.id, user.id)).run();
  return c.json({ message: `Utente ${email} promosso ad admin` });
});

export default router;
