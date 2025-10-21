import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "@/routes/index.jsx"; // explicitly import the file

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
