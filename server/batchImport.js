const weaponData = require("./data/WeaponData.json");
const attachmentData = require("./data/AttachmentData.json");

const { MongoClient } = require("mongodb");

require("dotenv").config({ path: "../.env" });
const { MONGO_URI } = process.env;

const client = new MongoClient(MONGO_URI);

const itemBatchImport = async () => {
  await client.connect();
  const db = client.db("XDArmoury");
  await db.collection("weapons").insertMany(weaponData);
  await db.collection("attachments").insertMany(attachmentData);

  console.log("Disconnected!");
  client.close();
};

itemBatchImport();