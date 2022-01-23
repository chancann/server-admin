const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const PORT = 3000;
dotenv.config();

// require routes
const userRoute = require("./router/userRouter");
const productRoute = require('./router/productRouter');

// middleware
app.use(express.json());

// Routes
app.use("/user", userRoute);
app.use("/product", productRoute);

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true
  })
  .then(() => {
    console.log("Connected to database");
    app.listen(PORT, () => {
      console.log(`RUNNING AT ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(`Something wrong ${err}`);
  });

