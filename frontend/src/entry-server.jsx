import React from "react";
import { renderToPipeableStream } from "react-dom/server";
import App from "./App";
import { StaticRouter } from "react-router-dom/server";
import { Context as ResponsiveContext } from "react-responsive";
import { HelmetProvider } from "react-helmet-async";
import { AuthContextProvider } from "./Components/Context/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

/**
 * @param {string} url
 * @param {string} [ssrManifest]
 * @param {import('react-dom/server').RenderToPipeableStreamOptions} [options]
 */

export function render(url, ssrManifest, options) {
  const helmetContext = {};

  const baseUrl = "http://localhost:7755"; // or whatever your base URL is

  const location = new URL(url, baseUrl);

  return renderToPipeableStream(
    <React.StrictMode>
      <ResponsiveContext.Provider value={{ width: 500 }}>
        <HelmetProvider context={helmetContext}>
          <QueryClientProvider client={queryClient}>
            <AuthContextProvider>
              <StaticRouter location={location}>
                <App />
              </StaticRouter>
            </AuthContextProvider>
          </QueryClientProvider>
        </HelmetProvider>
      </ResponsiveContext.Provider>
    </React.StrictMode>,
    {
      ...options,
      onShellReady: (shell) => {
        options.onShellReady(helmetContext, shell);
      },
    }
  );
}
