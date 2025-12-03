import React from "react";

/**
 * ToggleGroup - a reusable toggle button group for two options.
 * @param {string[]} options - Array of two option labels.
 * @param {string} value - Currently selected value.
 * @param {function} onChange - Callback when selection changes.
 * @param {string} className - Additional classes for the wrapper.
 */
export default function ToggleGroup({ options, value, onChange, className = "" }) {
  return (
    <div
      className={`flex items-center bg-gray-50 dark:bg-gray-800 rounded-full p-0.5 transition-all w-fit ${className}`}
    >
      {options.map((option) => {
        const active = value === option;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`px-3 py-1 text-sm font-medium rounded-full focus:outline-none transition-all whitespace-nowrap
              ${active
                ? "bg-white dark:bg-gray-700 border-2 border-cyan-400 dark:border-cyan-500 text-gray-900 dark:text-white shadow"
                : "bg-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"}
            `}
            style={{ boxShadow: active ? "0 2px 8px 0 rgba(0,0,0,0.04)" : undefined }}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
