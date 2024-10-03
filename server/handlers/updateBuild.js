const { MongoClient, ObjectId } = require("mongodb");

require("dotenv").config({ path: "../.env" });
const { MONGO_URI } = process.env;

const updateBuild = async (req, res) => {
    const client = new MongoClient(MONGO_URI);
    try {
        await client.connect();
        const db = client.db("XDArmoury");

        const buildId = req.params.id;
        const { name, attachments } = req.body;

        const result = await db.collection("builds").updateOne(
            { _id: new ObjectId(buildId) },
            { $set: { name, attachments } }
        );

        if (result.matchedCount === 0) {
            res.status(404).json({ status: 404, message: "Build not found" });
        } else {
            res.status(200).json({ status: 200, message: "Build updated successfully" });
        }
    } catch (error) {
        console.error("Error in updateBuild", error);
        res.status(500).json({
            status: 500,
            message: "Internal server error"
        });
    } finally {
        client.close();
    }
};

module.exports = {
    updateBuild
};