# Enhanced Theming System with Bootstrap 5.3.8

This document explains how to use and extend the new multiple dark/light theme system built on Bootstrap 5.3.8.

## Overview

The enhanced theming system provides:
- **Multiple dark themes**: Cyber Noir, Midnight Dystopia, Sentinel, Modern Dark
- **Multiple light themes**: Solarized Light, Eyesear White, Modern Light  
- **CSS Custom Properties**: Uses Bootstrap 5.3.8's native theming system
- **Dynamic switching**: Real-time theme changes without page reload
- **Backward compatibility**: Legacy themes still work

## How It Works

### 1. HTML Attributes
The system uses two HTML attributes on the `<html>` element:
- `data-bs-theme`: Controls Bootstrap's light/dark mode (`"light"` or `"dark"`)
- `data-theme`: Controls the specific theme variant (e.g., `"cyber_noir"`)

```html
<html data-bs-theme="dark" data-theme="cyber_noir">
```

### 2. CSS Custom Properties
Each theme overrides Bootstrap's CSS custom properties:

```css
[data-bs-theme="dark"][data-theme="cyber_noir"] {
  --bs-primary: #00ff41;
  --bs-body-bg: #0a0a0a;
  --bs-body-color: #00ff41;
  /* ... more overrides */
}
```

### 3. Theme Registration
Themes are registered in `src/Core/WebServer.cs`:

```csharp
RegisterTheme(new("cyber_noir", "Cyber Noir (Bootstrap 5.3.8)", ["css/themes/bootstrap-themes.css"], true));
```

## Available Themes

### Dark Themes
- **Modern Dark**: Default Bootstrap dark theme
- **Cyber Noir**: Green/cyan cyberpunk aesthetic
- **Midnight Dystopia**: Purple/blue dystopian theme
- **Sentinel**: Blue/gray professional theme

### Light Themes  
- **Modern Light**: Default Bootstrap light theme
- **Solarized Light**: Solarized color palette
- **Eyesear White**: Clean, minimal white theme

## Usage

### 1. JavaScript API
```javascript
// Get the theme switcher instance
const switcher = window.themeSwitcher;

// Apply a specific theme
switcher.applyTheme('cyber_noir');

// Toggle between light/dark variants
switcher.toggleLightDark();

// Get available themes
const themes = switcher.getAvailableThemes();

// Create a theme selector dropdown
switcher.createThemeSelector('theme-selector-container');
```

### 2. Event Listeners
```javascript
// Listen for theme changes
document.addEventListener('themeChanged', (event) => {
    console.log('Theme changed to:', event.detail.themeId);
});

// Request a theme change
document.dispatchEvent(new CustomEvent('themeChangeRequested', {
    detail: { themeId: 'cyber_noir' }
}));
```

### 3. CSS Classes
The system automatically applies theme-specific classes:
```css
/* Cyber Noir specific styles */
[data-bs-theme="dark"][data-theme="cyber_noir"] .btn-primary {
  background: linear-gradient(45deg, #00ff41, #00ffff);
  border: 1px solid #00ff41;
  color: #0a0a0a;
}
```

## Creating New Themes

### 1. Add CSS Custom Properties
In `src/wwwroot/css/themes/bootstrap-themes.css`:

```css
/* Your new dark theme */
[data-bs-theme="dark"][data-theme="your_theme"] {
  --bs-primary: #your-color;
  --bs-secondary: #your-secondary;
  --bs-body-bg: #your-background;
  --bs-body-color: #your-text;
  /* Override other Bootstrap variables as needed */
}

/* Your new light theme */
[data-bs-theme="light"][data-theme="your_light_theme"] {
  --bs-primary: #your-light-color;
  --bs-body-bg: #your-light-background;
  /* ... */
}
```

### 2. Register the Theme
In `src/Core/WebServer.cs`:

```csharp
RegisterTheme(new("your_theme", "Your Theme Name", ["css/themes/bootstrap-themes.css"], true));
RegisterTheme(new("your_light_theme", "Your Light Theme", ["css/themes/bootstrap-themes.css"], false));
```

### 3. Add to JavaScript
In `src/wwwroot/js/theme-switcher.js`, update the `getThemeData()` method:

```javascript
const themes = {
    // ... existing themes
    'your_theme': { isDark: true, name: 'Your Theme' },
    'your_light_theme': { isDark: false, name: 'Your Light Theme' }
};
```

## Advanced Features

### 1. Component-Specific Styling
You can create theme-specific component overrides:

```css
[data-bs-theme="dark"][data-theme="cyber_noir"] .navbar {
  background: linear-gradient(90deg, #0a0a0a 0%, #1a1a1a 100%);
  border-bottom: 1px solid #00ff41;
}

[data-bs-theme="dark"][data-theme="cyber_noir"] .btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 0 10px #00ff41;
}
```

### 2. Responsive Theme Adjustments
```css
@media (prefers-color-scheme: light) {
  [data-bs-theme="auto"][data-theme="modern_light"] {
    /* Auto theme respects system preference */
  }
}
```

### 3. Theme Transitions
Add smooth transitions between themes:

```css
* {
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
}
```

## Migration from Legacy Themes

Legacy themes continue to work alongside the new system. To migrate a legacy theme:

1. **Extract color values** from your legacy CSS
2. **Convert to CSS custom properties** using Bootstrap's variable names
3. **Add theme-specific overrides** for components
4. **Register the new theme** in WebServer.cs
5. **Test thoroughly** to ensure all components work

## Best Practices

1. **Use semantic color names**: `--bs-primary`, `--bs-success`, etc.
2. **Maintain contrast ratios**: Ensure accessibility compliance
3. **Test all components**: Buttons, forms, modals, navigation
4. **Provide light/dark variants**: Users expect both options
5. **Use consistent naming**: Follow the `theme_name` pattern
6. **Document your themes**: Include color palettes and use cases

## Troubleshooting

### Theme not applying?
- Check that the theme is registered in `WebServer.cs`
- Verify the CSS selector matches your theme ID
- Ensure the `data-theme` attribute is set correctly

### Colors not updating?
- Make sure you're overriding the correct CSS custom properties
- Check for CSS specificity issues
- Verify the theme CSS file is loading

### JavaScript errors?
- Ensure `theme-switcher.js` is loaded after Bootstrap
- Check that the theme ID exists in the `getThemeData()` method
- Verify event listeners are properly attached

## Performance Considerations

- **Single CSS file**: All themes use one `bootstrap-themes.css` file
- **CSS Custom Properties**: Faster than multiple CSS files
- **Lazy loading**: Themes only load when needed
- **Caching**: Browser caches the theme CSS file
- **Minimal JavaScript**: Lightweight theme switching logic
