# SwarmUI Design System

## Overview

SwarmUI now uses a comprehensive design system built on modern CSS architecture principles. This system provides consistent styling, maintainability, and scalability across the entire application.

## Architecture

The design system follows a layered architecture:

```
main.css (entry point)
├── design-tokens.css (foundational variables)
├── color-system.css (comprehensive color palette)  
├── components.css (component-specific styles)
├── Bootstrap 5.3.2 (framework base)
└── theme.css (theme overrides)
```

## Key Files

### 1. `/css/main.css`
**Central entry point** - Imports all design system files and provides:
- Layout utilities and grid systems
- Page-specific styles
- Utility classes
- Responsive breakpoints
- Animation definitions

### 2. `/css/design-tokens.css`
**Foundation layer** - Defines core design tokens:
- Spacing scale (space-0 to space-96)
- Typography scale (text-xs to text-9xl)
- Font weights and line heights
- Border radii (radius-none to radius-3xl)
- Shadow definitions (shadow-xs to shadow-2xl)
- Animation timing and easing
- Z-index layers
- Container and layout tokens

### 3. `/css/color-system.css`
**Color foundation** - Comprehensive color system:
- Light and dark theme support
- Semantic color tokens (success, warning, error, info)
- Component-specific color tokens
- State colors (hover, active, disabled)
- Utility classes for text, backgrounds, and borders

### 4. `/css/components.css`
**Component layer** - Systematic component styles:
- Button variants and sizes
- Form controls and inputs
- Cards and modals
- Navigation components
- Status indicators
- Browser/explorer components
- Utility components (spinners, progress bars)

### 5. `/css/theme.css`
**Theme overrides** - Theme-specific customizations:
- Font stack overrides
- Density modes (compact)
- Bootstrap integration
- Theme-specific color mappings

## Design Tokens

### Spacing Scale
```css
--space-0: 0;
--space-px: 1px;
--space-0_5: 0.125rem;  /* 2px */
--space-1: 0.25rem;     /* 4px */
--space-1_5: 0.375rem;  /* 6px */
--space-2: 0.5rem;      /* 8px */
--space-2_5: 0.625rem;  /* 10px */
--space-3: 0.75rem;     /* 12px */
--space-4: 1rem;        /* 16px */
--space-5: 1.25rem;     /* 20px */
--space-6: 1.5rem;      /* 24px */
--space-8: 2rem;        /* 32px */
--space-10: 2.5rem;     /* 40px */
--space-12: 3rem;       /* 48px */
/* ... up to space-96 */
```

### Typography Scale
```css
--text-xs: 0.75rem;     /* 12px */
--text-sm: 0.875rem;    /* 14px */
--text-base: 1rem;      /* 16px */
--text-lg: 1.125rem;    /* 18px */
--text-xl: 1.25rem;     /* 20px */
--text-2xl: 1.5rem;     /* 24px */
--text-3xl: 1.875rem;   /* 30px */
/* ... up to text-9xl */
```

### Border Radii
```css
--radius-none: 0;
--radius-sm: 0.125rem;   /* 2px */
--radius-md: 0.375rem;   /* 6px */
--radius-lg: 0.5rem;     /* 8px */
--radius-xl: 0.75rem;    /* 12px */
--radius-2xl: 1rem;      /* 16px */
--radius-3xl: 1.5rem;    /* 24px */
--radius-full: 9999px;
```

### Shadows
```css
--shadow-xs: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
--shadow-current: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
--shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);
```

## Color System

### Semantic Colors
- `--color-success`: Success states (green)
- `--color-warning`: Warning states (yellow/orange) 
- `--color-error`: Error states (red)
- `--color-info`: Information states (blue)

### Component Colors
- Button colors (`--btn-primary-bg`, `--btn-secondary-bg`, etc.)
- Form colors (`--input-bg`, `--input-border`, `--input-focus-ring`, etc.)
- Card colors (`--card-bg`, `--card-border`, `--card-header-bg`, etc.)
- Modal colors (`--modal-bg`, `--modal-border`, `--modal-backdrop`, etc.)

### State Colors
- Hover states (`--item-hover`)
- Active/selected states (`--item-selected`, `--item-selected-border`)
- Validation states (`--valid-bg`, `--invalid-bg`, etc.)

## Component Classes

### Buttons
```css
.btn              /* Base button with design tokens */
.btn-sm           /* Small button */
.btn-lg           /* Large button */
.btn-xl           /* Extra large button */
.btn-primary      /* Primary button variant */
.btn-secondary    /* Secondary button variant */
.btn-success      /* Success button variant */
.btn-danger       /* Danger button variant */
.btn-warning      /* Warning button variant */
```

### Form Controls
```css
.form-control     /* Input fields using design tokens */
.form-select      /* Select dropdowns */
.form-control-sm  /* Small form controls */
.form-control-lg  /* Large form controls */
```

### Cards
```css
.card             /* Card container with elevation */
.card-header      /* Card header section */
.card-body        /* Card body content */
.card-footer      /* Card footer section */
```

### Status Indicators
```css
.status-indicator /* Base status indicator */
.status-success   /* Success status */
.status-warning   /* Warning status */
.status-error     /* Error status */
.status-idle      /* Idle status */
.status-loading   /* Loading status */
```

## Utility Classes

### Spacing
```css
.m-0, .m-1, .m-2, .m-3, .m-4, .m-6, .m-8  /* Margin utilities */
.p-0, .p-1, .p-2, .p-3, .p-4, .p-6, .p-8  /* Padding utilities */
```

### Typography
```css
.text-xs, .text-sm, .text-base, .text-lg, .text-xl, .text-2xl  /* Font sizes */
.font-normal, .font-medium, .font-semibold, .font-bold        /* Font weights */
```

### Border Radius
```css
.rounded-none, .rounded-sm, .rounded, .rounded-lg, .rounded-xl, .rounded-full
```

### Shadows
```css
.shadow-none, .shadow-xs, .shadow-sm, .shadow, .shadow-md, .shadow-lg, .shadow-xl, .shadow-2xl
```

## Layout System

### Grid Layout
```css
.layout-container  /* Responsive container */
.layout-grid       /* Grid layout with gaps */
.layout-flex       /* Flex layout with gaps */
.layout-sidebar    /* Sidebar layout */
.layout-main       /* Main content area */
```

### Generate Page Layout
```css
.generate-layout   /* 3-column generate page grid */
.generate-tabs-bar /* Bottom tabs bar for generate page */
```

## Migration Guide

### From Hard-coded Values
```css
/* Before */
.my-component {
  padding: 16px;
  border-radius: 8px;
  font-size: 14px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* After */
.my-component {
  padding: var(--space-4);
  border-radius: var(--radius-lg);
  font-size: var(--text-sm);
  box-shadow: var(--shadow-sm);
}
```

### From Bootstrap Classes to Design Tokens
```css
/* Before */
.custom-card {
  background-color: var(--bs-secondary-bg);
  border: 1px solid var(--bs-border-color);
  border-radius: 0.5rem;
}

/* After */
.custom-card {
  background-color: var(--card-bg);
  border: var(--card-border-width) solid var(--card-border);
  border-radius: var(--card-radius);
}
```

## Theme Support

The design system fully supports light and dark themes through CSS custom properties. Theme switching is handled automatically through Bootstrap's `data-bs-theme` attribute.

### Dark Theme
- Default theme for SwarmUI
- Carefully chosen colors for optimal contrast
- Proper semantic color mapping

### Light Theme  
- Alternative theme option
- Maintains semantic color relationships
- Automatic contrast adjustments

### Compact Density Mode
Activated via `data-density="compact"` attribute:
- Tighter spacing scale
- Smaller button padding
- Reduced form control padding
- Optimized for smaller screens or dense layouts

## Performance Optimizations

- **CSS Custom Properties**: Efficient theme switching
- **Modular Architecture**: Only load what you need
- **Consistent Token Usage**: Better compression and caching
- **Minimal Specificity**: Easier overrides and maintenance

## Best Practices

1. **Always use design tokens** instead of hard-coded values
2. **Prefer semantic tokens** over generic ones when available
3. **Use component classes** for consistent styling
4. **Follow the spacing scale** for consistent rhythm
5. **Test in both themes** and compact density mode
6. **Validate contrast ratios** for accessibility

## File Import Order

When adding CSS files to the layout, maintain this order:
1. `main.css` (includes all design system files)
2. `theme.css` (theme-specific overrides)
3. Page-specific CSS files (if needed)

## Browser Support

- Modern browsers with CSS Custom Properties support
- Fallbacks provided where necessary
- Progressive enhancement approach

## Maintenance

The design system is designed for easy maintenance:
- Centralized token definitions
- Clear component boundaries  
- Minimal style duplication
- Consistent naming conventions

For questions or contributions to the design system, ensure all changes maintain consistency with the established token system and component architecture.