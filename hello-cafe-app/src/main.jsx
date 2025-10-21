import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import "./index.css";

const App = lazy(() => import("./App.jsx"));

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
   
    <Suspense fallback={<div className="text-center mt-10">Loading...</div>}>
      <App />
      <Toaster
        toastOptions={{
          position: "top-center",
          style: {
            background: "#283046",
            color: "white",
          },
        }}
      />
    </Suspense>
  
);
