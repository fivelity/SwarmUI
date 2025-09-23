import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import 'tailwindcss/css'
import './i18n';

import { ThemeProvider } from './contexts/ThemeProvider';

import { LayoutProvider } from './contexts/LayoutProvider';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <LayoutProvider>
        <App />
      </LayoutProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
