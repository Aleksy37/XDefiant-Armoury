const { MongoClient, ObjectId } = require("mongodb");

require("dotenv").config({ path: "../.env" });
const { MONGO_URI } = process.env;

const getBuilds = async (req, res) => {
    const client = new MongoClient(MONGO_URI);
    try {
        await client.connect();
        const db = client.db("XDArmoury");

        // Fetch all builds from the database
        const builds = await db.collection("builds").find({}).toArray();

        if (builds.length > 0) {
            // Fetch weapon details for each build
            const weaponIds = [...new Set(builds.map(build => build.weaponId))];
            const weapons = await db.collection("weapons").find({ _id: { $in: weaponIds.map(id => new ObjectId(id)) } }).toArray();
            
            // Create a map of weapon details for quick lookup
            const weaponMap = weapons.reduce((acc, weapon) => {
                acc[weapon._id.toString()] = weapon;
                return acc;
            }, {});

            // Fetch all unique attachment IDs
            const allAttachmentIds = [...new Set(builds.flatMap(build => build.attachments))];
            const attachments = await db.collection("attachments").find({ _id: { $in: allAttachmentIds } }).toArray();

            // Create a map of attachment details for quick lookup
            const attachmentMap = attachments.reduce((acc, attachment) => {
                acc[attachment._id] = attachment;
                return acc;
            }, {});

            // Enhance build objects with weapon and attachment details
            const enhancedBuilds = builds.map(build => ({
                ...build,
                weapon: {
                    name: weaponMap[build.weaponId].name,
                    weaponClass: weaponMap[build.weaponId].type
                },
                attachments: build.attachments.map(attachmentId => attachmentMap[attachmentId])
            }));

            res.status(200).json({ status: 200, builds: enhancedBuilds });
            console.log("Builds fetched successfully");
        } else {
            res.status(404).json({ status: 404, message: "No builds found" });
        }
    } catch (error) {
        console.error("Error in getBuilds", error);
        res.status(500).json({
            status: 500,
            message: "Internal server error"
        });
    } finally {
        client.close();
    }
};

module.exports = {
    getBuilds
};