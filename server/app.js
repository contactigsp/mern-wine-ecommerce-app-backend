const express = require("express");
const path = require("path");
const cors = require("cors")

const app = express();
app.use(express.json());
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

// =================== THIRD-PART MIDDLEWARES ===================
const morgan = require("morgan"); //morgan is a Node. js and Express middleware to log HTTP requests and errors, and simplifies the process.

// if (process.env.NODE_ENV === "development") {
app.use(morgan("dev")); // Morgan gives us info about request in the node repl
// }
setTimeout(() => console.log(process.env.NODE_ENV));

app.use(
  cors({
    origin: [
      //"http://localhost:3000",
      "https://mern-wine-ecommerce-app.onrender.com",
    ],
  })
);

// ========================== MOUNTING ==========================
const productsRouter = require("./routes/productsRoutes");
app.use("/api/v1", productsRouter); // in the express.Router().route("") we define the routes but we have to use this middleware to actually listen to the requests (its like acting between client and server), res, update and delete.

const userRouter = require("./routes/userRoutes");
app.use("/api/v1", userRouter);

const ordersRouter = require("./routes/ordersRoutes");
app.use("/api/v1", ordersRouter);

app.get("/", (req, res) => {
  res.send("Home page");
});

// ===================== MY OWN MIDDLEWARES =====================

// app.use((req, res, next) => {
//   // res.json({ status: "success", message: "hello world!" });
//   console.log("hello from my own middleware ! 👋");
//   next();
// });

app.get("/api/config/paypal", (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID);
});

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
