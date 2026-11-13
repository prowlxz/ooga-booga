// LESSON: APPLICATION ENTRY POINT
// This file tells React which component to display first.

import React from "react";
import ReactDOM from "react-dom/client";

// Import our main App component.
import App from "./App";

// Import global CSS.
import "./index.css";

// Find the HTML element with the ID "root".
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found. Check your index.html file.");
}

// Create the React root.
ReactDOM.createRoot(rootElement).render(
  // StrictMode helps identify potential problems during development.
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
