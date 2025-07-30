// utils/colorSchemes.ts - Complete Color Schemes Configuration
export const MINDMAP_COLOR_SCHEMES = {
  // 1. Purple Theme - "绝绝紫" (Absolute Purple)
  purple: {
    name: "Absolute Purple",
    chinese: "绝绝紫",
    primary: "#795F9C",
    secondary: "#EEDACA", 
    root: "#795F9C",
    main: "#A67CB5",
    sub: "#C198D4", 
    detail: "#E0C4F3",
    background: "#F8F5FB",
    text: "#2D1B3D"
  },

  // 2. Fortune Red - "发财红" (Fortune Red)
  fortuneRed: {
    name: "Fortune Red",
    chinese: "发财红", 
    primary: "#D85B72",
    secondary: "#EED8F6",
    root: "#D85B72",
    main: "#E08799",
    sub: "#E8A9B8",
    detail: "#F0CBD6", 
    background: "#FDF7F8",
    text: "#4A1B26"
  },

  // 3. Calm Green - "不焦虑" (No Anxiety)
  calmGreen: {
    name: "Calm Green", 
    chinese: "不焦虑",
    primary: "#6B8857",
    secondary: "#FAF2CB",
    root: "#6B8857", 
    main: "#87A574",
    sub: "#A3C291",
    detail: "#BFDFAE",
    background: "#F7FAF5",
    text: "#2D3A24"
  },

  // 4. Pine Green - "放青松" (Release Pine)
  pineGreen: {
    name: "Pine Green",
    chinese: "放青松",
    primary: "#518463", 
    secondary: "#EED8F6",
    root: "#518463",
    main: "#6FA080", 
    sub: "#8DBC9D",
    detail: "#ABD8BA",
    background: "#F5F9F7",
    text: "#1F3329"
  },

  // 5. Authentic Blue - "不摆蓝" (No Pretense Blue)
  authenticBlue: {
    name: "Authentic Blue",
    chinese: "不摆蓝",
    primary: "#4C697A",
    secondary: "#CDDAE2", 
    root: "#4C697A",
    main: "#6B8595",
    sub: "#8AA1B0",
    detail: "#A9BDCB",
    background: "#F5F7F9", 
    text: "#1E2A32"
  },

  // 6. Sugar Brown - "糖太棕" (Sugar Brown)
  sugarBrown: {
    name: "Sugar Brown",
    chinese: "糖太棕",
    primary: "#886441",
    secondary: "#EDCBB9",
    root: "#886441", 
    main: "#A58057",
    sub: "#C29C6D", 
    detail: "#DFB883",
    background: "#FBF8F5",
    text: "#3A2B1C"
  }
};

// Utility functions for theme management
export const getThemeColors = (themeName: keyof typeof MINDMAP_COLOR_SCHEMES) => {
  return MINDMAP_COLOR_SCHEMES[themeName] || MINDMAP_COLOR_SCHEMES.calmGreen;
};

export const generateCSSVariables = (themeName: keyof typeof MINDMAP_COLOR_SCHEMES) => {
  const theme = getThemeColors(themeName);
  return {
    '--color-primary': theme.primary,
    '--color-secondary': theme.secondary,
    '--color-root': theme.root,
    '--color-main': theme.main, 
    '--color-sub': theme.sub,
    '--color-detail': theme.detail,
    '--color-background': theme.background,
    '--color-text': theme.text
  };
};

export const COLOR_PALETTE_OPTIONS = Object.entries(MINDMAP_COLOR_SCHEMES).map(([key, theme]) => ({
  value: key,
  label: `${theme.name} (${theme.chinese})`,
  colors: {
    primary: theme.primary,
    secondary: theme.secondary
  }
}));

// React Flow node styling function
export const getNodeStyle = (category: string, colorScheme: keyof typeof MINDMAP_COLOR_SCHEMES) => {
  const theme = getThemeColors(colorScheme);
  
  const baseStyles = {
    borderRadius: category === 'root' ? '12px' : '8px',
    color: 'white',
    fontWeight: category === 'root' ? 'bold' : category === 'main' ? '600' : 'normal',
    fontSize: category === 'root' ? '16px' : category === 'main' ? '14px' : '12px',
    textAlign: 'center' as const,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    border: '2px solid rgba(255,255,255,0.2)',
    textShadow: '0 1px 2px rgba(0,0,0,0.3)'
  };

  const categoryStyles = {
    root: {
      ...baseStyles,
      backgroundColor: theme.root,
      padding: '12px 16px',
      minWidth: '160px',
      minHeight: '50px'
    },
    main: {
      ...baseStyles, 
      backgroundColor: theme.main,
      padding: '10px 14px',
      minWidth: '120px',
      minHeight: '40px'
    },
    sub: {
      ...baseStyles,
      backgroundColor: theme.sub,
      padding: '8px 12px', 
      minWidth: '100px',
      minHeight: '35px'
    },
    detail: {
      ...baseStyles,
      backgroundColor: theme.detail,
      padding: '6px 10px',
      minWidth: '80px', 
      minHeight: '30px',
      color: theme.text // Detail nodes use dark text for better readability
    }
  };

  return categoryStyles[category] || categoryStyles.main;
};

// Edge styling function
export const getEdgeStyle = (colorScheme: keyof typeof MINDMAP_COLOR_SCHEMES) => {
  const theme = getThemeColors(colorScheme);
  
  return {
    stroke: theme.main,
    strokeWidth: 2,
    markerEnd: {
      type: 'arrow' as const,
      color: theme.main
    }
  };
};
