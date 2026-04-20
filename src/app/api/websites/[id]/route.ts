import { NextRequest, NextResponse } from 'next/server'
import { updateDisplayWebsite, removeDisplayWebsite } from '@/lib/display-websites-db'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const id = params.id

    // Validate required fields
    if (!body.title || !body.url || !body.category) {
      return NextResponse.json(
        { error: 'جميع الحقول المطلوبة يجب ملؤها' },
        { status: 400 }
      )
    }

    const updatedWebsite = await updateDisplayWebsite(id, {
      title: body.title,
      description: body.description || '',
      url: body.url,
      category: body.category,
      technologies: body.technologies || [],
      images: body.images || [],
      badges: body.badges || [],
      tags: body.tags || [],
      featured: body.featured ?? false,
      status: body.status || 'active',
      client: body.client || 'CIAR',
      hidden: body.hidden ?? false,
    })
    if (!updatedWebsite) {
      return NextResponse.json({ error: 'الموقع غير موجود' }, { status: 404 })
    }

    return NextResponse.json(updatedWebsite)
  } catch (error) {
    console.error('Error updating website:', error)
    return NextResponse.json(
      { error: 'فشل في تحديث الموقع' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id

    const removed = await removeDisplayWebsite(id)
    if (!removed) {
      return NextResponse.json({ error: 'الموقع غير موجود' }, { status: 404 })
    }

    return NextResponse.json({ message: 'تم حذف الموقع بنجاح' })
  } catch (error) {
    console.error('Error deleting website:', error)
    return NextResponse.json(
      { error: 'فشل في حذف الموقع' },
      { status: 500 }
    )
  }
}