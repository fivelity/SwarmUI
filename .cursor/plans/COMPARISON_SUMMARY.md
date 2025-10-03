# SwarmUI Customized vs Reference Comparison Summary

## Overview
This document compares the customized SwarmUI files with the reference (.REF_src) versions to identify changes that may be causing layout and rendering issues.

---

## 1. layout.js Behavioral Changes

### Constructor Changes (Lines 88-167 in customized)

**Reference Version:**
- Simple comparison: `leftShut = localStorage.getItem('barspot_leftShut') == 'true'`
- Simple comparison: `bottomShut = localStorage.getItem('barspot_midForceToBottom') == 'true'`
- Initializes `antiDup`, `swipeStartX`, `swipeStartY`, `minSwipeDelta` in constructor
- Small window auto-hide logic: sets `bottomShut = true` and `leftShut = true` when `isSmallWindow`

**Customized Version:**
- Strict comparison: `leftShut = localStorage.getItem('barspot_leftShut') === 'true'`
- Strict comparison: `bottomShut = localStorage.getItem('barspot_midForceToBottom') === 'true'`
- **NEW:** Lines 144-167 add complex logic for:
  - "Don't automatically hide sidebars unless explicitly in mobile layout mode"
  - Forces sidebars visible by default on desktop
  - Checks for `layout_sidebars_manually_set` flag
  - Forces bottom bar visible if `user_closed_bottom_bar` is not set
  - **This logic overrides user preferences and may cause unexpected behavior**

### setBottomShut / setLeftShut Changes (Lines 189-206)

**Reference Version:**
```javascript
setBottomShut(val) {
    this.bottomShut = val;
    localStorage.setItem('barspot_midForceToBottom', `${this.bottomShut}`);
}

setLeftShut(val) {
    this.leftShut = val;
    localStorage.setItem('barspot_leftShut', `${this.leftShut}`);
}
```

**Customized Version:**
```javascript
setBottomShut(val) {
    this.bottomShut = val;
    localStorage.setItem('barspot_midForceToBottom', `${this.bottomShut}`);
    localStorage.setItem('layout_sidebars_manually_set', 'true');  // NEW
    if (val) {  // NEW
        localStorage.setItem('user_closed_bottom_bar', 'true');
    } else {
        localStorage.removeItem('user_closed_bottom_bar');
    }
}

setLeftShut(val) {
    this.leftShut = val;
    localStorage.setItem('barspot_leftShut', `${this.leftShut}`);
    localStorage.setItem('layout_sidebars_manually_set', 'true');  // NEW
}
```

### resetLayout Changes (Lines 156-186)

**Reference Version:**
```javascript
resetLayout() {
    // ... cleanup ...
    this.bottomShut = this.isSmallWindow;
    this.leftShut = this.isSmallWindow;
    this.reapplyPositions();
    // ... runnable calls ...
}
```

**Customized Version:**
```javascript
resetLayout() {
    // ... cleanup ...
    // Only hide sidebars if explicitly in mobile mode
    this.bottomShut = this.mobileDesktopLayout == 'mobile';  // CHANGED
    this.leftShut = this.mobileDesktopLayout == 'mobile';    // CHANGED
    this.reapplyPositions();
    // ... runnable calls ...
}
```

### reapplyPositions Changes (Lines 197-345)

**Key Differences:**

1. **Line 293 (Reference) vs Lines 288-328 (Customized) - Bottom Bar Logic:**

**Reference:**
```javascript
if (this.bottomSectionBarPos != -1 || bottomShut) {
    // ... calculate heights ...
    this.bottomBar.style.height = `calc(${fixed} - 45px)`;
}
else {
    // ... calculate heights ...
    this.bottomBar.style.height = `calc(49vh - 30px)`;
}
```

**Customized:**
```javascript
// Override bottomShut to always show bottom bar (Line 289-291)
let effectiveBottomShut = false; // Force bottom bar to always be visible

if (this.bottomSectionBarPos != -1 || effectiveBottomShut) {  // Uses effectiveBottomShut
    // ... calculate heights ...
    this.bottomBar.style.minHeight = '250px';           // NEW
    this.bottomBar.style.maxHeight = '40vh';            // NEW
    this.bottomBar.style.height = 'auto';               // CHANGED
    this.bottomBar.style.display = 'block';             // NEW
    this.bottomBar.style.visibility = 'visible';        // NEW
}
else {
    // ... calculate heights ...
    this.bottomBar.style.minHeight = '250px';           // NEW
    this.bottomBar.style.maxHeight = '40vh';            // NEW
    this.bottomBar.style.height = 'auto';               // CHANGED
    this.bottomBar.style.display = 'block';             // NEW
    this.bottomBar.style.visibility = 'visible';        // NEW
}
```

2. **Line 293 vs Line 332-335 - alignImageDataFormat:**

**Reference:**
```javascript
alignImageDataFormat();  // Direct call
```

**Customized:**
```javascript
// Make sure alignImageDataFormat is available
if (typeof alignImageDataFormat === 'function') {
    alignImageDataFormat();
}
```

### Event Listener Changes (Lines 336-421 vs 378-397)

**Reference:**
- `touchstart` listener has `{ capture: true, passive: false }` (Line 336-349)
- `touchmove` listener is plain (Line 433)

**Customized:**
- `touchstart` listener has `{ capture: true, passive: false }` (Lines 378-391)
- **NEW:** `touchmove` listener adds preventDefault during drag (Lines 475-481):
```javascript
document.addEventListener('touchmove', (e) => {
    moveEvt(e, e.touches.item(0).pageX, e.touches.item(0).pageY);
    // Prevent default during drag operations to avoid scroll conflicts
    if (this.leftBarDrag || this.rightBarDrag || this.bottomBarDrag || this.imageEditorSizeBarDrag) {
        e.preventDefault();
    }
});
```

**Reference:**
- `touchend` listener has `{ passive: true }` (Line 450)

**Customized:**
- `touchend` listener has `{ passive: true }` (Line 498)
- Uses `passive: true` in touchstart listener (Line 497)

---

## 2. genpage.css Structural Differences

### License Header

**Reference:** No license header, starts immediately with CSS
**Customized:** Lines 1-18 include Apache 2.0 license header

### Global Refinements (Lines 19-22 in customized)

**Customized ONLY:**
```css
:root {
    --sui-subnav-height: var(--subnav-height);
}
```

### Body Styles

**Reference (Lines 1-7):**
```css
body {
    top: 0px;
    left: 0px;
    width: 100vw;
    height: 100vh;
    position: fixed;
    overflow: hidden;
}
```

**Customized (Lines 24-27):**
```css
body {
    margin: 0;
    padding: 0;
}
```
**⚠️ CRITICAL CHANGE:** Removed `position: fixed` and `overflow: hidden` from body!

### Main Content (Lines 29-32 in customized)

**Customized ONLY:**
```css
main#main {
    min-height: auto;
}
```

### Generate Page Root (Lines 35-38 in customized)

**Customized ONLY:**
```css
.d-flex.flex-column.h-100 {
    min-height: calc(100vh - 120px);
    height: 100vh;
}
```

### Tab Content Visibility (Lines 40-91 in customized)

**Customized adds extensive rules:**
```css
.tab-content {
    display: block !important;
    flex-shrink: 0;
}

.tab-pane {
    min-height: 200px;
    flex-shrink: 0;
}

/* Fix tab visibility issues */
.tab-pane {
    display: none;
}

.tab-pane.show.active {
    display: block !important;
}

/* Nested tab handling */
.genpage-bottom-tab.show.active,
.tab-pane.show.active .tab-pane.show.active,
.tab-pane .tab-pane.show.active {
    display: block !important;
}

/* Server tab specific */
#server_tab, #user_tab, #utilities_tab {
    overflow: visible;
    min-height: 400px;
    padding: 1rem;
}

/* Sub-navigation */
.swarm-gen-tab-subnav {
    display: flex !important;
    flex-wrap: wrap;
    gap: var(--space-2, 0.5rem);
    margin-bottom: 1rem;
}
```

### Main Inputs Area (Lines 132-186 in customized)

**Customized adds detailed scrolling logic:**
```css
#main_inputs_area_wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
    max-height: calc(100vh - 250px);
    min-height: 0;
    overflow: hidden;
}

#main_inputs_area {
    flex: 1 1 auto;
    overflow-y: auto !important;
    overflow-x: hidden !important;
    padding: 0.5rem;
    min-height: 0;
    max-height: calc(100vh - 350px);
    scrollbar-width: thin;
    scrollbar-color: var(--bs-border-color) transparent;
}

/* Custom scrollbar styling */
#main_inputs_area::-webkit-scrollbar {
    width: 8px;
}
/* ... more scrollbar styles ... */
```

### Current Image Batch (Lines 211-234 in customized)

**Customized adds:**
```css
#current_image_batch_wrapper {
    min-height: 250px;
    max-height: 400px;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    overflow: hidden;
    padding: 0.5rem;
}

.current_image_batch_core {
    overflow-x: hidden;
    overflow-y: auto;
    height: auto;
    white-space: normal;
    min-height: 200px;
    max-height: 350px;
    padding: 0.25rem;
    flex-shrink: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
    align-items: flex-start;
}
```

### Bottom Bar (Lines 934-986 in customized)

**Customized adds new section:**
```css
#t2i_bottom_bar {
    margin-top: auto;
    flex-shrink: 0;
    display: block !important;
    visibility: visible !important;
    min-height: 250px !important;
    height: auto !important;
    max-height: 40vh !important;
    overflow: visible !important;
}

#bottombartabcollection {
    background-color: var(--bs-body-bg);
    border-bottom: 1px solid var(--bs-border-color);
    margin-bottom: 0;
}

#bottombartabcollection .nav-link {
    border-bottom: 2px solid transparent;
    transition: all 0.15s ease-in-out;
}

#bottombartabcollection .nav-link.active {
    border-bottom-color: var(--bs-primary);
    background-color: var(--bs-body-bg);
    font-weight: 500;
}

#t2i_bottom_bar_content {
    min-height: 250px;
    max-height: calc(40vh);
}

.bottom-info-bar-container {
    background-color: var(--bs-tertiary-bg);
    border-bottom: 1px solid var(--bs-border-color);
}
```

### Browser Container (Lines 788-799, 802-853 in customized)

**Customized adds:**
```css
.genpage-bottom-tab {
    height: auto;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
}

.genpage-bottom-tab .browser_container {
    flex: 1;
    min-height: 0;
}

/* File Explorer improvements */
.browser_container {
    border: 1px solid var(--bs-border-color);
    border-radius: 0.375rem;
    background-color: var(--bs-body-bg);
}

.browser-folder-tree-container {
    background-color: var(--bs-tertiary-bg);
    border-right: 1px solid var(--bs-border-color);
    padding: 0.5rem;
}

/* ... more browser styling ... */
```

**Reference (Lines 806-812):**
```css
.browser_container {
    display: block;
    height: 100%;
    overflow: hidden;
    white-space: nowrap;
    background-color: var(--background-panel);
}
```

### Navigation System (Lines 881-925 in customized)

**Customized ONLY - adds extensive navigation styling:**
```css
#navbarNav .nav-link.active {
    color: var(--bs-primary) !important;
    font-weight: 600;
    border-bottom: 2px solid var(--bs-primary);
    padding-bottom: calc(0.5rem - 2px);
}

#navbarNav .nav-link {
    transition: all 0.15s ease-in-out;
    border-bottom: 2px solid transparent;
}

#navbarNav .nav-link:hover {
    color: var(--bs-primary) !important;
    border-bottom-color: var(--bs-primary);
    opacity: 0.8;
}

#subnav_bar {
    min-height: 48px;
}

#subnav_list .nav-link {
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    margin-right: 0.25rem;
    transition: all 0.15s ease-in-out;
}

#subnav_list .nav-link:hover {
    background-color: var(--bs-secondary-bg);
}

#subnav_list .nav-link.active {
    background-color: var(--bs-primary);
    color: var(--bs-white);
}
```

---

## 3. site.css Global Changes

### Missing CSS Compared to Reference

**Reference has (Lines 70-75):**
```javascript
function showError(message) {
    let container = getRequiredElementById('center_toast');
    let box = getRequiredElementById('error_toast_box');
    // ... Bootstrap toast implementation ...
}
```

**Customized has (Lines 70-82):**
```javascript
function showError(message, time = 5000) {  // NEW: time parameter
    let container = getRequiredElementById('error_toast_box');
    getRequiredElementById('error_toast_content').innerText = message;
    let toast = new bootstrap.Toast(container, { delay: time });
    toast.show();
}
```

**NEW in Customized (Lines 77-84):**
```javascript
function showSuccess(message, time = 3000) {
    let container = document.getElementById('success_toast_box');
    if (!container) { console.warn('Missing success toast container'); return; }
    let body = getRequiredElementById('success_toast_content');
    body.innerText = message;
    let toast = new bootstrap.Toast(container, { delay: time });
    toast.show();
}
```

---

## 4. site.js Global Changes

### Missing Helper Functions in Reference

**Reference uses (Lines 300-321):**
```javascript
let shiftText = (up) => {
    let [selStart, selEnd] = getTextSelRange(elem);  // Helper function
    // ...
    let text = getTextContent(elem);  // Helper function
    // ...
    setTextContent(elem, newValue);   // Helper function
    setTextSelRange(elem, start, end); // Helper function
}
```

**Customized uses (Lines 562-641):**
```javascript
let shiftText = (up) => {
    let selStart = elem.selectionStart;  // Direct property access
    let selEnd = elem.selectionEnd;      // Direct property access
    // ...
    let before = elem.value.substring(0, selStart);  // Direct .value
    // ...
    elem.value = newValue;  // Direct .value
    elem.selectionStart = start;  // Direct property
    elem.selectionEnd = end;      // Direct property
}
```
**⚠️ NOTE:** Reference assumes helper functions exist; customized uses direct DOM API

### Image File Input Changes

**Reference has separate functions (Lines 495-553):**
```javascript
function clearImageFileInput(elem) { /* ... */ }
function setImageFileInput(elem, file) { /* ... */ }
function setImageFileDirect(elem, src, name, longName = null, callback = null) { /* ... */ }
function load_image_file(elem) {
    if (loadImageFileDedup) return;
    updateFileDragging({ target: elem }, true);
    let file = elem.files[0];
    setImageFileInput(elem, file);
}
```

**Customized has inline logic (Lines 758-806):**
```javascript
function load_image_file(elem) {
    if (loadImageFileDedup) return;
    updateFileDragging({ target: elem }, true);
    let file = elem.files[0];
    let parent = elem.closest('.auto-input');
    let preview = parent.querySelector('.auto-input-image-preview');
    let label = parent.querySelector('.auto-file-input-filename');
    if (file) {
        // ... all logic inline ...
    }
    else {
        delete elem.dataset.filedata;
        label.textContent = "";
        preview.innerHTML = '';
    }
}
```

### makeGenericPopover Signature

**Reference (Line 588):**
```javascript
function makeGenericPopover(id, name, type, description, example) { /* ... */ }
```

**Customized (Line 899):**
```javascript
function makeGenericPopover(id, name, type, description, extraClass = '') {
    try {
        const cls = extraClass ? ` ${extraClass}` : '';
        const safeName = escapeHtmlNoBr ? escapeHtmlNoBr(name) : name;
        const safeDesc = (typeof safeHtmlOnly !== 'undefined') ? safeHtmlOnly(description) : description;
        return `<div class="sui-popover${cls}" id="popover_${id}"><b>${safeName}</b> (${type}):<br><span class="translate slight-left-margin-block">${safeDesc}</span></div>`;
    } catch (e) {
        return `<div class="sui-popover${extraClass ? ' ' + extraClass : ''}" id="popover_${id}"><b>${name}</b> (${type}):<br><span class="translate slight-left-margin-block">${description}</span></div>`;
    }
}
```

### New Navigation System (Lines 245-476 in customized)

**Customized ONLY - adds entire navigation system:**
```javascript
/***** Header/workspace/subnav helpers *****/
function setActiveMainNavByHash(hash) { /* ... */ }
function activateTabFromHash(hash) { /* ... */ }
function updateSubNavBar() { /* ... */ }

document.addEventListener('DOMContentLoaded', () => {
    // Main navigation click handlers
    // Theme toggle persistence
    // Density toggle persistence
    // Keyboard shortcuts (Alt+I for interrupt)
    // Hash change handling
    // Tab visibility initialization
    // Diagnostic function (window.checkPageState)
    // ... extensive new code ...
});
```

### triggerChangeFor Enhancement

**Reference (Lines 242-251):**
```javascript
function triggerChangeFor(elem) {
    elem.dispatchEvent(new Event('input'));
    if (elem.oninput) elem.oninput(elem);
    elem.dispatchEvent(new Event('change'));
    if (elem.onchange) elem.onchange(elem);
}
```

**Customized (Lines 478-487):**
```javascript
function triggerChangeFor(elem) {
    elem.dispatchEvent(new Event('input', { bubbles: true }));  // NEW: bubbles
    if (elem.oninput) elem.oninput(elem);
    elem.dispatchEvent(new Event('change', { bubbles: true })); // NEW: bubbles
    if (elem.onchange) elem.onchange(elem);
}
```

### New Modal Helper Functions (Lines 489-514 in customized)

**Customized ONLY:**
```javascript
/** Safely show a Bootstrap 5 modal by element id (no jQuery). */
function showModalById(id) { /* ... */ }

/** Safely hide a Bootstrap 5 modal by element id (no jQuery). */
function hideModalById(id) { /* ... */ }

/** Set multiple values for a <select multiple> ... */
function setSelectValues(selectElem, values) { /* ... */ }
```

### doToggleEnable Enhancement

**Reference (Line 486):**
```javascript
function doToggleEnable(id) {
    // ... existing logic ...
    // NO triggerChangeFor at end
}
```

**Customized (Line 706, end of function):**
```javascript
function doToggleEnable(id) {
    // ... existing logic ...
    triggerChangeFor(toggler);  // NEW: trigger change for toggler
}
```

---

## Key Issues Identified

### Critical Layout Problems

1. **Body CSS Change (genpage.css):**
   - Removed `position: fixed; overflow: hidden;` from body
   - This fundamentally changes how the page scrolls and positions elements

2. **Forced Bottom Bar Visibility (layout.js):**
   - Lines 289-328 force `effectiveBottomShut = false`
   - Ignores user's `bottomShut` preference
   - Always sets `display: block` and `visibility: visible`

3. **Complex Sidebar Override Logic (layout.js):**
   - Lines 144-167 in constructor add complex logic to override user preferences
   - Checks multiple localStorage flags
   - May cause sidebars to appear unexpectedly

4. **Browser Container Height (genpage.css):**
   - Reference: `height: 100%`
   - Customized: Flex layout with `flex: 1; min-height: 0`
   - May cause incorrect height calculations

### JavaScript Behavioral Changes

1. **Missing Helper Functions:**
   - Reference assumes `getTextSelRange`, `setTextSelRange`, `getTextContent`, `setTextContent` exist
   - Customized uses direct DOM API
   - May cause compatibility issues

2. **Event Bubbling:**
   - Customized adds `{ bubbles: true }` to change/input events
   - May cause unexpected event propagation

3. **touchmove preventDefault:**
   - Customized adds preventDefault during drag operations
   - May interfere with normal scrolling on mobile

### CSS Architecture Issues

1. **Tab Visibility:**
   - Extensive new rules for tab panes (Lines 40-91 in genpage.css)
   - Multiple `!important` declarations
   - May conflict with Bootstrap's tab system

2. **Bottom Bar Styling:**
   - Multiple `!important` declarations (Lines 934-944)
   - Forces specific display/visibility values
   - Overrides user preferences and JavaScript calculations

3. **Navigation System:**
   - New navigation CSS (Lines 881-925) not in reference
   - May conflict with existing navigation

---

## Recommendations

1. **Revert Body CSS:** Restore `position: fixed; overflow: hidden;` to body in genpage.css
2. **Remove Forced Visibility:** Remove `effectiveBottomShut` override in layout.js
3. **Simplify Sidebar Logic:** Remove or simplify the constructor logic that overrides user preferences
4. **Remove !important:** Remove excessive `!important` declarations from bottom bar CSS
5. **Test Helper Functions:** Ensure all referenced helper functions exist or use direct DOM API consistently
6. **Review Tab Visibility:** Simplify tab visibility CSS rules to match Bootstrap patterns
7. **Validate Browser Height:** Test browser container height calculations with different content

---

## Files Analyzed

- `src/wwwroot/js/genpage/gentab/layout.js` (682 lines)
- `.REF_src/wwwroot/js/genpage/gentab/layout.js` (634 lines)
- `src/wwwroot/css/genpage.css` (2118 lines)
- `.REF_src/wwwroot/css/genpage.css` (1647 lines)
- `src/wwwroot/css/site.css` (960 lines)
- `.REF_src/wwwroot/css/site.css` (1647 lines)
- `src/wwwroot/js/site.js` (1288 lines)
- `.REF_src/wwwroot/js/site.js` (1032 lines)

