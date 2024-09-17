import React from 'react';
import { createRoot } from 'react-dom/client'; // Import createRoot
import App from './App';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// Find the root element in your HTML
const container = document.getElementById('root');

// Create a root and render the app
const root = createRoot(container); // createRoot is used in React 18+
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);