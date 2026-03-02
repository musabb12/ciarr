import { NextRequest, NextResponse } from 'next/server'
import { logoutAdmin } from '@/lib/admin-auth'

export async function POST(request: NextRequest) {
  try {
    const sessionId = request.cookies.get('admin-session')?.value

    if (!sessionId) {
      return NextResponse.json({ 
        error: 'No active session found' 
      }, { status: 400 })
    }

    // تسجيل الخروج من الجلسة
    const logoutResult = await logoutAdmin()

    const response = NextResponse.json({ 
      success: logoutResult.success,
      message: 'تم تسجيل الخروج بنجاح'
    })

    // حذف الكوكيز
    response.cookies.delete('admin-session')

    return response
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json({ 
      error: 'حدث خطأ في الخادم' 
    }, { status: 500 })
  }
}