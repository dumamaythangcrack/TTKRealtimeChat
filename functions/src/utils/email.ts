/**
 * Email Utility Functions (SendGrid)
 */

import sgMail from '@sendgrid/mail';

// Initialize SendGrid
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || 'noreply@chatttk.com';

if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

/**
 * Send email using SendGrid
 */
export async function sendEmail(
  to: string,
  subject: string,
  html: string,
  text?: string
) {
  try {
    if (!SENDGRID_API_KEY) {
      console.warn('SendGrid API key not configured, skipping email');
      return;
    }

    const msg = {
      to,
      from: FROM_EMAIL,
      subject,
      text: text || html.replace(/<[^>]*>/g, ''), // Strip HTML for text version
      html,
    };

    await sgMail.send(msg);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

/**
 * Send welcome email
 */
export async function sendWelcomeEmail(email: string, displayName: string) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Welcome to ChatTTK</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #3b82f6;">Welcome to ChatTTK! 🎉</h1>
          <p>Hi ${displayName},</p>
          <p>Thank you for joining ChatTTK! We're excited to have you on board.</p>
          <p>Get started by:</p>
          <ul>
            <li>Completing your profile</li>
            <li>Adding friends</li>
            <li>Starting your first conversation</li>
          </ul>
          <p>If you have any questions, feel free to reach out to our support team.</p>
          <p>Best regards,<br>The ChatTTK Team</p>
        </div>
      </body>
    </html>
  `;

  return sendEmail(email, 'Welcome to ChatTTK', html);
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(email: string, resetLink: string) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Reset Your Password</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #3b82f6;">Reset Your Password</h1>
          <p>You requested to reset your password. Click the button below to continue:</p>
          <p style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
          </p>
          <p>If you didn't request this, please ignore this email.</p>
          <p>This link will expire in 1 hour.</p>
          <p>Best regards,<br>The ChatTTK Team</p>
        </div>
      </body>
    </html>
  `;

  return sendEmail(email, 'Reset Your Password - ChatTTK', html);
}

/**
 * Send admin notification email
 */
export async function sendAdminNotificationEmail(
  email: string,
  title: string,
  message: string
) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>${title}</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #dc2626;">${title}</h1>
          <p>${message}</p>
          <p>Please log in to the admin panel to take action.</p>
          <p>Best regards,<br>ChatTTK Admin System</p>
        </div>
      </body>
    </html>
  `;

  return sendEmail(email, title, html);
}

