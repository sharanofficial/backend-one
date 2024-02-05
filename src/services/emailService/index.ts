import nodemailer from 'nodemailer';

const sendEmail = (email: string, subject: string, message: string) => {
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: 465,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.MAIL_USER,
    to: email,
    subject,
    text: message,
  };

  transporter.sendMail(mailOptions);
};

export { sendEmail };
