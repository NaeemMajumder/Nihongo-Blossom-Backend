// Express
const express = require("express");

// Express-Router
const router = express.Router();

const User = require("../models/newUser.js");

const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router.get("/", async (req, res) => {
  let allUsers = await User.find({});
  res.send(allUsers);
});

router.post("/", upload.single("photoUrl"), async (req, res) => {
  let { filename, path } = req.file;
  let url = path;

  let user = new User(req.body);
  user.photoUrl = { filename, url };
  await user.save();
  res.send(user);
});

router.post("/google", async (req, res) => {
    try {
      const googleUser = req.body;
  
      // Validate required fields
      if (!googleUser.name || !googleUser.email) {
        return res.status(400).json({ message: "Name and email are required" });
      }
  
      // Check if the user already exists
      let user = await User.findOne({ email: googleUser.email });
      if (user) {
        return res.status(200).json({ message: "User already exists", user });
      }
  
      // Save new user if not found
      user = new User(googleUser);
      await user.save();
  
      res.status(201).json({ message: "User registered successfully", user });
    } catch (error) {
      console.error("Error handling Google user login:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  

router.put("/:id", async (req, res) => {
  const userId = req.params.id;
  const { isAdmin } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isAdmin === isAdmin) {
      return res.status(400).json({
        message: "No change in user role, isAdmin is already the same",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { isAdmin },
      { new: true }
    );

    res.json({ message: "User role updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
