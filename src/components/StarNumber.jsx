import React from "react";

const StarNumber = ({
  number,
  size = 40,
  isHighlighted = false,
  color = "rgb(218,218,218)",
  textColor = "rgb(0,0,0)",
}) => {
  // Colors (simulating your Flutter logic)
  const defaultBgColor = "#EBEEF0"; // light mode default
  const darkBgColor = "#343434"; // dark mode (you can improve with context)
  const bgColor = isHighlighted ? "#2c3e50" : defaultBgColor; // secondaryDarkColor
  const fgColor = isHighlighted ? "#fff" : textColor;

  // Generate star points
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
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Star shape */}
      <path d={getStarPath(12)} fill={bgColor} />

      {/* Number in center */}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={size * 0.4}
        fontWeight="bold"
        fill={fgColor}
      >
        {number}
      </text>
    </svg>
  );
};

export default StarNumber;
