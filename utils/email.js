import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const buildOtpTemplate = (code) => `
<table width="100%" border="0" cellspacing="0" cellpadding="0" 
style="font-family: Arial, Helvetica, sans-serif; background:#f6f9fc; padding:30px;">
  <tr>
    <td align="center">
      <table width="500" cellpadding="0" cellspacing="0" 
      style="background:#ffffff; border-radius:10px; padding:30px;">
        
        <tr>
          <td align="center" style="font-size:22px; font-weight:700; color:#111;">
            Email Verification
          </td>
        </tr>

        <tr>
          <td align="center" style="color:#555; font-size:14px; padding-top:10px;">
            Use the OTP below to complete your verification.<br/>
            This code will expire in <strong>5 minutes</strong>.
          </td>
        </tr>

        <tr>
          <td align="center" style="padding:25px 0;">
            <div style="
              font-size:34px;
              font-weight:700;
              letter-spacing:4px;
              background:#111;
              color:#ffffff;
              padding:15px 25px;
              border-radius:8px;
              display:inline-block;
            ">
              ${code}
            </div>
          </td>
        </tr>

        <tr>
          <td align="center" style="color:#777; font-size:12px;">
            If you did not request this, please ignore this email.
          </td>
        </tr>

        <tr>
          <td align="center" style="color:#aaa; font-size:11px; padding-top:25px;">
            © ${new Date().getFullYear()} ${process.env.SENDGRID_NAME || "Your Company"}. All rights reserved.
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
`;

export const sendEmail = async ({ to, subject, text, html, otp }) => {
  const msg = {
    to,
    from: {
      email: process.env.SENDGRID_SENDER,
      name: process.env.SENDGRID_NAME || "Lead System"
    },
    subject,
    text: text || `Your OTP is ${otp}. It expires in 5 minutes.`,
    html: html || buildOtpTemplate(otp)
  };

  await sgMail.send(msg);
};
