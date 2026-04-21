import React from 'react'
import ReactDOM from 'react-dom/client'
import RouterApp from './RouterApp';
import { BrowserRouter } from 'react-router-dom' 
import './index.css' // <--- IMPORTANTE

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>  
      <RouterApp />
    </BrowserRouter>
  </React.StrictMode>,
)