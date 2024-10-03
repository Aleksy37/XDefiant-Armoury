const { MongoClient, ObjectId } = require("mongodb");

require("dotenv").config({ path: "../.env"});
const { MONGO_URI } = process.env;

const postBuild = async (req, res) => {
    const client = new MongoClient(MONGO_URI);
    try {
        await client.connect();
        const db = client.db("XDArmoury");
        const builds = db.collection('builds')

        const { name, weaponName, weaponClass, weaponId, attachments } = req.body;
        
        if (!name || !weaponId || !Array.isArray(attachments)) {
            return res.status(400).json({ status: 400, message: 'Invalid input'});
        }

        const existingBuild = await builds.findOne({ name });
            if (existingBuild) {
                return res.status(409).json({ status: 409, message: 'A build with this name exists already'})
            }

        const newBuild = {
            name,
            weaponName,
            weaponClass,
            weaponId,
            attachments,
        }

        const result = await builds.insertOne(newBuild);

        res.status(200).json({
            status: 200,
            message: "Build saved",
            buildId: result.insertedId
        });
        } catch (error) {
            console.error("Error saving build:", error);
            res.status(500).json({ status: 500, message: 'An error occured while saving'});
        } finally {
            await client.close();
        }
    };

    module.exports = {
        postBuild
    };

