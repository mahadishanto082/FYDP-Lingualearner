import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { body, validationResult } from "express-validator";
import connectDB from "./config/mongodb.js"; // Adjust path if needed
import multer from "multer";
import path from "path"; // Import path to handle file extensions

const upload = multer({ dest: "uploads/" });
// Set storage engine for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads"); // Specify the folder to save uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Set file name with timestamp
  },
});

const uploadMiddleware = multer({ storage: storage }); // Use the multer storage configuration

// ✅ Ensure CORS allows frontend requests

/*************************************************************
 * 1) MONGOOSE MODELS
 *************************************************************/
const { Schema, model, models } = mongoose;

// Comment Schema
const commentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  text: {
    type: String,
    required: true,
    trim: true,
    maxLength: 1000,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
});

// Post Schema
const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxLength: 200,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    img: {
      type: String,
      validate: {
        validator: (v) => !v || /^https?:\/\/.+/.test(v),
        message: "Image URL must be a valid URL",
      },
    },
    author: {
      id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
      },
      name: {
        type: String,
        required: true,
        trim: true,
      },
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [commentSchema],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index for full-text search if needed
postSchema.index({ title: "text", content: "text" });

// User Schema
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    bio: {
      type: String,
      trim: true,
    },
    image: {
      type: String, // Store a URL or base64
      validate: {
        validator: (v) => !v || /^https?:\/\/.+/.test(v),
        message: "Profile picture must be a valid URL",
      },
    },
    socialLinks: {
      facebook: String,
      twitter: String,
      instagram: String,
      linkedin: String,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Hash the password before saving (pre-save hook)
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Create models (check if they exist to avoid overwrite in watch mode)
const Post = models.Post || model("Post", postSchema);
const User = models.User || model("User", userSchema);

/*************************************************************
 * 2) AUTH MIDDLEWARE
 *************************************************************/
const auth = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    if (!authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Invalid token format (missing Bearer)" });
    }

    const token = authHeader.replace("Bearer ", "");
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userId = decoded.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth error:", error);
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    return res.status(401).json({ message: "Invalid token" });
  }
};

/*************************************************************
 * 3) EXPRESS APP SETUP
 *************************************************************/
const app = express();
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));
app.use(
  cors({
    origin: "http://localhost:8081",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

/*************************************************************
 * 4) CONNECT TO MONGODB
 *************************************************************/
connectDB()
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });

/*************************************************************
 * 5) VALIDATION RULES (express-validator)
 *************************************************************/
const ERROR_MESSAGES = {
  NAME_REQUIRED: "Name is required",
  EMAIL_REQUIRED: "Valid email is required",
  PASSWORD_LENGTH: "Password must be at least 6 characters long",
  PASSWORD_REQUIRED: "Password is required",
};

const validateRegistration = [
  body("name").trim().notEmpty().withMessage(ERROR_MESSAGES.NAME_REQUIRED),
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage(ERROR_MESSAGES.EMAIL_REQUIRED),
  body("password")
    .isLength({ min: 6 })
    .withMessage(ERROR_MESSAGES.PASSWORD_LENGTH),
];

const validateLogin = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage(ERROR_MESSAGES.EMAIL_REQUIRED),
  body("password").exists().withMessage(ERROR_MESSAGES.PASSWORD_REQUIRED),
];

/*************************************************************
 * 6) AUTH ROUTES: REGISTER, LOGIN
 *************************************************************/

// Register user
app.post("/register", validateRegistration, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const newUser = new User({ name, email, password });
    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully!",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("[LOGIN ERROR]", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Profile and other routes...

// Endpoint to upload image
app.post("/uploads", uploadMiddleware.single("file"), (req, res) => {
  if (req.file) {
    const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    res.status(200).json({ url: imageUrl });
  } else {
    res.status(400).json({ message: "No file uploaded" });
  }
});

// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
