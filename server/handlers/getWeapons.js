const { MongoClient } = require("mongodb");

require ("dotenv").config({ path: "../.env" });
const { MONGO_URI } = process.env;

const getWeapons = async (req, res) => {
    const client = new MongoClient(MONGO_URI);
    try {
        await client.connect();
        const db = client.db("XDArmoury")
        
        const allWeapons = await db.collection("weapons").find().toArray();

        if (allWeapons) {
            res.status(200).json({ status: 200, allWeapons });
            console.log("Weapons fetched");
        } else {
            res.status(404).json({ status: 404, message: "No Weapons found" })
        }
    } catch (error) {
        console.error("Error in getWeapons", error);
        res.status(500).json({
            status: 500,
            message: "Internal server error"
        });
    } finally {
        client.close();
    }
};

module.exports = {
    getWeapons
};