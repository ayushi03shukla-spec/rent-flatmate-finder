require("dotenv").config();

const { sendEmail } = require("./services/emailService");

sendEmail(
  process.env.EMAIL_USER,
  "Rent & Flatmate Finder Test",
  `
    <h2>🎉 Email Test Successful</h2>
    <p>Your email service is working correctly.</p>
  `
);