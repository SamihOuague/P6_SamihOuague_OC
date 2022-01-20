let router = require("express").Router();
let { signUp, logIn } = require("../controllers/authController");

router.post("/signup", signUp);
router.post("/login", logIn);

module.exports = router;