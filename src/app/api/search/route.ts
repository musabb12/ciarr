import { NextRequest, NextResponse } from 'next/server';

// Mock data for Ciar projects
const projects = [
  {
    id: 1,
    title: "Noon E-Commerce Platform",
    category: "e-commerce",
    industry: "retail",
    description: "Leading e-commerce platform with advanced AI recommendations and real-time inventory management across GCC countries.",
    image: "/project-ecommerce.jpg",
    technologies: ["React", "Node.js", "MongoDB", "AI/ML", "Redis"],
    client: "Noon",
    country: "Saudi Arabia",
    date: "2024",
    featured: true,
    link: "https://noon.com",
    complexity: "high",
    teamSize: 15,
    duration: "8 months",
    rating: 4.9,
    searchTags: ["shopping", "retail", "saudi", "ai", "mobile"]
  },
  {
    id: 2,
    title: "STC Banking App",
    category: "fintech",
    industry: "banking",
    description: "Secure mobile banking application with biometric authentication and real-time transaction processing.",
    image: "/project-banking.jpg",
    technologies: ["React Native", "TypeScript", "Firebase", "Blockchain"],
    client: "STC",
    country: "Saudi Arabia",
    date: "2024",
    featured: true,
    link: "#",
    complexity: "high",
    teamSize: 12,
    duration: "6 months",
    rating: 4.8,
    searchTags: ["banking", "fintech", "mobile", "security", "saudi"]
  },
  {
    id: 3,
    title: "Careem Food Delivery",
    category: "food-tech",
    industry: "food",
    description: "Comprehensive food delivery platform with real-time tracking and smart routing algorithms.",
    image: "/project-food.jpg",
    technologies: ["Next.js", "Python", "PostgreSQL", "Google Maps API"],
    client: "Careem",
    country: "UAE",
    date: "2023",
    featured: true,
    link: "https://careem.com",
    complexity: "medium",
    teamSize: 10,
    duration: "5 months",
    rating: 4.7,
    searchTags: ["food", "delivery", "uae", "logistics", "mobile"]
  },
  {
    id: 4,
    title: "Al Rajhi Real Estate",
    category: "real-estate",
    industry: "property",
    description: "Property listing platform with virtual tours and advanced search filters for Saudi market.",
    image: "/project-realestate.jpg",
    technologies: ["Vue.js", "Laravel", "MySQL", "3D Tours"],
    client: "Al Rajhi",
    country: "Saudi Arabia",
    date: "2023",
    featured: false,
    link: "#",
    complexity: "medium",
    teamSize: 8,
    duration: "4 months",
    rating: 4.6,
    searchTags: ["realestate", "property", "saudi", "virtual", "luxury"]
  },
  {
    id: 5,
    title: "Mawdoo3 Educational Platform",
    category: "edtech",
    industry: "education",
    description: "Arabic educational platform with interactive lessons and AI-powered personalized learning.",
    image: "/project-education.jpg",
    technologies: ["React", "Django", "PostgreSQL", "AI/ML"],
    client: "Mawdoo3",
    country: "Jordan",
    date: "2023",
    featured: false,
    link: "https://mawdoo3.com",
    complexity: "high",
    teamSize: 14,
    duration: "7 months",
    rating: 4.8,
    searchTags: ["education", "arabic", "learning", "ai", "jordan"]
  },
  {
    id: 6,
    title: "Talabat Logistics Dashboard",
    category: "logistics",
    industry: "delivery",
    description: "Advanced logistics management system with real-time tracking and optimization algorithms.",
    image: "/project-logistics.jpg",
    technologies: ["Angular", "Java", "MongoDB", "Apache Kafka"],
    client: "Talabat",
    country: "Kuwait",
    date: "2022",
    featured: false,
    link: "https://talabat.com",
    complexity: "high",
    teamSize: 11,
    duration: "6 months",
    rating: 4.7,
    searchTags: ["logistics", "delivery", "kuwait", "tracking", "optimization"]
  },
  {
    id: 7,
    title: "Emirates Airlines Booking",
    category: "travel",
    industry: "aviation",
    description: "Flight booking system with real-time availability and integrated payment processing.",
    image: "/project-travel.jpg",
    technologies: ["Next.js", "Node.js", "PostgreSQL", "Payment Gateway"],
    client: "Emirates",
    country: "UAE",
    date: "2022",
    featured: true,
    link: "https://emirates.com",
    complexity: "high",
    teamSize: 16,
    duration: "9 months",
    rating: 4.9,
    searchTags: ["travel", "aviation", "uae", "booking", "premium"]
  },
  {
    id: 8,
    title: "Ikea Saudi Arabia",
    category: "retail",
    industry: "furniture",
    description: "E-commerce platform for furniture with AR visualization and room planning tools.",
    image: "/project-furniture.jpg",
    technologies: ["React", "Three.js", "MongoDB", "AR"],
    client: "Ikea",
    country: "Saudi Arabia",
    date: "2023",
    featured: false,
    link: "https://ikea.com.sa",
    complexity: "medium",
    teamSize: 9,
    duration: "5 months",
    rating: 4.6,
    searchTags: ["furniture", "ar", "retail", "saudi", "design"]
  },
  {
    id: 9,
    title: "Saudi Health Portal",
    category: "healthcare",
    industry: "medical",
    description: "National healthcare portal with appointment booking and telemedicine services.",
    image: "/project-healthcare.jpg",
    technologies: ["React Native", "Python", "PostgreSQL", "Video API"],
    client: "Ministry of Health",
    country: "Saudi Arabia",
    date: "2024",
    featured: true,
    link: "#",
    complexity: "high",
    teamSize: 18,
    duration: "10 months",
    rating: 4.9,
    searchTags: ["healthcare", "medical", "saudi", "telemedicine", "government"]
  },
  {
    id: 10,
    title: "Oman Tourism Platform",
    category: "tourism",
    industry: "travel",
    description: "Comprehensive tourism platform with booking engine and destination management.",
    image: "/project-tourism.jpg",
    technologies: ["Next.js", "Laravel", "MySQL", "Booking Engine"],
    client: "Oman Tourism",
    country: "Oman",
    date: "2023",
    featured: false,
    link: "#",
    complexity: "medium",
    teamSize: 7,
    duration: "4 months",
    rating: 4.5,
    searchTags: ["tourism", "oman", "travel", "booking", "culture"]
  }
];

// Search analytics data
const searchAnalytics = {
  trending: ["e-commerce", "mobile banking", "healthcare", "AI/ML", "saudi arabia"],
  recent: ["fintech", "education", "logistics", "retail", "tourism"],
  popular: ["saudi arabia", "uae", "mobile app", "web development", "react"],
  categories: ["e-commerce", "fintech", "food-tech", "real-estate", "edtech", "logistics", "travel", "retail", "healthcare", "tourism"],
  countries: ["Saudi Arabia", "UAE", "Kuwait", "Oman", "Jordan"],
  technologies: ["React", "Node.js", "MongoDB", "AI/ML", "Redis", "React Native", "TypeScript", "Firebase", "Blockchain", "Next.js", "Python", "PostgreSQL", "Google Maps API", "Vue.js", "Laravel", "MySQL", "3D Tours", "Django", "Angular", "Java", "Apache Kafka", "Payment Gateway", "Three.js", "AR", "Video API", "Booking Engine"]
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category') || 'all';
    const country = searchParams.get('country') || 'all';
    const complexity = searchParams.get('complexity') || 'all';
    const technologies = searchParams.get('technologies')?.split(',') || [];
    const sortBy = searchParams.get('sort') || 'relevance';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const suggestions = searchParams.get('suggestions') === 'true';

    // Handle suggestions request
    if (suggestions && query.length > 2) {
      const queryLower = query.toLowerCase();
      const matches: string[] = [];
      
      // Search in project titles, descriptions, tags
      projects.forEach(project => {
        if (project.title.toLowerCase().includes(queryLower)) {
          matches.push(project.title);
        }
        if (project.description.toLowerCase().includes(queryLower)) {
          const words = project.description.split(' ');
          words.forEach(word => {
            if (word.toLowerCase().includes(queryLower) && word.length > 3) {
              matches.push(word);
            }
          });
        }
        project.searchTags.forEach(tag => {
          if (tag.toLowerCase().includes(queryLower)) {
            matches.push(tag);
          }
        });
      });
      
      // Add popular searches that match
      searchAnalytics.popular.forEach(search => {
        if (search.toLowerCase().includes(queryLower)) {
          matches.push(search);
        }
      });
      
      return NextResponse.json({
        suggestions: [...new Set(matches)].slice(0, 8)
      });
    }

    // Filter projects
    let filtered = projects.filter(project => {
      const matchesQuery = !query || 
        project.title.toLowerCase().includes(query.toLowerCase()) ||
        project.description.toLowerCase().includes(query.toLowerCase()) ||
        project.technologies.some(tech => tech.toLowerCase().includes(query.toLowerCase())) ||
        project.searchTags.some(tag => tag.toLowerCase().includes(query.toLowerCase())) ||
        project.client.toLowerCase().includes(query.toLowerCase()) ||
        project.country.toLowerCase().includes(query.toLowerCase());
      
      const matchesCategory = category === 'all' || project.category === category;
      const matchesCountry = country === 'all' || project.country === country;
      const matchesComplexity = complexity === 'all' || project.complexity === complexity;
      const matchesTechnologies = technologies.length === 0 || 
        technologies.some(tech => project.technologies.includes(tech));
      
      return matchesQuery && matchesCategory && matchesCountry && matchesComplexity && matchesTechnologies;
    });

    // Sort projects
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'date':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'name':
          return a.title.localeCompare(b.title);
        case 'relevance':
        default:
          // Simple relevance scoring
          const scoreA = calculateRelevanceScore(a, query);
          const scoreB = calculateRelevanceScore(b, query);
          return scoreB - scoreA;
      }
    });

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedResults = filtered.slice(startIndex, endIndex);

    return NextResponse.json({
      projects: paginatedResults,
      pagination: {
        page,
        limit,
        total: filtered.length,
        totalPages: Math.ceil(filtered.length / limit)
      },
      analytics: searchAnalytics,
      filters: {
        query,
        category,
        country,
        complexity,
        technologies,
        sortBy
      }
    });

  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Calculate relevance score
function calculateRelevanceScore(project: any, query: string) {
  if (!query) return 0;
  const queryLower = query.toLowerCase();
  let score = 0;
  
  if (project.title.toLowerCase().includes(queryLower)) score += 10;
  if (project.description.toLowerCase().includes(queryLower)) score += 5;
  if (project.technologies.some(tech => tech.toLowerCase().includes(queryLower))) score += 3;
  if (project.searchTags.some(tag => tag.toLowerCase().includes(queryLower))) score += 2;
  if (project.client.toLowerCase().includes(queryLower)) score += 4;
  if (project.country.toLowerCase().includes(queryLower)) score += 1;
  
  return score;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'analytics':
        // Track search analytics
        console.log('Search analytics:', data);
        return NextResponse.json({ success: true });
      
      case 'feedback':
        // Handle search feedback
        console.log('Search feedback:', data);
        return NextResponse.json({ success: true });
      
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Search POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}