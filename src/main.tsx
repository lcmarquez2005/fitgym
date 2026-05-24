import React from 'react'
import ReactDOM from 'react-dom/client'
import RouterApp from './RouterApp';
import { BrowserRouter } from 'react-router-dom'
import './index.css' // <--- IMPORTANTE

// Global font imports
const FontImports = () => (
  <style>
    {`
      @import url('https://fonts.googleapis.com/css2?family=Bakbak+One&display=swap');
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
      
      .font-bakbak { font-family: 'Bakbak One', sans-serif; }
      .font-inter { font-family: 'Inter', sans-serif; }
    `}
  </style>
)

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <BrowserRouter>
    <FontImports />
    <RouterApp />
  </BrowserRouter>
  // </React.StrictMode>
)