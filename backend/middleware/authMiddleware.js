const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    let token;

    // Check Authorization Header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];

      // Verify Token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get User (without password)
      req.user = await User.findById(decoded.id).select("-password");

      return next();
    }

    return res.status(401).json({
      message: "Not authorized. No token provided.",
    });
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token.",
    });
  }
};
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied. Insufficient permissions.",
      });
    }

    next();
  };
};

module.exports = {
  protect,
  authorize,
};