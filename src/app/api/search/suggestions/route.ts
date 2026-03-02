import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

// Mock project data for suggestions
const projects = [
  {
    title: "Noon E-Commerce Platform",
    description: "Leading e-commerce platform with advanced AI recommendations",
    technologies: ["React", "Node.js", "MongoDB", "AI/ML"],
    client: "Noon",
    country: "Saudi Arabia",
    category: "e-commerce",
    searchTags: ["shopping", "retail", "saudi", "ai", "mobile"]
  },
  {
    title: "STC Banking App",
    description: "Secure mobile banking application with biometric authentication",
    technologies: ["React Native", "TypeScript", "Firebase", "Blockchain"],
    client: "STC",
    country: "Saudi Arabia",
    category: "fintech",
    searchTags: ["banking", "fintech", "mobile", "security", "saudi"]
  },
  {
    title: "Careem Food Delivery",
    description: "Comprehensive food delivery platform with real-time tracking",
    technologies: ["Next.js", "Python", "PostgreSQL", "Google Maps API"],
    client: "Careem",
    country: "UAE",
    category: "food-tech",
    searchTags: ["food", "delivery", "uae", "logistics", "mobile"]
  },
  {
    title: "Saudi Health Portal",
    description: "National healthcare portal with appointment booking",
    technologies: ["React Native", "Python", "PostgreSQL", "Video API"],
    client: "Ministry of Health",
    country: "Saudi Arabia",
    category: "healthcare",
    searchTags: ["healthcare", "medical", "saudi", "telemedicine", "government"]
  },
  {
    title: "Emirates Airlines Booking",
    description: "Flight booking system with real-time availability",
    technologies: ["Next.js", "Node.js", "PostgreSQL", "Payment Gateway"],
    client: "Emirates",
    country: "UAE",
    category: "travel",
    searchTags: ["travel", "aviation", "uae", "booking", "premium"]
  }
];

// Popular search terms
const popularSearches = [
  "e-commerce", "mobile app", "saudi arabia", "banking", "healthcare", 
  "education", "real estate", "food delivery", "logistics", "AI/ML",
  "react", "next.js", "node.js", "python", "blockchain"
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const limit = parseInt(searchParams.get('limit') || '8');
    const useAI = searchParams.get('ai') === 'true';

    if (!query || query.length < 2) {
      return NextResponse.json({ suggestions: [] });
    }

    const queryLower = query.toLowerCase();
    const suggestions: Array<{
      text: string;
      type: 'project' | 'technology' | 'client' | 'country' | 'category' | 'tag' | 'ai';
      highlight?: string;
      description?: string;
    }> = [];

    // 1. Project title matches
    projects.forEach(project => {
      if (project.title.toLowerCase().includes(queryLower)) {
        suggestions.push({
          text: project.title,
          type: 'project',
          description: project.description,
          highlight: project.title
        });
      }
    });

    // 2. Technology matches
    const techMatches = new Set<string>();
    projects.forEach(project => {
      project.technologies.forEach(tech => {
        if (tech.toLowerCase().includes(queryLower)) {
          techMatches.add(tech);
        }
      });
    });
    techMatches.forEach(tech => {
      suggestions.push({
        text: tech,
        type: 'technology',
        description: `Technology used in our projects`
      });
    });

    // 3. Client matches
    projects.forEach(project => {
      if (project.client.toLowerCase().includes(queryLower)) {
        suggestions.push({
          text: project.client,
          type: 'client',
          description: `Client: ${project.title}`
        });
      }
    });

    // 4. Country matches
    const countryMatches = new Set<string>();
    projects.forEach(project => {
      if (project.country.toLowerCase().includes(queryLower)) {
        countryMatches.add(project.country);
      }
    });
    countryMatches.forEach(country => {
      suggestions.push({
        text: country,
        type: 'country',
        description: `Projects in ${country}`
      });
    });

    // 5. Category matches
    const categoryMatches = new Set<string>();
    projects.forEach(project => {
      if (project.category.toLowerCase().includes(queryLower)) {
        categoryMatches.add(project.category);
      }
    });
    categoryMatches.forEach(category => {
      suggestions.push({
        text: category,
        type: 'category',
        description: `${category} projects`
      });
    });

    // 6. Tag matches
    const tagMatches = new Set<string>();
    projects.forEach(project => {
      project.searchTags.forEach(tag => {
        if (tag.toLowerCase().includes(queryLower)) {
          tagMatches.add(tag);
        }
      });
    });
    tagMatches.forEach(tag => {
      suggestions.push({
        text: tag,
        type: 'tag',
        description: `Related to ${tag}`
      });
    });

    // 7. Popular search matches
    popularSearches.forEach(search => {
      if (search.toLowerCase().includes(queryLower) && !suggestions.find(s => s.text === search)) {
        suggestions.push({
          text: search,
          type: 'tag',
          description: `Popular search term`
        });
      }
    });

    // 8. AI-powered suggestions (if requested and query is substantial)
    if (useAI && query.length > 3) {
      try {
        const zai = await ZAI.create();
        
        const aiPrompt = `Based on the following search query "${query}", suggest 3-4 related search terms that would be relevant for finding software development projects. Focus on technologies, industries, or project types. Return only the suggestions as a JSON array of strings.`;

        const completion = await zai.chat.completions.create({
          messages: [
            {
              role: 'system',
              content: 'You are a search assistant for a software development portfolio. Generate relevant search suggestions based on user queries.'
            },
            {
              role: 'user',
              content: aiPrompt
            }
          ],
          max_tokens: 100,
          temperature: 0.7
        });

        const aiSuggestionsText = completion.choices[0]?.message?.content;
        if (aiSuggestionsText) {
          try {
            const aiSuggestions = JSON.parse(aiSuggestionsText);
            if (Array.isArray(aiSuggestions)) {
              aiSuggestions.slice(0, 3).forEach((suggestion: string) => {
                if (typeof suggestion === 'string' && suggestion.trim()) {
                  suggestions.push({
                    text: suggestion.trim(),
                    type: 'ai',
                    description: 'AI-powered suggestion'
                  });
                }
              });
            }
          } catch (parseError) {
            console.log('Could not parse AI suggestions:', parseError);
          }
        }
      } catch (aiError) {
        console.log('AI suggestions failed:', aiError);
        // Continue without AI suggestions
      }
    }

    // Sort suggestions by relevance and limit results
    const sortedSuggestions = suggestions
      .sort((a, b) => {
        // Prioritize exact matches
        const aExact = a.text.toLowerCase() === queryLower;
        const bExact = b.text.toLowerCase() === queryLower;
        if (aExact && !bExact) return -1;
        if (!aExact && bExact) return 1;
        
        // Prioritize starts with
        const aStarts = a.text.toLowerCase().startsWith(queryLower);
        const bStarts = b.text.toLowerCase().startsWith(queryLower);
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;
        
        // Prioritize by type order
        const typeOrder = { project: 0, technology: 1, client: 2, country: 3, category: 4, tag: 5, ai: 6 };
        const aOrder = typeOrder[a.type] || 99;
        const bOrder = typeOrder[b.type] || 99;
        if (aOrder !== bOrder) return aOrder - bOrder;
        
        // Alphabetical
        return a.text.localeCompare(b.text);
      })
      .slice(0, limit);

    return NextResponse.json({
      suggestions: sortedSuggestions,
      query,
      total: suggestions.length
    });

  } catch (error) {
    console.error('Search suggestions API error:', error);
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
      case 'feedback':
        // Track user feedback on suggestions
        const { suggestion, query, helpful } = data;
        console.log('Suggestion feedback:', { suggestion, query, helpful });
        return NextResponse.json({ success: true });
      
      case 'improve':
        // Use AI to improve search query
        try {
          const zai = await ZAI.create();
          const { originalQuery } = data;
          
          const improvementPrompt = `Improve this search query for finding software development projects: "${originalQuery}". Make it more specific and effective. Return only the improved query as a string.`;

          const completion = await zai.chat.completions.create({
            messages: [
              {
                role: 'system',
                content: 'You are a search optimization expert. Improve search queries to get better results.'
              },
              {
                role: 'user',
                content: improvementPrompt
              }
            ],
            max_tokens: 50,
            temperature: 0.3
          });

          const improvedQuery = completion.choices[0]?.message?.content?.trim();
          
          return NextResponse.json({
            originalQuery,
            improvedQuery,
            success: true
          });
        } catch (aiError) {
          console.error('Query improvement failed:', aiError);
          return NextResponse.json(
            { error: 'AI improvement failed' },
            { status: 500 }
          );
        }
        
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Search suggestions POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}