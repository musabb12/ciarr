import { NextRequest, NextResponse } from 'next/server';
import {
  buildFirebaseConfigErrorMessage,
  uploadBufferToFirebaseStorage,
} from '@/lib/firebase-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * رفع ملف إلى Firebase Storage.
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const requestedPath = String(formData.get('path') || '/');

    if (!file) {
      return NextResponse.json({ error: 'لم يتم إرسال ملف' }, { status: 400 });
    }

    if (file.size === 0) {
      return NextResponse.json({ error: 'الملف فارغ' }, { status: 400 });
    }

    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const cleanFolder = requestedPath
      .replace(/\\/g, '/')
      .replace(/^\/+|\/+$/g, '')
      .replace(/\.\./g, '');
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).slice(2, 10);
    const objectPath = `${cleanFolder ? `${cleanFolder}/` : ''}${timestamp}_${randomString}_${safeName}`;

    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    let uploadedUrl = '';
    try {
      const uploadResult = await uploadBufferToFirebaseStorage({
        fileBuffer,
        destinationPath: objectPath,
        contentType: file.type || 'application/octet-stream',
      });
      uploadedUrl = uploadResult.publicUrl;
    } catch (uploadError) {
      const message =
        uploadError instanceof Error
          ? uploadError.message
          : 'فشل رفع الملف إلى Firebase Storage';
      const isConfigError = /Firebase is not configured/i.test(message);
      return NextResponse.json(
        { error: isConfigError ? buildFirebaseConfigErrorMessage() : message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      id: `file-${timestamp}`,
      name: file.name,
      size: file.size,
      mimeType: file.type || 'application/octet-stream',
      type: 'file',
      path: objectPath,
      url: uploadedUrl,
      createdAt: new Date(timestamp).toISOString(),
      modifiedAt: new Date(timestamp).toISOString(),
    }, { status: 201 });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'فشل رفع الملف' }, { status: 500 });
  }
}
