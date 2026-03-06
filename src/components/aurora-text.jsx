import React, { memo } from "react"

export const AuroraText = memo(({
  children,
  className = "",
  colors = ["#2B75BF", "#88d3ff", "#E6BD67", "#2B75BF"],
  speed = 4
}) => {
  const gradientStyle = {
    backgroundImage: `linear-gradient(135deg, ${colors.join(", ")}, ${
      colors[0]
    })`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    animationDuration: `${10 / speed}s`,
  }

  return (
    <span className={`relative inline-block ${className}`}>
      <span className="sr-only">{children}</span>
      <span
        className="animate-aurora relative bg-size-[200%_auto] bg-clip-text text-transparent"
        style={gradientStyle}
        aria-hidden="true">
        {children}
      </span>
    </span>
  );
})

AuroraText.displayName = "AuroraText"
