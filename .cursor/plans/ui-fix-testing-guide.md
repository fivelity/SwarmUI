# UI Fix Testing Guide

## Quick Visual Inspection

After starting the application, perform these quick checks on the Generate page:

### 1. Check for Line Artifacts (HIGHEST PRIORITY)

#### Horizontal Lines ❌ Should NOT appear:
- [ ] No line cutting through the "Batch" label
- [ ] No line across the progress bar area
- [ ] No line at the top of the bottom navigation tabs
- [ ] No line separating bottom info bar components (subtle dividers OK)

#### Vertical Lines ❌ Should NOT appear:
- [ ] No thick vertical lines in the browser content area
- [ ] No vertical lines in the image display area
- [ ] No vertical lines in the parameter sidebar

### 2. Check Split Bars ✅ SHOULD appear:

#### What Split Bars Look Like:
- Subtle gray lines (5px wide/tall)
- Become highlighted when you hover over them
- Change cursor to resize icon on hover (⟷ or ↕)

#### Split Bars to Verify:
- [ ] **Left split bar** - Between parameter sidebar and image area
- [ ] **Right split bar** - Between image area and batch/history area
- [ ] **Bottom split bar** - Above the bottom navigation tabs (History, Presets, etc.)
- [ ] **Browser tree splitter** - In file browser between folder tree and file list

### 3. Test Split Bar Functionality

Try dragging each split bar to resize sections:

#### Left Sidebar Resize:
1. Hover over the left edge of the image area
2. Cursor should change to ⟷
3. Click and drag left/right
4. Sidebar should resize smoothly

#### Right Sidebar Resize:
1. Hover over the right edge of the image area
2. Cursor should change to ⟷
3. Click and drag left/right
4. Batch/history area should resize smoothly

#### Bottom Section Resize:
1. Hover over the top edge of the bottom tabs area
2. Cursor should change to ↕
3. Click and drag up/down
4. Bottom section should resize smoothly

### 4. Check Browser Tree Splitter

1. Navigate to Image History or Models tab at the bottom
2. Look for the folder tree on the left
3. Hover over the divider between tree and content
4. Should see cursor change to ⟷
5. Drag to resize the tree area

## Detailed Checklist

### Theme Testing

Test with different themes to ensure consistency:

#### Default Theme (Light)
- [ ] Split bars visible as subtle gray lines
- [ ] No unwanted border artifacts
- [ ] Hover states work correctly

#### Default Theme (Dark)
- [ ] Split bars visible against dark background
- [ ] No unwanted border artifacts
- [ ] Hover states work correctly

#### Cyber-Noir Theme (if available)
- [ ] Split bars styled according to theme
- [ ] Theme-specific colors applied correctly
- [ ] No conflicts with theme overrides

### Layout Persistence Testing

1. Resize each split bar to a custom position
2. Refresh the page (F5)
3. Verify positions are restored correctly

### Responsive Testing

If testing on different screen sizes:

#### Desktop (>1024px)
- [ ] All split bars functional
- [ ] 3-column layout displays correctly
- [ ] No clipping or overflow issues

#### Tablet (768px - 1024px)
- [ ] Layout adjusts appropriately
- [ ] Split bars still functional
- [ ] No horizontal scrolling

#### Mobile (<768px)
- [ ] Mobile layout active
- [ ] Split bars hidden or adapted
- [ ] Touch gestures work (if applicable)

## Known Issues vs. Expected Behavior

### ✅ EXPECTED (Not bugs):

1. **Subtle divider lines** - Very thin, low-opacity borders between some UI elements are intentional for visual separation
2. **Split bar hover effect** - Split bars becoming more prominent on hover is intentional
3. **Layout shifts on resize** - Content reflows when split bars are dragged

### ❌ BUGS (Should be fixed):

1. **Thick horizontal lines** cutting through text or UI elements
2. **Vertical lines** appearing in content areas (not split bars)
3. **Hidden split bars** that should be visible
4. **Non-functional split bars** that don't respond to hover or drag

## Reporting Issues

If you find remaining issues, please note:

1. **Screenshot** - Capture the exact visual problem
2. **Theme** - Which theme you're using
3. **Browser** - Browser name and version
4. **Screen size** - Approximate window size
5. **Steps** - What actions preceded the issue
6. **Console errors** - Check browser console (F12) for errors

## Quick Fixes to Try

If you encounter issues:

### Browser Cache
1. Hard refresh: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
2. Clear browser cache and reload

### Layout Reset
1. Click "Quick Tools" button (if available)
2. Select "Reset Page Layout"
3. Refresh the page

### CSS Verification
Check if CSS files loaded correctly:
1. Open browser DevTools (F12)
2. Go to Network tab
3. Filter by CSS
4. Verify all CSS files loaded without 404 errors

## Success Criteria

The fixes are working correctly if:

✅ No unexpected horizontal or vertical line artifacts
✅ All split bars are visible and functional
✅ Hover states work on split bars
✅ Layout can be resized by dragging split bars
✅ Layout positions persist across page refreshes
✅ No console errors related to CSS variables
✅ Themes apply correctly without visual glitches

## Additional Notes

- Split bars are designed to be subtle when not in use
- The 5px width/height is intentional for better dragging UX
- Some borders are intentional for visual hierarchy
- Legacy variable compatibility ensures old code works

## Emergency Rollback

If critical issues appear and you need to rollback:

1. The changes are all in CSS files
2. No JavaScript or HTML logic was modified
3. Revert these files:
   - `src/wwwroot/css/color-system.css`
   - `src/wwwroot/css/genpage.css`
   - `src/wwwroot/css/design-tokens.css`

---

**Implementation Date:** October 3, 2025  
**Files Modified:** 3 CSS files  
**LOC Changed:** ~150 lines added/modified

