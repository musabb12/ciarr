import { NextRequest, NextResponse } from 'next/server'
import { createAdminSession } from '@/lib/admin-auth'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ 
        error: 'اسم المستخدم وكلمة المرور مطلوبان' 
      }, { status: 400 })
    }

    // إنشاء جلسة آمنة
    const sessionResult = await createAdminSession(username, password)

    if (sessionResult.success) {
      const response = NextResponse.json({ 
        success: true,
        sessionId: sessionResult.sessionId,
        expiresAt: sessionResult.expiresAt,
        user: { username },
        message: 'تم تسجيل الدخول بنجاح'
      })

      // تعيين الكوكيز لمدة ساعتين
      response.cookies.set('admin-session', sessionResult.sessionId!, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 2 * 60 * 60, // ساعتان
        path: '/'
      })

      return response
    } else {
      return NextResponse.json({ 
        error: sessionResult.error || 'بيانات الاعتماد غير صحيحة' 
      }, { status: 401 })
    }
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ 
      error: 'حدث خطأ في الخادم' 
    }, { status: 500 })
  }
}