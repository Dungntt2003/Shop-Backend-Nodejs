const express = require("express");
const router = express.Router();
const UsersController = require("../controllers/users");

router.post("/signup", UsersController.user_sign_in);

router.post("/login", UsersController.user_log_in);

router.delete("/:userId", UsersController.user_delete);

module.exports = router;
