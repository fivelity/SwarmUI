# Comprehensive Plan to Fix UI Rendering Issues

## **Root Cause Analysis**

Based on the image description and codebase analysis, the "wacky" rendering issues are caused by:

1. **Horizontal and vertical gray lines cutting across UI elements** - These appear to be unintended border artifacts
2. **Text clipping and alignment issues** - Layout calculation problems
3. **Misplaced visual elements** - CSS conflicts between the new design system and legacy styles

## **Phase 1: CSS Architecture Audit**

### **1.1 Design System Conflicts**
- **Issue**: The new design system (`main.css`, `components.css`, `design-tokens.css`) may be conflicting with legacy styles
- **Action**: Audit CSS cascade and identify conflicting rules
- **Files to examine**:
  - `src/wwwroot/css/main.css` (new design system)
  - `src/wwwroot/css/site.css` (legacy styles)
  - `src/wwwroot/css/genpage.css` (page-specific styles)
  - `src/wwwroot/css/components.css` (component system)

### **1.2 Border and Line Artifacts**
- **Issue**: Unintended borders and lines appearing as visual glitches
- **Action**: Identify and fix CSS rules causing unwanted borders
- **Key areas**:
  - Split bar styling in `layout.js`
  - Border conflicts in `genpage.css`
  - Theme-specific border overrides

## **Phase 2: Layout System Investigation**

### **2.1 Three-Column Layout Analysis**
- **Issue**: The main layout uses a complex three-column system with split bars
- **Action**: Examine layout calculation logic
- **Key files**:
  - `src/wwwroot/js/genpage/gentab/layout.js` (layout management)
  - `src/wwwroot/css/main.css` (grid system)
  - `src/wwwroot/css/genpage.css` (layout overrides)

### **2.2 Split Bar System**
- **Issue**: Split bars may be rendering incorrectly or at wrong positions
- **Action**: Audit split bar positioning and styling
- **Elements to check**:
  - `t2i-top-split-bar` (left sidebar splitter)
  - `t2i-top-2nd-split-bar` (right sidebar splitter)  
  - `t2i-mid-split-bar` (bottom section splitter)

## **Phase 3: Specific Issue Resolution**

### **3.1 Horizontal Line Issues**
- **Problem**: Lines cutting through "Batch" label and progress bar
- **Root Cause**: Likely CSS border conflicts or split bar misalignment
- **Solution**: 
  - Check `.bottom-info-bar-container` and `.bottom-info-bar-component` styles
  - Verify split bar positioning calculations
  - Fix border inheritance issues

### **3.2 Vertical Line Issues**
- **Problem**: Vertical lines in content areas
- **Root Cause**: Browser container or split bar rendering issues
- **Solution**:
  - Check `.browser-folder-tree-splitter` styling
  - Verify `.browser_container` border rules
  - Fix split bar width calculations

### **3.3 Text Clipping and Alignment**
- **Problem**: Text being cut off or misaligned
- **Root Cause**: Container width constraints or flex/grid calculation issues
- **Solution**:
  - Check input field width calculations
  - Verify flex/grid container sizing
  - Fix text overflow handling

## **Phase 4: CSS Specificity and Cascade Fixes**

### **4.1 CSS Specificity Conflicts**
- **Issue**: New design system rules may be overridden by legacy styles
- **Action**: 
  - Audit CSS specificity hierarchy
  - Add `!important` declarations where necessary
  - Reorganize CSS import order

### **4.2 Theme System Integration**
- **Issue**: Theme-specific styles may be conflicting
- **Action**:
  - Check theme CSS files for border/line overrides
  - Verify theme switching doesn't break layout
  - Fix theme-specific border artifacts

## **Phase 5: JavaScript Layout Logic**

### **5.1 Layout Calculation Issues**
- **Issue**: JavaScript layout calculations may be incorrect
- **Action**: 
  - Audit `GenTabLayout` class methods
  - Check split bar positioning logic
  - Verify responsive layout calculations

### **5.2 Dynamic Style Application**
- **Issue**: JavaScript may be applying incorrect styles
- **Action**:
  - Check style application in `layout.js`
  - Verify dynamic class toggling
  - Fix style calculation timing

## **Phase 6: Testing and Validation**

### **6.1 Cross-Browser Testing**
- **Action**: Test rendering in different browsers
- **Focus**: Chrome, Firefox, Safari, Edge

### **6.2 Responsive Layout Testing**
- **Action**: Test at different screen sizes
- **Focus**: Mobile, tablet, desktop breakpoints

### **6.3 Theme Switching Testing**
- **Action**: Test all available themes
- **Focus**: Dark/light theme transitions

## **Implementation Priority**

1. **High Priority**: Fix horizontal/vertical line artifacts (immediate visual impact)
2. **Medium Priority**: Resolve text clipping and alignment issues
3. **Low Priority**: Optimize layout calculations and responsive behavior

## **Expected Outcomes**

- **Eliminate**: All unintended horizontal and vertical lines
- **Fix**: Text clipping and alignment issues
- **Improve**: Overall layout stability and consistency
- **Ensure**: Proper theme switching without visual artifacts

## **Key Files to Investigate**

### **CSS Files**
- `src/wwwroot/css/main.css` - Design system entry point
- `src/wwwroot/css/site.css` - Legacy styles with potential conflicts
- `src/wwwroot/css/genpage.css` - Page-specific layout styles
- `src/wwwroot/css/components.css` - Component system
- `src/wwwroot/css/design-tokens.css` - Design tokens
- `src/wwwroot/css/color-system.css` - Color system
- `src/wwwroot/css/theme.css` - Theme overrides

### **JavaScript Files**
- `src/wwwroot/js/genpage/gentab/layout.js` - Layout management
- `src/wwwroot/js/genpage/main.js` - Main page logic
- `src/wwwroot/js/site.js` - Site-wide JavaScript

### **HTML Structure**
- `src/Pages/Shared/_Layout.cshtml` - Main layout template
- Generate page HTML structure for three-column layout

## **Specific CSS Rules to Check**

### **Border-Related Issues**
```css
/* Check for conflicting border rules */
.border, .border-1, .border-top, .border-bottom, .border-left, .border-right
.splitter-bar, .split-bar
.browser-folder-tree-splitter
.bottom-info-bar-container
.bottom-info-bar-component
```

### **Layout-Related Issues**
```css
/* Check for layout calculation problems */
.d-flex, .flex-column, .h-100
.grid, .grid-template-columns
.calc(), minmax(), fr units
```

### **Text Clipping Issues**
```css
/* Check for text overflow problems */
.text-overflow, .overflow-hidden, .overflow-x, .overflow-y
.white-space, .word-break
.width, .max-width, .min-width
```

This plan provides a systematic approach to identifying and resolving the core rendering issues while maintaining the existing functionality and design system architecture.
