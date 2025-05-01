const express= require('express')
const { signup, login } = require('../controllers/authController')
const authenticateJWT = require("../middleware/authMiddleware");
const authLimiter = require("../middleware/authLimiter");


const router = express.Router()

router.post('/signup',authLimiter, signup)
router.post('/login',authLimiter, login)

// Protected route
router.get("/profile", authenticateJWT, (req, res) => {
    // The request has passed through authenticateJWT, meaning the user is authenticated.
    // You can access the user's data via req.user
    res.status(200).json({
      message: "Welcome to your profile!",
      user: req.user, // This is the user data decoded from the JWT
    });
  });


module.exports = router;