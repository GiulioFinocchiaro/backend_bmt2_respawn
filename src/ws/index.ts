import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'node:http';
import { verifyToken, JwtPayload } from '../middleware/auth';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';

interface AuthenticatedSocket extends WebSocket {
  userId?: string;
  email?: string;
  isAlive?: boolean;
}

let wss: WebSocketServer;

export function initWebSocket(server: Server) {
  wss = new WebSocketServer({ server, path: '/ws' });

  wss.on('connection', (ws: AuthenticatedSocket, req) => {
    ws.isAlive = true;

    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const token = url.searchParams.get('token');

    if (!token) {
      ws.close(4001, 'Token mancante');
      return;
    }

    try {
      const payload = verifyToken(token) as JwtPayload;
      ws.userId = payload.userId;
      ws.email = payload.email;
      console.log(`📡 WebSocket connesso: ${payload.email}`);
    } catch {
      ws.close(4001, 'Token non valido');
      return;
    }

    ws.on('pong', () => {
      ws.isAlive = true;
    });

    ws.on('close', () => {
      console.log(`📡 WebSocket disconnesso: ${ws.email}`);
    });

    ws.send(JSON.stringify({ type: 'connected', userId: ws.userId }));
  });

  const interval = setInterval(() => {
    wss.clients.forEach((ws: AuthenticatedSocket) => {
      if (ws.isAlive === false) return ws.terminate();
      ws.isAlive = false;
      ws.ping();
    });
  }, 30000);

  wss.on('close', () => clearInterval(interval));

  console.log('📡 WebSocket server ready on /ws');
  return wss;
}

export function broadcast(event: string, data: Record<string, unknown>) {
  if (!wss) return;
  const message = JSON.stringify({ type: event, ...data, timestamp: new Date().toISOString() });
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

export function getWss() {
  return wss;
}
