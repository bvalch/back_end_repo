const express = require("express");
const router = express.Router();
// const commentController = require("../controllers/commentController");
const messageController = require("../controllers/messageController")

router.route("/").post(messageController.createMessageThread)
// router.route("/message/:id").post()
// router.route("/message/:id").get(commentController.getAllCommentsForAHike);

// router.route("/message").get(commentController.getAllCommentsForUser)

module.exports = router;
