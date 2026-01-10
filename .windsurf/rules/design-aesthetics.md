---
trigger: model_decision 
description: Apply when generating frontend aesthetics (./reactiveswarm)
---

# REACTIVESWARM – ANTI-GENERIC FRONTEND AESTHETIC RULES & GUIDELINES

# The ReactiveSwarm UI must never converge toward generic, “on-distribution”
# AI-generated aesthetics. The interface is a flagship, battlefield-grade
# control surface for autonomous agents — intentional, atmospheric, and engineered.

# ------------------------------------------------------------
# TYPOGRAPHY
# ------------------------------------------------------------

- "Use distinctive, character-rich typefaces that reinforce tactical, cosmic, or industrial aesthetics."
- "Avoid generic or overused fonts (Inter, Roboto, Arial, system fonts, or common fallbacks like Space Grotesk)."
- "Typography must establish hierarchy and identity, not neutrality."
- "Prefer pairings with contrast (e.g., sharp display + utilitarian mono)."
- "Maintain extreme legibility for data-dense surfaces (logs, terminal outputs). Use high-quality mono fonts with distinct glyphs (e.g., 0 vs O) for these areas."

# ------------------------------------------------------------
# COLOR & THEME (Tailwind v4.1+)
# ------------------------------------------------------------

- "Use Tailwind v4.1+ CSS variables (--color-*) as the single source of truth."
- "Commit to cohesive, high-contrast palettes with decisive accent colors."
- "Draw inspiration from IDE themes, aerospace HUDs, and tactical UIs."
- "Dark mode is primary; light variants must still feel engineered."
- "Reserve high-saturation accent colors strictly for state changes and critical alerts. Subdue default states to ensure action-required elements pop."

# ------------------------------------------------------------
# MOTION & INTERACTION
# ------------------------------------------------------------

- "Motion must feel snappy, responsive, and engineered — never slow or lazy."
- "Animations should be swift and concise; users should never feel like they are waiting."
- "Use CSS animations for HTML and Motion libraries for React components."
- "Prioritize high-impact sequences such as page-load orchestrations and staggered reveals."
- "Avoid scattered micro-interactions that dilute clarity and purpose."
- "Use motion to indicate system health or processing weight (e.g., high-frequency border pulses for active WebSocket streams)."

# ------------------------------------------------------------
# BACKGROUNDS & DEPTH
# ------------------------------------------------------------

- "Never default to flat, solid-color backgrounds."
- "Use layered gradients, subtle noise, geometric patterns (grid), or contextual atmospheric effects."
- "Backgrounds must create depth and environment, like a command surface."

# ------------------------------------------------------------
# SHADCNUI COMPONENT GUIDANCE (DESIGN-ORIENTED)
# ------------------------------------------------------------

- "Treat ShadcnUI components as raw materials, not final designs."
- "Apply custom Tailwind tokens, motion, and typography to push beyond defaults."
- "Keep components modular and single-purpose when it improves clarity or organization."
- "Avoid unnecessary fragmentation; component boundaries should support design intent."

# ------------------------------------------------------------
# AVOID GENERIC AI AESTHETICS
# ------------------------------------------------------------

- "No overused fonts (Inter, Roboto, Arial, system fonts)."
- "No cliché purple-on-white gradient palettes."
- "No predictable layout scaffolds or cookie-cutter component patterns."
- "No generic 'AI slop' — all design must feel specific to ReactiveSwarm."

# ------------------------------------------------------------
# CREATIVE INTERPRETATION
# ------------------------------------------------------------

- "Choose unexpected but coherent design solutions."
- "Vary aesthetics across screens while maintaining cohesion."
- "Every UI element must feel like part of a high-end operator interface."

# ============================================================
# ADDITIONAL GUIDANCE
# ============================================================

### Motion as Functional Telemetry

In a complex system like ReactiveSwarm, motion should act as a signal for backend state:
- **WebSocket Streams:** Instead of a static "Loading" text, use a high-frequency, subtle border pulse or a "scanning" line to indicate an active data pipe.
- **Staggered Reveals:** When `/API/ListModels` returns hundreds of items, use a swift, staggered entry. This masks the rendering time and creates a sense of the UI "booting up" like a tactical HUD.
- **Action Confirmation:** A microscopic "snap" or recoil on a button click provides tactile feedback, confirming that the `session_id` has been sent to the backend.

### React 19 Performance Benefits

React 19’s improvements to the **Concurrent Renderer** and **Transitions API** (using `useTransition` and `useDeferredValue`) mean that animations won't block the main thread. If a heavy model list is rendering, UI animations can remain fluid at 60fps, maintaining that "battle-hardened" stability even under load. 

### Implementation Guardrails

To keep it from feeling "generic" or "lazy":
- **The "Zero-Duration" Rule:** Avoid long, easing-out transitions. Use **Spring physics** with high stiffness and low damping for a "mechanical" feel.
- **Layout Transitions:** Use the `layout` prop in Motion to move elements between your resizable sidebars. This ensures the UI feels like a single, physical