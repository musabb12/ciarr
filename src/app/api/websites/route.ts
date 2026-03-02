import { NextResponse } from 'next/server'
import { listDisplayWebsites } from '@/lib/display-websites-db'
import { listWebsites } from '@/data/websites'

export async function GET() {
  try {
    const list = await listDisplayWebsites()
    return NextResponse.json(list)
  } catch (error) {
    console.error('Error fetching websites:', error)
    try {
      const fallback = listWebsites().map((w) => ({
        id: w.id,
        title: w.title,
        description: w.description ?? '',
        url: w.url,
        category: w.category,
        technologies: w.technologies ?? [],
        images: w.images ?? [],
        badges: w.badges ?? [],
        tags: w.tags ?? [],
        featured: (w as { featured?: boolean }).featured ?? false,
        status: (w as { status?: string }).status ?? 'active',
        client: (w as { client?: string }).client ?? 'CIAR',
        hidden: w.hidden ?? false,
        displayOrder: w.displayOrder,
      }))
      return NextResponse.json(fallback)
    } catch (e) {
      return NextResponse.json(
        { error: 'فشل في جلب المواقع' },
        { status: 500 }
      )
    }
  }
}