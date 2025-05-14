const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const { saltRounds } = require("../constants/common");
const User = require("../models/User");

// Sign up route
router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    req.session.user = user;
    res.status(201).redirect("/");
  } catch (error) {
    res.status(400).render("signup", {
      message: "Duplicate username or email",
    });
  }
});

// Login route
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(401)
        .render("login", { message: "Invalid username or password" });
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(401)
        .render("login", { message: "Invalid username or password" });
    }

    req.session.user = user;
    res.status(200).redirect("/");
  } catch (error) {
    res.status(500).render("signup", {
      message: "Error creating account: " + error.message,
    });
  }
});

module.exports = router;
