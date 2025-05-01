const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { findUserByEmail, createUser } = require("../models/userModel");
require("dotenv").config();

// Email validation regex
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Password strength check (min 6 chars)
const isStrongPassword = (password) =>
  typeof password === "string" && password.length >= 6;

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  // Basic input validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  if (!isStrongPassword(password)) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters long" });
  }

  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email already exists, please use another email" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await createUser({
      name: name,
      email: email,
      password: hashedPassword,
    });

    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.error("Error in regsiterUser:", error);
    return res.status(500).json({
      status: 500,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Await the user retrieval function to ensure you get the user data
      const user = await findUserByEmail(email);
      
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }
  
      // Compare the hashed password with the entered password
      const isMatch = await bcrypt.compare(password, user.password);
      
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid password" });
      }
  
      // Generate the JWT token if credentials are valid
      const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
      // Respond with a success message and the token
      res.status(200).json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      });
  
    } catch (error) {
      console.error("Error in Login:", error);
      return res.status(500).json({
        status: 500,
        message: "Something went wrong",
        error: error.message,
      });
    }
  };
  
