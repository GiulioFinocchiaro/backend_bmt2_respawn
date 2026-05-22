import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth.js';
import { getAllTimers, calculateTimer } from '../services/timer.js';
const router = new Hono({ strict: false });
router.use('*', authMiddleware);
router.get('/', (c) => {
    return c.json(getAllTimers());
});
router.get('/:id', (c) => {
    const timer = calculateTimer(c.req.param('id'));
    if (!timer)
        return c.json({ error: 'Timer non trovato' }, 404);
    return c.json(timer);
});
export default router;
//# sourceMappingURL=timers.js.map