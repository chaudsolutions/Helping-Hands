const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");

// app constants
const mongoUrl = process.env.mongodbLive;
const port = process.env.PORT;

// Create http server
const app = express();
// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
  })
);

// Connect to Database
mongoose.connect(mongoUrl);

// Fetch models
const requireAuth = require("./Models/requireAuth.js");
// Fetch routes
const Authentication = require("./Routes/Authentication.js");
const userDocs = require("./Routes/UserDocs.js");
const getItems = require("./Routes/GetItems.js");
const verifyPayments = require("./Routes/VerifyPayments.js");
const FundsRoute = require("./Routes/Funds.js");
const ApiRoute = require("./Routes/Api.js");
const AdminRoute = require("./Routes/AdminRoute.js");

// Define a default route handler for the root URL ("/")
app.get("/", (req, res) => {
  res.send("Hello, World! This is the root route for HELP WITH FUNDS SERVERS.");
});

// Use Authentication route
app.use("/auth", Authentication);

// Route protection
app.use("/user", requireAuth);
// User route
app.use("/user", userDocs);

// Route protection
app.use("/funds", requireAuth);
// User route
app.use("/funds", FundsRoute);

// Use get items route
app.use("/get", getItems);

// Use payments verification route
app.use("/verify-payment", verifyPayments);

// use api route
app.use("/api", ApiRoute);

// Route protection
app.use("/admin", requireAuth);
// use admin route
app.use("/admin", AdminRoute);

// Start http server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
