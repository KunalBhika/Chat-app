import express from "express";
import authRouter from "./routes/auth.routes.js";
import messageRouter from "./routes/message.routes.js";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./lib/db.js";
const app = express();

dotenv.config();
const PORT = process.env.PORT;

app.use(cookieParser());
app.use(express.json());
app.use(cors( {
    origin: 'http://localhost:5173', 
    methods: ['GET', 'POST' , 'PUT'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  } ));

app.use("/api/auth", authRouter);
app.use("/api/message", messageRouter);

app.listen(PORT, () => { 
    console.log("Server Running on PORT : " + PORT) 
    connectDB();
});