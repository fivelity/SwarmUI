---
trigger: manual
---

# Plan: ReactiveSwarm - Modern React 19 Frontend

## Phase 1: Foundation Setup and Configuration

1. Foundation Setup and Configuration

Initialize Vite 6+ project with React 19 and TypeScript 5.6+
Configure Tailwind CSS v4.1+ with Modern Dark 2.0 theme (charcoal #09090b, glassmorphism)
Install and configure Shadcn UI with custom dark overrides
Set up path aliases and module resolution
Configure ESLint and Prettier for React 19 standards
Create folder structure: src/components, src/stores, src/services, src/pages, src/hooks, src/types
Initialize git workflow and development environment
Set up build optimization and dev server configuration

2. Core State Management Layer

Create Zustand store architecture with modular slices
Implement useGenerationStore for status, progress, queue, and outputs
Implement useParameterStore for all T2I parameters with fine-grained subscriptions
Implement useModelStore for models, LoRAs, embeddings, wildcards
Implement useBackendStore for backend status and feature flags
Implement useUIStore for active tab, dialogs, and transient UI state
Implement useLayoutStore for panel sizes, collapsed states, and slot arrangements
Implement useHistoryStore for image cache and gallery state
Implement useAuthStore for session and user permissions
Implement useThemeStore for CSS variable overrides
Add localStorage middleware for persistence of layout and UI preferences
Create custom hooks for computed store selectors to minimize re-renders

3. WebSocket and SwarmUI API Infrastructure

Build WebSocketService with connection pooling and heartbeat
Implement exponential backoff reconnection logic with max retry limits
Create typed API client wrapping all SwarmUI REST endpoints
Build message queue system for WebSocket generation requests
Create handlers for all response types (status, progress, image, error)
Implement binary stream decoder for base64 preview images
Build cancellation token system for generation interrupts
Create error handling layer with user-friendly messages
Build request interceptors for session injection
Implement connection state watchers for UI feedback

4. Three-Column Layout System (Phase 1 Core)

Implement react-resizable-panels for 3-column draggable layout
Create DragHandle component for panel resizing with visual feedback
Build LeftSidebar container with collapse toggle
Build CenterCanvas container for main content
Build RightSidebar container with collapse toggle
Implement localStorage persistence for panel widths and collapsed states
Create responsive breakpoint handlers (hide sidebars on mobile)
Build layout state sync to useLayoutStore
Create keyboard shortcuts for panel toggles (Ctrl/Cmd + bracket keys)
Implement smooth animations for panel collapse/expand

5. Slot System and Layout Modification Mode

Create generic Slot component that can hold any panel
Build default layout: LeftSidebar contains Parameters, CenterCanvas contains Canvas, RightSidebar contains Gallery
Implement dnd-kit for slot rearrangement
Create Layout Modification Mode toggle (button in top nav)
Build visual indicators showing drop zones when in modification mode
Implement layout preset system (save/load multiple configurations)
Create reset to default layout button
Persist layout slot arrangement to localStorage
Build validation to ensure at least one canvas slot exists
Create layout name editor for custom configurations

6. Top Navigation and Tab System

Build top navigation bar with branding and logo
Create tab navigation: Generate, ComfyUI, Settings
Implement active tab styling and persistence
Build status indicator area showing generation count and queue info
Create interrupt button for canceling current generation
Build refresh/sync button for model and parameter lists
Create account menu with user info and logout
Implement search/global action bar (Ctrl+K)
Build help and documentation links
Create layout modification mode toggle

7. Center Canvas Component (Phase 1 Core)

Build responsive image display area
Implement zoom controls (fit, 100%, custom percentage)
Create pan functionality with mouse drag
Build image metadata display panel (collapsible)
Implement quick action toolbar with download, delete, star buttons
Create drag-and-drop zone for image-to-image loading
Build real-time preview streaming display
Implement progress overlay with percentage and step info
Create comparison slider for before/after viewing
Build error state display with retry options

8. Left Sidebar - Parameter Controls (Phase 1 Core)

Build collapsible parameter group containers
Create dnd-kit sortable interface for group reordering
Implement search/filter box at top for parameter lookup
Create "Display Advanced Parameters" toggle switch
Build parameter type components: text input, slider, POT slider, integer, decimal, checkbox, dropdown
Implement useTransition wrapper for all parameter updates
Create quick parameter presets (checkpoints, samplers, CFG ranges)
Build parameter reset per-group and global
Implement parameter validation and error highlighting
Create parameter description tooltips on hover

9. Right Sidebar - Gallery and History (Phase 1 Core)

Build tab switcher: Gallery, Starred, Folder Browser
Implement infinite scroll virtual list for image gallery
Create folder tree navigation with lazy loading
Build sort controls (name, date) with reverse toggle
Implement star/unstar functionality with optimistic updates
Create search/filter for images by metadata
Build bulk selection mode with multi-delete
Implement image context menu
Create drag-and-drop for selecting multiple images
Build starred images special view

10. Phase 1 Integration and Testing

Connect all three layout components with state management
Implement full WebSocket message flow to parameter store
Build generation request pipeline from UI to API
Create error boundaries for each major section
Implement visual feedback for all async operations
Build loading states and skeleton screens
Create comprehensive storybook for component showcase
Test layout responsiveness across screen sizes
Validate performance with React DevTools profiler

## Phase 2: Feature Modules (Prepared After Phase 1 Completion)

11. Advanced Prompt Engine and Syntax Support

Build real-time prompt syntax highlighter
Create autocomplete system for wildcards and models
Implement variable/macro expansion preview
Build segment and region visual builder
Create LoRA syntax autocomplete with weights
Implement comment stripper
Build prompt history with quick recall

12. Model Browser and Management

Create hierarchical folder tree for model navigation
Build model card with metadata and thumbnail
Implement model search with fuzzy matching
Create model type filters
Build model refresh with progress
Implement model favorite/pin system

13. ComfyUI Integration Page

Create dedicated ComfyUI page/tab
Implement iframe wrapper for workflow editor
Build hidden sidebars (full-width mode)
Create overlay controls: Send to Generate Tab, Import from Generate Tab
Implement multi-GPU selector overlay
Build workflow import/export functionality
Create workflow save/restore to backend
Implement state synchronization bridge
Build node-level progress streaming display
Create quick parameter injection system
14. Grid Generator Interface

Build multi-axis parameter selection
Create axis drag-and-drop reordering
Implement dynamic value input and ranges
Build grid preview calculator
Create progress tracking for batch generation
Build result display with axis labels
Implement grid export functionality

15. Integrated Image Editor

Build canvas-based inpainting editor
Implement brush controls (size, hardness)
Create mask layer with opacity
Build eraser and mask refinement tools
Implement undo/redo stack
Create mask blur and feathering controls
Build quick shape selections
Implement mask save/load

16. Backend Persistence and Settings

Create settings page with user preferences
Build preference persistence via SwarmUI backend API endpoints
Implement parameter preset save/load/delete
Create layout configuration storage
Build generation history archival
Implement user theme customization storage
Create workflow template storage on backend
Build user settings sync via API

17. Theme System and Customization

Build CSS variable-based theming system
Create theme editor UI with live preview
Implement color picker components
Create glassmorphism controls
Build theme preset library
Implement theme export as JSON
Create theme sharing via backend storage

18. Performance Optimization

Implement React 19 useTransition for all heavy updates
Create fine-grained Zustand selectors
Build virtual scrolling for galleries
Implement lazy loading and code splitting
Create image lazy loading with intersection observer
Build service worker for offline capability
Implement optimistic UI updates
Create debounced parameter updates

19. Testing, Documentation, and Polish

Set up Vitest with React Testing Library
Create integration tests for WebSocket flow
Build E2E tests with Playwright
Implement visual regression testing
Create accessibility tests with axe-core
Build comprehensive storybook
Write API documentation
Create user onboarding guide
Optimize bundle size and performance

## Key Architectural Decisions:

SwarmUI backend remains single source of truth for all state persistence
No Third-Party Database integration - all settings stored via SwarmUI API
Phase 1 creates complete, working foundation with three columns and basic generation
WebSocket connection handles all real-time updates and bidirectional communication
Zustand stores provide fine-grained reactivity without prop drilling
React 19 useTransition prevents UI blocking during parameter updates
ComfyUI exists as separate tab with full-width iframe when active
Modern Dark 2.0 aesthetic applied throughout with glassmorphism accents
Modular component design allows easy extension and feature addition

## Phase 1 Completion Criteria:

Three-column layout is resizable, collapsible, and persistent
All parameter types render and update correctly
WebSocket connection streams images and progress in real-time
Gallery displays and searches historical images
Generation workflow completes end-to-end
Responsive design works on tablet and desktop
Performance meets React DevTools standards