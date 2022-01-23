const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const PORT = 8080;
const path = require("path");
const cors = require("cors");
dotenv.config();

// require routes
const userRoute = require("./router/userRoute");
const productRoute = require("./router/productRoute");
const newsRoute = require("./router/newsRoute");
const appointmentRoute = require("./router/appointmentRoute");

// middleware
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(cors());

// Routes
app.use("/api/user", userRoute);
app.use("/api/product", productRoute);
app.use("/api/news", newsRoute);
app.use("/api/appointment", appointmentRoute);

mongoose
  .connect(process.env.MONGO_URL, { useNewUrlParser: true })
  .then(() => {
    console.log("Connected to database");
    app.listen(PORT, () => {
      console.log(`RUNNING AT ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(`Something wrong ${err}`);
  });