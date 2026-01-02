import sgMail from "@sendgrid/mail";
import "dotenv/config";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

(async () => {
  try {
    await sgMail.send({
      to: "your-email@gmail.com",
      from: process.env.SENDGRID_SENDER,
      subject: "Test Email",
      text: "If you see this, SendGrid works.",
    });

    console.log("SUCCESS");
  } catch (e) {
    console.error("FAILED", e.response?.body || e.message);
  }
})();

