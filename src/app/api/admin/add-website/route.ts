import { NextRequest, NextResponse } from 'next/server';
import { uploadBufferToFirebaseStorage } from '@/lib/firebase-admin';
import { websitesRepo } from '@/lib/firebase/repos';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Extract form fields
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const price = formData.get('price') as string;
    const provider = formData.get('provider') as string;
    const features = JSON.parse(formData.get('features') as string || '[]');
    const technologies = JSON.parse(formData.get('technologies') as string || '[]');
    const demoUrl = formData.get('demoUrl') as string;
    
    // Validate required fields
    if (!title || !description || !category || !price) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Handle image uploads
    const images: string[] = [];
    let imageIndex = 0;
    
    while (true) {
      const image = formData.get(`image${imageIndex}`) as File;
      if (!image) break;
      
      try {
        const timestamp = Date.now();
        const filename = `${title.replace(/\s+/g, '_')}_${timestamp}_${imageIndex}.${image.name.split('.').pop()}`;
        const bytes = await image.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const uploadResult = await uploadBufferToFirebaseStorage({
          fileBuffer: buffer,
          destinationPath: `websites/${filename}`,
          contentType: image.type || 'application/octet-stream',
        });
        images.push(uploadResult.publicUrl);
        imageIndex++;
      } catch (error) {
        console.error('Error saving image:', error);
      }
    }

    // Create new website object
    const newWebsite = {
      id: Date.now().toString(),
      title,
      description,
      category,
      price: parseFloat(price),
      provider: provider || 'CIAR',
      features,
      technologies,
      demoUrl,
      images: images.length > 0 ? images : ['/template-portfolio.jpg'], // Fallback image
      rating: 0,
      reviews: 0,
      status: 'active' as const,
      createdAt: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    // احفظ في Firestore (websites)
    try {
      const displayCount = await websitesRepo.count();
      await websitesRepo.create({
        id: newWebsite.id,
        title,
        description: description ?? null,
        url: demoUrl || '',
        category,
        technologies,
        images: newWebsite.images,
        badges: [],
        tags: features,
        featured: false,
        status: 'active',
        client: provider || null,
        provider: provider || null,
        price: isNaN(newWebsite.price) ? null : newWebsite.price,
        demoUrl: demoUrl || null,
        hidden: false,
        displayOrder: displayCount + 1,
      });
    } catch (err) {
      console.error('Firestore save error (websites):', err);
    }

    return NextResponse.json({
      success: true,
      website: newWebsite,
      message: 'Website added successfully'
    });

  } catch (error) {
    console.error('Error adding website:', error);
    return NextResponse.json(
      { error: 'Failed to add website' },
      { status: 500 }
    );
  }
}