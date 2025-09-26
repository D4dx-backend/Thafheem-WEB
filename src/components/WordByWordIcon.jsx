import React from 'react';

const WordByWordIcon = ({ className = "w-4 h-4", size }) => {
  // If size is provided, use it to set both width and height
  const iconSize = size ? `w-${size} h-${size}` : className;
  
  return (
    <svg
      className={iconSize}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Document with heavily rounded corners (pill-like appearance) - blue outline */}
      <rect
        x="4"
        y="3"
        width="16"
        height="18"
        rx="6"
        ry="6"
        fill="none"
        stroke="white"
        strokeWidth="2"
      />
      
      {/* Three horizontal blue lines with rounded ends - different lengths */}
      {/* Top line - medium length */}
      <rect
        x="7"
        y="8"
        width="8"
        height="2"
        rx="1"
        ry="1"
        fill="white"
      />
      
      {/* Middle line - longest */}
      <rect
        x="7"
        y="11"
        width="10"
        height="2"
        rx="1"
        ry="1"
        fill="white"
      />
      
      {/* Bottom line - shortest */}
      <rect
        x="7"
        y="14"
        width="6"
        height="2"
        rx="1"
        ry="1"
        fill="white"
      />
    </svg>
  );
};

export default WordByWordIcon;
