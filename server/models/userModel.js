const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: [true, "All fields must be filled"],
    validate: {
      validator: function (val) {
        return val.match(/[a-zA-Z \d]/g).join("") === this.fullname;
      },
      message: "A name must not contain special characters",
    },
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    required: [true, "All fields must be filled"],
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  password: {
    type: String,
    required: [true, "All fields must be filled"],
  },
});

// static signup method
userSchema.statics.signup = async function (email, password, fullname) {
  //here we cannot use arrow function because we wanna use "this" keyword inside of it.

  if (!validator.isStrongPassword(password)) {
    throw Error("password not strong enough");
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({ fullname, email, password: hash });

  return user;
};

userSchema.statics.login = async function (email, password) {
  // Check if fields are filled. Not empty string
  if (!email || !password) {
    throw Error("All fields must be filled");
  }

  // Check if the email is registered in DB
  const user = await this.findOne({ email });

  if (!user) {
    throw Error("Incorrect User");
  }

  // Check if plain password matches bcrypt password in DB
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw Error("Incorrect Password");
  }
  return user;
};

const User = new mongoose.model("User", userSchema);
module.exports = User;
