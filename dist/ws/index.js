import WebSocket, { WebSocketServer } from 'ws';
import { verifyToken } from '../middleware/auth.js';
let wss = null;
export function initWebSocket(server) {
    wss = new WebSocketServer({ server });
    wss.on('connection', (ws) => {
        ws.on('message', (message) => {
            try {
                const data = JSON.parse(message.toString());
                if (data.token) {
                    const payload = verifyToken(data.token);
                    // Qui potremmo associare ws a user
                }
            }
            catch (e) {
                // ignore
            }
        });
    });
}
export function broadcast(event, payload) {
    if (!wss)
        return;
    for (const client of wss.clients) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ event, payload }));
        }
    }
}
//# sourceMappingURL=index.js.map