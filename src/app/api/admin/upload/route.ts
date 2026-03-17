import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'
import { supabase } from '@/lib/supabaseClient'

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

    // استخدام عميل الخادم (service_role) إن وُجد، وإلا العميل العادي (قد يكون null عند البناء)
    const client = supabaseAdmin ?? supabase
    if (!client) {
      return NextResponse.json(
        { error: 'إعدادات التخزين غير مكتملة. أضف NEXT_PUBLIC_SUPABASE_URL و SUPABASE_SERVICE_ROLE_KEY (أو NEXT_PUBLIC_SUPABASE_ANON_KEY) في Netlify.' },
        { status: 500 }
      )
    }

    // إنشاء اسم فريد للملف داخل مجلد admin/ في Bucket باسم uploads
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const filePath = `admin/${timestamp}_${randomString}_${safeName}`

    const arrayBuffer = await file.arrayBuffer()
    const fileBuffer = Buffer.from(arrayBuffer)

    // رفع الملف إلى Supabase Storage (Bucket: uploads)
    const { error: uploadError } = await client.storage
      .from('uploads')
      .upload(filePath, fileBuffer, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      console.error('Supabase upload error:', uploadError)
      const message = uploadError.message || 'فشل رفع الملف إلى التخزين'
      return NextResponse.json({ error: message }, { status: 500 })
    }

    const { data: publicUrlData } = client.storage.from('uploads').getPublicUrl(filePath)
    const publicUrl = publicUrlData?.publicUrl ?? ''
    
    return NextResponse.json({ 
      success: true,
      filename: publicUrl,
      originalName: file.name,
      size: file.size,
      type: file.type
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'فشل رفع الملف' }, { status: 500 })
  }
}