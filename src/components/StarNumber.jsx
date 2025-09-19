import React from "react";

const StarNumber = ({
  number,
  size = 45,
  isHighlighted = false,
  className = "",
}) => {
  const getStarPath = (points = 12) => {
    const outerRadius = size / 2;
    const innerRadius = outerRadius * 0.9;
    const centerX = size / 2;
    const centerY = size / 2;

    let path = "";
    for (let i = 0; i < points * 2; i++) {
      const r = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (i * Math.PI) / points - Math.PI / 2;
      const x = centerX + r * Math.cos(angle);
      const y = centerY + r * Math.sin(angle);
      path += i === 0 ? `M${x},${y}` : `L${x},${y}`;
    }
    return path + "Z";
  };

  return (
    <svg
      width={`${size}px`}
      height={`${size}px`}
      viewBox={`0 0 ${size} ${size}`}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Star shape */}
      <path
        d={getStarPath(12)}
        className={`${
          isHighlighted
            ? "fill-[#2c3e50]"
            : "fill-[#EBEEF0] dark:fill-[#323A3F]"
        }`}
      />

      {/* Number in center */}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={size * 0.4}
        fontWeight="bold"
        className={`${
          isHighlighted
            ? "fill-white"
            : "fill-black dark:fill-white"
        }`}
      >
        {number}
      </text>
    </svg>
  );
};

export default StarNumber;
