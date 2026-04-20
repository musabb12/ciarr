import { NextRequest, NextResponse } from 'next/server'
import { buildFirebaseConfigErrorMessage, getFirebaseAdminServices } from '@/lib/firebase-admin'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function getCollectionName(rawValue: string | null) {
  return (rawValue || '').trim()
}

export async function GET(request: NextRequest) {
  const services = getFirebaseAdminServices()
  if (!services) {
    return NextResponse.json({ error: buildFirebaseConfigErrorMessage() }, { status: 500 })
  }

  const { searchParams } = new URL(request.url)
  const collection = getCollectionName(searchParams.get('collection'))
  const id = (searchParams.get('id') || '').trim()
  const limit = Math.min(Number(searchParams.get('limit') || 20), 100)

  if (!collection) {
    return NextResponse.json({ error: 'يجب إرسال اسم collection' }, { status: 400 })
  }

  try {
    const collectionRef = services.db.collection(collection)

    if (id) {
      const docSnap = await collectionRef.doc(id).get()
      if (!docSnap.exists) {
        return NextResponse.json({ error: 'العنصر غير موجود' }, { status: 404 })
      }

      return NextResponse.json({
        id: docSnap.id,
        data: docSnap.data() ?? {},
      })
    }

    const snapshot = await collectionRef.limit(limit).get()
    const items = snapshot.docs.map((doc) => ({
      id: doc.id,
      data: doc.data(),
    }))

    return NextResponse.json({ items, count: items.length })
  } catch (error) {
    console.error('Firestore GET error:', error)
    return NextResponse.json({ error: 'فشل قراءة البيانات من Firestore' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const services = getFirebaseAdminServices()
  if (!services) {
    return NextResponse.json({ error: buildFirebaseConfigErrorMessage() }, { status: 500 })
  }

  try {
    const body = await request.json()
    const collection = getCollectionName(typeof body?.collection === 'string' ? body.collection : null)
    const id = typeof body?.id === 'string' ? body.id.trim() : ''
    const data = body?.data
    const merge = Boolean(body?.merge ?? true)

    if (!collection) {
      return NextResponse.json({ error: 'يجب إرسال اسم collection' }, { status: 400 })
    }
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      return NextResponse.json({ error: 'يجب إرسال data على شكل كائن' }, { status: 400 })
    }

    const docRef = id ? services.db.collection(collection).doc(id) : services.db.collection(collection).doc()
    await docRef.set(
      {
        ...data,
        updatedAt: new Date().toISOString(),
      },
      { merge }
    )

    return NextResponse.json(
      {
        success: true,
        id: docRef.id,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Firestore POST error:', error)
    return NextResponse.json({ error: 'فشل حفظ البيانات في Firestore' }, { status: 500 })
  }
}
