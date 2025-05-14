require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser"); // Can use express.json()
const session = require("express-session");
const authRoutes = require("./routes/auth");
const helmet = require("helmet");
const User = require("./models/User");

const app = express();

// Connect to the database
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/interviewApp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database connected"))
  .catch((err) => console.error("Database connection error:", err)); // Error handling

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

// Secure HTTP headers
app.use(helmet());

app.use(
  session({
    secret: process.env.SECRET_KEY || "default",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60,
    },
  })
);

// Set view engine
app.set("view engine", "ejs");

// Routes
app.get("/", async (req, res) => {
  try {
    const numberUser = await User.countDocuments();
    res.status(200).render("home", {
      user: req.session.user || null,
      numberUser: numberUser || 0,
    });
  } catch (error) {
    res.status(500).render("500");
  }
});

app.get("/signup", (req, res) => {
  try {
    res.status(200).render("signup", { message: null });
  } catch (error) {
    res.status(500).render("500");
  }
});

app.get("/login", (req, res) => {
  try {
    res.status(200).render("login", { message: null });
  } catch (error) {
    res.status(500).render("500");
  }
});

app.use(authRoutes);

// Render the 404 error page for any unmatched routes
app.use((req, res) => {
  res.status(404).render("404");
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
