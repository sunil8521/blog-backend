import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import cors from "cors";
import {ErrorMiddleware,ErrorHandling}from "./error/error.js"
import userRoutes from "./routes/Userroutes.js"
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["http://localhost:5173","https://goss-app.netlify.app"],
    credentials: true,
  })
);
app.use(cookieParser());

mongoose
  .connect(process.env.DB_URI, {
    dbName: process.env.DB_NAME,
  })
  .then(() => {
    console.log("Successfully connected to database!");
  })
  .catch(() => {
    console.log("Unable connect with databse!");
  });

app.get("/", (req, res) => {
  res.send("hello");
});
app.use("/api/user", userRoutes);

app.all("*", (req, res, next) => {
  next(
    new ErrorHandling(
      `Can't find ${req.protocol}://${req.get("host")}${
        req.originalUrl
      } on server!`,
      404
    )
  );
});
app.use(ErrorMiddleware);

app.listen(3000, () => {
  console.log("running");
});
