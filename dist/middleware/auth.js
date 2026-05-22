import jwt from 'jsonwebtoken';
import { db } from '../db/index.js';
import { users } from '../db/schema.js';
import { eq } from 'drizzle-orm';
const JWT_SECRET = process.env.JWT_SECRET || 'bmt2-timer-secret-dev';
export function generateAccessToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
}
export function generateRefreshToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}
export function verifyToken(token) {
    return jwt.verify(token, JWT_SECRET);
}
export async function authMiddleware(c, next) {
    const auth = c.req.header('Authorization');
    if (!auth || !auth.startsWith('Bearer ')) {
        return c.json({ error: 'Token mancante' }, 401);
    }
    try {
        const token = auth.slice(7);
        const payload = verifyToken(token);
        c.set('user', payload);
        await next();
    }
    catch {
        return c.json({ error: 'Token non valido o scaduto' }, 401);
    }
}
export async function adminMiddleware(c, next) {
    const auth = c.req.header('Authorization');
    if (!auth || !auth.startsWith('Bearer ')) {
        return c.json({ error: 'Token mancante' }, 401);
    }
    try {
        const token = auth.slice(7);
        const payload = verifyToken(token);
        const user = db.select().from(users).where(eq(users.id, payload.userId)).get();
        if (!user || !user.admin) {
            return c.json({ error: 'Accesso negato: solo admin' }, 403);
        }
        c.set('user', payload);
        await next();
    }
    catch {
        return c.json({ error: 'Token non valido o scaduto' }, 401);
    }
}
//# sourceMappingURL=auth.js.map