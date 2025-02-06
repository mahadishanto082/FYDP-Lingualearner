app.put("/user/profile", auth, upload.single("profilePicture"), async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      if (!user) return res.status(404).json({ message: "User not found" });
  
      const { name, email, password, bio } = req.body;
      if (name) user.name = name;
      if (email) user.email = email;
      if (password) user.password = password;
      if (bio) user.bio = bio;
      
      // If file uploaded, update profile picture path
      if (req.file) {
        user.image = `/uploads/${req.file.filename}`; // Store relative path
      }
  
      await user.save();
      res.json({ message: "Profile updated successfully", user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  app.use("/uploads", express.static("uploads"));

  