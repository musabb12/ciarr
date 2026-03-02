import { NextRequest, NextResponse } from 'next/server'
import { extendSession } from '@/lib/admin-auth'

export async function POST(request: NextRequest) {
  try {
    const sessionId = request.cookies.get('admin-session')?.value

    if (!sessionId) {
      return NextResponse.json({ 
        error: 'No active session found' 
      }, { status: 401 })
    }

    // تمديد الجلسة
    const extendResult = await extendSession(sessionId)

    if (extendResult.success) {
      const response = NextResponse.json({ 
        success: true,
        message: 'تم تمديد الجلسة بنجاح',
        newExpiry: new Date(extendResult.expiresAt!).toISOString(),
        sessionId: extendResult.sessionId
      })

      // تحديث الكوكيز بوقت انتهاء جديد
      response.cookies.set('admin-session', extendResult.sessionId!, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 2 * 60 * 60, // ساعتان
        path: '/'
      })

      return response
    } else {
      return NextResponse.json({ 
        error: extendResult.error || 'Failed to extend session' 
      }, { status: 401 })
    }
  } catch (error) {
    console.error('Extend session error:', error)
    return NextResponse.json({ 
      error: 'حدث خطأ في الخادم' 
    }, { status: 500 })
  }
}