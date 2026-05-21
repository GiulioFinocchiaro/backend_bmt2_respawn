# BMT2 Timer API — Documentazione

## Panoramica

- **Base URL (dev):** `http://localhost:3001`
- **Framework:** Hono + Node.js
- **Database:** SQLite via Drizzle ORM
- **Auth:** JWT (access token 15min) + Refresh token (7gg, rotation)
- **WebSocket:** `ws://host:3001/ws?token=<JWT>`
- **Swagger UI:** `/docs`
- **OpenAPI JSON:** `/openapi.json`

---

## Indice

1. [Autenticazione](#1-autenticazione)
2. [Timer](#2-timer)
3. [Admin — Metin/Boss CRUD](#3-admin--metinboss-crud)
4. [Admin — Mappe CRUD](#4-admin--mappe-crud)
5. [Admin — Config](#5-admin--config)
6. [WebSocket](#6-websocket)
7. [Schema Timer](#7-schema-timer)
8. [Codici Errore](#8-codici-errore)

---

## 1. Autenticazione

Tutti gli endpoint `/api/auth` tranne `/logout` e `/me` NON richiedono JWT.

### `POST /api/auth/register`

Registra un nuovo utente.

**Body:**
```json
{
  "email": "user@example.com",
  "nome": "Mario",
  "password": "password123"
}
```

**Response `201`:**
```json
{
  "user": { "id": "uuid", "email": "user@example.com", "nome": "Mario", "admin": false },
  "access_token": "eyJ...",
  "refresh_token": "abc123..."
}
```

**Errori:** `409` — Email già registrata.

---

### `POST /api/auth/login`

Login con email e password.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response `200`:**
```json
{
  "user": { "id": "uuid", "email": "user@example.com", "nome": "Mario", "admin": false },
  "access_token": "eyJ...",
  "refresh_token": "abc123..."
}
```

**Errori:** `401` — Email o password errati.

---

### `POST /api/auth/refresh`

Scambia un refresh token con una nuova coppia (rotation). Il vecchio token viene invalidato.

**Body:**
```json
{
  "refresh_token": "abc123..."
}
```

**Response `200`:**
```json
{
  "access_token": "eyJ...",
  "refresh_token": "def456..."
}
```

**Errori:** `401` — Token non valido / scaduto / utente non trovato.

---

### `POST /api/auth/logout`

Invalida **tutti** i refresh token dell'utente autenticato.

**Headers:** `Authorization: Bearer <access_token>`

**Body:** nessuno

**Response `200`:**
```json
{
  "message": "Logout effettuato"
}
```

---

### `GET /api/auth/me`

Restituisce il profilo dell'utente autenticato.

**Headers:** `Authorization: Bearer <access_token>`

**Response `200`:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "nome": "Mario",
  "admin": false
}
```

**Errori:** `404` — Utente non trovato.

---

### `POST /api/auth/promote`

Promuove un utente ad admin. NON richiede JWT, ma richiede un **segreto condiviso**.

**Body:**
```json
{
  "email": "user@example.com",
  "secret": "bmt2-admin-secret"
}
```

**Response `200`:**
```json
{
  "message": "Utente user@example.com promosso ad admin"
}
```

**Errori:** `403` — Secret non valido. `404` — Utente non trovato.

> **Nota:** Il secret di default è `bmt2-admin-secret`. Si configura via variabile d'ambiente `ADMIN_SECRET`.

---

## 2. Timer

Tutti gli endpoint `/api/timers` richiedono JWT.

**Headers:** `Authorization: Bearer <access_token>`

### `GET /api/timers`

Lista tutti i timer con calcoli in tempo reale.

**Response `200`:**
```json
[
  {
    "id": "uuid",
    "nome": "Metin Tu-Young",
    "categoria": "Metin",
    "tempo_respawn": 3600,
    "ultimo_spawn": "2026-05-21T12:30:00.000Z",
    "prossimo_spawn": "2026-05-21T13:30:00.000Z",
    "spawn_successivo": "2026-05-21T14:30:00.000Z",
    "tempo_rimanente": 1847,
    "tempo_trascorso": 1753,
    "stato": "in_corso",
    "spawn_oggi": 3,
    "spawn_dal_riavvio": 42,
    "spawn_points": null,
    "mappa_id": null,
    "icona": null,
    "note": null
  }
]
```

---

### `GET /api/timers/:id`

Dettaglio di un singolo timer.

**Response `200`:** Oggetto `Timer` (vedi schema sopra).

**Errori:** `404` — Timer non trovato.

---

### `POST /api/timers/:id/start`

Avvia o riprende il timer. Imposta stato a `in_corso`. Broadcast `timer:updated`.

**Response `200`:** Oggetto `Timer` aggiornato.

---

### `POST /api/timers/:id/pause`

Mette in pausa il timer. Salva i secondi rimanenti in `paused_remaining`. Imposta stato a `in_pausa`. Broadcast `timer:updated`.

**Response `200`:** Oggetto `Timer` aggiornato.

---

### `POST /api/timers/:id/reset`

Resetta il timer. Elimina **tutti** gli spawn event per quel boss. Imposta stato a `fermo`. Broadcast `timer:updated`.

**Response `200`:** Oggetto `Timer` aggiornato.

---

## 3. Admin — Metin/Boss CRUD

Tutti gli endpoint `/api/admin/metin-boss` richiedono JWT + ruolo admin.

**Headers:** `Authorization: Bearer <access_token>`

### `GET /api/admin/metin-boss`

Lista tutte le entità (Metin e Boss).

**Response `200`:**
```json
[
  {
    "id": "uuid",
    "nome": "Metin Tu-Young",
    "categoria": "Metin",
    "tempo_respawn": 3600,
    "spawn_points": "x:123,y:456",
    "mappa_id": "uuid_mappa",
    "icona": null,
    "note": "Vicino al villaggio",
    "created_at": "2026-05-20T..."
  }
]
```

---

### `GET /api/admin/metin-boss/:id`

Dettaglio di una singola entità.

**Errori:** `404` — Non trovato.

---

### `POST /api/admin/metin-boss`

Crea una nuova entità. Broadcast `admin:metin-boss-created`.

**Body:**
```json
{
  "nome": "Metin Tu-Young",
  "categoria": "Metin",
  "tempo_respawn": 3600,
  "mappa_id": null,
  "icona": null,
  "note": null
}
```

`categoria` può essere `"Metin"` o `"Boss"` (default `"Metin"`).

**Response `201`:** Oggetto `MetinBoss` creato.

---

### `PATCH /api/admin/metin-boss/:id`

Aggiorna parzialmente un'entità. Broadcast `admin:metin-boss-updated`.

**Body (tutti opzionali):**
```json
{
  "nome": "Nuovo Nome",
  "tempo_respawn": 1800
}
```

**Response `200`:** Oggetto `MetinBoss` aggiornato.

**Errori:** `404` — Non trovato.

---

### `DELETE /api/admin/metin-boss/:id`

Elimina un'entità. Broadcast `admin:metin-boss-deleted`.

**Response `200`:**
```json
{
  "message": "Metin/Boss eliminato"
}
```

**Errori:** `404` — Non trovato.

---

## 4. Admin — Mappe CRUD

Tutti gli endpoint `/api/admin/mappe` richiedono JWT + ruolo admin.

### `GET /api/admin/mappe`

Lista tutte le mappe.

**Response `200`:**
```json
[
  {
    "id": "uuid",
    "nome": "Mappa 1",
    "image_url": "https://...",
    "created_at": "2026-05-20T..."
  }
]
```

---

### `GET /api/admin/mappe/:id`

Dettaglio di una mappa.

**Errori:** `404` — Non trovata.

---

### `POST /api/admin/mappe`

Crea una nuova mappa. Broadcast `admin:mappa-created`.

**Body:**
```json
{
  "nome": "Mappa 1",
  "image_url": null
}
```

**Response `201`:** Oggetto `Mappa` creato.

---

### `PATCH /api/admin/mappe/:id`

Aggiorna parzialmente una mappa. Broadcast `admin:mappa-updated`.

**Body (tutti opzionali):**
```json
{
  "nome": "Nuovo nome mappa"
}
```

**Response `200`:** Oggetto `Mappa` aggiornato.

**Errori:** `404` — Non trovata.

---

### `DELETE /api/admin/mappe/:id`

Elimina una mappa. Broadcast `admin:mappa-deleted`.

**Response `200`:**
```json
{
  "message": "Mappa eliminata"
}
```

**Errori:** `404` — Non trovata.

---

## 5. Admin — Config

Tutti gli endpoint `/api/admin/config` richiedono JWT + ruolo admin.

### `GET /api/admin/config`

Legge tutte le chiavi di configurazione.

**Response `200`:**
```json
{
  "data_riavvio": "2026-04-14T23:20:00.000Z"
}
```

---

### `PATCH /api/admin/config/:key`

Aggiorna o crea una chiave di configurazione. Broadcast `admin:config-updated`.

**Body:**
```json
{
  "value": "2026-05-21T00:00:00.000Z"
}
```

**Response `200`:**
```json
{
  "key": "data_riavvio",
  "value": "2026-05-21T00:00:00.000Z"
}
```

---

## 6. WebSocket

**Endpoint:** `ws://<host>:3001/ws?token=<JWT>`

### Connessione

Il token JWT va passato come query parameter `token`. Se il token è mancante o non valido, la connessione viene chiusa con codice `4001`.

### Heartbeat

Il server invia un ping ogni 30 secondi. Il client deve rispondere con un messaggio `pong`. I socket che non rispondono vengono terminati.

### Messaggio di benvenuto

Alla connessione riuscita, il server invia:
```json
{
  "type": "connected",
  "userId": "uuid_utente"
}
```

### Eventi broadcast

Tutti gli eventi hanno il formato:
```json
{
  "type": "<event_type>",
  "timer": { ... },
  "metinBoss": { ... },
  "mappa": { ... },
  "metinBossId": "uuid",
  "mappaId": "uuid",
  "key": "data_riavvio",
  "value": "...",
  "timestamp": "2026-05-21T12:00:00.000Z"
}
```

| Evento | Quando | Campi inclusi |
|--------|--------|---------------|
| `timer:updated` | Start/pause/reset timer | `timer`, `timestamp` |
| `admin:metin-boss-created` | Nuovo Metin/Boss | `metinBoss`, `timestamp` |
| `admin:metin-boss-updated` | Metin/Boss modificato | `metinBoss`, `timestamp` |
| `admin:metin-boss-deleted` | Metin/Boss eliminato | `metinBossId`, `timestamp` |
| `admin:mappa-created` | Nuova mappa | `mappa`, `timestamp` |
| `admin:mappa-updated` | Mappa modificata | `mappa`, `timestamp` |
| `admin:mappa-deleted` | Mappa eliminata | `mappaId`, `timestamp` |
| `admin:config-updated` | Config aggiornata | `key`, `value`, `timestamp` |

---

## 7. Schema Timer

Proprietà dell'oggetto `Timer` restituito dalle API `/api/timers`.

| Campo | Tipo | Descrizione |
|-------|------|-------------|
| `id` | `string` (UUID) | ID del Metin/Boss |
| `nome` | `string` | Nome visualizzato |
| `categoria` | `"Metin" \| "Boss"` | Tipo di entità |
| `tempo_respawn` | `number` | Secondi tra uno spawn e l'altro |
| `ultimo_spawn` | `string \| null` | ISO data ultimo kill registrato |
| `prossimo_spawn` | `string \| null` | ISO data = `ultimo_spawn + tempo_respawn` |
| `spawn_successivo` | `string \| null` | ISO data = `prossimo_spawn + tempo_respawn` |
| `tempo_rimanente` | `number \| null` | Secondi rimanenti al prossimo spawn |
| `tempo_trascorso` | `number \| null` | Secondi trascorsi dall'ultimo spawn |
| `stato` | `"fermo" \| "in_corso" \| "in_pausa" \| "respawnato"` | Stato attuale del timer |
| `spawn_oggi` | `number` | Conteggio spawn events oggi |
| `spawn_dal_riavvio` | `number` | Conteggio spawn dall'ultimo riavvio server |
| `spawn_points` | `string \| null` | Coordinate o descrizione punti spawn |
| `mappa_id` | `string \| null` | ID mappa associata |
| `icona` | `string \| null` | URL icona |
| `note` | `string \| null` | Note opzionali |

---

## 8. Codici Errore

| Codice | Significato |
|--------|-------------|
| `400` | Richiesta malformata (es. body non valido) |
| `401` | Non autenticato (JWT mancante, scaduto o non valido) |
| `403` | Non autorizzato (es. secret admin errato, utente non admin) |
| `404` | Risorsa non trovata |
| `409` | Conflitto (es. email già registrata) |
| `500` | Errore interno del server |

Formato errore:
```json
{
  "error": "Descrizione dell'errore"
}
```

---

## Variabili d'Ambiente

| Variabile | Default | Descrizione |
|-----------|---------|-------------|
| `PORT` | `3001` | Porta del server HTTP |
| `JWT_SECRET` | `bmt2-timer-secret-dev` | Chiave per firmare i JWT |
| `ADMIN_SECRET` | `bmt2-admin-secret` | Segreto per promuovere admin |
| `DATABASE_URL` | `file:./data/bmt2.db` | Path del database SQLite |

---

## Autenticazione Rapida

```bash
# 1. Registrazione
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","nome":"Test","password":"test123"}'

# 2. Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'

# 3. Usa il token per chiamate autenticate
curl http://localhost:3001/api/timers \
  -H "Authorization: Bearer <access_token>"

# 4. Promuovi ad admin
curl -X POST http://localhost:3001/api/auth/promote \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","secret":"bmt2-admin-secret"}'
```
