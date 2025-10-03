<!-- 57c42a5d-8e90-437e-a4d1-748758580f67 90e1bd47-4d0c-4ce8-87e3-e979da11b49c -->
# Compare Customized UI to Reference

1. **layout-js** – Inspect differences in `wwwroot/js/genpage/gentab/layout.js` to identify logic changes affecting bar visibility, sizing, and responsive behaviour.
2. **css-genpage** – Review structural CSS shifts in `wwwroot/css/genpage.css` to spot rule overrides impacting viewport sizing, split bars, and flex layouts.
3. **css-site** – Check `wwwroot/css/site.css` updates for global variable, slider, and component styling changes that might cascade into layout regressions.
4. **site-js** – Verify modifications in `wwwroot/js/site.js` for slider initialisation and prompt handling that could influence layout interactions.

## Todos

- compare-js: Summarise behavioural changes in `layout.js`
- compare-genpage-css: Document structural differences in `genpage.css`
- compare-site-css-js: Capture global styling & utility changes (site.css/site.js) that affect layout