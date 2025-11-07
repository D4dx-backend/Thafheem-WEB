import React from "react";

/**
 * Loading fallback component for lazy-loaded routes and components
 * Displays a centered loading spinner with theme support
 */
const LazyLoadFallback = ({ message = "Loading..." }) => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-cyan-500 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          {message}
        </p>
      </div>
    </div>
  );
};

/**
 * Compact loading fallback for smaller components
 */
export const CompactLoadFallback = ({ message = "Loading..." }) => {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500 mx-auto mb-2"></div>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          {message}
        </p>
      </div>
    </div>
  );
};

export default LazyLoadFallback;


