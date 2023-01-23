const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");

router.route("/").post(commentController.postCommentToHike);

router.route("/:id").get(commentController.getAllCommentsForAHike);

module.exports = router;
