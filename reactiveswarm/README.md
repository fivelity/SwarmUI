# ReactiveSwarm

A high-performance, modular React 19 frontend for SwarmUI.

## Tech Stack

- **Framework:** React 19 + Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4.1
- **State Management:** Zustand
- **Layout:** react-resizable-panels
- **UI Components:** Shadcn UI (Manual Setup for Tailwind v4)
- **Icons:** Lucide React

## Project Structure

- `src/stores` - Zustand stores (Generation, Model, Backend, Layout)
- `src/components/layout` - Main layout components (AppLayout, Sidebars, Canvas)
- `src/components/common` - Reusable UI components
- `src/lib` - Utilities (cn, etc.)

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run development server:
   ```bash
   npm run dev
   ```

## Architecture Notes

- **Layout:** The app uses a 3-column resizable layout. State is persisted in `localStorage`.
- **Theming:** CSS variables are defined in `src/index.css` following Shadcn UI conventions but adapted for Tailwind v4 `@theme`.
- **Aliases:** `@/` maps to `src/`.

