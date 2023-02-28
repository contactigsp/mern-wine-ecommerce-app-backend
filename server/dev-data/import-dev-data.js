const fs = require("fs");
const mongoose = require("mongoose");

const dotenv = require("dotenv");
dotenv.config({ path: `${__dirname}/../config.env` });
const Products = require("./../models/productsModel");

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then((con) => {
    console.log("DB connection successfully");
  });

const products = JSON.parse(fs.readFileSync(`${__dirname}/products.json`));

// ============================== IMPORT DATA ==============================
const importData = async () => {
  try {
    await Products.create(products);
    console.log("Data successfully loaded!");
  } catch (err) {
    console.log(err);
    console.log("Something went wrong... please, try again");
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Products.deleteMany();
    console.log("Data has been successfully deleted!!");
  } catch (err) {
    console.log(err);
    console.log("Something went wrong... please, try again");
  }
  process.exit();
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}

console.log(process.argv);
