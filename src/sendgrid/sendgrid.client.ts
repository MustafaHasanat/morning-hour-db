/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
import { ClientResponse } from '@sendgrid/mail';

const nodemailer = require('nodemailer');
const client = require('@sendgrid/mail');

client.setApiKey(process.env.SENDGRID_API_KEY);

export const sendEmail = async (data: {
  to: string;
  from: string;
  subject: string;
  text: string;
  html: string;
}) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.forwardemail.net',
      port: 465,
      secure: true,
      service: 'gmail',
      auth: {
        user: 'mustafa.hasanat99@gmail.com',
        pass: 'axce.MU26st4FA99',
      },
    });

    const mailOptions = {
      from: 'mustafa.hasanat99@gmail.com',
      to: 'mustfaaayyed@gmail.com',
      subject: 'Sending Email using Node.js',
      text: 'That was easy!',
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

    // return await client.send(data);
  } catch (error) {
    console.error(error);
  }
};

// const response = await axios({
//   method: 'POST',
//   url: 'https://api.sendgrid.com/v3/mail/send',
//   headers: {
//     Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
//     'Content-Type': 'application/json',
//   },
//   data: JSON.stringify(data),
// });
