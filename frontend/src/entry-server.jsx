import React from "react";
import { renderToPipeableStream } from "react-dom/server";
import App from "./App";
import { StaticRouter } from "react-router-dom/server";
import { Context as ResponsiveContext } from "react-responsive";
import { HelmetProvider } from "react-helmet-async";
import { AuthContextProvider } from "./Components/Context/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { URLProvider } from "./Components/Context/URLContext";

const queryClient = new QueryClient();

/**
 * @param {string} url
 * @param {string} [ssrManifest]
 * @param {import('react-dom/server').RenderToPipeableStreamOptions} [options]
 */

export function render(url, ssrManifest, options) {
  const helmetContext = {};

  const fullUrl = options.fullUrl;

  return renderToPipeableStream(
    <React.StrictMode>
      <ResponsiveContext.Provider value={{ width: 500 }}>
        <HelmetProvider context={helmetContext}>
          <QueryClientProvider client={queryClient}>
            <AuthContextProvider>
              <URLProvider url={fullUrl}>
                <StaticRouter location={url}>
                  <App />
                </StaticRouter>
              </URLProvider>
            </AuthContextProvider>
          </QueryClientProvider>
        </HelmetProvider>
      </ResponsiveContext.Provider>
    </React.StrictMode>,
    {
      ...options,
      onShellReady: () => {
        options.onShellReady(helmetContext);
      },
    }
  );
}
