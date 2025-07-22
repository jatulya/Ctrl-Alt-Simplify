import React from "react";

export function formatMessageWithBold(text: string): React.ReactNode {
  const parts = text.split(/(\*\*.*?\*\*)/g); // Split by **bold**
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
}
