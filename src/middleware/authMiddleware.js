const jwt = require("jsonwebtoken");
require("dotenv").config();

// Middleware to check if the user is authenticated
const authenticateJWT = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(403).json({ message: "Access denied, no token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attaching decoded user to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    console.error("JWT Error:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authenticateJWT;
