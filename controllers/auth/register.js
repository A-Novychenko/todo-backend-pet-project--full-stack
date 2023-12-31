const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {nanoid} = require("nanoid");

const {BASE_URL} = process.env;

const {HttpError, sendMail} = require("../../helpers");

const {User} = require("../../models/auth");

const register = async (req, res) => {
  const {email, password} = req.body;

  const user = await User.findOne({email});

  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashPass = await bcrypt.hash(password, 10);

  const verifyCode = nanoid();

  const newUser = await User.create({
    ...req.body,
    password: hashPass,
    verifyCode,
  });

  setTimeout(async () => {
    const {verify, _id} = await User.findById(newUser._id);
    if (!verify) {
      await User.findByIdAndRemove(_id);
    }
    return;
  }, 3600000);

  const verifyEmail = {
    to: email,
    subject: "TODO-APP verify  email",
    html: `<h1>${verifyCode}</h1><a target="_blank" href="${BASE_URL}/verify?verifyCode:${verifyCode}">follow the link to verify</a>`,
    // html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${verifyCode}">Click verify email</a>`,
  };

  sendMail(verifyEmail);

  res.status(201).json({
    status: "succes",
    code: 201,
    message: "User registered!",
    data: {user: newUser, token: null},
  });
};

module.exports = register;
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const {nanoid} = require("nanoid");

// const {BASE_URL} = process.env;

// const {HttpError, sendMail} = require("../../helpers");

// const {User} = require("../../models/auth");

// const register = async (req, res) => {
//   const {email, password} = req.body;

//   const user = await User.findOne({email});

//   if (user) {
//     throw HttpError(409, "Email in use");
//   }

//   const hashPass = await bcrypt.hash(password, 10);

//   const verifyCode = nanoid();

//   const newUser = await User.create({
//     ...req.body,
//     password: hashPass,
//     verifyCode,
//   });

//   const verifyEmail = {
//     to: email,
//     subject: "TODO-APP verify  email",
//     html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${verifyCode}">Click verify email</a>`,
//   };

//   sendMail(verifyEmail);

//   res.status(201).json({
//     status: "succes",
//     code: 201,
//     message: "User registered!",
//     data: {user: newUser, token: null},
//   });
// };

// module.exports = register;
