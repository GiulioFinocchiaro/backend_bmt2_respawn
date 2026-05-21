import { Context, Next } from 'hono';
import jwt from 'jsonwebtoken';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';

const JWT_SECRET = process.env.JWT_SECRET || 'bmt2-timer-secret-dev';

export interface JwtPayload {
  userId: string;
  email: string;
  admin: boolean;
}

export function generateAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
}

export function generateRefreshToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}

export async function authMiddleware(c: Context, next: Next) {
  const auth = c.req.header('Authorization');
  if (!auth || !auth.startsWith('Bearer ')) {
    return c.json({ error: 'Token mancante' }, 401);
  }

  try {
    const token = auth.slice(7);
    const payload = verifyToken(token) as JwtPayload;
    c.set('user', payload);
    await next();
  } catch {
    return c.json({ error: 'Token non valido o scaduto' }, 401);
  }
}

export async function adminMiddleware(c: Context, next: Next) {
  const auth = c.req.header('Authorization');
  if (!auth || !auth.startsWith('Bearer ')) {
    return c.json({ error: 'Token mancante' }, 401);
  }

  try {
    const token = auth.slice(7);
    const payload = verifyToken(token) as JwtPayload;

    const user = db.select().from(users).where(eq(users.id, payload.userId)).get();
    if (!user || !user.admin) {
      return c.json({ error: 'Accesso negato: solo admin' }, 403);
    }

    c.set('user', payload);
    await next();
  } catch {
    return c.json({ error: 'Token non valido o scaduto' }, 401);
  }
}
