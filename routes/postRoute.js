const express = require("express");
const {
  createPost,
  viewPost,
  myPost,
  like,
  dislike,
  makecomment,
  deletepost,
} = require("../controllers/postController");
const { protect } = require("../middleware/requirelogin");
const router = express.Router();

// create post viewPost
router.route("/createpost").post(protect, createPost);
//  view Post
router.route("/allpost").get(protect, viewPost);
//  Only logged in user posts
router.route("/myposts").get(protect, myPost);

router.route("/like").put(protect, like);
router.route("/dislike").put(protect, dislike);
router.route("/comment").put(protect, makecomment);
router.route("/deletepost/:postId").delete(protect, deletepost);

module.exports = router;
