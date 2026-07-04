
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

// Register User
const registerUser = async (req, res) => {
  console.log(" 1. Register API Hit");
  try {
    const { name, email, password, phone, role } = req.body;
     console.log("2. Request Body:", req.body);

    // Check required fields
    if (!name || !email || !password || !phone || !role) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Check if user already exists
    console.log("3. Checking existing user...");
    const existingUser = await User.findOne({ email });
     console.log("4. Existing user:", existingUser);

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Hash password
      console.log("5. Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 10);
     console.log("6. Password hashed");

    // Create user
       console.log("7. Creating user...");
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role,
    });
     console.log("8. User created:", user);

    // Send Response
    res.status(201).json({
      message: "User Registered Successfully",
      token: generateToken(user._id, user.role),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};
// Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check required fields
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Compare password
    // Compare password
console.log("User Found:", user.email);
console.log("Entered Password:", password);
console.log("Stored Hash:", user.password);

const isMatch = await bcrypt.compare(password, user.password);

console.log("Password Match:", isMatch);

if (!isMatch) {
  return res.status(401).json({
    message: "Invalid email or password",
  });
}

    // Login Success
    res.status(200).json({
      message: "Login Successful",
      token: generateToken(user._id, user.role),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
};