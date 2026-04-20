/**
 * الأخبار (NewsItem) — طبقة مركزية
 */

import { newsRepo } from '@/lib/firebase/repos';

export async function listActiveNews() {
  return newsRepo.listActive();
}

export async function listAllNews() {
  return newsRepo.listAll();
}
