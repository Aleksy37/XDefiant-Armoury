const { MongoClient } = require("mongodb");

require("dotenv").config({ path: "../.env" });
const { MONGO_URI } = process.env;

const getAttachments = async (req, res) => {
    const client = new MongoClient(MONGO_URI);
    try {
        await client.connect();
        const db = client.db("XDArmoury");

        const { attachmentIds } = req.query;

        // Validate input
        if (!attachmentIds) {
            return res.status(400).json({ status: 400, message: "attachmentIds query parameter is required" });
        }

        let parsedAttachmentIds;
        try {
            parsedAttachmentIds = JSON.parse(attachmentIds);
            if (!Array.isArray(parsedAttachmentIds)) {
                throw new Error("Not an array");
            }
        } catch (error) {
            return res.status(400).json({ status: 400, message: "Invalid attachmentIds. Expected a JSON array." });
        }

        // Fetch attachments from the database
        const attachments = await db.collection("attachments").find({ _id: { $in: parsedAttachmentIds } }).toArray();

        if (attachments.length > 0) {
            // Group attachments by slot
            const groupedAttachments = attachments.reduce((acc, attachment) => {
                if (!acc[attachment.slot]) {
                    acc[attachment.slot] = [];
                }
                acc[attachment.slot].push(attachment);
                return acc;
            }, {});

            res.status(200).json({ status: 200, groupedAttachments });
            console.log("Attachments fetched");
        } else {
            res.status(404).json({ status: 404, message: "No attachments found for the given IDs" });
        }
    } catch (error) {
        console.error("Error in getAttachments", error);
        res.status(500).json({
            status: 500,
            message: "Internal server error"
        });
    } finally {
        client.close();
    }
};

module.exports = {
    getAttachments
};