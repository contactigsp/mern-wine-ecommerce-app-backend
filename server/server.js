const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const connectDB = require("./config/db");

// ================== CONNECT TO MONGO DB ==================
const app = require(`${__dirname}/app`); // this line of code goes after dotenv because otherwise it wouldn't have the data about url to console log

connectDB();

// const DB = process.env.DATABASE.replace(
//   "<PASSWORD>",
//   process.env.DATABASE_PASSWORD
// );

// // connect to db
// mongoose.set("strictQuery", true);
// mongoose
//   .connect(DB, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then((con) => {
//     // listen for requests
    const port = process.env.PORT || 6000;
//     app.listen(port, () => {
//       console.log("DB connection successfully and listening on port", port);
//     });
//   })
//   .catch((error) => {
//     console.log(error);
//   });

mongoose.connection.once('open', () => {
  // console.log('Connected to MongoDB')
  app.listen(port, () => console.log(`Server running on port ${port}`))
})
