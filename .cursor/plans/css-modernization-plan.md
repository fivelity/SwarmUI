# CSS Modernization Plan: Legacy Variable Migration

## Overview
Migrate all legacy CSS variables to modern Bootstrap 5.3 and design token standards. This will eliminate the compatibility layer and ensure the codebase uses a consistent, modern variable naming convention.

## Variable Migration Map

| Legacy Variable | Modern Replacement | Usage Count |
|----------------|-------------------|-------------|
| `--light-border` | `--bs-border-color` | ~30 |
| `--light-border-rgb` | `--bs-border-color-rgb` | 1 |
| `--emphasis` | `--bs-primary` | ~10 |
| `--background` | `--bs-body-bg` | 2 |
| `--background-soft` | `--bs-tertiary-bg` | 2 |
| `--text-soft` | `--bs-secondary-color` | 3 |
| `--text-strong` | `--bs-emphasis-color` | 0 |
| `--button-background` | `--btn-primary-bg` | 3 |
| `--button-text` | `--btn-primary-color` | 2 |
| `--button-border` | `--btn-primary-border` | 3 |
| `--button-background-hover` | `--btn-primary-hover-bg` | 2 |
| `--button-foreground-hover` | `--btn-primary-color` | 2 |
| `--button-background-disabled` | `--bs-secondary-bg` | 1 |
| `--button-foreground-disabled` | `--bs-secondary-color` | 1 |
| `--danger-button-background` | `--btn-danger-bg` | 0 |
| `--danger-button-background-hover` | `--bs-danger` | 2 |

## Files to Migrate

### 1. `src/wwwroot/css/genpage.css` - 45 usages
**Priority: HIGH** - Main page styling

### 2. `src/wwwroot/css/installer.css` - 8 usages
**Priority: MEDIUM** - Installer page styling

### 3. `src/wwwroot/css/color-system.css` - 20 usages
**Priority: HIGH** - Remove compatibility layer after migration

## Migration Strategy

### Phase 1: Automated Replacement
Use search-replace to systematically update all legacy variables:

```bash
# Replace in order (most specific first to avoid partial matches)
--button-background-disabled → --bs-secondary-bg
--button-background-hover → --btn-primary-hover-bg
--button-foreground-disabled → --bs-secondary-color
--button-foreground-hover → --btn-primary-color
--danger-button-background-hover → --bs-danger
--button-background → --btn-primary-bg
--button-border → --btn-primary-border
--button-text → --btn-primary-color
--light-border-rgb → --bs-border-color-rgb
--light-border → --bs-border-color
--background-soft → --bs-tertiary-bg
--text-strong → --bs-emphasis-color
--text-soft → --bs-secondary-color
--emphasis → --bs-primary
--background → --bs-body-bg
```

### Phase 2: Context-Specific Updates
Some usages may need semantic clarification:

- **Button states** - Ensure hover/disabled states use appropriate semantic tokens
- **Borders** - Consider if `--bs-border-color` or `--color-outline` is more appropriate
- **Emphasis colors** - Use `--bs-primary` for interactive elements, `--bs-emphasis-color` for text

### Phase 3: Cleanup
1. Remove legacy compatibility section from `color-system.css`
2. Update theme files if they override legacy variables
3. Run linter to catch any missed usages

## Benefits of Modernization

### 1. Consistency ✅
- Single source of truth for color/style tokens
- Easier for developers to know which variable to use
- Better IDE autocomplete support

### 2. Maintainability ✅
- Fewer variables to maintain
- Clear semantic naming (Bootstrap standard)
- No translation layer to update

### 3. Performance ✅
- Slightly fewer CSS variables defined
- No double-lookup (legacy → modern → value)
- Cleaner CSS output

### 4. Theme Integration ✅
- Themes override Bootstrap variables directly
- No need to maintain parallel legacy overrides
- Better compatibility with Bootstrap themes

## Specific Improvements

### Split Bars
**Before:**
```css
background-color: var(--light-border);
```

**After:**
```css
background-color: var(--bs-border-color);
```

### Hover States
**Before:**
```css
background-color: var(--emphasis);
```

**After:**
```css
background-color: var(--bs-primary);
```

### Button Components
**Before:**
```css
background-color: var(--button-background);
color: var(--button-text);
border: 1px solid var(--button-border);
```

**After:**
```css
background-color: var(--btn-primary-bg);
color: var(--btn-primary-color);
border: 1px solid var(--btn-primary-border);
```

### Text Emphasis
**Before:**
```css
color: var(--text-soft);
```

**After:**
```css
color: var(--bs-secondary-color);
```

## Edge Cases to Consider

### 1. Theme Overrides
Check if any themes in `src/wwwroot/css/themes/` override legacy variables:
- If yes, migrate theme overrides to Bootstrap variables
- Ensure theme compatibility maintained

### 2. JavaScript References
Check if JavaScript references these CSS variables:
- Search for `getComputedStyle` or `getPropertyValue` calls
- Update any hardcoded variable names

### 3. Dynamic Styles
Some styles may be applied via JavaScript:
- Check `style.setProperty` calls
- Update to use modern variable names

## Testing Checklist

After migration:
- [ ] Visual regression test on Generate page
- [ ] Test all themes (default light/dark, custom themes)
- [ ] Check installer page rendering
- [ ] Verify split bars still function correctly
- [ ] Test button hover/disabled states
- [ ] Check browser compatibility
- [ ] Validate no console errors about undefined variables

## Rollback Plan

If issues arise:
1. Changes are isolated to CSS files
2. Git revert specific commits
3. Restore legacy compatibility layer temporarily

## Timeline

- **Phase 1** (Automated): 30 minutes
- **Phase 2** (Context review): 1 hour
- **Phase 3** (Cleanup & testing): 1 hour
- **Total**: ~2.5 hours

## Success Criteria

✅ All legacy variables replaced with modern equivalents  
✅ No visual regressions  
✅ All themes work correctly  
✅ Linter shows zero CSS variable errors  
✅ Legacy compatibility layer removed  
✅ Documentation updated to reference modern variables

