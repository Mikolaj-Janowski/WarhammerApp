import React from "react";
import ReactDOM from "react-dom/client"; // Required for React 18+
import App from "./App"; // Main app component
import "./styles.css"; // Import global styles

// Create root and render the app
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);