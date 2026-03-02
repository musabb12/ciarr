'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, Sparkles, TrendingUp, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

interface GlobalSearchProps {
  placeholder?: string;
  className?: string;
  showButton?: boolean;
}

export default function GlobalSearch({ 
  placeholder = "Search projects, technologies, or clients...", 
  className = "",
  showButton = true 
}: GlobalSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [trending, setTrending] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mock data - in real app, this would come from API
  const mockProjects = [
    { title: "Noon E-Commerce Platform", url: "/search?q=noon" },
    { title: "STC Banking App", url: "/search?q=stc" },
    { title: "Careem Food Delivery", url: "/search?q=careem" },
    { title: "Saudi Health Portal", url: "/search?q=health" },
    { title: "Emirates Airlines Booking", url: "/search?q=emirates" }
  ];

  const mockTrending = ["e-commerce", "mobile banking", "healthcare", "AI/ML", "saudi arabia"];
  const mockRecent = ["fintech", "education", "logistics"];

  // Listen for keyboard shortcut
  useEffect(() => {
    const handleOpenSearch = () => {
      setIsOpen(true);
      setTimeout(() => inputRef.current?.focus(), 100);
    };

    window.addEventListener('openGlobalSearch', handleOpenSearch);
    return () => window.removeEventListener('openGlobalSearch', handleOpenSearch);
  }, []);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch suggestions when query changes
  useEffect(() => {
    if (query.length > 2) {
      setIsLoading(true);
      // Simulate API call
      const timer = setTimeout(() => {
        const mockSuggestions = [
          ...mockProjects.filter(p => 
            p.title.toLowerCase().includes(query.toLowerCase())
          ).map(p => p.title),
          ...mockTrending.filter(t => 
            t.toLowerCase().includes(query.toLowerCase())
          )
        ].slice(0, 6);
        
        setSuggestions(mockSuggestions);
        setIsLoading(false);
      }, 300);

      return () => clearTimeout(timer);
    } else {
      setSuggestions([]);
      setIsLoading(false);
    }
  }, [query]);

  // Initialize trending and recent searches
  useEffect(() => {
    setTrending(mockTrending);
    setRecentSearches(mockRecent);
  }, []);

  const handleSearch = (searchTerm: string) => {
    if (searchTerm.trim()) {
      // Add to recent searches
      setRecentSearches(prev => {
        const updated = [searchTerm, ...prev.filter(s => s !== searchTerm)];
        return updated.slice(0, 5);
      });
      
      // Navigate to search page
      window.location.href = `/search?q=${encodeURIComponent(searchTerm)}`;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(query);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    handleSearch(suggestion);
  };

  const openSearch = () => {
    setIsOpen(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  if (!isOpen && !showButton) {
    return null;
  }

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={openSearch}
        className={`relative h-9 px-3 gap-2 inline-flex items-center ${className}`}
      >
        <Search className="w-4 h-4 shrink-0" />
        <span>بحث</span>
        <kbd className="px-1.5 py-0.5 text-xs rounded bg-black/5">⌘K</kbd>
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />
      
      {/* Search Modal */}
      <div 
        ref={searchRef}
        className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden"
      >
        {/* Search Input */}
        <div className="flex items-center p-4 border-b border-gray-200">
          <Search className="w-5 h-5 text-gray-400 mr-3" />
          <Input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="border-0 focus:ring-0 text-lg px-0"
          />
          {query && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setQuery('')}
              className="ml-2"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="ml-2"
          >
            <span className="text-sm">ESC</span>
          </Button>
        </div>

        {/* Search Results */}
        <div className="max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mx-auto"></div>
              <p className="text-gray-500 mt-2">Searching...</p>
            </div>
          ) : query.length > 2 ? (
            <div className="p-4">
              {/* Suggestions */}
              {suggestions.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center mb-3">
                    <Sparkles className="w-4 h-4 text-yellow-500 mr-2" />
                    <span className="text-sm font-medium text-gray-700">Suggestions</span>
                  </div>
                  <div className="space-y-1">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
                      >
                        <div className="flex items-center">
                          <Search className="w-4 h-4 text-gray-400 mr-3" />
                          <span className="text-gray-900">{suggestion}</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <span className="text-sm text-gray-700">
                  Can't find what you're looking for?
                </span>
                <Button
                  size="sm"
                  onClick={() => handleSearch(query)}
                  className="bg-yellow-500 text-white hover:bg-yellow-600"
                >
                  Advanced Search
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-4">
              {/* Trending Searches */}
              <div className="mb-6">
                <div className="flex items-center mb-3">
                  <TrendingUp className="w-4 h-4 text-blue-500 mr-2" />
                  <span className="text-sm font-medium text-gray-700">Trending Now</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {trending.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="cursor-pointer hover:bg-blue-100 transition-colors"
                      onClick={() => handleSuggestionClick(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center mb-3">
                    <Clock className="w-4 h-4 text-green-500 mr-2" />
                    <span className="text-sm font-medium text-gray-700">Recent Searches</span>
                  </div>
                  <div className="space-y-1">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(search)}
                        className="w-full flex items-center justify-between p-2 hover:bg-gray-50 rounded transition-colors text-left"
                      >
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 text-gray-400 mr-3" />
                          <span className="text-gray-700">{search}</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Links */}
              <div>
                <div className="text-sm font-medium text-gray-700 mb-3">Quick Links</div>
                <div className="grid grid-cols-2 gap-2">
                  <Link href="/portfolio">
                    <Button variant="outline" className="w-full justify-start">
                      All Projects
                    </Button>
                  </Link>
                  <Link href="/services">
                    <Button variant="outline" className="w-full justify-start">
                      Services
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button variant="outline" className="w-full justify-start">
                      Contact Us
                    </Button>
                  </Link>
                  <Link href="/about">
                    <Button variant="outline" className="w-full justify-start">
                      About Us
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-4">
              <span>Press ⌘K to open</span>
              <span>↑↓ to navigate</span>
              <span>ESC to close</span>
            </div>
            <div className="flex items-center">
              <Sparkles className="w-3 h-3 text-yellow-500 mr-1" />
              <span>AI-powered search</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}