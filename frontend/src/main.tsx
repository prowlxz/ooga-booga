// LESSON: APPLICATION ENTRY POINT
// This file tells React which component to display first.

import React from 'react';
import ReactDOM from 'react-dom/client';

// Import our modular App component.
import App from "./App";

// Import global CSS.
import './index.css';

// Find the HTML element with the ID "root".
ReactDOM.createRoot(
  document.getElementById('root')!
).render(

  // StrictMode helps identify potential problems during development.
  <React.StrictMode>
    <App />
  </React.StrictMode>

);