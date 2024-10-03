("use strict")

//imports

const express = require("express");
const morgan = require("morgan");
const { getWeapons } = require("./handlers/getWeapons");
const { getAttachments } = require("./handlers/getAttachments");
const { postBuild } = require("./handlers/postBuild");
const { getBuilds } = require("./handlers/getBuilds");
const { deleteBuild } = require("./handlers/deleteBuild");
const { updateBuild } = require("./handlers/updateBuild");
const { getBuildDetails } = require("./handlers/getBuildDetails");

const PORT = 4000

express()
  .use(morgan("tiny"))
  .use(express.static("./server/assets"))
  .use(express.json())
  .use(express.urlencoded({ extended: false }))
  .use("/", express.static(__dirname + "/"))

  // REST Endpoints
  .get("/api/weapons", getWeapons)
  .get("/api/attachments", getAttachments)
  .get("/api/builds", getBuilds)
  .get("/api/builds/:id/edit", getBuildDetails)
  .post("/api/saveBuild", postBuild)
  .delete("/api/builds/:id", deleteBuild)
  .put('/api/builds/:id', updateBuild)

  .use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ status: 500, message: "internal server error" })
  })


  .listen(PORT, () => console.info(`Listening on port ${PORT}`));
    
