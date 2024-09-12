const data = require("./data/items.json");
const companies = require("./data/companies.json");

const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;

const client = new MongoClient(MONGO_URI);

const itemBatchImport = async () => {
  await client.connect();
  const db = client.db("ECommerce");
  await db.collection("items").insertMany(data);
  await db.collection("companies").insertMany(companies);

  console.log("Disconnected!");
  client.close();
};

itemBatchImport();