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

dotenv.config();
const app = express();
app.use(express.json()); // ✅ Ensure JSON parsing is enabled before routes

app.use(helmet());
app.use(morgan("dev"));
app.use(
  cors({
    origin: "http://localhost:5000",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(cors()); // ✅ Allows all origins (for debugging)


// Connect to DB
connectDB();

// Routes
app.use("/", authRoutes);
app.use("/posts", postRoutes);
app.use("/comments", commentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
