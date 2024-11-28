import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import { config } from 'dotenv';
import cors from "cors";
import UserRouter from "./route/userRoute";
import storeRouter from "./route/storeRoute";

// Load environment variables
config();

const app = express();

app.use(cors({
    credentials:true,
}));

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.json()); // Middleware to parse JSON requests

  // Sample REST method
app.get('/api/health-check', (req, res) => {
    console.log("hello")
    res.status(200).json({ message: 'Hello, World!' });
});

// Use User API routes
app.use("/api/user", UserRouter);
// Use Store API routes
app.use("/api/store", storeRouter);

export default app;