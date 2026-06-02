import nodemailer from 'nodemailer';

export const sendVerificationEmail = async (email, name, token, req) => {
  // Construct dynamic verification URL based on the incoming request protocol and host
  const protocol = req.protocol;
  const host = req.get('host'); // e.g. localhost:5000
  const verificationUrl = `${protocol}://${host}/api/auth/verify/${token}`;

  const emailUser = process.env.EMAIL_USER;
  const emailPassword = process.env.EMAIL_PASSWORD;

  // Fallback: If SMTP variables are not defined in the backend .env, log the verification link prominently in the terminal.
  if (!emailUser || !emailPassword) {
    console.log('\n┌────────────────────────────────────────────────────────┐');
    console.log('│             📧 DEVELOPER EMAIL FALLBACK LOG             │');
    console.log('├────────────────────────────────────────────────────────┤');
    console.log(`│ Recipient:  ${email.padEnd(42)} │`);
    console.log(`│ Name:       ${name.padEnd(42)} │`);
    console.log('│ Link:                                                  │');
    console.log(`│ ${verificationUrl.padEnd(54)} │`);
    console.log('└────────────────────────────────────────────────────────┘\n');
    return;
  }

  try {
    // Create Nodemailer Transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Standard Gmail setup, user can change as required
      auth: {
        user: emailUser,
        pass: emailPassword,
      },
    });

    const htmlTemplate = `
      <div style="background-color: #0B0F19; color: #E2E8F0; font-family: 'Plus Jakarta Sans', Arial, sans-serif; padding: 40px; text-align: center; border-radius: 16px; max-width: 600px; margin: 0 auto; border: 1px solid rgba(255, 255, 255, 0.08);">
        <div style="margin-bottom: 24px;">
          <span style="font-size: 28px; font-weight: 800; background: linear-gradient(to right, #2DD4BF, #06B6D4); -webkit-background-clip: text; color: #2DD4BF;">WanderLust AI</span>
        </div>
        <h2 style="font-size: 24px; font-weight: 700; color: #FFFFFF; margin-bottom: 12px;">Verify Your Email Address</h2>
        <p style="color: #94A3B8; font-size: 16px; line-height: 1.6; margin-bottom: 32px;">
          Hello <strong>${name}</strong>,<br>
          Thank you for joining WanderLust! To unlock your personalized travel desk, AI assistant, and search history persistence, please confirm your email address.
        </p>
        <div style="margin-bottom: 36px;">
          <a href="${verificationUrl}" target="_blank" style="background: linear-gradient(to right, #14B8A6, #06B6D4); color: #000000; font-size: 16px; font-weight: 700; text-decoration: none; padding: 14px 32px; border-radius: 12px; display: inline-block; transition: box-shadow 0.3s;">
            Verify Email Address
          </a>
        </div>
        <p style="color: #64748B; font-size: 12px; line-height: 1.6;">
          This verification link is valid for <strong>24 hours</strong>. If you did not register for a WanderLust account, you can safely ignore this email.
        </p>
        <hr style="border: 0; border-top: 1px solid rgba(255, 255, 255, 0.05); margin: 32px 0;">
        <p style="color: #475569; font-size: 11px;">
          &copy; ${new Date().getFullYear()} WanderLust AI. All rights reserved.
        </p>
      </div>
    `;

    const mailOptions = {
      from: `"WanderLust AI" <${emailUser}>`,
      to: email,
      subject: 'Verify your WanderLust Email',
      html: htmlTemplate,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Verification email sent successfully: ${info.messageId}`);
  } catch (error) {
    console.error('Error sending verification email via SMTP:', error);
    // Even if SMTP fails in local dev, do not crash the registration flow. Print the link to console as fallback!
    console.log('\n[FALLBACK] SMTP sending failed. Verification link:', verificationUrl, '\n');
  }
};
