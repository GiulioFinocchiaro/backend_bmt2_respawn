import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const timers = sqliteTable('timers', {
  id: text('id').primaryKey(),
  nome_boss: text('nome_boss').notNull(),
  categoria: text('categoria').default('Metin'),
  tempo_respawn: integer('tempo_respawn').notNull(),
  spawn_precedente: text('spawn_precedente'),
  ultimo_spawn: text('ultimo_spawn'),
  spawn_oggi: integer('spawn_oggi').default(0),
  stato: text('stato').default('fermo'),
  note: text('note'),
  created_at: text('created_at').default(new Date().toISOString()),
  updated_at: text('updated_at').default(new Date().toISOString()),
});
