var express = require('express')
var router = express.Router();
const User = require("../controller/user_controller");


router.post("/signup", User.signUp);

router.post("/login", User.login);

router.post("/verifyEmail", User.verifyEmail);

router.post("/verifyOtp", User.verifyOtp);






module.exports = router;