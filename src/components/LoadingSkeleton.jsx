/**
 * Loading Skeleton Components for better perceived performance
 * Provides visual feedback while content is loading
 */

import React from 'react';

// Verse skeleton for Surah.jsx
export const VerseSkeleton = () => (
  <div className="pb-4 sm:pb-6 border-b border-gray-200 dark:border-gray-700 rounded-md">
    {/* Arabic text skeleton */}
    <div className="text-right mb-2 sm:mb-3 lg:mb-4">
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4 ml-auto"></div>
    </div>
    
    {/* Translation skeleton */}
    <div className="mb-2 sm:mb-3">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2 w-5/6"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
    </div>
    
    {/* Actions skeleton */}
    <div className="flex flex-wrap items-center gap-2 sm:gap-4 lg:gap-6">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-8"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-4"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-4"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-4"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-4"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-4"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-4"></div>
    </div>
  </div>
);

// Block skeleton for BlockWise.jsx
export const BlockSkeleton = () => (
  <div className="rounded-xl mb-4 sm:mb-6 border border-gray-200 dark:border-gray-700">
    <div className="px-3 sm:px-4 pt-3 sm:pt-4 flex items-center justify-between">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-32"></div>
    </div>

    <div className="p-3 sm:p-4 md:p-6 lg:p-8">
      {/* Arabic text skeleton */}
      <div className="text-center mb-4">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4 mx-auto"></div>
      </div>
    </div>

    <div className="px-3 sm:px-4 md:px-6 lg:px-8 pb-3 sm:pb-4 md:pb-6 lg:pb-8">
      {/* Translation skeleton */}
      <div className="mb-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2 w-5/6"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
      </div>
      
      {/* Action buttons skeleton */}
      <div className="flex flex-wrap justify-start gap-1 sm:gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
        ))}
      </div>
    </div>
  </div>
);

// Loading indicator with progress
export const LoadingWithProgress = ({ progress = 0, message = "Loading..." }) => (
  <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
    <div className="text-center max-w-md mx-auto px-4">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-500 mx-auto mb-4"></div>
      <p className="text-gray-600 dark:text-gray-400 mb-4">{message}</p>
      
      {/* Progress bar */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
        <div 
          className="bg-cyan-500 h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      <p className="text-sm text-gray-500 dark:text-gray-400">{progress}% complete</p>
    </div>
  </div>
);

// Compact loading indicator
export const CompactLoading = ({ message = "Loading..." }) => (
  <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 text-sm">
    <div className="animate-spin rounded-full h-4 w-4 border-b border-current"></div>
    <span>{message}</span>
  </div>
);

// Skeleton for multiple verses
export const VersesSkeleton = ({ count = 5 }) => (
  <div className="space-y-4 sm:space-y-6 lg:space-y-8">
    {Array.from({ length: count }).map((_, index) => (
      <VerseSkeleton key={index} />
    ))}
  </div>
);

// Skeleton for multiple blocks
export const BlocksSkeleton = ({ count = 3 }) => (
  <div className="space-y-4 sm:space-y-6">
    {Array.from({ length: count }).map((_, index) => (
      <BlockSkeleton key={index} />
    ))}
  </div>
);

export default {
  VerseSkeleton,
  BlockSkeleton,
  LoadingWithProgress,
  CompactLoading,
  VersesSkeleton,
  BlocksSkeleton
};
