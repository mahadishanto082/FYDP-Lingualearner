import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/profile.js";
import { body, validationResult } from "express-validator";
// import { upload } from '../config/gridfs.js';
import mongoose from "mongoose";

const router = express.Router();

// Initialize GridFS bucket
let gfs;
mongoose.connection.once("open", () => {
  gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: "uploads",
  });
});

// Validation rules for user registration
const validateRegistration = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

// Register a new user
router.post("/register", validateRegistration, async (req, res) => {
  try {
    console.log("Received registration request");
    console.log("Request body:", req.body);
    console.log(
      "File:",
      req.file
        ? {
            fieldname: req.file.fieldname,
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size,
            path: req.file.path,
          }
        : "No file uploaded"
    );

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // If file was uploaded, delete it since registration failed
      if (req.file && req.file.id) {
        try {
          await gfs.delete(new mongoose.Types.ObjectId(req.file.id));
        } catch (deleteErr) {
          console.error(
            "Error deleting file after registration failure:",
            deleteErr
          );
        }
      }
      return res.status(400).json({ message: "User already exists" });
    }

    // Create image URL if file was uploaded
    const imageUrl = req.file ? `/api/image/${req.file.filename}` : null;
    console.log("Image URL:", imageUrl);

    // Create new user
    const newUser = new User({
      name,
      email,
      password,
      image: imageUrl,
    });

    await newUser.save();
    console.log("User saved successfully");

    // Generate JWT token
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const responseData = {
      message: "User registered successfully",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        image: newUser.image,
      },
    };

    console.log("Sending response:", responseData);
    res.status(201).json(responseData);
  } catch (err) {
    console.error("Registration error:", err);
    // If file was uploaded and registration failed, delete the file
    if (req.file && req.file.id) {
      try {
        await gfs.delete(new mongoose.Types.ObjectId(req.file.id));
      } catch (deleteErr) {
        console.error("Error deleting file:", deleteErr);
      }
    }
    if (err.message === "Only image files are allowed!") {
      return res.status(400).json({ message: err.message });
    }
    if (err.name === "MulterError") {
      return res
        .status(400)
        .json({ message: "Error uploading file: " + err.message });
    }
    res.status(500).json({ message: "Server error: " + err.message });
  }
});

// Get user profile
router.get("/user/profile", async (req, res) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user data
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }
    res.status(500).json({ message: "Server error" });
  }
});

// Serve images
router.get("/image/:filename", async (req, res) => {
  try {
    const file = await gfs.find({ filename: req.params.filename }).toArray();
    if (!file || file.length === 0) {
      return res.status(404).json({ message: "Image not found" });
    }

    // Set proper content type
    res.set("Content-Type", file[0].contentType);

    // Create read stream and pipe to response
    const readStream = gfs.openDownloadStreamByName(req.params.filename);
    readStream.pipe(res);
  } catch (error) {
    console.error("Error serving image:", error);
    res.status(500).json({ message: "Error serving image" });
  }
});

// Login a user
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Both email and password are required" });
  }

  try {
    // Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare entered password with stored (hashed) password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Respond with success, token, and user data
    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
