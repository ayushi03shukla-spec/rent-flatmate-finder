const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");
const router = express.Router();

const {
  registerUser,
  loginUser,
} = require("../controllers/authController");
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, (req, res) => {
  res.status(200).json({
    message: "Protected Route Accessed Successfully",
    user: req.user,
  });
});
router.get(
  "/owner-test",
  protect,
  authorize("owner"),
  (req, res) => {
    res.json({
      message: "Welcome Owner!",
      user: req.user,
    });
  }
);

module.exports = router;