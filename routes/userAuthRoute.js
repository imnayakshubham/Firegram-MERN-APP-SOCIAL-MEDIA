const express = require("express");
const router = express.Router();
const {
  register,
  login,
  protected,
} = require("../controllers/userAuthController.js");

router.route("/register").post(register);
router.route("/login").post(login);

module.exports = router;
