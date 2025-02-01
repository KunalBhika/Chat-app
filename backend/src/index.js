import express from "express";
import authRouter from "./routes/auth.routes.js";
import messageRouter from "./routes/message.routes.js";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./lib/db.js";
import { server, app } from "./lib/socket.js";
import path from "path";

dotenv.config();
const PORT = process.env.PORT;
const _dirname = path.resolve();

app.use(cookieParser());
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use("/api/auth", authRouter);
app.use("/api/message", messageRouter);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(_dirname, "../frontend/dist")));
  app.use("*" , (req , res) => {
    res.sendFile(path.join(_dirname , "../frontend" , "dist" , "index.html"));
  })
}

server.listen(PORT, () => {
  console.log("Server Running on PORT : " + PORT)
  connectDB();
});