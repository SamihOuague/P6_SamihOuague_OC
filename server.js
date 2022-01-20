const express = require("express");
const app = express();
const cors = require("cors");
const authRouter = require("./src/routers/authRouter");
const productRouter = require("./src/routers/productRouter");
const mongoose = require("mongoose");
const port = "3000" || process.env.PORT;

mongoose.connect("mongodb://localhost:27017/p6db");

app.use(cors());
app.use(express.json());
app.use(express.static("./public"));

app.use("/api/sauces", productRouter);
app.use("/api/auth", authRouter);

app.listen(port, () => {
    console.log("Server is running with port " + port);
});