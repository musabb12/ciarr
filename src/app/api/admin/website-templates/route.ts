import { NextRequest, NextResponse } from 'next/server';

// Mock data - in a real app, this would come from a database
const mockWebsiteTemplates = [
  {
    id: '1',
    title: 'متجر تجارة إلكترونية حديث',
    category: 'ecommerce',
    description: 'حل تسوق متكامل عبر الإنترنت مع نظام دفع وإدارة المخزون',
    price: 299,
    rating: 4.8,
    reviews: 124,
    provider: 'TechPro Solutions',
    status: 'active' as const,
    createdAt: '2024-01-20'
  },
  {
    id: '2',
    title: 'مطعم أنيق',
    category: 'restaurant',
    description: 'موقع مطعم راقٍ مع نظام حجوزات عبر الإنترنت وإدارة القوائم',
    price: 199,
    rating: 4.9,
    reviews: 89,
    provider: 'WebCraft Agency',
    status: 'active' as const,
    createdAt: '2024-01-19'
  },
  {
    id: '3',
    title: 'معرض أعمال إبداعي',
    category: 'portfolio',
    description: 'قالب معرض أعمال رائع مثالي للمصممين والمبدعين',
    price: 149,
    rating: 4.7,
    reviews: 156,
    provider: 'Design Studio Pro',
    status: 'pending' as const,
    createdAt: '2024-01-18'
  },
  {
    id: '4',
    title: 'لوحة تحكم برمجيات',
    category: 'saas',
    description: 'لوحة تحليلات احترافية مع تصور البيانات في الوقت الفعلي',
    price: 399,
    rating: 4.9,
    reviews: 67,
    provider: 'DevMasters',
    status: 'active' as const,
    createdAt: '2024-01-17'
  },
  {
    id: '5',
    title: 'منصة مدونة حديثة',
    category: 'blog',
    description: 'منصة مدونة غنية بالميزات مع تحسين محركات البحث والتحقيق المالي',
    price: 179,
    rating: 4.6,
    reviews: 203,
    provider: 'Content Creators Hub',
    status: 'inactive' as const,
    createdAt: '2024-01-16'
  }
];

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json(mockWebsiteTemplates);
  } catch (error) {
    console.error('Error fetching website templates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch website templates' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const newTemplate = {
      id: Date.now().toString(),
      ...body,
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    return NextResponse.json(newTemplate, { status: 201 });
  } catch (error) {
    console.error('Error creating website template:', error);
    return NextResponse.json(
      { error: 'Failed to create website template' },
      { status: 500 }
    );
  }
}