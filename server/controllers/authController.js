const User = require("../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const jwt = require("jsonwebtoken");

// This is a way to reuse the function to create token
const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

// login user
const loginUser = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  // console.log(email, password, "from auth controller")
  const user = await User.login(email, password);

  // create a token
  const token = createToken(user._id);

  res.status(200).json({
    status: "success",
    message: "login user",
    data: {
      _id: user._id,
      fullname: user.fullname,
      email,
      token,
    },
  });
});

// signup user
const signupUser = catchAsync(async (req, res) => {
  const { email, password, fullname } = req.body;
  const user = await User.signup(email, password, fullname);

  // create a token
  const token = createToken(user._id);
  res.status(201).json({
    status: "success",
    message: "signup user",
    data: { _id: user._id,fullname, email, token },
  });
});

module.exports = { signupUser, loginUser };
