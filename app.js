const config = require("./utils/config");

const express = require("express");
const app = express();
app.use(express.json());

const cors = require("cors");
app.use(cors());

const middleware = require("./utils/middleware");
app.use(middleware.errorHandler);

require("express-async-errors");
const blogsRouter = require("./controllers/blogs");
app.use("/api/blogs", blogsRouter);

const mongoose = require("mongoose");
mongoose
  .connect(config.MONGODB_URI)
  .then((result) => console.log("Connected to MONGODB"))
  .catch((error) => console.log(error));

module.exports = app;
