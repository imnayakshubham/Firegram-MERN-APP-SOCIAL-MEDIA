const Post = require("../modals/postSchema.js");
const { protect } = require("../middleware/requirelogin");
const express = require("express");
const router = express.Router();
const User = require("../modals/UserSchema.js");
const finduser = require("../controllers/userController.js");

router.route("/user/:id").get(protect, finduser);

module.exports = router;
