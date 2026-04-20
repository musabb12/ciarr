import { NextRequest, NextResponse } from 'next/server'
import { buildFirebaseConfigErrorMessage, uploadBufferToFirebaseStorage } from '@/lib/firebase-admin'

// نضمن تشغيل هذا الـ API Route على بيئة Node.js
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'لم يتم اختيار ملف' }, { status: 400 })
    }

    // تحقق من نوع الملف (يجب أن يكون صورة)
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'يجب أن يكون الملف من نوع صورة' }, { status: 400 })
    }

    // تحقق من حجم الملف (10MB كحد أقصى)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'حجم الملف كبير جداً (الحد الأقصى 10MB)' }, { status: 400 })
    }

    // إنشاء اسم فريد للملف داخل مجلد admin/
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const filePath = `admin/${timestamp}_${randomString}_${safeName}`

    const arrayBuffer = await file.arrayBuffer()
    const fileBuffer = Buffer.from(arrayBuffer)

    let publicUrl = ''
    try {
      const uploadResult = await uploadBufferToFirebaseStorage({
        fileBuffer,
        destinationPath: filePath,
        contentType: file.type,
      })
      publicUrl = uploadResult.publicUrl
    } catch (uploadError) {
      console.error('Firebase upload error:', uploadError)
      const message = uploadError instanceof Error ? uploadError.message : 'فشل رفع الملف إلى Firebase Storage'
      const isConfigError = /Firebase is not configured/i.test(message)
      return NextResponse.json(
        { error: isConfigError ? buildFirebaseConfigErrorMessage() : message },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ 
      success: true,
      filename: publicUrl,
      path: filePath,
      originalName: file.name,
      size: file.size,
      type: file.type
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'فشل رفع الملف' }, { status: 500 })
  }
}