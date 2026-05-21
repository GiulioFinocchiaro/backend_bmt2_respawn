import { db } from '../db';
import { config, mb_tmp, metinBoss, mappa_mbt, mappe } from '../db/schema';
import { eq, sql, or } from 'drizzle-orm';

export interface TimerOutput {
  id: string;
  mbt_id: string;
  nome: string;
  descrizione: string | null;
  categoria: string;
  tempo_respawn: number;
  ultimo_spawn: string;
  prossimo_spawn: string;
  spawn_successivo: string;
  tempo_rimanente: number;
  tempo_trascorso: number;
  spawn_oggi: number;
  spawn_dal_riavvio: number;
  stato: string;
  coord_x: number | null;
  coord_y: number | null;
  mappa_id: string | null;
  mappa_nome: string | null;
  icona: string | null;
  note: string | null;
}

function getDataRiavvio(): Date {
  const row = db.select().from(config).where(eq(config.key, 'data_riavvio')).get();
  return row ? new Date(row.value) : new Date('2026-04-14T23:20:00.000Z');
}

function getTempoRespawn(mbTmpId: string): number {
  const row = db.select().from(mb_tmp).where(eq(mb_tmp.id, mbTmpId)).get();
  return row!.tempo_respawn;
}

export function getLastSpawn(mbTmpId: string): Date {
  const now = Date.now();
  const riavvio = getDataRiavvio().getTime();
  const diffSec = (now - riavvio) / 1000;
  const t = getTempoRespawn(mbTmpId);
  const cicli = Math.floor(diffSec / t);
  return new Date(riavvio + cicli * t * 1000);
}

export function getNextSpawn(mbTmpId: string): Date {
  const last = getLastSpawn(mbTmpId);
  const t = getTempoRespawn(mbTmpId);
  return new Date(last.getTime() + t * 1000);
}

export function getNextNextSpawn(mbTmpId: string): Date {
  const next = getNextSpawn(mbTmpId);
  const t = getTempoRespawn(mbTmpId);
  return new Date(next.getTime() + t * 1000);
}

export function calculateTimer(mbTmpId: string): TimerOutput | null {
  const tmp = db.select().from(mb_tmp).where(eq(mb_tmp.id, mbTmpId)).get();
  if (!tmp) return null;

  const mb = db.select().from(metinBoss).where(eq(metinBoss.id, tmp.metin_boss_id)).get();
  if (!mb) return null;

  const last = getLastSpawn(mbTmpId);
  const next = getNextSpawn(mbTmpId);
  const nextNext = getNextNextSpawn(mbTmpId);

  const now = Date.now();
  const diffSec = (now - last.getTime()) / 1000;
  const tempoRimanente = Math.max(0, tmp.tempo_respawn - diffSec);
  const tempoTrascorso = Math.min(diffSec, tmp.tempo_respawn);

  const riavvio = getDataRiavvio();
  const diffDalRiavvioSec = (now - riavvio.getTime()) / 1000;
  const cicliTotali = Math.floor(diffDalRiavvioSec / tmp.tempo_respawn);

  const oggiInizio = new Date();
  oggiInizio.setUTCHours(0, 0, 0, 0);
  const diffRiavvioMezzanotte = Math.max(0, (oggiInizio.getTime() - riavvio.getTime()) / 1000);
  const cicliAMezzanotte = Math.floor(diffRiavvioMezzanotte / tmp.tempo_respawn);
  const cicliOggi = Math.max(0, cicliTotali - cicliAMezzanotte);

  const coord = db.select({
    coord_x: mappa_mbt.coord_x,
    coord_y: mappa_mbt.coord_y,
    mappa_id: mappa_mbt.mappa_id,
  }).from(mappa_mbt).where(eq(mappa_mbt.mbt_id, tmp.id)).get();

  let mappaNome: string | null = null;
  if (coord?.mappa_id) {
    const map = db.select().from(mappe).where(eq(mappe.id, coord.mappa_id)).get();
    mappaNome = map?.nome ?? null;
  }

  return {
    id: mb.id,
    mbt_id: tmp.id,
    nome: mb.nome,
    descrizione: tmp.descrizione,
    categoria: mb.categoria || 'Metin',
    tempo_respawn: tmp.tempo_respawn,
    ultimo_spawn: last.toISOString(),
    prossimo_spawn: next.toISOString(),
    spawn_successivo: nextNext.toISOString(),
    tempo_rimanente: Math.floor(tempoRimanente),
    tempo_trascorso: Math.floor(tempoTrascorso),
    spawn_oggi: cicliOggi,
    spawn_dal_riavvio: cicliTotali,
    stato: tempoRimanente <= 0 ? 'respawnato' : 'in_corso',
    coord_x: coord?.coord_x ?? null,
    coord_y: coord?.coord_y ?? null,
    mappa_id: coord?.mappa_id ?? null,
    mappa_nome: mappaNome,
    icona: mb.icona,
    note: mb.note,
  };
}

export function getAllTimers(): TimerOutput[] {
  const all = db.select().from(mb_tmp).all();
  console.log(all);
  return all.map(t => calculateTimer(t.id)).filter(Boolean) as TimerOutput[];
}

export function getAllMetinTimers(): TimerOutput[] {
    const allMetin = db.select().from(mb_tmp).where(eq(metinBoss.categoria, 'Metin')).all()
    return allMetin.map(t => calculateTimer(t.id)).filter(Boolean) as TimerOutput[];
}

export function getAllBossTimers(): TimerOutput[] {
    const allBoss = db.select().from(mb_tmp).where(eq(metinBoss.categoria, 'Boss')).all()
    return allBoss.map(t => calculateTimer(t.id)).filter(Boolean) as TimerOutput[];
}

export function searchAllTimers(query: string): TimerOutput[] {
    const pattern = `%${query.toLowerCase()}%`;

    const all = db.select()
        .from(mb_tmp)
        .where(
            or(
                sql`LOWER(${mb_tmp.descrizione}) LIKE ${pattern}`,
                sql`LOWER(${metinBoss.nome}) LIKE ${pattern}`,
                sql`LOWER(${metinBoss.categoria}) LIKE ${pattern}`,
                sql`LOWER(${metinBoss.note}) LIKE ${pattern}`,
                sql`LOWER(${mappe.nome}) LIKE ${pattern}`,
            )
        )
        .all();

    return all.map(t => calculateTimer(t.id)).filter(Boolean) as TimerOutput[];
}
