import express from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";

const router = express.Router();

const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
}
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }
    if (username.length < 3) {
      return res
        .status(400)
        .json({ message: "Username must be at least 3 characters" });
    }

 
    const existingUsernaeme = await User.findOne({ username });
    if (existingUsernaeme) {
      return res.status(400).json({ message: "Username already exists" });
    }
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const profileImage = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;

    const user = new User({
      username,
      email,
      password,
      profileImage,
    });
    await user.save();

    const token = generateToken(user._id);
    res.status(201).json({ token,,user:{
        id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
    } });
  } catch (error) {
    console.log("error in the register route", error);
    res.status(500).json({ message: "Server error" });
  }
});
router.post("/login", (req, res) => {
  res.send("Login");
});

export default router;
