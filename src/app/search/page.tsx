'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Search, Filter, TrendingUp, Clock, Star, ChevronDown, X, Sparkles, Zap, Target, BarChart3, Users, Globe } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SearchHighlight from '@/components/ui/search-highlight';
import VoiceSearch from '@/components/ui/voice-search';

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

// Popular search suggestions
const popularSearches = [
  "e-commerce", "mobile app", "saudi arabia", "banking", "healthcare", 
  "education", "real estate", "food delivery", "logistics", "AI/ML"
];

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [selectedComplexity, setSelectedComplexity] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('relevance');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  
  // Search analytics state
  const [searchAnalytics, setSearchAnalytics] = useState({
    trending: ["e-commerce", "mobile banking", "healthcare", "AI/ML", "saudi arabia"],
    recent: ["fintech", "education", "logistics", "retail", "tourism"],
    popular: ["saudi arabia", "uae", "mobile app", "web development", "react"]
  });

  // Fetch search analytics
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('/api/search/analytics');
        if (response.ok) {
          const data = await response.json();
          setSearchAnalytics({
            trending: data.trendingQueries?.slice(0, 5).map((q: any) => q.query) || [],
            recent: data.recentSearches?.slice(0, 5).map((s: any) => s.query) || [],
            popular: data.popularQueries?.slice(0, 5).map((q: any) => q.query) || []
          });
        }
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      }
    };

    fetchAnalytics();
  }, []);

  // Get all unique technologies
  const allTechnologies = useMemo(() => {
    const techs = new Set<string>();
    projects.forEach(project => {
      project.technologies.forEach(tech => techs.add(tech));
    });
    return Array.from(techs).sort();
  }, []);

  // Get all unique countries
  const countries = useMemo(() => {
    const countries = new Set<string>();
    projects.forEach(project => countries.add(project.country));
    return Array.from(countries).sort();
  }, []);

  // Generate AI-powered suggestions using API
  const generateSuggestions = useCallback(async (query: string) => {
    if (!query || query.length < 2) return [];
    
    try {
      const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(query)}&limit=8&ai=true`);
      if (response.ok) {
        const data = await response.json();
        return data.suggestions.map((s: any) => s.text);
      }
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
    }
    
    // Fallback to local suggestions
    return generateLocalSuggestions(query);
  }, []);

  // Local suggestions as fallback
  const generateLocalSuggestions = useCallback((query: string) => {
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
    popularSearches.forEach(search => {
      if (search.toLowerCase().includes(queryLower)) {
        matches.push(search);
      }
    });
    
    // Remove duplicates and limit to 8 suggestions
    return [...new Set(matches)].slice(0, 8);
  }, []);

  // Update suggestions when search term changes
  useEffect(() => {
    if (searchTerm.length > 2) {
      generateSuggestions(searchTerm).then(newSuggestions => {
        setSuggestions(newSuggestions);
        setShowSuggestions(true);
      });
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm, generateSuggestions]);

  // Calculate relevance score (moved above filteredProjects to avoid TDZ during render)
  const calculateRelevanceScore = (project: any, query: string) => {
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
  };

  // Filter and sort projects
  const filteredProjects = useMemo(() => {
    let filtered = projects.filter(project => {
      const matchesSearch = !searchTerm || 
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.technologies.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase())) ||
        project.searchTags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
        project.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.country.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
      const matchesCountry = selectedCountry === 'all' || project.country === selectedCountry;
      const matchesComplexity = selectedComplexity === 'all' || project.complexity === selectedComplexity;
      const matchesTechnologies = selectedTechnologies.length === 0 || 
        selectedTechnologies.some(tech => project.technologies.includes(tech));
      
      return matchesSearch && matchesCategory && matchesCountry && matchesComplexity && matchesTechnologies;
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
          const scoreA = calculateRelevanceScore(a, searchTerm);
          const scoreB = calculateRelevanceScore(b, searchTerm);
          return scoreB - scoreA;
      }
    });

    return filtered;
  }, [searchTerm, selectedCategory, selectedCountry, selectedComplexity, selectedTechnologies, sortBy]);
 

  // Handle search submission
  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    setShowSuggestions(false);
    
    // Add to search history
    if (term && !searchHistory.includes(term)) {
      setSearchHistory(prev => [term, ...prev.slice(0, 4)]);
    }

    // Track search analytics
    try {
      const searchStartTime = Date.now();
      const resultsCount = filteredProjects.length;
      const searchTime = (Date.now() - searchStartTime) / 1000;

      await fetch('/api/search/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'track_search',
          data: {
            query: term,
            filters: {
              category: selectedCategory,
              country: selectedCountry,
              complexity: selectedComplexity,
              technologies: selectedTechnologies
            },
            resultsCount,
            searchTime
          }
        })
      });
    } catch (error) {
      console.error('Failed to track search:', error);
    }
  };

  // Handle technology selection
  const handleTechnologyToggle = (tech: string) => {
    setSelectedTechnologies(prev => 
      prev.includes(tech) 
        ? prev.filter(t => t !== tech)
        : [...prev, tech]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategory('all');
    setSelectedCountry('all');
    setSelectedComplexity('all');
    setSelectedTechnologies([]);
    setPriceRange([0, 100]);
    setSortBy('relevance');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <img src="/logo.png" alt="Ciar" className="w-8 h-8" />
              <span className="text-2xl font-bold text-gray-900">Ciar</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="text-sm">
                {filteredProjects.length} Projects Found
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <div className="mb-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Advanced Project Search
            </h1>
            <p className="text-xl text-gray-600">
              Find the perfect project from our portfolio
            </p>
          </div>

          {/* Main Search Bar */}
          <div className="relative max-w-3xl mx-auto mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search projects, technologies, clients, or countries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch(searchTerm);
                  }
                }}
                className="pl-12 pr-32 h-14 text-lg border-2 border-gray-200 focus:border-yellow-500 rounded-xl"
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                <VoiceSearch 
                  onTranscript={(transcript) => {
                    setSearchTerm(transcript);
                    handleSearch(transcript);
                  }} 
                />
                {searchTerm && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSearchTerm('')}
                    className="h-8 w-8 p-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* AI Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border rounded-lg shadow-lg z-50">
                <div className="p-2">
                  <div className="flex items-center px-3 py-2 text-sm text-gray-500">
                    <Sparkles className="w-4 h-4 mr-2 text-yellow-500" />
                    AI-Powered Suggestions
                  </div>
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearch(suggestion)}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md transition-colors"
                    >
                      <div className="flex items-center">
                        <Search className="w-4 h-4 mr-2 text-gray-400" />
                        <span>{suggestion}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Search Tags */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {popularSearches.map((tag, index) => (
              <Badge
                key={index}
                variant="outline"
                className="cursor-pointer hover:bg-yellow-50 hover:border-yellow-500 transition-colors"
                onClick={() => handleSearch(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Search Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-medium">Trending Now</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {searchAnalytics.trending.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs bg-blue-200 text-blue-800">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 font-medium">Recent Searches</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {searchAnalytics.recent.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs bg-green-200 text-green-800">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Clock className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600 font-medium">Popular Tags</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {searchAnalytics.popular.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs bg-purple-200 text-purple-800">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Star className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Filter className="w-5 h-5 mr-2" />
                    Filters
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Clear All
                  </Button>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="all">All Filters</TabsTrigger>
                    <TabsTrigger value="advanced">Advanced</TabsTrigger>
                  </TabsList>

                  <TabsContent value="all" className="space-y-6">
                    {/* Category Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          <SelectItem value="e-commerce">E-Commerce</SelectItem>
                          <SelectItem value="fintech">FinTech</SelectItem>
                          <SelectItem value="food-tech">Food Tech</SelectItem>
                          <SelectItem value="real-estate">Real Estate</SelectItem>
                          <SelectItem value="edtech">EdTech</SelectItem>
                          <SelectItem value="logistics">Logistics</SelectItem>
                          <SelectItem value="travel">Travel</SelectItem>
                          <SelectItem value="retail">Retail</SelectItem>
                          <SelectItem value="healthcare">Healthcare</SelectItem>
                          <SelectItem value="tourism">Tourism</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Country Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Country
                      </label>
                      <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Countries</SelectItem>
                          {countries.map(country => (
                            <SelectItem key={country} value={country}>
                              {country}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Complexity Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Complexity
                      </label>
                      <Select value={selectedComplexity} onValueChange={setSelectedComplexity}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Levels</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TabsContent>

                  <TabsContent value="advanced" className="space-y-6">
                    {/* Technologies Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Technologies
                      </label>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {allTechnologies.map(tech => (
                          <div key={tech} className="flex items-center space-x-2">
                            <Checkbox
                              id={tech}
                              checked={selectedTechnologies.includes(tech)}
                              onCheckedChange={() => handleTechnologyToggle(tech)}
                            />
                            <label htmlFor={tech} className="text-sm text-gray-600">
                              {tech}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Sort Options */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sort By
                      </label>
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="relevance">Relevance</SelectItem>
                          <SelectItem value="rating">Rating</SelectItem>
                          <SelectItem value="date">Date</SelectItem>
                          <SelectItem value="name">Name</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="lg:w-3/4">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  Search Results
                </h2>
                <p className="text-gray-600">
                  {filteredProjects.length} projects found
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span className="text-sm text-gray-500">Smart Search Active</span>
              </div>
            </div>

            {/* Projects Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {filteredProjects.map((project) => (
                <Card key={project.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={project.image} 
                      alt={project.title} 
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Button variant="secondary" size="sm" className="bg-yellow-400 text-gray-900 hover:bg-yellow-300">
                        View Project
                      </Button>
                    </div>
                    {project.featured && (
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-yellow-500 text-white">
                          Featured
                        </Badge>
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <Badge variant="secondary" className="bg-black/70 text-white">
                        {project.country}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">
                        <SearchHighlight text={project.title} query={searchTerm} />
                      </h3>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 mr-1" />
                        <span className="text-sm text-gray-600">{project.rating}</span>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      <SearchHighlight text={project.description} query={searchTerm} />
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.slice(0, 3).map((tech, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          <SearchHighlight text={tech} query={searchTerm} />
                        </Badge>
                      ))}
                      {project.technologies.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{project.technologies.length - 3} more
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        <SearchHighlight text={project.client} query={searchTerm} />
                      </div>
                      <div className="flex items-center">
                        <Globe className="w-4 h-4 mr-1" />
                        <SearchHighlight text={project.country} query={searchTerm} />
                      </div>
                      <div className="flex items-center">
                        <Target className="w-4 h-4 mr-1" />
                        {project.complexity}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* No Results */}
            {filteredProjects.length === 0 && (
              <div className="text-center py-12">
                <div className="mb-4">
                  <Search className="w-16 h-16 text-gray-300 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No projects found
                </h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search terms or filters
                </p>
                <Button onClick={clearFilters} variant="outline">
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}