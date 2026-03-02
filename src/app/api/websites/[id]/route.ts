import { NextRequest, NextResponse } from 'next/server'

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

    // Update website with new data
    const updatedWebsite = {
      id,
      title: body.title,
      description: body.description || '',
      url: body.url,
      category: body.category,
      technologies: body.technologies || [],
      images: body.images || []
    }

    // In a real application, you would update this in a database
    console.log('Website updated:', updatedWebsite)

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

    // In a real application, you would delete this from a database
    console.log('Website deleted:', id)

    return NextResponse.json({ message: 'تم حذف الموقع بنجاح' })
  } catch (error) {
    console.error('Error deleting website:', error)
    return NextResponse.json(
      { error: 'فشل في حذف الموقع' },
      { status: 500 }
    )
  }
}