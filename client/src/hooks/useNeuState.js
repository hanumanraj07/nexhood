import { useState } from 'react';

export const useNeuState = (baseStyle) => {
  const [pressed, setPressed] = useState(false);
  return {
    style: {
      ...baseStyle,
      ...(pressed ? { boxShadow: 'var(--nh-shadow-inset)' } : baseStyle),
    },
    onMouseDown: () => setPressed(true),
    onMouseUp: () => setPressed(false),
    onMouseLeave: () => setPressed(false),
  };
};


