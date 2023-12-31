const nodemailer = require("nodemailer");

const {UKR_NET_EMAIL, UKR_NET_PASSWORD} = process.env;

const config = {
  host: "smtp.ukr.net",
  port: 465,
  secure: true,
  auth: {
    user: UKR_NET_EMAIL,
    pass: UKR_NET_PASSWORD,
  },
};

const transport = nodemailer.createTransport(config);

const sendMail = (data) => {
  const email = {...data, from: UKR_NET_EMAIL};
  transport.sendMail(email);
  return true;
};

module.exports = sendMail;
