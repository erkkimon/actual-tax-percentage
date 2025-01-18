interface ThemeColors {
    background: string;
    primary: string;
    secondary: string;
    text: string;
    textSecondary: string;
    graphColors: string[];
}

interface ThemeFonts {
    primary: string;
}

interface ThemeSpacing {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    xxl: string;
}

interface ThemeBreakpoints {
    mobile: string;
    tablet: string;
    desktop: string;
}

interface ThemeTransitions {
    fast: string;
    normal: string;
    slow: string;
}

interface ThemeShadows {
    glow: string;
    glowSecondary: string;
}

export interface Theme {
    colors: ThemeColors;
    fonts: ThemeFonts;
    spacing: ThemeSpacing;
    breakpoints: ThemeBreakpoints;
    transitions: ThemeTransitions;
    shadows: ThemeShadows;
}

export const theme: Theme = {
    colors: {
        background: '#0A0A0A',
        primary: '#00FF94',
        secondary: '#FF00E5',
        text: '#FFFFFF',
        textSecondary: '#B3B3B3',
        graphColors: [
            '#00FF94',  // Primary
            '#FF00E5',  // Secondary
            '#00E5FF',  // Cyan
            '#FFE500',  // Yellow
            '#FF8A00',  // Orange
            '#FF0000',  // Red
            '#B3B3B3',  // Gray
        ]
    },
    fonts: {
        primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    },
    spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        xxl: '3rem'
    },
    breakpoints: {
        mobile: '480px',
        tablet: '768px',
        desktop: '1024px'
    },
    transitions: {
        fast: '0.2s',
        normal: '0.3s',
        slow: '0.5s'
    },
    shadows: {
        glow: '0 0 20px rgba(0, 255, 148, 0.3)',
        glowSecondary: '0 0 20px rgba(255, 0, 229, 0.3)'
    }
};