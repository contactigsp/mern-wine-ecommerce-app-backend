const AppError = require("./../utils/appError");

const handleCastErrorDB = (err) => {
  console.log("hello from HANDLE CAST error DB");
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  console.log("hello from HANDLE DUPLICATE FIELDS");
  let item = err.keyValue.email;
  // const message = `Duplicate field value: ${item}. Please use another value!`;
  const message = `${item} is already in use. Please choose another one!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  console.log("hello from HANDLE VALIDATION");
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const handleSignupPasswordErrorDB = (err) => {
  console.log("hello from HANDLE PASSWORD");

  const message = "Password not strong enough.";
  return new AppError(message, 403);
};

const handleLoginCredentialsErrorDB = (err) => {
  console.log("hello from HANDLE CREDENTIALS ERROR");
  // console.log(err.message);

  const message = err.message;
  return new AppError(message, 401);
};

const handleJWTError = () =>
  new AppError("Invalid token. Please log in again!", 401);

const handleJWTExpiredError = () =>
  new AppError("Your token has expired! Please log in again.", 401);

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      // error: err,
    });
    console.log("HELLO FROM sendErrorProd (IS OPERATIONAL)");

    // Programming or other unknown error: don't leak error details
  } else {
    // 1) Log error
    console.error("ERROR 💥", err);
    console.log("HELLO FROM sendErrorProd (NOT OPERATIONAL)");

    // 2) Send generic message
    res.status(500).json({
      status: "error",
      message: "Something went very wrong!",
    });
  }
};

module.exports = (err, req, res, next) => {
  // console.log(err.stack);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    if (err.name === "CastError") {
      error = handleCastErrorDB(error);
      sendErrorProd(error, res);
      return;
    }
    if (err.code === 11000) {
      error = handleDuplicateFieldsDB(error);
      sendErrorProd(error, res);
      return;
    }

    if (err.errors !== undefined) {
      if (err.errors.email !== undefined) {
        if (err.errors.email.name === "ValidatorError") {
          error = handleValidationErrorDB(error);
          sendErrorProd(error, res);
          return;
        }
      }

      if (err.errors.fullname !== undefined) {
        if (err.errors.fullname.name === "ValidatorError") {
          error = handleValidationErrorDB(error);
          sendErrorProd(error, res);
          return;
        }
      }
    }

    // Signup Errors Responses (That I cannot include in schema)
    if (err.message === "password not strong enough") {
      console.log("HI FROM IF");
      error = handleSignupPasswordErrorDB(error);
      sendErrorProd(error, res);
      return;
    }

    // Login Errors Responses (Login code is not inside the create scope, therefore they wont be validated by mongoose, that's why we included error res below)
    if (
      err.message === "Incorrect User" ||
      err.message === "Incorrect Password" ||
      err.message === "All fields must be filled"
    ) {
      error = handleLoginCredentialsErrorDB(err);
      sendErrorProd(error, res);
      return;
    }

    sendErrorProd(error, res);
  }
};
