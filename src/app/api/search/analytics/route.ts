import { NextRequest, NextResponse } from 'next/server';

// Mock search analytics data
let searchAnalytics = {
  totalSearches: 0,
  popularQueries: [
    { query: "e-commerce", count: 45 },
    { query: "mobile app", count: 38 },
    { query: "saudi arabia", count: 32 },
    { query: "banking", count: 28 },
    { query: "healthcare", count: 25 }
  ],
  trendingQueries: [
    { query: "AI/ML", growth: 125 },
    { query: "mobile banking", growth: 98 },
    { query: "healthcare", growth: 76 },
    { query: "e-commerce", growth: 65 },
    { query: "fintech", growth: 54 }
  ],
  recentSearches: [
    { query: "fintech", timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
    { query: "education", timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString() },
    { query: "logistics", timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
    { query: "retail", timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString() },
    { query: "tourism", timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString() }
  ],
  searchFilters: {
    categories: [
      { name: "e-commerce", count: 156 },
      { name: "fintech", count: 134 },
      { name: "healthcare", count: 98 },
      { name: "education", count: 87 },
      { name: "real-estate", count: 76 }
    ],
    countries: [
      { name: "Saudi Arabia", count: 234 },
      { name: "UAE", count: 187 },
      { name: "Kuwait", count: 98 },
      { name: "Oman", count: 65 },
      { name: "Jordan", count: 43 }
    ],
    technologies: [
      { name: "React", count: 189 },
      { name: "Node.js", count: 167 },
      { name: "Python", count: 145 },
      { name: "AI/ML", count: 123 },
      { name: "Next.js", count: 98 }
    ]
  },
  performanceMetrics: {
    averageSearchTime: 0.245, // seconds
    successRate: 94.5, // percentage
    zeroResultsRate: 5.5, // percentage
    averageResultsPerPage: 8.7
  }
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'overview';

    switch (type) {
      case 'popular':
        return NextResponse.json(searchAnalytics.popularQueries);
      
      case 'trending':
        return NextResponse.json(searchAnalytics.trendingQueries);
      
      case 'recent':
        return NextResponse.json(searchAnalytics.recentSearches);
      
      case 'filters':
        return NextResponse.json(searchAnalytics.searchFilters);
      
      case 'performance':
        return NextResponse.json(searchAnalytics.performanceMetrics);
      
      case 'overview':
      default:
        return NextResponse.json(searchAnalytics);
    }

  } catch (error) {
    console.error('Search analytics API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'track_search': {
        // Track a search query
        const { query, filters, resultsCount, searchTime } = data;

        // Update total searches
        searchAnalytics.totalSearches++;

        // Update popular queries
        const existingQuery = searchAnalytics.popularQueries.find(q => q.query === query);
        if (existingQuery) {
          existingQuery.count++;
        } else {
          searchAnalytics.popularQueries.push({ query, count: 1 });
          searchAnalytics.popularQueries.sort((a, b) => b.count - a.count);
          searchAnalytics.popularQueries = searchAnalytics.popularQueries.slice(0, 10);
        }

        // Update recent searches
        searchAnalytics.recentSearches.unshift({
          query,
          timestamp: new Date().toISOString()
        });
        searchAnalytics.recentSearches = searchAnalytics.recentSearches.slice(0, 10);

        // Update performance metrics
        if (searchTime) {
          searchAnalytics.performanceMetrics.averageSearchTime =
            (searchAnalytics.performanceMetrics.averageSearchTime + searchTime) / 2;
        }

        if (resultsCount === 0) {
          searchAnalytics.performanceMetrics.zeroResultsRate =
            (searchAnalytics.performanceMetrics.zeroResultsRate * 0.9) + (10 * 0.1);
        } else {
          searchAnalytics.performanceMetrics.zeroResultsRate =
            searchAnalytics.performanceMetrics.zeroResultsRate * 0.9;
        }

        searchAnalytics.performanceMetrics.successRate = 100 - searchAnalytics.performanceMetrics.zeroResultsRate;

        console.log('Search tracked:', { query, filters, resultsCount, searchTime });
        return NextResponse.json({ success: true });
      }
      
      case 'track_click': {
        // Track when a user clicks on a search result
        const { resultId, position, query } = data;
        console.log('Search result clicked:', { resultId, position, query });
        return NextResponse.json({ success: true });
      }
      
      case 'track_feedback': {
        // Track user feedback on search results
        const { feedback, query: feedbackQuery, rating } = data;
        console.log('Search feedback:', { feedback, query: feedbackQuery, rating });
        return NextResponse.json({ success: true });
      }
      
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Search analytics POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}