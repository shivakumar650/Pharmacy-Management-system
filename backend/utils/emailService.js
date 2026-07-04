const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.ALERT_EMAIL,
    pass: process.env.ALERT_EMAIL_PASSWORD
  }
});

async function sendExpiryAlert(batches) {
  const rows = batches
    .map(
      b =>
        `• ${b.medicineName} | Batch ${b.batchNo} | ${b.daysLeft} days | Qty ${b.quantity}`
    )
    .join("\n");

  const message = `
🚨 CRITICAL MEDICINE EXPIRY ALERT 🚨

${rows}

Immediate action required.
`;

  await transporter.sendMail({
    from: `"Pharmacy System" <${process.env.ALERT_EMAIL}>`,
    to: process.env.ALERT_RECEIVER,
    subject: "🚨 Critical Medicine Expiry Alert",
    text: message
  });
}

module.exports = { sendExpiryAlert };
