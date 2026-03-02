'use client';

import React from 'react';

interface SearchHighlightProps {
  text: string;
  query: string;
  className?: string;
}

export default function SearchHighlight({ text, query, className = '' }: SearchHighlightProps) {
  if (!query || query.length < 2) {
    return <span className={className}>{text}</span>;
  }

  const parts = text.split(new RegExp(`(${query})`, 'gi'));
  
  return (
    <span className={className}>
      {parts.map((part, index) => 
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={index} className="bg-yellow-200 text-yellow-900 px-1 rounded">
            {part}
          </mark>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </span>
  );
}