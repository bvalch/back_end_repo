const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");

router
  .route("/")
  .post(messageController.createMessageThread)
  .get(messageController.getAllMessageThreads);

router
  .route("/:id")
  .post(messageController.replyToMessageThread)
  .put(messageController.updateMessageThread);



module.exports = router;
