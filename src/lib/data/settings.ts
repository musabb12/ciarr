import { db } from '@/lib/db';
export async function getSetting(key: string) {
  const r = await db.setting.findUnique({ where: { key } });
  return r?.value ?? null;
}
export async function setSetting(key: string, value: string, group = 'general') {
  await db.setting.upsert({ where: { key }, create: { key, value, group }, update: { value, group } });
}
