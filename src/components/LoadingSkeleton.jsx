/**
 * Loading Skeleton Components with Shimmer Effect
 * Provides smooth, performant visual feedback while content is loading
 * ✨ Enhanced with gradient shimmer animation for better perceived performance
 */

import React from 'react';

// Shimmer wrapper component
const Shimmer = ({ className = "", children }) => (
  <div className={`relative overflow-hidden ${className}`}>
    {children}
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 dark:via-white/10 to-transparent"></div>
  </div>
);

// Verse skeleton for Surah.jsx
export const VerseSkeleton = () => (
  <div className="pb-4 sm:pb-6 border-b border-gray-200 dark:border-gray-700 rounded-md">
    {/* Arabic text skeleton */}
    <div className="text-right mb-2 sm:mb-3 lg:mb-4">
      <Shimmer className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded mb-2" />
      <Shimmer className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded w-3/4 ml-auto" />
    </div>
    
    {/* Translation skeleton */}
    <div className="mb-2 sm:mb-3">
      <Shimmer className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded mb-2" />
      <Shimmer className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded mb-2 w-5/6" />
      <Shimmer className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded w-3/4" />
    </div>
    
    {/* Actions skeleton */}
    <div className="flex flex-wrap items-center gap-2 sm:gap-4 lg:gap-6">
      {Array.from({ length: 7 }).map((_, i) => (
        <Shimmer key={i} className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded w-8" />
      ))}
    </div>
  </div>
);

// Block skeleton for BlockWise.jsx - Optimized for speed
export const BlockSkeleton = () => (
  <div className="rounded-xl mb-4 sm:mb-6 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
    <div className="px-3 sm:px-4 pt-3 sm:pt-4 flex items-center justify-between">
      <Shimmer className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded w-32" />
    </div>

    <div className="p-3 sm:p-4 md:p-6 lg:p-8">
      {/* Arabic text skeleton - Prominent shimmer */}
      <div className="text-center mb-4 space-y-2">
        <Shimmer className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded" />
        <Shimmer className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded" />
        <Shimmer className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded w-3/4 mx-auto" />
      </div>
    </div>

    <div className="px-3 sm:px-4 md:px-6 lg:px-8 pb-3 sm:pb-4 md:pb-6 lg:pb-8">
      {/* Translation skeleton */}
      <div className="mb-4 space-y-2">
        <Shimmer className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded" />
        <Shimmer className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded" />
        <Shimmer className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded w-5/6" />
        <Shimmer className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded w-3/4" />
      </div>
      
      {/* Action buttons skeleton */}
      <div className="flex flex-wrap justify-start gap-1 sm:gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Shimmer key={i} className="h-10 w-10 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg" />
        ))}
      </div>
    </div>
  </div>
);

// Loading indicator with progress - Enhanced spinner
export const LoadingWithProgress = ({ progress = 0, message = "Loading..." }) => (
  <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
    <div className="text-center max-w-md mx-auto px-4">
      {/* Enhanced spinner with gradient */}
      <div className="relative mx-auto mb-4 h-16 w-16">
        <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-700"></div>
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-cyan-500 border-r-cyan-400 animate-spin"></div>
      </div>
      <p className="text-gray-600 dark:text-gray-400 mb-4 font-medium">{message}</p>
      
      {/* Progress bar with shimmer */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2 overflow-hidden relative">
        <div 
          className="bg-gradient-to-r from-cyan-500 to-cyan-400 h-2 rounded-full transition-all duration-300 ease-out relative overflow-hidden"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_2s_infinite]"></div>
        </div>
      </div>
      
      <p className="text-sm text-gray-500 dark:text-gray-400">{progress}% complete</p>
    </div>
  </div>
);

// Compact loading indicator - Enhanced with smooth animation
export const CompactLoading = ({ message = "Loading..." }) => (
  <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 text-sm">
    <div className="relative h-4 w-4">
      <div className="absolute inset-0 rounded-full border border-gray-300 dark:border-gray-600"></div>
      <div className="absolute inset-0 rounded-full border border-transparent border-t-cyan-500 animate-spin"></div>
    </div>
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
