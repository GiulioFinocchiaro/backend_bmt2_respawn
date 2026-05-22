export declare const spec: {
    openapi: string;
    info: {
        title: string;
        version: string;
        description: string;
    };
    servers: {
        url: string;
        description: string;
    }[];
    components: {
        securitySchemes: {
            BearerAuth: {
                type: string;
                scheme: string;
                bearerFormat: string;
            };
        };
        schemas: {
            Timer: {
                type: string;
                properties: {
                    mbt_id: {
                        type: string;
                        format: string;
                        description: string;
                    };
                    id: {
                        type: string;
                        format: string;
                        description: string;
                    };
                    nome: {
                        type: string;
                    };
                    categoria: {
                        type: string;
                        enum: string[];
                    };
                    descrizione: {
                        type: string;
                        nullable: boolean;
                        description: string;
                    };
                    tempo_respawn: {
                        type: string;
                        description: string;
                    };
                    ultimo_spawn: {
                        type: string;
                        format: string;
                        nullable: boolean;
                        description: string;
                    };
                    prossimo_spawn: {
                        type: string;
                        format: string;
                        nullable: boolean;
                        description: string;
                    };
                    spawn_successivo: {
                        type: string;
                        format: string;
                        nullable: boolean;
                        description: string;
                    };
                    tempo_rimanente: {
                        type: string;
                        nullable: boolean;
                        description: string;
                    };
                    tempo_trascorso: {
                        type: string;
                        nullable: boolean;
                        description: string;
                    };
                    stato: {
                        type: string;
                        enum: string[];
                        description: string;
                    };
                    spawn_oggi: {
                        type: string;
                        description: string;
                    };
                    spawn_dal_riavvio: {
                        type: string;
                        description: string;
                    };
                    icona: {
                        type: string;
                        nullable: boolean;
                    };
                    note: {
                        type: string;
                        nullable: boolean;
                    };
                };
            };
            MetinBoss: {
                type: string;
                properties: {
                    id: {
                        type: string;
                        format: string;
                    };
                    nome: {
                        type: string;
                    };
                    categoria: {
                        type: string;
                        enum: string[];
                    };
                    icona: {
                        type: string;
                        nullable: boolean;
                    };
                    note: {
                        type: string;
                        nullable: boolean;
                    };
                    created_at: {
                        type: string;
                        format: string;
                    };
                };
            };
            MbTmp: {
                type: string;
                properties: {
                    id: {
                        type: string;
                        format: string;
                    };
                    metin_boss_id: {
                        type: string;
                        format: string;
                    };
                    descrizione: {
                        type: string;
                    };
                    tempo_respawn: {
                        type: string;
                        description: string;
                    };
                    created_at: {
                        type: string;
                        format: string;
                    };
                };
            };
            MappaMbt: {
                type: string;
                properties: {
                    id: {
                        type: string;
                        format: string;
                    };
                    mbt_id: {
                        type: string;
                        format: string;
                    };
                    coord_x: {
                        type: string;
                    };
                    coord_y: {
                        type: string;
                    };
                    mappa_id: {
                        type: string;
                    };
                    created_at: {
                        type: string;
                        format: string;
                    };
                };
            };
            Mappa: {
                type: string;
                properties: {
                    id: {
                        type: string;
                        format: string;
                    };
                    nome: {
                        type: string;
                    };
                    image_url: {
                        type: string;
                        nullable: boolean;
                    };
                    created_at: {
                        type: string;
                        format: string;
                    };
                };
            };
            User: {
                type: string;
                properties: {
                    id: {
                        type: string;
                        format: string;
                    };
                    email: {
                        type: string;
                        format: string;
                    };
                    nome: {
                        type: string;
                    };
                    admin: {
                        type: string;
                    };
                };
            };
            PromoteInput: {
                type: string;
                required: string[];
                properties: {
                    email: {
                        type: string;
                        format: string;
                    };
                    secret: {
                        type: string;
                    };
                };
            };
            AuthResponse: {
                type: string;
                properties: {
                    user: {
                        $ref: string;
                    };
                    access_token: {
                        type: string;
                    };
                    refresh_token: {
                        type: string;
                    };
                };
            };
            Error: {
                type: string;
                properties: {
                    error: {
                        type: string;
                    };
                };
            };
            CreateMetinBossInput: {
                type: string;
                required: string[];
                properties: {
                    nome: {
                        type: string;
                        minLength: number;
                    };
                    categoria: {
                        type: string;
                        enum: string[];
                        default: string;
                    };
                    icona: {
                        type: string;
                        nullable: boolean;
                    };
                    note: {
                        type: string;
                        nullable: boolean;
                    };
                };
            };
            UpdateMetinBossInput: {
                type: string;
                properties: {
                    nome: {
                        type: string;
                        minLength: number;
                    };
                    categoria: {
                        type: string;
                        enum: string[];
                    };
                    icona: {
                        type: string;
                        nullable: boolean;
                    };
                    note: {
                        type: string;
                        nullable: boolean;
                    };
                };
            };
            CreateMbTmpInput: {
                type: string;
                required: string[];
                properties: {
                    metin_boss_id: {
                        type: string;
                        format: string;
                    };
                    descrizione: {
                        type: string;
                        minLength: number;
                    };
                    tempo_respawn: {
                        type: string;
                        minimum: number;
                    };
                };
            };
            UpdateMbTmpInput: {
                type: string;
                properties: {
                    descrizione: {
                        type: string;
                        minLength: number;
                    };
                    tempo_respawn: {
                        type: string;
                        minimum: number;
                    };
                };
            };
            CreateMappaMbtInput: {
                type: string;
                required: string[];
                properties: {
                    mbt_id: {
                        type: string;
                        format: string;
                    };
                    coord_x: {
                        type: string;
                    };
                    coord_y: {
                        type: string;
                    };
                    mappa_id: {
                        type: string;
                        format: string;
                    };
                };
            };
            UpdateMappaMbtInput: {
                type: string;
                properties: {
                    coord_x: {
                        type: string;
                    };
                    coord_y: {
                        type: string;
                    };
                    mappa_id: {
                        type: string;
                        format: string;
                    };
                };
            };
            RegisterInput: {
                type: string;
                required: string[];
                properties: {
                    email: {
                        type: string;
                        format: string;
                    };
                    nome: {
                        type: string;
                        minLength: number;
                    };
                    password: {
                        type: string;
                        minLength: number;
                    };
                };
            };
            LoginInput: {
                type: string;
                required: string[];
                properties: {
                    email: {
                        type: string;
                        format: string;
                    };
                    password: {
                        type: string;
                    };
                };
            };
            RefreshInput: {
                type: string;
                required: string[];
                properties: {
                    refresh_token: {
                        type: string;
                    };
                };
            };
        };
    };
    paths: {
        '/api/auth/register': {
            post: {
                tags: string[];
                summary: string;
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                $ref: string;
                            };
                        };
                    };
                };
                responses: {
                    '201': {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    '409': {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                };
            };
        };
        '/api/auth/login': {
            post: {
                tags: string[];
                summary: string;
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                $ref: string;
                            };
                        };
                    };
                };
                responses: {
                    '200': {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    '401': {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                };
            };
        };
        '/api/auth/refresh': {
            post: {
                tags: string[];
                summary: string;
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                $ref: string;
                            };
                        };
                    };
                };
                responses: {
                    '200': {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    type: string;
                                    properties: {
                                        access_token: {
                                            type: string;
                                        };
                                        refresh_token: {
                                            type: string;
                                        };
                                    };
                                };
                            };
                        };
                    };
                    '401': {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                };
            };
        };
        '/api/auth/logout': {
            post: {
                tags: string[];
                summary: string;
                security: {
                    BearerAuth: never[];
                }[];
                responses: {
                    '200': {
                        description: string;
                    };
                    '401': {
                        description: string;
                    };
                };
            };
        };
        '/api/auth/me': {
            get: {
                tags: string[];
                summary: string;
                security: {
                    BearerAuth: never[];
                }[];
                responses: {
                    '200': {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    '401': {
                        description: string;
                    };
                };
            };
        };
        '/api/auth/promote': {
            post: {
                tags: string[];
                summary: string;
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                $ref: string;
                            };
                        };
                    };
                };
                responses: {
                    '200': {
                        description: string;
                    };
                    '403': {
                        description: string;
                    };
                    '404': {
                        description: string;
                    };
                };
            };
        };
        '/api/timers': {
            get: {
                tags: string[];
                summary: string;
                security: {
                    BearerAuth: never[];
                }[];
                responses: {
                    '200': {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    type: string;
                                    items: {
                                        $ref: string;
                                    };
                                };
                            };
                        };
                    };
                    '401': {
                        description: string;
                    };
                };
            };
        };
        '/api/timers/{id}': {
            get: {
                tags: string[];
                summary: string;
                security: {
                    BearerAuth: never[];
                }[];
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                    };
                }[];
                responses: {
                    '200': {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    '404': {
                        description: string;
                    };
                };
            };
        };
        '/api/admin/metin-boss': {
            get: {
                tags: string[];
                summary: string;
                security: {
                    BearerAuth: never[];
                }[];
                responses: {
                    '200': {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    type: string;
                                    items: {
                                        $ref: string;
                                    };
                                };
                            };
                        };
                    };
                };
            };
            post: {
                tags: string[];
                summary: string;
                security: {
                    BearerAuth: never[];
                }[];
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                $ref: string;
                            };
                        };
                    };
                };
                responses: {
                    '201': {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                };
            };
        };
        '/api/admin/metin-boss/{id}': {
            get: {
                tags: string[];
                summary: string;
                security: {
                    BearerAuth: never[];
                }[];
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                    };
                }[];
                responses: {
                    '200': {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    '404': {
                        description: string;
                    };
                };
            };
            patch: {
                tags: string[];
                summary: string;
                security: {
                    BearerAuth: never[];
                }[];
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                    };
                }[];
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                $ref: string;
                            };
                        };
                    };
                };
                responses: {
                    '200': {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    '404': {
                        description: string;
                    };
                };
            };
            delete: {
                tags: string[];
                summary: string;
                security: {
                    BearerAuth: never[];
                }[];
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                    };
                }[];
                responses: {
                    '200': {
                        description: string;
                    };
                    '404': {
                        description: string;
                    };
                };
            };
        };
        '/api/admin/mb-tmp': {
            get: {
                tags: string[];
                summary: string;
                security: {
                    BearerAuth: never[];
                }[];
                responses: {
                    '200': {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    type: string;
                                    items: {
                                        $ref: string;
                                    };
                                };
                            };
                        };
                    };
                };
            };
            post: {
                tags: string[];
                summary: string;
                security: {
                    BearerAuth: never[];
                }[];
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                $ref: string;
                            };
                        };
                    };
                };
                responses: {
                    '201': {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                };
            };
        };
        '/api/admin/mb-tmp/{id}': {
            get: {
                tags: string[];
                summary: string;
                security: {
                    BearerAuth: never[];
                }[];
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                    };
                }[];
                responses: {
                    '200': {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    '404': {
                        description: string;
                    };
                };
            };
            patch: {
                tags: string[];
                summary: string;
                security: {
                    BearerAuth: never[];
                }[];
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                    };
                }[];
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                $ref: string;
                            };
                        };
                    };
                };
                responses: {
                    '200': {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    '404': {
                        description: string;
                    };
                };
            };
            delete: {
                tags: string[];
                summary: string;
                security: {
                    BearerAuth: never[];
                }[];
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                    };
                }[];
                responses: {
                    '200': {
                        description: string;
                    };
                    '404': {
                        description: string;
                    };
                };
            };
        };
        '/api/admin/mappa-mbt': {
            get: {
                tags: string[];
                summary: string;
                security: {
                    BearerAuth: never[];
                }[];
                responses: {
                    '200': {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    type: string;
                                    items: {
                                        $ref: string;
                                    };
                                };
                            };
                        };
                    };
                };
            };
            post: {
                tags: string[];
                summary: string;
                security: {
                    BearerAuth: never[];
                }[];
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                $ref: string;
                            };
                        };
                    };
                };
                responses: {
                    '201': {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                };
            };
        };
        '/api/admin/mappa-mbt/{id}': {
            get: {
                tags: string[];
                summary: string;
                security: {
                    BearerAuth: never[];
                }[];
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                    };
                }[];
                responses: {
                    '200': {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    '404': {
                        description: string;
                    };
                };
            };
            patch: {
                tags: string[];
                summary: string;
                security: {
                    BearerAuth: never[];
                }[];
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                    };
                }[];
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                $ref: string;
                            };
                        };
                    };
                };
                responses: {
                    '200': {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    '404': {
                        description: string;
                    };
                };
            };
            delete: {
                tags: string[];
                summary: string;
                security: {
                    BearerAuth: never[];
                }[];
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                    };
                }[];
                responses: {
                    '200': {
                        description: string;
                    };
                    '404': {
                        description: string;
                    };
                };
            };
        };
        '/api/admin/mappe': {
            get: {
                tags: string[];
                summary: string;
                security: {
                    BearerAuth: never[];
                }[];
                responses: {
                    '200': {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    type: string;
                                    items: {
                                        $ref: string;
                                    };
                                };
                            };
                        };
                    };
                };
            };
            post: {
                tags: string[];
                summary: string;
                security: {
                    BearerAuth: never[];
                }[];
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                type: string;
                                required: string[];
                                properties: {
                                    nome: {
                                        type: string;
                                    };
                                    image_url: {
                                        type: string;
                                        nullable: boolean;
                                    };
                                };
                            };
                        };
                    };
                };
                responses: {
                    '201': {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                };
            };
        };
        '/api/admin/mappe/{id}': {
            get: {
                tags: string[];
                summary: string;
                security: {
                    BearerAuth: never[];
                }[];
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                    };
                }[];
                responses: {
                    '200': {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    '404': {
                        description: string;
                    };
                };
            };
            patch: {
                tags: string[];
                summary: string;
                security: {
                    BearerAuth: never[];
                }[];
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                    };
                }[];
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                type: string;
                                properties: {
                                    nome: {
                                        type: string;
                                    };
                                    image_url: {
                                        type: string;
                                        nullable: boolean;
                                    };
                                };
                            };
                        };
                    };
                };
                responses: {
                    '200': {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    '404': {
                        description: string;
                    };
                };
            };
            delete: {
                tags: string[];
                summary: string;
                security: {
                    BearerAuth: never[];
                }[];
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                    };
                }[];
                responses: {
                    '200': {
                        description: string;
                    };
                    '404': {
                        description: string;
                    };
                };
            };
        };
        '/api/admin/config': {
            get: {
                tags: string[];
                summary: string;
                security: {
                    BearerAuth: never[];
                }[];
                responses: {
                    '200': {
                        description: string;
                    };
                };
            };
        };
        '/api/admin/config/{key}': {
            patch: {
                tags: string[];
                summary: string;
                security: {
                    BearerAuth: never[];
                }[];
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                    };
                }[];
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                type: string;
                                required: string[];
                                properties: {
                                    value: {
                                        type: string;
                                    };
                                };
                            };
                        };
                    };
                };
                responses: {
                    '200': {
                        description: string;
                    };
                };
            };
        };
    };
    tags: {
        name: string;
        description: string;
    }[];
};
//# sourceMappingURL=openapi.d.ts.map