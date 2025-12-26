import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Router } from 'react-router-dom'
import { BrowserRouter } from 'react-router-dom'
import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRouter from './AppRouter.jsx';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AppRouter />
  </BrowserRouter>
)
