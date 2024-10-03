const { MongoClient, ObjectId } = require("mongodb");

require("dotenv").config({ path: "../.env" });
const { MONGO_URI } = process.env;

const deleteBuild = async (req, res) => {
    const client = new MongoClient(MONGO_URI);
    try {
        await client.connect();
        const db = client.db("XDArmoury");

        const buildId = req.params.id;

        const result = await db.collection("builds").deleteOne({ _id: new ObjectId(buildId) });

        if (result.deletedCount === 1) {
            res.status(200).json({ status: 200, message: "Build deleted successfully" });
        } else {
            res.status(404).json({ status: 404, message: "Build not found" });
        }
    } catch (error) {
        console.error("Error in deleteBuild", error);
        res.status(500).json({
            status: 500,
            message: "Internal server error"
        });
    } finally {
        client.close();
    }
};

module.exports = {
    deleteBuild
};