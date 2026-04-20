import { websitesRepo } from '@/lib/firebase/repos';

export async function listDisplayWebsites(includeHidden = false) {
  return websitesRepo.list({ includeHidden });
}

export async function getDisplayWebsiteBySlug(slug: string) {
  const website = await websitesRepo.findByIdOrSlug(slug);
  if (!website) return null;
  if (website.hidden || website.status !== 'active') return null;
  return website;
}
