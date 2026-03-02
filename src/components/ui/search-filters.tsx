'use client';

import { useState } from 'react';
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface SearchFiltersProps {
  categories: string[];
  countries: string[];
  technologies: string[];
  selectedCategory: string;
  selectedCountry: string;
  selectedComplexity: string;
  selectedTechnologies: string[];
  onCategoryChange: (value: string) => void;
  onCountryChange: (value: string) => void;
  onComplexityChange: (value: string) => void;
  onTechnologiesChange: (values: string[]) => void;
  onClearAll: () => void;
  className?: string;
}

export default function SearchFilters({
  categories,
  countries,
  technologies,
  selectedCategory,
  selectedCountry,
  selectedComplexity,
  selectedTechnologies,
  onCategoryChange,
  onCountryChange,
  onComplexityChange,
  onTechnologiesChange,
  onClearAll,
  className = ''
}: SearchFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAllTechnologies, setShowAllTechnologies] = useState(false);

  const hasActiveFilters = selectedCategory !== 'all' || 
                          selectedCountry !== 'all' || 
                          selectedComplexity !== 'all' || 
                          selectedTechnologies.length > 0;

  const activeFilterCount = [
    selectedCategory !== 'all' ? 1 : 0,
    selectedCountry !== 'all' ? 1 : 0,
    selectedComplexity !== 'all' ? 1 : 0,
    selectedTechnologies.length
  ].reduce((a, b) => a + b, 0);

  const handleTechnologyToggle = (tech: string) => {
    const newTechnologies = selectedTechnologies.includes(tech)
      ? selectedTechnologies.filter(t => t !== tech)
      : [...selectedTechnologies, tech];
    onTechnologiesChange(newTechnologies);
  };

  const displayedTechnologies = showAllTechnologies 
    ? technologies 
    : technologies.slice(0, 8);

  return (
    <Card className={`${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            <h3 className="text-lg font-semibold">Filters</h3>
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFilterCount} active
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearAll}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-4 h-4 mr-1" />
                Clear All
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {isExpanded && (
          <div className="space-y-6">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <Select value={selectedCategory} onValueChange={onCategoryChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Country Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country
              </label>
              <Select value={selectedCountry} onValueChange={onCountryChange}>
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
              <Select value={selectedComplexity} onValueChange={onComplexityChange}>
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

            {/* Technologies Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Technologies
              </label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {displayedTechnologies.map(tech => (
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
                {technologies.length > 8 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAllTechnologies(!showAllTechnologies)}
                    className="text-xs"
                  >
                    {showAllTechnologies ? 'Show Less' : `Show ${technologies.length - 8} More`}
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Active Filters Summary */}
        {hasActiveFilters && !isExpanded && (
          <div className="flex flex-wrap gap-2">
            {selectedCategory !== 'all' && (
              <Badge variant="secondary" className="text-xs">
                Category: {selectedCategory}
              </Badge>
            )}
            {selectedCountry !== 'all' && (
              <Badge variant="secondary" className="text-xs">
                Country: {selectedCountry}
              </Badge>
            )}
            {selectedComplexity !== 'all' && (
              <Badge variant="secondary" className="text-xs">
                Complexity: {selectedComplexity}
              </Badge>
            )}
            {selectedTechnologies.slice(0, 3).map(tech => (
              <Badge key={tech} variant="secondary" className="text-xs">
                {tech}
              </Badge>
            ))}
            {selectedTechnologies.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{selectedTechnologies.length - 3} more
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}