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
export declare function getLastSpawn(mbTmpId: string): Date;
export declare function getNextSpawn(mbTmpId: string): Date;
export declare function getNextNextSpawn(mbTmpId: string): Date;
export declare function calculateTimer(mbTmpId: string): TimerOutput | null;
export declare function getAllTimers(): TimerOutput[];
export declare function getAllMetinTimers(): TimerOutput[];
export declare function getAllBossTimers(): TimerOutput[];
export declare function searchAllTimers(query: string): TimerOutput[];
//# sourceMappingURL=timer.d.ts.map