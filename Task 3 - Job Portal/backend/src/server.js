const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

dotenv.config();

const app = express();

app.use(cors({
  origin: "http://localhost:3000"
}));
app.use(express.json());

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is missing from .env");
}

// Temporary storage for testing
const users = [];

let jobs = [
  {
    id: 1,
    title: "Python Developer Intern",
    company: "Tech Solutions",
    location: "Hyderabad",
    type: "Internship",
    salary: "₹10,000/month"
  },
  {
    id: 2,
    title: "Frontend Developer",
    company: "WebWorks",
    location: "Remote",
    type: "Full-time",
    salary: "₹4 LPA"
  }
];

// Home route
app.get("/", (req, res) => {
  res.send("CareerHub Backend is running!");
});

// Register
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required."
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters."
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = users.find(
      user => user.email === normalizedEmail
    );

    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists."
      });
    }

    const allowedRoles = ["candidate", "recruiter"];
    const userRole = allowedRoles.includes(role)
      ? role
      : "candidate";

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = {
      id: users.length + 1,
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: userRole
    };

    users.push(newUser);

    res.status(201).json({
      message: "Registration successful!",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Registration failed."
    });
  }
});

// Login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required."
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = users.find(
      user => user.email === normalizedEmail
    );

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password."
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Invalid email or password."
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful!",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Login failed."
    });
  }
});

// Get jobs
app.get("/api/jobs", (req, res) => {
  const q = (req.query.q || "").toLowerCase();
  const location = (req.query.location || "").toLowerCase();

  const filteredJobs = jobs.filter(job => {
    const matchesKeyword =
      job.title.toLowerCase().includes(q) ||
      job.company.toLowerCase().includes(q);

    const matchesLocation =
      job.location.toLowerCase().includes(location);

    return matchesKeyword && matchesLocation;
  });

  res.json(filteredJobs);
});

// Add a job
app.post("/api/jobs", (req, res) => {
  const { title, company, location, type, salary } = req.body;

  if (!title || !company || !location) {
    return res.status(400).json({
      message: "Title, company and location are required."
    });
  }

  const newJob = {
    id: Date.now(),
    title,
    company,
    location,
    type: type || "Full-time",
    salary: salary || "Not specified"
  };

  jobs.push(newJob);

  res.status(201).json({
    message: "Job added successfully!",
    job: newJob
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK" });
});

app.listen(PORT, () => {
  console.log(`CareerHub backend running on http://localhost:${PORT}`);
});