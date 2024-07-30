import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthContextProvider } from "./Components/Context/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { URLProvider } from "./Components/Context/URLContext";

const queryClient = new QueryClient();

const fullUrl = window.location.href;

ReactDOM.hydrateRoot(
  document.getElementById("root"),
  <React.StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthContextProvider>
          <URLProvider url={fullUrl}>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </URLProvider>
        </AuthContextProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </React.StrictMode>
);
