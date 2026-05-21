export const spec = {
  openapi: '3.1.0',
  info: {
    title: 'BMT2 Timer API',
    version: '1.0.0',
    description: 'API per il timer boss di Metin2. Supporta autenticazione JWT, CRUD boss/metin, mappe, e WebSocket in tempo reale.',
  },
  servers: [
    { url: 'http://localhost:3001', description: 'Development' },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      Timer: {
        type: 'object',
        properties: {
          mbt_id: { type: 'string', format: 'uuid', description: 'ID della variante mb_tmp' },
          id: { type: 'string', format: 'uuid', description: 'ID del metin_boss' },
          nome: { type: 'string' },
          categoria: { type: 'string', enum: ['Metin', 'Boss'] },
          descrizione: { type: 'string', nullable: true, description: 'Descrizione / punti spawn' },
          tempo_respawn: { type: 'integer', description: 'Tempo in secondi' },
          ultimo_spawn: { type: 'string', format: 'date-time', nullable: true, description: 'Ultimo spawn calcolato' },
          prossimo_spawn: { type: 'string', format: 'date-time', nullable: true, description: 'Prossimo spawn = ultimo_spawn + tempo_respawn' },
          spawn_successivo: { type: 'string', format: 'date-time', nullable: true, description: 'Spawn successivo = prossimo_spawn + tempo_respawn' },
          tempo_rimanente: { type: 'integer', nullable: true, description: 'Secondi rimanenti al prossimo spawn' },
          tempo_trascorso: { type: 'integer', nullable: true, description: 'Secondi trascorsi dall\'ultimo spawn' },
          stato: { type: 'string', enum: ['in_corso', 'respawnato'], description: 'Stato determinato dal timer' },
          spawn_oggi: { type: 'integer', description: 'Spawn avvenuti oggi' },
          spawn_dal_riavvio: { type: 'integer', description: 'Spawn avvenuti dal riavvio del server' },
          icona: { type: 'string', nullable: true },
          note: { type: 'string', nullable: true },
        },
      },
      MetinBoss: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          nome: { type: 'string' },
          categoria: { type: 'string', enum: ['Metin', 'Boss'] },
          icona: { type: 'string', nullable: true },
          note: { type: 'string', nullable: true },
          created_at: { type: 'string', format: 'date-time' },
        },
      },
      MbTmp: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          metin_boss_id: { type: 'string', format: 'uuid' },
          descrizione: { type: 'string' },
          tempo_respawn: { type: 'integer', description: 'Tempo in secondi' },
          created_at: { type: 'string', format: 'date-time' },
        },
      },
      MappaMbt: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          mbt_id: { type: 'string', format: 'uuid' },
          coord_x: { type: 'integer' },
          coord_y: { type: 'integer' },
          mappa_id: { type: 'string' },
          created_at: { type: 'string', format: 'date-time' },
        },
      },
      Mappa: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          nome: { type: 'string' },
          image_url: { type: 'string', nullable: true },
          created_at: { type: 'string', format: 'date-time' },
        },
      },
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          email: { type: 'string', format: 'email' },
          nome: { type: 'string' },
          admin: { type: 'boolean' },
        },
      },
      PromoteInput: {
        type: 'object',
        required: ['email', 'secret'],
        properties: {
          email: { type: 'string', format: 'email' },
          secret: { type: 'string' },
        },
      },
      AuthResponse: {
        type: 'object',
        properties: {
          user: { '$ref': '#/components/schemas/User' },
          access_token: { type: 'string' },
          refresh_token: { type: 'string' },
        },
      },
      Error: {
        type: 'object',
        properties: {
          error: { type: 'string' },
        },
      },
      CreateMetinBossInput: {
        type: 'object',
        required: ['nome'],
        properties: {
          nome: { type: 'string', minLength: 1 },
          categoria: { type: 'string', enum: ['Metin', 'Boss'], default: 'Metin' },
          icona: { type: 'string', nullable: true },
          note: { type: 'string', nullable: true },
        },
      },
      UpdateMetinBossInput: {
        type: 'object',
        properties: {
          nome: { type: 'string', minLength: 1 },
          categoria: { type: 'string', enum: ['Metin', 'Boss'] },
          icona: { type: 'string', nullable: true },
          note: { type: 'string', nullable: true },
        },
      },
      CreateMbTmpInput: {
        type: 'object',
        required: ['metin_boss_id', 'descrizione', 'tempo_respawn'],
        properties: {
          metin_boss_id: { type: 'string', format: 'uuid' },
          descrizione: { type: 'string', minLength: 1 },
          tempo_respawn: { type: 'integer', minimum: 1 },
        },
      },
      UpdateMbTmpInput: {
        type: 'object',
        properties: {
          descrizione: { type: 'string', minLength: 1 },
          tempo_respawn: { type: 'integer', minimum: 1 },
        },
      },
      CreateMappaMbtInput: {
        type: 'object',
        required: ['mbt_id', 'coord_x', 'coord_y', 'mappa_id'],
        properties: {
          mbt_id: { type: 'string', format: 'uuid' },
          coord_x: { type: 'integer' },
          coord_y: { type: 'integer' },
          mappa_id: { type: 'string', format: 'uuid' },
        },
      },
      UpdateMappaMbtInput: {
        type: 'object',
        properties: {
          coord_x: { type: 'integer' },
          coord_y: { type: 'integer' },
          mappa_id: { type: 'string', format: 'uuid' },
        },
      },
      RegisterInput: {
        type: 'object',
        required: ['email', 'nome', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          nome: { type: 'string', minLength: 1 },
          password: { type: 'string', minLength: 6 },
        },
      },
      LoginInput: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string' },
        },
      },
      RefreshInput: {
        type: 'object',
        required: ['refresh_token'],
        properties: {
          refresh_token: { type: 'string' },
        },
      },
    },
  },
  paths: {
    '/api/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Registra un nuovo utente',
        requestBody: { content: { 'application/json': { schema: { '$ref': '#/components/schemas/RegisterInput' } } } },
        responses: {
          '201': { description: 'Utente registrato', content: { 'application/json': { schema: { '$ref': '#/components/schemas/AuthResponse' } } } },
          '409': { description: 'Email già registrata', content: { 'application/json': { schema: { '$ref': '#/components/schemas/Error' } } } },
        },
      },
    },
    '/api/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login utente',
        requestBody: { content: { 'application/json': { schema: { '$ref': '#/components/schemas/LoginInput' } } } },
        responses: {
          '200': { description: 'Login effettuato', content: { 'application/json': { schema: { '$ref': '#/components/schemas/AuthResponse' } } } },
          '401': { description: 'Credenziali errate', content: { 'application/json': { schema: { '$ref': '#/components/schemas/Error' } } } },
        },
      },
    },
    '/api/auth/refresh': {
      post: {
        tags: ['Auth'],
        summary: 'Rinnova access token con refresh token',
        requestBody: { content: { 'application/json': { schema: { '$ref': '#/components/schemas/RefreshInput' } } } },
        responses: {
          '200': { description: 'Token rinnovato', content: { 'application/json': { schema: { type: 'object', properties: { access_token: { type: 'string' }, refresh_token: { type: 'string' } } } } } },
          '401': { description: 'Refresh token non valido', content: { 'application/json': { schema: { '$ref': '#/components/schemas/Error' } } } },
        },
      },
    },
    '/api/auth/logout': {
      post: {
        tags: ['Auth'],
        summary: 'Logout (invalida tutti i refresh token)',
        security: [{ BearerAuth: [] }],
        responses: {
          '200': { description: 'Logout effettuato' },
          '401': { description: 'Non autorizzato' },
        },
      },
    },
    '/api/auth/me': {
      get: {
        tags: ['Auth'],
        summary: 'Profilo utente corrente',
        security: [{ BearerAuth: [] }],
        responses: {
          '200': { description: 'Profilo utente', content: { 'application/json': { schema: { '$ref': '#/components/schemas/User' } } } },
          '401': { description: 'Non autorizzato' },
        },
      },
    },
    '/api/auth/promote': {
      post: {
        tags: ['Auth'],
        summary: 'Promuovi utente ad admin (richiede ADMIN_SECRET)',
        requestBody: { content: { 'application/json': { schema: { '$ref': '#/components/schemas/PromoteInput' } } } },
        responses: {
          '200': { description: 'Utente promosso' },
          '403': { description: 'Secret non valido' },
          '404': { description: 'Utente non trovato' },
        },
      },
    },
    '/api/timers': {
      get: {
        tags: ['Timers'],
        summary: 'Lista tutti i timer con calcoli on-the-fly',
        security: [{ BearerAuth: [] }],
        responses: {
          '200': { description: 'Lista timer', content: { 'application/json': { schema: { type: 'array', items: { '$ref': '#/components/schemas/Timer' } } } } },
          '401': { description: 'Non autorizzato' },
        },
      },
    },
    '/api/timers/{id}': {
      get: {
        tags: ['Timers'],
        summary: 'Dettaglio timer per mb_tmp id',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          '200': { description: 'Timer', content: { 'application/json': { schema: { '$ref': '#/components/schemas/Timer' } } } },
          '404': { description: 'Non trovato' },
        },
      },
    },
    '/api/admin/metin-boss': {
      get: {
        tags: ['Admin - Metin/Boss'],
        summary: 'Lista tutti i metin/boss',
        security: [{ BearerAuth: [] }],
        responses: {
          '200': { description: 'Lista', content: { 'application/json': { schema: { type: 'array', items: { '$ref': '#/components/schemas/MetinBoss' } } } } },
        },
      },
      post: {
        tags: ['Admin - Metin/Boss'],
        summary: 'Crea nuovo metin/boss (senza tempo_respawn)',
        security: [{ BearerAuth: [] }],
        requestBody: { content: { 'application/json': { schema: { '$ref': '#/components/schemas/CreateMetinBossInput' } } } },
        responses: {
          '201': { description: 'Creato', content: { 'application/json': { schema: { '$ref': '#/components/schemas/MetinBoss' } } } },
        },
      },
    },
    '/api/admin/metin-boss/{id}': {
      get: {
        tags: ['Admin - Metin/Boss'],
        summary: 'Dettaglio metin/boss',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          '200': { description: 'Metin/Boss', content: { 'application/json': { schema: { '$ref': '#/components/schemas/MetinBoss' } } } },
          '404': { description: 'Non trovato' },
        },
      },
      patch: {
        tags: ['Admin - Metin/Boss'],
        summary: 'Modifica metin/boss',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { content: { 'application/json': { schema: { '$ref': '#/components/schemas/UpdateMetinBossInput' } } } },
        responses: {
          '200': { description: 'Aggiornato', content: { 'application/json': { schema: { '$ref': '#/components/schemas/MetinBoss' } } } },
          '404': { description: 'Non trovato' },
        },
      },
      delete: {
        tags: ['Admin - Metin/Boss'],
        summary: 'Elimina metin/boss',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          '200': { description: 'Eliminato' },
          '404': { description: 'Non trovato' },
        },
      },
    },
    '/api/admin/mb-tmp': {
      get: {
        tags: ['Admin - MbTmp'],
        summary: 'Lista tutte le varianti respawn',
        security: [{ BearerAuth: [] }],
        responses: {
          '200': { description: 'Lista', content: { 'application/json': { schema: { type: 'array', items: { '$ref': '#/components/schemas/MbTmp' } } } } },
        },
      },
      post: {
        tags: ['Admin - MbTmp'],
        summary: 'Crea nuova variante respawn',
        security: [{ BearerAuth: [] }],
        requestBody: { content: { 'application/json': { schema: { '$ref': '#/components/schemas/CreateMbTmpInput' } } } },
        responses: {
          '201': { description: 'Creato', content: { 'application/json': { schema: { '$ref': '#/components/schemas/MbTmp' } } } },
        },
      },
    },
    '/api/admin/mb-tmp/{id}': {
      get: {
        tags: ['Admin - MbTmp'],
        summary: 'Dettaglio variante respawn',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          '200': { description: 'MbTmp', content: { 'application/json': { schema: { '$ref': '#/components/schemas/MbTmp' } } } },
          '404': { description: 'Non trovato' },
        },
      },
      patch: {
        tags: ['Admin - MbTmp'],
        summary: 'Modifica variante respawn',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { content: { 'application/json': { schema: { '$ref': '#/components/schemas/UpdateMbTmpInput' } } } },
        responses: {
          '200': { description: 'Aggiornato', content: { 'application/json': { schema: { '$ref': '#/components/schemas/MbTmp' } } } },
          '404': { description: 'Non trovato' },
        },
      },
      delete: {
        tags: ['Admin - MbTmp'],
        summary: 'Elimina variante respawn',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          '200': { description: 'Eliminato' },
          '404': { description: 'Non trovato' },
        },
      },
    },
    '/api/admin/mappa-mbt': {
      get: {
        tags: ['Admin - MappaMbt'],
        summary: 'Lista tutte le coordinate mappa',
        security: [{ BearerAuth: [] }],
        responses: {
          '200': { description: 'Lista', content: { 'application/json': { schema: { type: 'array', items: { '$ref': '#/components/schemas/MappaMbt' } } } } },
        },
      },
      post: {
        tags: ['Admin - MappaMbt'],
        summary: 'Crea nuova coordinata mappa',
        security: [{ BearerAuth: [] }],
        requestBody: { content: { 'application/json': { schema: { '$ref': '#/components/schemas/CreateMappaMbtInput' } } } },
        responses: {
          '201': { description: 'Creato', content: { 'application/json': { schema: { '$ref': '#/components/schemas/MappaMbt' } } } },
        },
      },
    },
    '/api/admin/mappa-mbt/{id}': {
      get: {
        tags: ['Admin - MappaMbt'],
        summary: 'Dettaglio coordinata mappa',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          '200': { description: 'MappaMbt', content: { 'application/json': { schema: { '$ref': '#/components/schemas/MappaMbt' } } } },
          '404': { description: 'Non trovato' },
        },
      },
      patch: {
        tags: ['Admin - MappaMbt'],
        summary: 'Modifica coordinata mappa',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { content: { 'application/json': { schema: { '$ref': '#/components/schemas/UpdateMappaMbtInput' } } } },
        responses: {
          '200': { description: 'Aggiornato', content: { 'application/json': { schema: { '$ref': '#/components/schemas/MappaMbt' } } } },
          '404': { description: 'Non trovato' },
        },
      },
      delete: {
        tags: ['Admin - MappaMbt'],
        summary: 'Elimina coordinata mappa',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          '200': { description: 'Eliminato' },
          '404': { description: 'Non trovato' },
        },
      },
    },
    '/api/admin/mappe': {
      get: {
        tags: ['Admin - Mappe'],
        summary: 'Lista tutte le mappe',
        security: [{ BearerAuth: [] }],
        responses: {
          '200': { description: 'Lista mappe', content: { 'application/json': { schema: { type: 'array', items: { '$ref': '#/components/schemas/Mappa' } } } } },
        },
      },
      post: {
        tags: ['Admin - Mappe'],
        summary: 'Crea nuova mappa',
        security: [{ BearerAuth: [] }],
        requestBody: { content: { 'application/json': { schema: { type: 'object', required: ['nome'], properties: { nome: { type: 'string' }, image_url: { type: 'string', nullable: true } } } } } },
        responses: {
          '201': { description: 'Mappa creata', content: { 'application/json': { schema: { '$ref': '#/components/schemas/Mappa' } } } },
        },
      },
    },
    '/api/admin/mappe/{id}': {
      get: {
        tags: ['Admin - Mappe'],
        summary: 'Dettaglio mappa',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          '200': { description: 'Mappa', content: { 'application/json': { schema: { '$ref': '#/components/schemas/Mappa' } } } },
          '404': { description: 'Non trovata' },
        },
      },
      patch: {
        tags: ['Admin - Mappe'],
        summary: 'Modifica mappa',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { nome: { type: 'string' }, image_url: { type: 'string', nullable: true } } } } } },
        responses: {
          '200': { description: 'Aggiornata', content: { 'application/json': { schema: { '$ref': '#/components/schemas/Mappa' } } } },
          '404': { description: 'Non trovata' },
        },
      },
      delete: {
        tags: ['Admin - Mappe'],
        summary: 'Elimina mappa',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          '200': { description: 'Eliminata' },
          '404': { description: 'Non trovata' },
        },
      },
    },
    '/api/admin/config': {
      get: {
        tags: ['Admin - Config'],
        summary: 'Leggi tutte le configurazioni',
        security: [{ BearerAuth: [] }],
        responses: { '200': { description: 'Configurazioni' } },
      },
    },
    '/api/admin/config/{key}': {
      patch: {
        tags: ['Admin - Config'],
        summary: 'Aggiorna configurazione (es. data_riavvio)',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'key', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { content: { 'application/json': { schema: { type: 'object', required: ['value'], properties: { value: { type: 'string' } } } } } },
        responses: { '200': { description: 'Configurazione aggiornata' } },
      },
    },
  },
  tags: [
    { name: 'Auth', description: 'Autenticazione JWT' },
    { name: 'Timers', description: 'Timer boss calcolati on-the-fly' },
    { name: 'Admin - Metin/Boss', description: 'CRUD metin e boss' },
    { name: 'Admin - MbTmp', description: 'CRUD varianti respawn' },
    { name: 'Admin - MappaMbt', description: 'CRUD coordinate mappa' },
    { name: 'Admin - Mappe', description: 'CRUD mappe' },
    { name: 'Admin - Config', description: 'Configurazioni server' },
  ],
};
