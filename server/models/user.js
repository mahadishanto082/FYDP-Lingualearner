import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true, // Ensure unique emails
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"], // ✅ Email validation
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    bio: { type: String, trim: true },
    image: { type: String },
    socialLinks: {
      facebook: { type: String, trim: true },
      twitter: { type: String, trim: true },
      instagram: { type: String, trim: true },
      linkedin: { type: String, trim: true },
    },
  },
  { timestamps: true }
);

// ✅ Hash password before saving (only if modified)
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

// ✅ Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error("Password comparison failed");
  }
};

// ✅ Fix OverwriteModelError
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
