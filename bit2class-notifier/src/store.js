import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

const emptyState = () => ({
  version: 1,
  initializedAt: null,
  notified: {},
  activities: {},
});

/** 极简 JSON 状态存储：原子写（先写临时文件再 rename），单进程自用足够。 */
export class JsonStore {
  constructor(file) {
    this.file = file;
    this.cache = null;
  }

  async load() {
    if (this.cache) return this.cache;
    try {
      const parsed = JSON.parse(await readFile(this.file, 'utf8'));
      this.cache = {
        ...emptyState(),
        ...parsed,
        notified: { ...(parsed.notified ?? {}) },
        activities: { ...(parsed.activities ?? {}) },
      };
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
      this.cache = emptyState();
    }
    return this.cache;
  }

  async save(state) {
    this.cache = state;
    await mkdir(dirname(this.file), { recursive: true });
    const temp = `${this.file}.tmp`;
    await writeFile(temp, `${JSON.stringify(state, null, 2)}\n`, 'utf8');
    await rename(temp, this.file);
    return state;
  }
}

/** 清掉太老的记录，避免状态文件无限膨胀。 */
export function prune(state, now = Date.now(), { keepDays = 30 } = {}) {
  const cutoff = now - keepDays * 24 * 60 * 60 * 1000;

  for (const [key, iso] of Object.entries(state.notified)) {
    const at = Date.parse(iso);
    if (!Number.isFinite(at) || at < cutoff) delete state.notified[key];
  }

  for (const [id, activity] of Object.entries(state.activities)) {
    const at = Date.parse(activity?.lastSeenAt ?? '');
    if (!Number.isFinite(at) || at < cutoff) delete state.activities[id];
  }

  return state;
}
