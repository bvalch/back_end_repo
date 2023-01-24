const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");

router.route("/hike")
.post(commentController.postCommentToHike)
.delete(commentController.deleteComment)

router.route("/hike/:id").get(commentController.getAllCommentsForAHike);

router.route("/user/getall").get(commentController.getAllCommentsForUser)

module.exports = router;
