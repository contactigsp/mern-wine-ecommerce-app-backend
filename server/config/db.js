const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const DB = process.env.DATABASE.replace(
      "<PASSWORD>",
      process.env.DATABASE_PASSWORD
    );

    mongoose.set("strictQuery", true);
    const conn = await mongoose.connect(DB, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });

    console.log("DB connection successfully");
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
