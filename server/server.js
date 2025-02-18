import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import connectDB from "./config/mongodb.js";
import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/posts.js";
import commentRoutes from "./routes/comments.js";
import userRoutes from "./routes/user.js"; // ✅ Added user profile routes

dotenv.config();
const app = express();

app.use(express.json()); // ✅ Ensure JSON parsing is enabled before routes
app.use(helmet());
app.use(morgan("dev"));

// ✅ Fix CORS: Allow frontend to access API
const allowedOrigins = ["http://localhost:8081"]; // Replace X.X with your actual IP

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.options("*", cors()); // ✅ Handle preflight requests

// ✅ Log incoming requests for debugging
app.use((req, res, next) => {
  console.log("Incoming Request:", req.method, req.url);
  console.log("Headers:", req.headers);
  next();
});

// Connect to DB
connectDB();

// Routes
app.use("/", authRoutes);
app.use("/posts", postRoutes);
app.use("/comments", commentRoutes);
app.use("/user", userRoutes); // ✅ Add user profile route

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
