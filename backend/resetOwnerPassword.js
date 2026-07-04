require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

async function resetPassword() {
  await mongoose.connect(process.env.MONGO_URI);

  const hashedPassword = await bcrypt.hash("Owner@123", 10);

  await User.updateOne(
    { email: "owner@gmail.com" },
    { $set: { password: hashedPassword } }
  );

  console.log("✅ Password reset successfully.");

  await mongoose.disconnect();
}

resetPassword().catch(console.error);