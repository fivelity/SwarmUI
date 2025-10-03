/**
 * Bootstrap 5.3.8 Enhanced Theme Switcher
 * Provides utilities for managing multiple dark/light themes
 */

class ThemeSwitcher {
    constructor() {
        this.currentTheme = this.getCurrentTheme();
        this.init();
    }

    /**
     * Initialize the theme switcher
     */
    init() {
        this.applyTheme(this.currentTheme);
        this.setupEventListeners();
    }

    /**
     * Get the current theme from cookie or default
     */
    getCurrentTheme() {
        const cookie = this.getCookie('sui_theme_id');
        return cookie || 'modern_dark';
    }

    /**
     * Set a cookie
     */
    setCookie(name, value, days = 365) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
    }

    /**
     * Get a cookie value
     */
    getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    /**
     * Apply a theme by ID
     */
    applyTheme(themeId) {
        // Get theme data from the server (this would need to be available via API)
        let theme = this.getThemeData(themeId);
        if (!theme) {
            console.warn(`Theme ${themeId} not found, falling back to modern_dark`);
            themeId = 'modern_dark';
            theme = this.getThemeData(themeId);
        }

        // Update HTML attributes
        document.documentElement.setAttribute('data-bs-theme', theme.isDark ? 'dark' : 'light');
        document.documentElement.setAttribute('data-theme', themeId);

        // Update cookie
        this.setCookie('sui_theme_id', themeId);

        // Update theme-specific CSS
        this.updateThemeCSS(theme);

        // Store current theme
        this.currentTheme = themeId;

        // Dispatch theme change event
        document.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { themeId, theme }
        }));
    }

    /**
     * Get theme data (this would typically come from an API)
     */
    getThemeData(themeId) {
        // This is a simplified version - in reality, you'd get this from the server
        const themes = {
            'modern_dark': { isDark: true, name: 'Modern Dark' },
            'modern_light': { isDark: false, name: 'Modern Light' },
            'cyber_noir': { isDark: true, name: 'Cyber Noir' },
            'midnight_dystopia': { isDark: true, name: 'Midnight Dystopia' },
            'sentinel': { isDark: true, name: 'Sentinel' },
            'solarized': { isDark: false, name: 'Solarized Light' },
            'eyesear_white': { isDark: false, name: 'Eyesear White' },
            // Legacy themes
            'dark_dreams': { isDark: true, name: 'Dark Dreams (Legacy)' },
            'gravity_blue': { isDark: true, name: 'Gravity Blue (Legacy)' },
            'cyber_swarm': { isDark: true, name: 'Cyber Swarm (Legacy)' },
            'punked': { isDark: true, name: 'Punked (Legacy)' },
            'swarmpunk': { isDark: true, name: 'Swarm Punk' },
            'beweish': { isDark: true, name: 'Beweish' },
            'custom-theme': { isDark: true, name: 'Synthwave' },
            'terminal-shock': { isDark: true, name: 'Terminal Shock' }
        };
        return themes[themeId] || null;
    }

    /**
     * Update theme-specific CSS
     */
    updateThemeCSS(theme) {
        // Remove existing theme CSS
        const existingThemeCSS = document.querySelectorAll('.theme_sheet_header');
        existingThemeCSS.forEach(link => link.remove());

        // Add new theme CSS if needed
        if (theme.cssPaths && theme.cssPaths.length > 0) {
            theme.cssPaths.forEach(path => {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = path;
                link.className = 'theme_sheet_header';
                document.head.appendChild(link);
            });
        }
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Listen for theme change events from other components
        document.addEventListener('themeChangeRequested', (event) => {
            this.applyTheme(event.detail.themeId);
        });

        // Listen for system theme changes
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                if (this.currentTheme === 'auto') {
                    this.applyTheme(e.matches ? 'modern_dark' : 'modern_light');
                }
            });
        }
    }

    /**
     * Toggle between light and dark variants of current theme
     */
    toggleLightDark() {
        const currentTheme = this.currentTheme;
        const isDark = document.documentElement.getAttribute('data-bs-theme') === 'dark';
        
        // Find the opposite variant
        let newTheme;
        if (currentTheme.includes('_dark')) {
            newTheme = currentTheme.replace('_dark', '_light');
        } else if (currentTheme.includes('_light')) {
            newTheme = currentTheme.replace('_light', '_dark');
        } else {
            // For themes without _dark/_light suffix, toggle the base theme
            newTheme = isDark ? 'modern_light' : 'modern_dark';
        }

        this.applyTheme(newTheme);
    }

    /**
     * Get available themes
     */
    getAvailableThemes() {
        return [
            { id: 'modern_dark', name: 'Modern Dark', isDark: true },
            { id: 'modern_light', name: 'Modern Light', isDark: false },
            { id: 'cyber_noir', name: 'Cyber Noir', isDark: true },
            { id: 'midnight_dystopia', name: 'Midnight Dystopia', isDark: true },
            { id: 'sentinel', name: 'Sentinel', isDark: true },
            { id: 'solarized', name: 'Solarized Light', isDark: false },
            { id: 'eyesear_white', name: 'Eyesear White', isDark: false },
            // Legacy themes
            { id: 'dark_dreams', name: 'Dark Dreams (Legacy)', isDark: true },
            { id: 'gravity_blue', name: 'Gravity Blue (Legacy)', isDark: true },
            { id: 'cyber_swarm', name: 'Cyber Swarm (Legacy)', isDark: true },
            { id: 'punked', name: 'Punked (Legacy)', isDark: true },
            { id: 'swarmpunk', name: 'Swarm Punk', isDark: true },
            { id: 'beweish', name: 'Beweish', isDark: true },
            { id: 'custom-theme', name: 'Synthwave', isDark: true },
            { id: 'terminal-shock', name: 'Terminal Shock', isDark: true }
        ];
    }

    /**
     * Create a theme selector dropdown
     */
    createThemeSelector(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const select = document.createElement('select');
        select.className = 'form-select';
        select.id = 'theme-selector';

        const themes = this.getAvailableThemes();
        themes.forEach(theme => {
            const option = document.createElement('option');
            option.value = theme.id;
            option.textContent = theme.name;
            if (theme.id === this.currentTheme) {
                option.selected = true;
            }
            select.appendChild(option);
        });

        select.addEventListener('change', (e) => {
            this.applyTheme(e.target.value);
        });

        container.appendChild(select);
    }
}

// Initialize theme switcher when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.themeSwitcher = new ThemeSwitcher();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeSwitcher;
}
