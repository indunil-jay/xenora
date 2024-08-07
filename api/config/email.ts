import nodemailer from "nodemailer";
const sendEmail = async ({
  email,
  subject,
  text,
}: {
  email: string;
  subject: string;
  text: string;
}) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST as string,
    port: parseInt(process.env.EMAIL_PORT as string, 10) || 2525,
    auth: {
      user: process.env.EMAIL_USERNAME as string,
      pass: process.env.EMAIL_PASSWORD as string,
    },
  });

  const mailOptions = {
    from: "xenore travel <xenora.travel.info@gmail.com",
    to: email,
    subject,
    text,
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;
