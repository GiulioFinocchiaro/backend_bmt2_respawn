import { db } from './index';
import { timers } from './schema';
import { randomUUID } from 'crypto';

const bossList = [
  { nome_boss: 'Metin Tu-Young / Jeon Un', categoria: 'Metin', tempo_respawn: 3600 },
  { nome_boss: 'Metin 8 Zampe / Scarlatte', categoria: 'Metin', tempo_respawn: 2700 },
  { nome_boss: 'Metin Imperiale', categoria: 'Metin', tempo_respawn: 2400 },
  { nome_boss: 'Metin Jinno CENTRO', categoria: 'Metin', tempo_respawn: 9000 },
  { nome_boss: 'Metin Jinno SUD', categoria: 'Metin', tempo_respawn: 8000 },
];

const now = new Date().toISOString();

for (const boss of bossList) {
  db.insert(timers).values({
    id: randomUUID(),
    ...boss,
    stato: 'fermo',
    spawn_oggi: 0,
    created_at: now,
    updated_at: now,
  }).run();
}

console.log(`✅ Seeded ${bossList.length} bosses`);
process.exit(0);
