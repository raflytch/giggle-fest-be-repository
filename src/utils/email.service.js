import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("Error setting up email transport:", error);
  } else {
    console.log("Server is ready to send emails");
  }
});

const getVerificationEmailTemplate = (verificationUrl) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f9f9f9;
        }
        .header {
          text-align: center;
          padding: 20px;
          background-color: #4a90e2;
          color: white;
        }
        .content {
          padding: 30px;
          background-color: white;
          border-radius: 5px;
          margin: 20px 0;
        }
        .button {
          display: inline-block;
          padding: 12px 24px;
          background-color: #4a90e2;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          padding: 20px;
          color: #666;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Verify Your Account</h1>
        </div>
        <div class="content">
          <h2>Hello!</h2>
          <p>Thank you for registering. Please click the button below to verify your account:</p>
          <center>
            <a href="${verificationUrl}" class="button">Verify Account</a>
          </center>
          <p>If the button doesn't work, you can also click this link:</p>
          <p><a href="${verificationUrl}">${verificationUrl}</a></p>
          <p>This link will expire in 24 hours.</p>
          <p>For security reasons, this verification link can only be requested 3 times per hour.</p>
        </div>
        <div class="footer">
          <p>If you didn't create an account, please ignore this email.</p>
          <p>© ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const sendVerificationEmail = async (email, verificationToken) => {
  try {
    const verificationUrl = `${process.env.BASE_URL}/api/v1/auth/verify/${verificationToken}`;

    const mailOptions = {
      from: {
        name: process.env.EMAIL_FROM_NAME || "Your Company Name",
        address: process.env.EMAIL_USER,
      },
      to: email,
      subject: "Verify Your Account",
      html: getVerificationEmailTemplate(verificationUrl),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Verification email sent:", info.messageId);

    return info;
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw error;
  }
};

export const sendResetOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: {
      name: process.env.EMAIL_FROM_NAME || "Your Company Name",
      address: process.env.EMAIL_USER,
    },
    to: email,
    subject: "Your Password Reset OTP",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; }
          .header { text-align: center; padding: 20px; background-color: #4a90e2; color: white; }
          .content { padding: 30px; background-color: white; border-radius: 5px; margin: 20px 0; }
          .otp { font-size: 32px; font-weight: bold; text-align: center; color: #4a90e2; margin: 20px 0; letter-spacing: 5px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset OTP</h1>
          </div>
          <div class="content">
            <h2>Hello!</h2>
            <p>Your OTP for password reset is:</p>
            <div class="otp">${otp}</div>
            <p>This OTP will expire in 15 minutes.</p>
            <p>If you didn't request this reset, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  return transporter.sendMail(mailOptions);
};
