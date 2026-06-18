import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
      port: process.env.SMTP_PORT || 2525,
      auth: {
        user: process.env.SMTP_EMAIL || 'mock_user',
        pass: process.env.SMTP_PASSWORD || 'mock_pass'
      }
    });

    const message = {
      from: `${process.env.FROM_NAME || 'ShopMERN Store'} <${process.env.SMTP_EMAIL || 'store@shopmern.com'}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html
    };

    const info = await transporter.sendMail(message);
    console.log(`Email dispatched successfully: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('Email sending failed. Falling back to console log:');
    console.log('------------------ TRANSACTIONAL EMAIL ------------------');
    console.log(`TO:      ${options.email}`);
    console.log(`SUBJECT: ${options.subject}`);
    console.log(`MESSAGE: ${options.message}`);
    console.log('---------------------------------------------------------');
    return null;
  }
};

export default sendEmail;
