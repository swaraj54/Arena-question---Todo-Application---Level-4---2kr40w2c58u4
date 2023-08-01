const express = require("express");

const { loginUser, signupUser, logout } = require("../controllers/userControllers");

const router = express.Router();


router.get("/login", loginUser);
router.post("/signup", signupUser);
router.post("/logout", logout);

module.exports = router;