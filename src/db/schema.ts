import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  nome: text('nome').notNull(),
  password_hash: text('password_hash').notNull(),
  admin: integer('admin', { mode: 'boolean' }).default(false),
  created_at: text('created_at').default(new Date().toISOString()),
});

export const refreshTokens = sqliteTable('refresh_tokens', {
  id: text('id').primaryKey(),
  user_id: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  token: text('token').notNull().unique(),
  expires_at: text('expires_at').notNull(),
  created_at: text('created_at').default(new Date().toISOString()),
});

export const config = sqliteTable('config', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
});

export const metinBoss = sqliteTable('metin_boss', {
    id: text('id').primaryKey(),
    nome: text('nome').notNull(),
    categoria: text('categoria', { enum: ['Metin', 'Boss'] }).default('Metin'),
    icona: text('icona'),
    note: text('note'),
    created_at: text('created_at').default(new Date().toISOString()),
})

export const mappe = sqliteTable('mappe', {
  id: text('id').primaryKey(),
  nome: text('nome').notNull(),
  image_url: text('image_url'),
  created_at: text('created_at').default(new Date().toISOString()),
});

export const mb_tmp = sqliteTable('mb_tmp', {
    id: text('id').primaryKey(),
    metin_boss_id: text('metin_boss_id').notNull().references(() => metinBoss.id, { onDelete: 'cascade' }),
    descrizione: text('descrizione'),
    tempo_respawn: integer('tempo_respawn').notNull(),
    created_at: text('created_at').default(new Date().toISOString()),
});

export const mappa_mbt = sqliteTable('mappa_mbt', {
    id: text('id').primaryKey(),
    mbt_id: text('mbt_id').notNull().references(() => mb_tmp.id, { onDelete: 'cascade' }), // ✅ era metinBoss.id
    coord_y: integer('coord_y').notNull(),
    coord_x: integer('coord_x').notNull(),
    mappa_id: text('mappa_id').notNull().references(() => mappe.id, { onDelete: 'cascade' }),
    created_at: text('created_at').default(new Date().toISOString()),
});