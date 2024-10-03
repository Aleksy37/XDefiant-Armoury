const { MongoClient, ObjectId } = require("mongodb");

require("dotenv").config({ path: "../.env" });
const { MONGO_URI } = process.env;

const getBuildDetails = async (req, res) => {
    const client = new MongoClient(MONGO_URI);
    try {
        await client.connect();
        const db = client.db("XDArmoury");

        const buildId = req.params.id;

        console.log('Build ID:', buildId);

        // Fetch the build
        const build = await db.collection("builds").findOne({ _id: new ObjectId(buildId) });

        if (!build) {
            return res.status(404).json({ status: 404, message: "Build not found" });
        }

        console.log('Build:', build);

        // Fetch the weapon details
        const weapon = await db.collection("weapons").findOne({ _id: new ObjectId(build.weaponId) });

        if (!weapon) {
            return res.status(404).json({ status: 404, message: "Weapon not found" });
        }

        console.log('Weapon:', weapon);

        // Fetch the attachments for this build
        const buildAttachments = await db.collection("attachments")
            .find({ _id: { $in: build.attachments } })
            .toArray();

        console.log('Build Attachments:', buildAttachments);

        // Fetch all available attachments for this weapon
        const availableAttachments = await db.collection("attachments")
            .find({ _id: { $in: weapon.attachments } })
            .toArray();

        console.log('Available Attachments:', availableAttachments);

        // Group available attachments by slot
        const groupedAvailableAttachments = availableAttachments.reduce((acc, att) => {
            if (!acc[att.slot]) {
                acc[att.slot] = [];
            }
            acc[att.slot].push(att);
            return acc;
        }, {});

        // Prepare the response
        const response = {
            build: {
                _id: build._id,
                name: build.name,
                weapon: {
                    _id: weapon._id,
                    name: weapon.name,
                    weaponClass: weapon.type // Note: changed from weaponClass to type based on your weapon document structure
                },
                attachments: buildAttachments
            },
            availableAttachments: groupedAvailableAttachments
        };

        res.status(200).json({ status: 200, data: response });
    } catch (error) {
        console.error("Error in getBuildDetails", error);
        res.status(500).json({
            status: 500,
            message: "Internal server error"
        });
    } finally {
        client.close();
    }
};

module.exports = {
    getBuildDetails
};