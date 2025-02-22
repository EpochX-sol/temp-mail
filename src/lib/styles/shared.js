export const SHARED_STYLES = {
    // Theme Colors
    COLORS: {
        HEADER_BG: "#0b0c10",
        PRIMARY_TEXT: "#ffffff",
        SECONDARY_TEXT: "#9ca3af",
        HIGHLIGHT: "#0D6EFD",
        HIGHLIGHT_DARK: "#0056b3",
        BORDER: "#e0e0e0",
        SUCCESS: {
            BG: "#d4edda",
            BORDER: "#c3e6cb",
            TEXT: "#155724"
        },
        ERROR: {
            BG: "#f8d7da",
            BORDER: "#f5c6cb",
            TEXT: "#721c24"
        },
        DARK: {
            BG_PAGE: "#111827",
            BG_PRIMARY: "#1f2937",
            BG_SECONDARY: "#374151",
            TEXT_PRIMARY: "#f3f4f6",
            TEXT_SECONDARY: "#e5e7eb"
        },
        LIGHT: {
            BG_PAGE: "#f9f9f9",
            BG_PRIMARY: "#ffffff",
            BG_SECONDARY: "#f3f4f6",
            TEXT_PRIMARY: "#111827",
            TEXT_SECONDARY: "#4b5563"
        }
    },

    // Typography
    TYPOGRAPHY: {
        FONT_FAMILY: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        SIZES: {
            H1: "2.5rem",
            H2: "2rem",
            H3: "1.25rem",
            BODY: "1rem",
            SMALL: "0.95rem"
        }
    },

    // Spacing
    SPACING: {
        XS: "4px",
        SM: "8px",
        MD: "16px",
        LG: "24px",
        XL: "32px",
        XXL: "48px"
    },

    // Common Components
    COMPONENTS: {
        CARD: {
            BORDER_RADIUS: "8px",
            SHADOW: "0 2px 5px rgba(0, 0, 0, 0.1)",
            SHADOW_HOVER: "0 4px 10px rgba(0, 0, 0, 0.2)",
            PADDING: "20px"
        },
        HEADER: {
            PADDING: "60px 20px",
            MAX_WIDTH: "800px"
        },
        BUTTON: {
            BORDER_RADIUS: "6px",
            PADDING: "12px 24px",
            TRANSITION: "all 0.2s ease"
        },
        FORM: {
            INPUT_PADDING: "12px",
            INPUT_BORDER_RADIUS: "6px",
            FOCUS_SHADOW: "0 0 0 2px rgba(13, 110, 253, 0.25)"
        }
    },

    // Animations
    ANIMATIONS: {
        TRANSITION_SPEED: "0.2s",
        HOVER_TRANSFORM: "translateY(-5px)"
    },

    // Media Queries
    BREAKPOINTS: {
        MOBILE: "768px",
        TABLET: "1024px",
        DESKTOP: "1200px"
    },

    // CSS Variables
    CSS_VARS: {
        '--header-bg': '#0b0c10',
        '--header-padding': '60px 20px',
        '--header-max-width': '800px',
        '--card-border-radius': '8px',
        '--card-shadow': '0 2px 5px rgba(0, 0, 0, 0.1)',
        '--card-shadow-hover': '0 4px 10px rgba(0, 0, 0, 0.2)',
        '--spacing-sm': '8px',
        '--spacing-md': '16px',
        '--spacing-lg': '24px',
        '--spacing-xl': '32px',
        '--spacing-xxl': '48px',
        '--font-size-h1': '2.5rem',
        '--font-size-h2': '2rem',
        '--font-size-h3': '1.25rem',
        '--font-size-body': '1rem',
        '--mobile-breakpoint': '768px'
    },

    // Common CSS Classes as static strings
    CSS: {
        PAGE_CONTAINER: `
            min-height: 100vh;
            background: var(--bg-page);
            color: var(--text-primary);
        `,
        HEADER: `
            background-color: var(--header-bg);
            padding: var(--header-padding);
            text-align: center;
            color: white;
            width: 100%;
        `,
        HEADER_CONTENT: `
            max-width: var(--header-max-width);
            margin: 0 auto;
        `,
        HEADER_TITLE: `
            font-size: var(--font-size-h1);
            margin: 0;
            color: white;
            font-weight: 600;
        `,
        HEADER_SUBTITLE: `
            color: var(--secondary-text);
            font-size: 1.1rem;
            margin-top: 12px;
        `,
        CARD: `
            background: var(--bg-primary);
            border: 1px solid var(--border-color);
            border-radius: var(--card-border-radius);
            padding: 20px;
            transition: transform 0.2s;
            box-shadow: var(--card-shadow);
        `,
        BUTTON_PRIMARY: `
            background: var(--highlight-color);
            color: white;
            padding: 12px 24px;
            border: none;
            border-radius: 6px;
            font-size: 1.1rem;
            cursor: pointer;
            transition: all 0.2s ease;
            font-weight: 500;
        `,
        GRID: `
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 20px;
        `
    },

    // Mobile Styles
    MOBILE: {
        HEADER: `
            padding: 40px 0;
        `,
        HEADER_TITLE: `
            font-size: 2rem;
        `,
        CONTENT_PADDING: `
            padding: 20px;
        `
    }
}; 