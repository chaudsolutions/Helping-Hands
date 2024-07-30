import fs from "node:fs/promises";
import express from "express";
import { Transform } from "node:stream";
import "dotenv/config";
import mongoose from "mongoose";

// app constants
const mongoUrl = process.env.mongodbLocal;

// Server Constants
const isProduction = process.env.NODE_ENV === "production";
const port = process.env.PORT || 5275;
const base = "/";
const ABORT_DELAY = 10000;

// Cached production assets
const templateHtml = isProduction
  ? await fs.readFile("./dist/client/index.html", "utf-8")
  : "";
const ssrManifest = isProduction
  ? JSON.parse(
      await fs.readFile("./dist/client/.vite/ssr-manifest.json", "utf-8")
    )
  : undefined;

// Create http server
const app = express();
// Middleware to parse JSON bodies
app.use(express.json());

// Add Vite or respective production middlewares
let vite;
if (!isProduction) {
  const { createServer } = await import("vite");
  vite = await createServer({
    server: { middlewareMode: true },
    appType: "custom",
    base,
  });
  app.use(vite.middlewares);
} else {
  const compression = (await import("compression")).default;
  const sirv = (await import("sirv")).default;
  app.use(compression());
  app.use(base, sirv("./dist/client", { extensions: [] }));
}

// Connect to Database
mongoose.connect(mongoUrl);

// Fetch models
import requireAuth from "./Server/Models/requireAuth.js";
// Fetch routes
import Authentication from "./Server/Routes/Authentication.js";
import userDocs from "./Server/Routes/UserDocs.js";
import getItems from "./Server/Routes/GetItems.js";
import verifyPayments from "./Server/Routes/VerifyPayments.js";

// Use Authentication route
app.use("/auth", Authentication);

// Route protection
app.use("/user", requireAuth);
// User route
app.use("/user", userDocs);

// Use get items route
app.use("/get", getItems);

// Use payments verification route
app.use("/verify-payment", verifyPayments);

// Favicon
app.get("/favicon.ico", (req, res) => {
  res.status(204);
});

// Serve HTML
app.use("*", async (req, res) => {
  try {
    const url = req.originalUrl.replace(base, "");

    let template;
    let render;
    if (!isProduction) {
      // Always read fresh template in development
      template = await fs.readFile("./index.html", "utf-8");
      template = await vite.transformIndexHtml(url, template);
      render = (await vite.ssrLoadModule("/src/entry-server.jsx")).render;
    } else {
      template = templateHtml;
      render = (await import("./dist/server/entry-server.js")).render;
    }

    let didError = false;

    const helmetContext = {}; // Initialize helmetContext here

    // Construct the full URL from the request
    const fullUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;

    const { pipe, abort } = render(url, ssrManifest, {
      onShellError() {
        res.status(500);
        res.set({ "Content-Type": "text/html" });
        res.send("<h1>Something went wrong</h1>");
      },
      onShellReady(helmetContext) {
        res.status(didError ? 500 : 200);
        res.set({ "Content-Type": "text/html" });

        const transformStream = new Transform({
          transform(chunk, encoding, callback) {
            res.write(chunk, encoding);
            callback();
          },
        });

        const [htmlStart, htmlEnd] = template.split(`<!--app-html-->`);
        const helmet = helmetContext.helmet;
        const helmetHtml = `
          <head>
            ${helmet?.title?.toString()}
            ${helmet?.meta?.toString()}
            ${helmet?.link?.toString()}
          </head>
        `;
        const newHtmlStart = htmlStart.replace("<head>", helmetHtml);
        res.write(newHtmlStart);
        transformStream.on("finish", () => {
          res.end(htmlEnd);
        });
        pipe(transformStream);
      },
      onError(error) {
        didError = true;
        console.error(error);
      },
      helmetContext,
      fullUrl,
    });

    setTimeout(() => {
      abort();
    }, ABORT_DELAY);
  } catch (e) {
    vite?.ssrFixStacktrace(e);
    console.error(e.stack);
    res.status(500).end(e.stack);
  }
});

// Start http server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
