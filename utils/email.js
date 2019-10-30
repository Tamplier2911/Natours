const nodemailer = require('nodemailer');

const sendEmail = async options => {
  //   Create a transporter - service that will actually send the email.
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  // Define the email options
  const mailOptions = {
    from: 'Artem Nikolaiev <hello@artem.io>',
    to: options.email,
    subject: options.subject,
    text: options.message
    // html:
  };

  // Send the email
  await transport.sendMail(mailOptions);
};

module.exports = sendEmail;
