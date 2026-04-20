import { settingsRepo } from '@/lib/firebase/repos';
export async function getSetting(key: string) {
  return settingsRepo.getValue(key);
}
export async function setSetting(key: string, value: string, group = 'general') {
  await settingsRepo.setValue(key, value, group);
}
